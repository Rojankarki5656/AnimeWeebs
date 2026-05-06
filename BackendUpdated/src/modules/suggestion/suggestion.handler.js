import { validationError } from '@/utils/errors';
import config from '@/config/config';
import suggestionExtract from './suggestion.extract';
import connectRedis from '@/utils/connectRedis'; // added

export default async function suggestionHandler(c) {
  const { keyword } = c.req.valid('query');
  
  const { exist, redis } = await connectRedis();
  const cacheKey = `suggestion:${keyword}`;

  // Helper to fetch fresh suggestion data
  const fetchFreshSuggestions = async () => {
    const endpoint = `ajax/anime/search?keyword=${keyword}`;
    const Referer = `${config.baseurl}/home`;
    const res = await fetch(config.baseurl + endpoint, {
      headers: {
        Referer,
        ...config.headers,
      },
    });
    const data = await res.json();
    if (!data.status) throw new validationError('suggestion not found');

    const response = suggestionExtract(data.result.html);
    return response;
  };

  // If Redis is not available, skip caching
  if (!exist) {
    return fetchFreshSuggestions();
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Redis read error:', err.message);
    // fall through to fetch fresh
  }

  // Cache miss or error – fetch fresh data
  const suggestions = await fetchFreshSuggestions();

  // Store in Redis with TTL (e.g., 1 hour – suggestions may change often)
  try {
    await redis.set(cacheKey, JSON.stringify(suggestions), {
      ex: 60 * 60, // 1 hour
    });
  } catch (err) {
    console.error('Redis write error:', err.message);
    // Non‑critical, continue
  }

  return suggestions;
}