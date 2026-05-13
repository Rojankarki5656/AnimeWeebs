import config from "@/config/config";
import { axiosInstance } from "@/services/axiosInstance";
import { NotFoundError } from "@/utils/errors";
import infoExtract from "../info/info.extract";
import episodesExtract from "./episodes.extract";
import connectRedis from "@/utils/connectRedis";

const ENCDEC_URL = "https://enc-dec.app/api/enc-reanime";

async function encodeToken(text) {
  try {
    const response = await fetch(
      `${ENCDEC_URL}?encode=${encodeURIComponent(text)}`,
      {
        method: "GET",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.status === 200 ? data.result : null;
  } catch (error) {
    console.error("Encode error:", error.message);
    return null;
  }
}

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

export default async function episodesHandler(c) {
  const { id } = c.req.valid("param");
  
  const { exist, redis } = await connectRedis();
  const cacheKey = `episodes:${id}`;

  const fetchFreshEpisodes = async () => {
    let aniId = id;
    try {
      const detailRes = await axiosInstance(`watch/${id}`);
      if (detailRes.success && detailRes.data) {
        const detail = infoExtract(detailRes.data);
        if (detail?.id) {
          aniId = detail.id;
        }
      }
    } catch (resolveError) {
      console.log("Resolve anime id failed:", resolveError.message);
    }

    const token = await encodeToken(aniId);
    if (!token) {
      throw new Error("Failed to generate token");
    }

    const episodesUrl = `ajax/episodes/list?ani_id=${aniId}&_=${token}`;
    const episodesRes = await fetch(config.baseurl + episodesUrl);

    if (!episodesRes.ok) {
      throw new Error(`Failed to fetch episodes: ${episodesRes.status}`);
    }

    const episodesData = await episodesRes.json();
    if (episodesData.status !== "ok") {
      throw new Error("Invalid episodes response");
    }

    const episodes = episodesExtract(episodesData.result, aniId);
    return episodes;
  };

  if (!exist) {
    const episodes = await fetchFreshEpisodes();
    return episodes;
  }

  // Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache hit for episodes:", id);
      const episodes = parseCached(cached);
      return episodes;
    }
  } catch (err) {
    console.error("Redis read error:", err.message);
    // Delete corrupted cache entry
    try {
      await redis.del(cacheKey);
    } catch (delErr) {
      console.error("Failed to delete corrupted cache:", delErr.message);
    }
  }

  const episodes = await fetchFreshEpisodes();

  try {
    await redis.set(cacheKey, JSON.stringify(episodes), {
      ex: 60 * 60 * 24,
    });
  } catch (err) {
    console.error("Redis write error:", err.message);
  }

  return episodes;
}