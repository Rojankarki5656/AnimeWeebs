import config from '@/config/config';
import serversExtract from './servers.extract';
import { NotFoundError } from '@/utils/errors';

export default async function (c) {
  const { ep_token } = c.req.valid('param');

  const response = await getServers(ep_token);

  // `withTryCatch()` wraps this return value as { success: true, data: ... }
  return {
    watching: response.watching,
    servers: response.servers,
  };
}

export async function getServers(epToken) {
  const ENCDEC_URL = 'https://enc-dec.app/api/enc-kai';
  
  // First encode the token
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
    
    // Check if there's a result property
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