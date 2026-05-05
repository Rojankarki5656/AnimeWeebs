import config from '@/config/config';
import extractUpdates from './recently-updates.extract';
import { NotFoundError } from '@/utils/errors';

export default async function updatesHandler(c) {
  const page = parseInt(c.req.query('page') || '1');
  if (isNaN(page) || page < 1) {
    return c.json({ success: false, error: 'Invalid page number' }, 400);
  }
  
  const data = await fetchUpdates(page);
  return c.json({
    success: true,
    page,
    items: data.items,
    hasNextPage: data.hasNextPage,
  });
}

export async function fetchUpdates(page) {
  // Hardcode name="all-updates" as needed by the upstream API
  const url = `${config.baseurl}/ajax/home/items?name=all-updates&page=${page}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        'X-Requested-With': 'XMLHttpRequest',
        Referer: config.baseurl,
      },
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const json = await res.json();
    if (json.status !== 'ok' || !json.result) {
      throw new Error('Invalid response from upstream');
    }
    
    const items = extractUpdates(json.result);
    // Heuristic: if we got 12 items (typical page size), assume there is a next page
    const hasNextPage = items.length >= 12;
    
    return { items, hasNextPage };
  } catch (err) {
    console.error('Failed to fetch updates:', err.message);
    throw new NotFoundError('Could not fetch recent updates');
  }
}