// index.js
// Anime metadata API using AniList GraphQL (recommended instead of HTML scraping)
//
// Setup:
//   npm install express cors
//
// Run:
//   node index.js
//
// API:
//   GET /api/recent-anime
//   GET /api/anime/:id
//   GET /api/watch?id=<anime-id>

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.options(/.*/, cors());

// --------------------------------------------------
// Health Check
// --------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Anime API server is running",
    port: PORT,
  });
});

// --------------------------------------------------
// Recent Anime
// --------------------------------------------------
app.get("/api/recent-anime", async (req, res) => {
  try {
    const response = await fetch(
      "https://anikotoapi.site/recent-anime?page=1&per_page=12"
    );

    if (!response.ok) {
      throw new Error(`Upstream API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Recent anime error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// --------------------------------------------------
// Watch Data
// --------------------------------------------------
app.get("/api/watch", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing query parameter: id",
      });
    }

    const response = await fetch(`https://anikotoapi.site/series/${id}`);

    if (!response.ok) {
      throw new Error(`Upstream API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Watch API error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// --------------------------------------------------
// Anime Details from AniList GraphQL
// --------------------------------------------------
app.get("/api/anime/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid anime ID",
      });
    }

    const data = await fetchAniListAnime(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Anime details error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// --------------------------------------------------
// AniList GraphQL Fetcher
// --------------------------------------------------
async function fetchAniListAnime(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        format
        status
        episodes
        duration
        season
        seasonYear
        averageScore
        meanScore
        popularity
        favourites
        source
        hashtag
        genres
        synonyms

        studios(isMain: false) {
          nodes {
            id
            name
          }
        }

        tags {
          id
          name
          rank
        }

        nextAiringEpisode {
          episode
          timeUntilAiring
        }

        relations {
          edges {
            relationType
            node {
              id
              type
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
            }
          }
        }

        characters(sort: ROLE, perPage: 6) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE) {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }

        staff(perPage: 6) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }

        externalLinks {
          site
          url
          language
        }

        recommendations(perPage: 5) {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "AnimeWeebs/1.0",
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList API returned ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  const media = json.data.Media;

  if (!media) {
    throw new Error("Anime not found");
  }

  return {
    id: media.id,
    title: media.title.romaji || media.title.english,
    romaji: media.title.romaji,
    english: media.title.english,
    native: media.title.native,
    synonyms: media.synonyms || [],
    description: media.description,
    poster:
      media.coverImage.extraLarge ||
      media.coverImage.large ||
      media.coverImage.medium,
    bannerImage: media.bannerImage,

    format: media.format,
    status: media.status,
    episodes: media.episodes,
    episodeDuration: media.duration,
    season: media.season,
    seasonYear: media.seasonYear,

    averageScore: media.averageScore,
    meanScore: media.meanScore,
    popularity: media.popularity,
    favorites: media.favourites,
    source: media.source,

    hashtag: media.hashtag
      ? {
          text: media.hashtag,
          url: `https://twitter.com/search?q=${encodeURIComponent(
            media.hashtag
          )}`,
        }
      : null,

    genres: media.genres || [],

    studios:
      media.studios?.nodes?.map((studio) => ({
        id: studio.id,
        name: studio.name,
      })) || [],

    tags:
      media.tags?.map((tag) => ({
        id: tag.id,
        name: tag.name,
        percentage: tag.rank,
      })) || [],

    airing: media.nextAiringEpisode
      ? {
          nextEpisode: media.nextAiringEpisode.episode,
          timeUntilAiring: media.nextAiringEpisode.timeUntilAiring,
        }
      : null,

    relations:
      media.relations?.edges?.map((edge) => ({
        type: edge.relationType,
        id: edge.node.id,
        mediaType: edge.node.type.toLowerCase(),
        title:
          edge.node.title.romaji || edge.node.title.english || "Unknown",
        poster: edge.node.coverImage?.medium || null,
      })) || [],

    characters:
      media.characters?.edges?.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name.full,
        role: edge.role,
        image: edge.node.image?.large || null,
        voiceActor:
          edge.voiceActors?.length > 0
            ? {
                id: edge.voiceActors[0].id,
                name: edge.voiceActors[0].name.full,
                image: edge.voiceActors[0].image?.large || null,
              }
            : null,
      })) || [],

    staff:
      media.staff?.edges?.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name.full,
        role: edge.role,
        image: edge.node.image?.large || null,
      })) || [],

    externalLinks:
      media.externalLinks?.map((link) => ({
        name: link.site,
        url: link.url,
        language: link.language || null,
      })) || [],

    recommendations:
      media.recommendations?.nodes
        ?.filter((node) => node.mediaRecommendation)
        .map((node) => ({
          id: node.mediaRecommendation.id,
          title:
            node.mediaRecommendation.title.romaji ||
            node.mediaRecommendation.title.english,
          poster: node.mediaRecommendation.coverImage?.medium || null,
        })) || [],
  };
}

// --------------------------------------------------
// Start Server
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});