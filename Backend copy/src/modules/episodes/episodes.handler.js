import config from "@/config/config";
import { axiosInstance } from "@/services/axiosInstance";
import { NotFoundError } from "@/utils/errors";
import infoExtract from "../info/info.extract";
import episodesExtract from "./episodes.extract";

const ENCDEC_URL = "https://enc-dec.app/api/enc-kai"; // Update this URL

async function encodeToken(text) {
  try {
    const response = await fetch(
      `${ENCDEC_URL}?text=${encodeURIComponent(text)}`,
      {
        method: "GET",
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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

export default async function episodesHandler(c) {
  const { id } = c.req.valid("param");

  try {
    // Resolve slug-based ids to the internal anime id when needed.
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

    // Generate token from ani_id
    const token = await encodeToken(aniId);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    // Fetch episodes
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
  } catch (err) {
    console.log("Error:", err.message);
    throw new NotFoundError("Episodes Not Found");
  }
}
