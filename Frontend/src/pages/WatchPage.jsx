import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import { useApi3 } from "../services/useApi3";
import PageNotFound from "./PageNotFound";
import {
  Grid3x3,
  List,
  Home,
  ChevronRight,
  Film,
  Clock,
  Share2,
  Bookmark,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const normalizeEpisodeParam = (value) => {
  if (!value) return null;
  const matched = String(value).match(/\d+(?:\.\d+)?/);
  return matched ? matched[0] : null;
};

const getEpisodeNumberFromEpisode = (episode) => {
  if (!episode) return null;
  const directNumber = Number(episode.episodeNumber);
  if (Number.isFinite(directNumber) && directNumber > 0) return directNumber;
  const id = String(episode.id || "");
  const episodeMatch = id.match(/(?:^|-)episode-(\d+)(?:$|[/?#])/i);
  if (episodeMatch) return Number(episodeMatch[1]);
  const numericMatch = id.match(/(\d+(?:\.\d+)?)(?!.*\d)/);
  return numericMatch ? Number(numericMatch[1]) : null;
};

const getEpisodeParam = (episode) => {
  const episodeNumber = getEpisodeNumberFromEpisode(episode);
  return episodeNumber ? String(episodeNumber) : null;
};

const humanizeSlug = (value = "") =>
  decodeURIComponent(String(value))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseWatchSlug = (rawSlug = "") => {
  if (!rawSlug) return { animeId: "", animeTitle: "" };
  const cleanedSlug = decodeURIComponent(rawSlug.split("?")[0]);
  const episodePattern = cleanedSlug.match(/^(.*)-episode-(\d+)$/i);
  if (episodePattern) {
    return {
      animeId: episodePattern[1],
      animeTitle: humanizeSlug(episodePattern[1]),
    };
  }
  if (cleanedSlug.includes("-_")) {
    const [titlePart, idPart] = cleanedSlug.split("-_");
    return {
      animeId: idPart || "",
      animeTitle: titlePart
        ? decodeURIComponent(titlePart).replace(/-/g, " ").trim()
        : "",
    };
  }
  return {
    animeId: cleanedSlug,
    animeTitle: humanizeSlug(cleanedSlug),
  };
};




const WatchPage = () => {
  const { slug } = useParams();
  const { animeId: id, animeTitle: parsedAnimeTitle } = parseWatchSlug(
    slug || ""
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("column");
  const [showEpisodeList, setShowEpisodeList] = useState(true);

  const ep = normalizeEpisodeParam(searchParams.get("ep"));

  const { data, isError, isLoading } = useApi(`/episodes/${id}`);


  const searchQuery = `/api/search?q=MAO`;
  const { data: searchData, isLoading: searchLoading, isError: searchError } = useApi3(searchQuery);

  const episodes = useMemo(() => data?.data || [], [data]);

  const updateParams = useCallback((newParam) => {
    const normalizedEp = normalizeEpisodeParam(newParam);
    if (!normalizedEp) return;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("ep", normalizedEp);
      return newParams;
    });
  }, [setSearchParams]);

  // Auto-redirect to first episode if no `ep` param
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEpisode = getEpisodeParam(episodes[0]);
      if (firstEpisode) updateParams(firstEpisode);
    }
  }, [ep, episodes, updateParams]);

  useEffect(() => {
    if (!ep || !episodes.length) return;
    const hasMatchingEpisode = episodes.some(
      (episode) => normalizeEpisodeParam(getEpisodeParam(episode)) === ep
    );
    if (!hasMatchingEpisode) {
      const firstEpisode = getEpisodeParam(episodes[0]);
      if (firstEpisode) updateParams(firstEpisode);
    }
  }, [ep, episodes, updateParams]);

  if (isError) return <PageNotFound />;

  if (isLoading || !episodes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Loader className="h-16 w-16" />
      </div>
    );
  }

  if (Array.isArray(episodes) && episodes.length === 0) {
    return <Navigate to={`/anime/${id}`} replace />;
  }

  const currentEp =
    episodes && ep !== null
      ? episodes.find(
          (episode) => normalizeEpisodeParam(getEpisodeParam(episode)) === ep
        )
      : null;

  const changeEpisode = (action) => {
    if (!currentEp) return;
    const currentIndex = episodes.findIndex(
      (episode) =>
        normalizeEpisodeParam(getEpisodeParam(episode)) ===
        normalizeEpisodeParam(getEpisodeParam(currentEp))
    );
    if (currentIndex === -1) return;
    if (action === "next") {
      const nextEp = episodes[currentIndex + 1];
      if (nextEp) updateParams(getEpisodeParam(nextEp));
    } else {
      const prevEp = episodes[currentIndex - 1];
      if (prevEp) updateParams(getEpisodeParam(prevEp));
    }
  };

  const currentEpisodeIndex = currentEp
    ? episodes.findIndex(
        (episode) =>
          normalizeEpisodeParam(getEpisodeParam(episode)) ===
          normalizeEpisodeParam(getEpisodeParam(currentEp))
      )
    : -1;

  const hasNextEp =
    currentEpisodeIndex > -1 ? Boolean(episodes[currentEpisodeIndex + 1]) : false;
  const hasPrevEp =
    currentEpisodeIndex > -1 ? Boolean(episodes[currentEpisodeIndex - 1]) : false;

  const animeTitle = parsedAnimeTitle?.toUpperCase() || "Anime";
  const safeEpNumber = getEpisodeNumberFromEpisode(currentEp) ?? ep ?? "1";

  // SEO: dynamic meta
  const title = `Watch ${animeTitle} Episode ${safeEpNumber} Online Free | AnimeWeebs`;
  const description = `Stream ${animeTitle} Episode ${safeEpNumber} in HD with no ads. Watch free on AnimeWeebs – subbed & dubbed, multiple servers.`;
  const canonicalUrl = `https://animeweebs.com/watch/${slug}`;
  const imageUrl = currentEp?.poster || "https://animeweebs.com/default-og.jpg";

  // JSON‑LD: VideoObject + BreadcrumbList
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${animeTitle} Episode ${safeEpNumber}`,
    "description": description,
    "thumbnailUrl": imageUrl,
    "uploadDate": currentEp?.aired || new Date().toISOString(),
    "duration": currentEp?.duration || "",
    "embedUrl": canonicalUrl,
    "contentUrl": canonicalUrl,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/WatchAction",
      "userInteractionCount": 1000,
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://animeweebs.com/" },
      { "@type": "ListItem", position: 2, name: animeTitle, item: `https://animeweebs.com/anime/${id}` },
      { "@type": "ListItem", position: 3, name: `Episode ${safeEpNumber}`, item: canonicalUrl },
    ],
  };

  const showDetailedView = episodes.length <= 50;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 to-black">
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${animeTitle}, episode ${safeEpNumber}, watch free, online streaming, subbed, dubbed, animeweebs`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="video.episode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb (mobile friendly) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6 flex-wrap">
          <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-white transition">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-primary font-medium truncate">Episode {safeEpNumber}</span>
        </nav>

        {/* Mobile action buttons (row) */}
        <div className="flex items-center justify-between mb-6 sm:hidden">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-white">
              <Bookmark className="w-3 h-3" /> Save
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-white">
              <Share2 className="w-3 h-3" /> Share
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            {/* Hidden H1 for SEO (visible only to screen readers) */}
            <h1 className="sr-only">Watch {animeTitle} Episode {safeEpNumber} online free</h1>

            <div className="mb-6">
              {/* Episode info */}
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{animeTitle}</h2>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><Film className="w-4 h-4" /> Episode {safeEpNumber}</span>
                  {currentEp?.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {currentEp.duration}</span>}
                </div>
              </div>

              {/* Player */}
              {ep && id && currentEp && (
                <Player
                  episodeId={currentEp.id}
                  token={currentEp.token}
                  currentEp={currentEp}
                  changeEpisode={changeEpisode}
                  hasNextEp={hasNextEp}
                  hasPrevEp={hasPrevEp}
                />
              )}
            </div>
          </div>

          {/* Episodes Sidebar – sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gray-800/30 rounded-xl p-4">
                {/* Episodes Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">Episodes</h3>
                      <p className="text-xs text-gray-400">{episodes.length} total</p>
                    </div>
                    {showDetailedView && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setLayout("column")}
                          className={`p-2 rounded-lg transition ${
                            layout === "column" ? "bg-primary text-black" : "bg-gray-700 text-gray-400"
                          }`}
                          aria-label="Grid view"
                        >
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayout("row")}
                          className={`p-2 rounded-lg transition ${
                            layout === "row" ? "bg-primary text-black" : "bg-gray-700 text-gray-400"
                          }`}
                          aria-label="List view"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick stats cards (responsive grid) */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{safeEpNumber}</div>
                    <div className="text-xs text-gray-400">Current</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{episodes.length}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>

                {/* Toggleable Episode List */}
                <div className="relative">
                  <div
                    className={`overflow-y-auto transition-all duration-300 ${
                      showEpisodeList ? "max-h-[60vh] sm:max-h-[70vh]" : "max-h-0"
                    }`}
                  >
                    <Episodes
                      episodes={episodes}
                      currentEp={currentEp}
                      layout={showDetailedView ? layout : "column"}
                      animeId={id}
                      animeTitle={animeTitle}
                    />
                  </div>
                  <button
                    onClick={() => setShowEpisodeList(!showEpisodeList)}
                    className="w-full mt-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1 transition"
                  >
                    {showEpisodeList ? "Hide Episodes" : "Show Episodes"}
                    <ChevronRight className={`w-4 h-4 transition-transform ${showEpisodeList ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episode Navigation (mobile optimized) */}
        {currentEp && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                {hasPrevEp && (
                  <button
                    onClick={() => changeEpisode("prev")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition group"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Previous</div>
                      <div className="font-medium">Ep {currentEp.episodeNumber - 1}</div>
                    </div>
                  </button>
                )}
              </div>
              <div className="w-full sm:w-auto">
                {hasNextEp && (
                  <button
                    onClick={() => changeEpisode("next")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 rounded-xl text-black font-medium transition group"
                  >
                    <div className="text-right">
                      <div className="text-xs text-black/70">Next</div>
                      <div className="font-medium">Ep {currentEp.episodeNumber + 1}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hidden SEO paragraph */}
        <div className="sr-only">
          <p>
            Watch {animeTitle} Episode {safeEpNumber} online free in HD on AnimeWeebs.
            No ads, fast streaming, multiple servers. Subbed and dubbed available.
            The best free anime site to watch {animeTitle} episodes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;