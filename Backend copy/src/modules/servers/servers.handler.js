import config from '@/config/config';
import serversExtract from './servers.extract';
import { NotFoundError } from '@/utils/errors';
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

export default async function (c) {
  const { ep_token } = c.req.valid('param');
  
  const { exist, redis } = await connectRedis();
  const cacheKey = `servers:${ep_token}`;

  const fetchFreshServers = async () => {
    const response = await getServers(ep_token);
    return {
      watching: response.watching,
      servers: response.servers,
    };
  };

  if (!exist) {
    return fetchFreshServers();
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for servers:", ep_token);
      return parseCached(cached);
    }
  } catch (err) {
    console.error("Redis read error:", err.message);
    try {
      await redis.del(cacheKey);
    } catch (delErr) {
      console.error("Failed to delete corrupted cache:", delErr.message);
    }
  }

  const freshData = await fetchFreshServers();

  try {
    await redis.set(cacheKey, JSON.stringify(freshData), {
      ex: 60 * 60 * 24,
    });
  } catch (err) {
    console.error("Redis write error:", err.message);
  }

  return freshData;
}

export async function getServers(epToken) {
  const ENCDEC_URL = 'https://enc-dec.app/api/enc-kai';
  
  let encoded;
  try {
    const encodeResponse = await fetch(`${ENCDEC_URL}?text=${encodeURIComponent(epToken)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    
    const encodeData = await encodeResponse.json();
    encoded = encodeData.status === 200 ? encodeData.result : null;
        
    if (!encoded) {
      throw new Error('Token encryption failed');
    }
  } catch (error) {
    throw new NotFoundError('Token encryption failed');
  }
  
  const ajaxUrl = `/ajax/links/list`;
  const url = `${config.baseurl}${ajaxUrl}?token=${epToken}&_=${encoded}`;
    
  try {
    const res = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': `${config.baseurl}/`,
        ...config.headers,
      },
    });
    
    const data = await res.json();
    const html = data.result || '';
    
    if (!html) {
      return {
        watching: '',
        servers: {}
      };
    }
    
    const response = serversExtract(html);
    return response;
  } catch (err) {
    console.error('Fetch error:', err.message);
    throw new NotFoundError('Servers not found: ' + err.message);
  }
}