// stream.handler.js - Modified version
import config from '@/config/config';
import { NotFoundError, validationError } from '@/utils/errors.js';
import streamExtract from './stream.extract.js';
import connectRedis from '@/utils/connectRedis';

const parseCached = (cached) => {
  if (!cached) return null;
  if (typeof cached === "object" && cached !== null) {
    return cached;
  }
  if (typeof cached === "string") {
    const trimmed = cached.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return JSON.parse(trimmed);
    }
  }
  throw new Error("Invalid cache format");
};

export default async function streamHandler(c) {
  const { link_id } = c.req.valid('query');
  
  if (!link_id) {
    throw new validationError('link_id is required');
  }
  
  const { exist, redis } = await connectRedis();
  const cacheKey = `stream:${link_id}`;

  const fetchFreshSource = async () => {
    const response = await resolveSource(link_id);
    if (!response || response.error) {
      throw new NotFoundError('Failed to resolve source', response?.error || 'Unknown error');
    }
    return response;
  };

  if (!exist) {
    const response = await fetchFreshSource();
    return streamExtract(response);
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for stream source:", link_id);
      const response = parseCached(cached);
      return streamExtract(response);
    }
  } catch (err) {
    console.error("Redis read error:", err.message);
    try {
      await redis.del(cacheKey);
    } catch (delErr) {
      console.error("Failed to delete corrupted cache:", delErr.message);
    }
  }

  const response = await fetchFreshSource();

  try {
    await redis.set(cacheKey, JSON.stringify(response), {
      ex: 60 * 60 * 24,
    });
  } catch (err) {
    console.error("Redis write error:", err.message);
  }

  return streamExtract(response);
}

async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 403 && i < retries - 1) {
        console.log(`Got 403, retrying in ${delay}ms... (attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function resolveSource(linkId) {
  const ENCDEC_URL = 'https://enc-dec.app/api/enc-reanime';
  const DEC_KAI_URL = 'https://enc-dec.app/api/dec-reanime';
  
  const AJAX_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': `${config.baseurl}/`,
  };
  
  try {
    const encoded = await encodeToken(linkId, ENCDEC_URL);
    if (!encoded) {
      return { error: 'Token encryption failed' };
    }
    
    const linksViewUrl = `${config.baseurl}/ajax/links/view?id=${linkId}&_=${encoded}`;
    const response = await fetch(linksViewUrl, {
      method: 'GET',
      headers: AJAX_HEADERS,
    });
    
    if (!response.ok) {
      return { error: `Failed to fetch links view: ${response.status}` };
    }
    
    const data = await response.json();
    const encryptedResult = data.result || '';
    
    if (!encryptedResult) {
      return { error: 'No encrypted result found' };
    }
    
    const embedData = await decodeKai(encryptedResult, DEC_KAI_URL);
    if (!embedData || !embedData.url) {
      return { error: 'Embed decryption failed' };
    }
    
    const embedUrl = embedData.url;
    const videoId = embedUrl.replace(/\/$/, '').split('/').pop();
    const embedBase = embedUrl.includes('/e/') 
      ? embedUrl.split('/e/')[0]
      : embedUrl.split('/').slice(0, -1).join('/');
    
    const mediaUrl = `${embedBase}/media/${videoId}`;
    
    // Instead of fetching media, return the media URL for frontend to handle
    return {
      embed_url: embedUrl,
      media_url: mediaUrl, // Send this to frontend
      encrypted_media: null, // Not needed anymore
      skip: embedData.skip || {},
      sources: [], // Will be populated by frontend
      tracks: [], // Will be populated by frontend
      download: '',
    };
  } catch (error) {
    console.error('Resolve source error:', error.message);
    return { error: error.message };
  }
}

async function encodeToken(text, encdecUrl) {
  try {
    const response = await fetch(`${encdecUrl}?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.status === 200 ? data.result : null;
  } catch (error) {
    console.error('Encode error:', error.message);
    return null;
  }
}

async function decodeKai(encryptedText, decKaiUrl) {
  try {
    const response = await fetch(decKaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ text: encryptedText }),
    });
    
    const data = await response.json();
    return data.status === 200 ? data.result : null;
  } catch (error) {
    console.error('Decode Kai error:', error.message);
    return null;
  }
}