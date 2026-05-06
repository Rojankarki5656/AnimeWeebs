import config from '@/config/config';
import extractUpdates from './recently-updates.extract';
import { NotFoundError } from '@/utils/errors';
import connectRedis from '@/utils/connectRedis'; // added

export default async function updatesHandler(c) {
  const page = parseInt(c.req.query('page') || '1');
  if (isNaN(page) || page < 1) {
    return c.json({ success: false, error: 'Invalid page number' }, 400);
  }
  
  const { exist, redis } = await connectRedis();
  const cacheKey = `updates:page:${page}`;

  // Helper to fetch fresh data
  const fetchFresh = async () => {
    const data = await fetchUpdates(page);
    return {
      items: data.items,
      hasNextPage: data.hasNextPage,
    };
  };

  // If Redis is not available, skip caching
  if (!exist) {
    const { items, hasNextPage } = await fetchFresh();
    return c.json({
      success: true,
      page,
      items,
      hasNextPage,
    });
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const { items, hasNextPage } = JSON.parse(cached);
      return c.json({
        success: true,
        page,
        items,
        hasNextPage,
      });
    }
  } catch (err) {
    console.error('Redis read error:', err.message);
    // fall through to fetch fresh
  }

  // Cache miss or error – fetch fresh data
  const { items, hasNextPage } = await fetchFresh();

  // Store in Redis with TTL (e.g., 1 hour for updates)
  try {
    await redis.set(cacheKey, JSON.stringify({ items, hasNextPage }), {
      ex: 60 * 60, // 1 hour
    });
  } catch (err) {
    console.error('Redis write error:', err.message);
    // Non‑critical, continue
  }

  return c.json({
    success: true,
    page,
    items,
    hasNextPage,
  });
}

// fetchUpdates remains exactly as originally defined
export async function fetchUpdates(page) {
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
    const hasNextPage = items.length >= 12;
    
    return { items, hasNextPage };
  } catch (err) {
    console.error('Failed to fetch updates:', err.message);
    throw new NotFoundError('Could not fetch recent updates');
  }
}