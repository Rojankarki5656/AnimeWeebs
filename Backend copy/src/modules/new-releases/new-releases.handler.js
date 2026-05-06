import config from '@/config/config';
import extractNewReleases from './new-releases.extract';
import { NotFoundError } from '@/utils/errors';
import connectRedis from '@/utils/connectRedis'; // added

export default async function newReleasesHandler(c) {
  let page = parseInt(c.req.query('page') || '1');
  if (isNaN(page) || page < 1) page = 1;

  const { exist, redis } = await connectRedis();

  // Helper to fetch fresh data (reuses existing logic)
  const fetchFresh = async () => {
    const { items, totalPages } = await fetchNewReleases(page);
    return { items, totalPages };
  };

  // If Redis is not available, skip caching
  if (!exist) {
    const { items, totalPages } = await fetchFresh();
    return c.json({
      success: true,
      page,
      totalPages,
      items,
    });
  }

  // Try cache – use a key that includes the page number
  const cacheKey = `new-releases:page:${page}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const { items, totalPages } = JSON.parse(cached);
      return c.json({
        success: true,
        page,
        totalPages,
        items,
      });
    }
  } catch (err) {
    console.error('Redis read error:', err.message);
    // fall through to fetch fresh
  }

  // Cache miss or error – fetch fresh data
  const { items, totalPages } = await fetchFresh();

  // Store in Redis with TTL (e.g., 24 hours)
  try {
    await redis.set(cacheKey, JSON.stringify({ items, totalPages }), {
      ex: 60 * 60 * 24,
    });
  } catch (err) {
    console.error('Redis write error:', err.message);
    // Non‑critical, continue
  }

  return c.json({
    success: true,
    page,
    totalPages,
    items,
  });
}

// fetchNewReleases remains unchanged
export async function fetchNewReleases(page) {
  const url = `${config.baseurl}/new-releases?page=${page}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: config.baseurl,
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const { items, totalPages } = extractNewReleases(html);

    return { items, totalPages };
  } catch (err) {
    console.error('Failed to fetch new releases:', err.message);
    throw new NotFoundError('Could not fetch new releases');
  }
}