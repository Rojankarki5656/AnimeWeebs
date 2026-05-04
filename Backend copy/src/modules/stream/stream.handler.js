import config from '@/config/config';
import { NotFoundError, validationError } from '@/utils/errors.js';
import streamExtract from './stream.extract.js';

export default async function streamHandler(c) {
  const { link_id } = c.req.valid('query');
  
  if (!link_id) {
    throw new validationError('link_id is required');
  }
  
  const response = await resolveSource(link_id);
  
  if (!response || response.error) {
    throw new NotFoundError('Failed to resolve source');
  }

  return streamExtract(response);
}

export async function resolveSource(linkId) {
  const ENCDEC_URL = 'https://enc-dec.app/api/enc-kai';
  const DEC_KAI_URL = 'https://enc-dec.app/api/dec-kai';
  const DEC_MEGA_URL = 'https://enc-dec.app/api/dec-mega';
  
  const AJAX_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': `${config.baseurl}/`,
  };
  
  const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
  };
  
  try {
    // 1. Encode the link_id
    const encoded = await encodeToken(linkId, ENCDEC_URL);
    if (!encoded) {
      return { error: 'Token encryption failed' };
    }
    
    // 2. Fetch from /ajax/links/view
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
    
    // 3. Decrypt with decode_kai
    const embedData = await decodeKai(encryptedResult, DEC_KAI_URL);
    if (!embedData || !embedData.url) {
      return { error: 'Embed decryption failed' };
    }
    
    const embedUrl = embedData.url;
    
    // 4. Extract video_id and fetch media
    const videoId = embedUrl.replace(/\/$/, '').split('/').pop();
    const embedBase = embedUrl.includes('/e/') 
      ? embedUrl.split('/e/')[0]
      : embedUrl.split('/').slice(0, -1).join('/');
    
    const mediaUrl = `${embedBase}/media/${videoId}`;
    const mediaResponse = await fetch(mediaUrl, {
      method: 'GET',
      headers: HEADERS,
    });
    
    if (!mediaResponse.ok) {
      return { error: `Failed to fetch media: ${mediaResponse.status}` };
    }
    
    const mediaData = await mediaResponse.json();
    const encryptedMedia = mediaData.result || '';
    
    if (!encryptedMedia) {
      return { error: 'No encrypted media found' };
    }
    
    // 5. Decrypt with decode_mega
    const finalData = await decodeMega(encryptedMedia, DEC_MEGA_URL, HEADERS['User-Agent']);
    if (!finalData) {
      return { error: 'Media decryption failed' };
    }
    
    return {
      embed_url: embedUrl,
      skip: embedData.skip || {},
      sources: finalData.sources || [],
      tracks: finalData.tracks || [],
      download: finalData.download || '',
    };
  } catch (error) {
    console.error('Resolve source error:', error.message);
    return { error: error.message };
  }
}

// Helper function to encode token
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

// Helper function to decode Kai
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

// Helper function to decode Mega
async function decodeMega(encryptedText, decMegaUrl, userAgent) {
  try {
    const response = await fetch(decMegaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ 
        text: encryptedText, 
        agent: userAgent 
      }),
    });
    
    const data = await response.json();
    return data.status === 200 ? data.result : null;
  } catch (error) {
    console.error('Decode Mega error:', error.message);
    return null;
  }
}