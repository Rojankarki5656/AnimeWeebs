// Home.js
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import HeroCarousel from "../components/hero"; // your existing HeroCarousel
import TrendingLayout from "../layouts/TrendingLayout";
import MainLayout from "../layouts/MainLayout";
import Footer from "../components/Footer";
import { useAniListHome } from "../hooks/home";
import { useLatestEpisodes } from "../hooks/latestEpisodes";

const Home = () => {
  const {
    trendingNow,
    popularThisSeason,
    upcomingNextSeason,
    allTimePopular,
    top100,
    loading,
    error,
  } = useAniListHome();

  const {
    data: latestEpisodes,
    loading: latestLoading,
    error: latestError,
  } = useLatestEpisodes();

  // Prepare data for HeroCarousel – take first 6 from trendingNow + popularThisSeason
  const heroSlides = [...(trendingNow || []), ...(popularThisSeason || [])]
    .slice(0, 6)
    .map((anime, idx) => ({
      id: anime.id,
      title:
        anime.title?.romaji ||
        anime.title?.english ||
        anime.title?.native ||
        "Untitled",
      poster: anime.coverImage?.extraLarge || anime.coverImage?.large || "",
      type: "ANIME", // default
      aired: new Date().getFullYear().toString(), // fallback
      duration: "? min",
      synopsis: anime.description || "No description available.",
      sessionId: null, // if you don't need sessions, set null
      rank: idx + 1,
    }));

  // For TrendingLayout – use trendingNow (already in correct shape)
  const trendingData = (trendingNow || []).map((anime, idx) => ({
    id: anime.id,
    title: anime.title?.romaji || anime.title?.english || anime.title?.native,
    poster: anime.coverImage?.large || anime.coverImage?.medium,
    rank: idx + 1,
    sessionId: null, // adjust if needed
  }));

  // For MainLayout – upcoming next season
  const upcomingData = (upcomingNextSeason || []).map((anime) => ({
    id: anime.id,
    title: anime.title?.romaji || anime.title?.english || anime.title?.native,
    poster: anime.coverImage?.large || anime.coverImage?.medium,
    episodes: { sub: 0, dub: 0, eps: 0 }, // fallback – API does not provide episode counts
    type: "ANIME",
  }));

  // For MainLayout – all time popular
  const popularData = (allTimePopular || []).map((anime) => ({
    id: anime.id,
    title: anime.title?.romaji || anime.title?.english || anime.title?.native,
    poster: anime.coverImage?.large || anime.coverImage?.medium,
    episodes: { sub: 0, dub: 0, eps: 0 },
    type: "ANIME",
  }));

  // For MainLayout – top 100 (show rank)
  const top100Data = (top100 || []).map((anime, idx) => ({
    id: anime.id,
    title: anime.title?.romaji || anime.title?.english || anime.title?.native,
    poster: anime.coverImage?.large || anime.coverImage?.medium,
    episodes: { sub: 0, dub: 0, eps: 0 },
    type: "ANIME",
    rank: idx + 1, // custom rank for MainLayout (if you want to display)
  }));

  if (loading) return <Loader className="h-screen" />;
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>Failed to load anime data. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Helmet>
        <title>
          AnimeWeebs – Watch Anime Online Free – No Ads, HD Streaming
        </title>
        <meta
          name="description"
          content="Watch anime online free on AnimeWeebs – the ultimate no-ads anime streaming site. Stream the latest episodes of trending anime, seasonal hits, and top-rated classics in HD."
        />
        <link rel="canonical" href="https://animeweebs.app" />
      </Helmet>

      {/* Hero Carousel – uses trending + popular */}
      <HeroCarousel slides={heroSlides} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Section */}
        {trendingData.length > 0 && (
          <TrendingLayout data={trendingData} heading="🔥 Trending Now" />
        )}

        {!latestLoading && !latestError && latestEpisodes.length > 0 && (
          <MainLayout
            title="Latest Episodes"
            data={latestEpisodes}
            endpoint="recent-anime"
          />
        )}
        {latestError && (
          <p className="text-red-400 text-sm">
            Failed to load latest episodes.
          </p>
        )}

        {/* Upcoming Next Season */}
        {upcomingData.length > 0 && (
          <MainLayout
            title="📅 Upcoming Next Season"
            data={upcomingData}
            endpoint="next-season"
          />
        )}

        {/* All Time Popular */}
        {popularData.length > 0 && (
          <MainLayout
            title="🏆 All Time Popular"
            data={popularData}
            endpoint="all-time-popular"
          />
        )}

        {/* Top 100 Anime (with rank) */}
        {top100Data.length > 0 && (
          <MainLayout
            title="🌟 Top 100 Anime"
            data={top100Data}
            endpoint="top-100"
            showRank
          />
        )}

        {/* SEO paragraph */}
        <div className="text-center text-gray-300 text-sm space-y-2 max-w-3xl mx-auto pt-8">
          <p>
            <strong>AnimeWeebs</strong> is the best{" "}
            <strong>free anime streaming site</strong> to watch anime online
            free with <strong>no ads</strong>. Stream the latest episodes in HD,
            from trending shows to timeless classics. No registration required.
            Start watching now!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
