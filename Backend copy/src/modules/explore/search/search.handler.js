import extractSearch from "./search.extract";
import { axiosInstance } from "@/services/axiosInstance";
import createEndpoint from "@/utils/createEndpoint";
import { NotFoundError, validationError } from "@/utils/errors";
import connectRedis from "@/utils/connectRedis";

export default async function searchHandler(c) {
  const { page, keyword } = c.req.valid("query");

  const { exist, redis } = await connectRedis();
  const cacheKey = `search:${keyword}:page:${page}`;

  const extractMoreLink = (html) => {
    const match = html.match(/<a[^>]*class="page-link"[^>]*rel="next"[^>]*href="([^"]+)"/);
    return match ? match[1] : null;
  };

  const extractTotalPages = (html) => {
    const paginationLinks = html.match(/<li class="page-item"[^>]*><a[^>]*href="[^"]*page=(\d+)"[^>]*>/g);
    if (!paginationLinks) return 1;
    
    const pages = paginationLinks.map(link => {
      const match = link.match(/page=(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    return Math.max(...pages, 1);
  };

  const fetchFresh = async () => {
    const endpoint = createEndpoint(`browser?keyword=${keyword}`, page);
    const result = await axiosInstance(endpoint, { responseType: "text" });

    if (!result.success) {
      throw new validationError("make sure given endpoint is correct");
    }

    const html = result.data;
    if (!html || typeof html !== "string") {
      throw new NotFoundError("No search results found");
    }

    const items = extractSearch(html);
    if (items.length < 1) throw new NotFoundError();

    const moreLink = extractMoreLink(html);
    const totalPages = extractTotalPages(html);
    const hasNextPage = !!moreLink && page < totalPages;

    return { 
      items, 
      moreLink,
      pageInfo: {
        currentPage: page,
        hasNextPage,
        totalPages
      }
    };
  };

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

  // No Redis – skip caching
  if (!exist) {
    const { items, moreLink, pageInfo } = await fetchFresh();
    return c.json({ success: true, keyword, count: items.length, items, moreLink, pageInfo });
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const { items, moreLink, pageInfo } = parseCached(cached);
      return c.json({ success: true, keyword, count: items.length, items, moreLink, pageInfo });
    }
  } catch (err) {
    console.error("Redis read error:", err.message);
  }

  // Cache miss or error – fetch fresh
  const { items, moreLink, pageInfo } = await fetchFresh();

  // Store in Redis (TTL: 1 hour)
  try {
    await redis.set(cacheKey, JSON.stringify({ items, moreLink, pageInfo }), { ex: 60 * 60 });
  } catch (err) {
    console.error("Redis write error:", err.message);
  }

  return c.json({ success: true, keyword, count: items.length, items, moreLink, pageInfo });
}