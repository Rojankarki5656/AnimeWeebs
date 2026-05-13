// WatchPage.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
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
  Sun,
  Focus,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSeriesData } from "../hooks/useSeriesData";

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------
const normalizeEpisodeParam = (value) => {
  if (!value) return null;
  const matched = String(value).match(/\d+(?:\.\d+)?/);
  return matched ? matched[0] : null;
};

const getEpisodeParam = (release) => {
  const epNum = release?.number;
  return epNum ? String(epNum) : null;
};

// ----------------------------------------------------------------------
// Main WatchPage component
// ----------------------------------------------------------------------
const WatchPage = () => {
  const { id } = useParams(); // numeric anime ID from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("column");
  const [showEpisodeList, setShowEpisodeList] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const ep = normalizeEpisodeParam(searchParams.get("ep"));

  // Use the enhanced hook with fallback
  const { series, episodes, isLoading, isError, usedFallback } =
    useSeriesData(id);

  // Find current episode object
  const currentEp = useMemo(() => {
    if (!ep || !episodes.length) return null;
    return episodes.find((episode) => String(episode.number) === ep);
  }, [episodes, ep]);

  // Update URL when episode changes
  const updateParams = useCallback(
    (newEpisodeNum) => {
      const normalized = normalizeEpisodeParam(newEpisodeNum);
      if (!normalized) return;
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("ep", normalized);
        return newParams;
      });
    },
    [setSearchParams],
  );

  // If no episode param and episodes exist, select first episode
  useEffect(() => {
    if (!ep && episodes.length > 0) {
      const firstEpNum = getEpisodeParam(episodes[0]);
      if (firstEpNum) updateParams(firstEpNum);
    }
  }, [ep, episodes, updateParams]);

  // If current episode is invalid, fallback to first episode
  useEffect(() => {
    if (ep && episodes.length > 0 && !currentEp) {
      const firstEpNum = getEpisodeParam(episodes[0]);
      if (firstEpNum) updateParams(firstEpNum);
    }
  }, [ep, episodes, currentEp, updateParams]);

  const currentIndex = useMemo(() => {
    if (!currentEp) return -1;
    return episodes.findIndex((e) => e.number === currentEp.number);
  }, [episodes, currentEp]);

  const hasNextEp = currentIndex > -1 && currentIndex < episodes.length - 1;
  const hasPrevEp = currentIndex > -1 && currentIndex > 0;

  const changeEpisode = (action) => {
    if (action === "next" && hasNextEp) {
      const next = episodes[currentIndex + 1];
      updateParams(next.number);
    } else if (action === "prev" && hasPrevEp) {
      const prev = episodes[currentIndex - 1];
      updateParams(prev.number);
    }
  };

  // Prepare player sources from current episode's embed_url
  const getPlayerSources = () => {
    if (!currentEp) return [];
    const sources = [];
    if (currentEp.embed_url?.sub) {
      sources.push({
        label: "SUB",
        file: currentEp.embed_url.sub,
        type: "iframe",
      });
    }
    if (currentEp.embed_url?.dub) {
      sources.push({
        label: "DUB",
        file: currentEp.embed_url.dub,
        type: "iframe",
      });
    }
    return sources;
  };

  // Loading / error states
  if (isError) return <PageNotFound />;
  if (isLoading || !episodes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Loader className="h-16 w-16" />
      </div>
    );
  }
  if (!series || episodes.length === 0) {
    return <Navigate to="/" replace />;
  }

  const animeTitle = series.title || "Anime";
  const safeEpNumber = currentEp?.number ?? ep ?? "1";
  const title = `Watch ${animeTitle} Episode ${safeEpNumber} Online Free | AnimeWeebs`;
  const description = `Stream ${animeTitle} Episode ${safeEpNumber} in HD with no ads. Watch free on AnimeWeebs – subbed & dubbed.`;
  const canonicalUrl = `https://animeweebs.com/watch/${id}?ep=${safeEpNumber}`;
  const imageUrl = series.poster || "https://animeweebs.com/default-og.jpg";

  // JSON-LD schemas
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${animeTitle} Episode ${safeEpNumber}`,
    description: description,
    thumbnailUrl: imageUrl,
    uploadDate: currentEp?.updated_at || new Date().toISOString(),
    duration: series.duration ? `${series.duration} min` : "",
    embedUrl: canonicalUrl,
    contentUrl: canonicalUrl,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: 1000,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://animeweebs.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: animeTitle,
        item: `https://animeweebs.com/anime/${id}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Episode ${safeEpNumber}`,
        item: canonicalUrl,
      },
    ],
  };

  const showDetailedView = episodes.length <= 50;

  const containerClasses = `min-h-screen pt-20 transition-all duration-300 ${
    theaterMode ? "bg-black" : "bg-gradient-to-br from-gray-900 to-black"
  } ${focusMode ? "overflow-x-hidden" : ""}`;

  const mainGridClasses = `grid grid-cols-1 gap-6 lg:gap-8 transition-all duration-300 ${
    focusMode ? "lg:grid-cols-1" : "lg:grid-cols-4"
  }`;

  const sidebarClasses = `transition-all duration-300 ${focusMode ? "hidden" : "lg:block"}`;

  return (
    <div className={containerClasses}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`${animeTitle}, episode ${safeEpNumber}, watch free, online streaming, subbed, dubbed, animeweebs`}
        />
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
        <script type="application/ld+json">
          {JSON.stringify(videoSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {!focusMode && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm mb-6 flex-wrap"
          >
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link
              to={`/anime/${id}`}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition"
            >
              <span className="hidden sm:inline">Anime</span>
            </Link>

            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-primary font-medium truncate">
              Episode {safeEpNumber}
            </span>
          </nav>
        )}

        {!focusMode && (
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
        )}

        <div className={mainGridClasses}>
          <div className={focusMode ? "lg:col-span-1" : "lg:col-span-3"}>
            <h1 className="sr-only">
              Watch {animeTitle} Episode {safeEpNumber} online free
            </h1>
            <div className="mb-6">
              {!focusMode && (
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {animeTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Film className="w-4 h-4" /> Episode {safeEpNumber}
                    </span>
                    {series.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {series.duration} min
                      </span>
                    )}
                    {currentEp?.embed_url?.dub && (
                      <span className="flex items-center gap-1 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                        Dub Available
                      </span>
                    )}
                  </div>
                </div>
              )}

              {currentEp && (
                <Player
                  key={currentEp.number}
                  episodeNumber={safeEpNumber}
                  animeTitle={animeTitle}
                  sources={getPlayerSources()}
                  downloads={[]}
                  isLoading={false}
                  isError={false}
                  onNext={hasNextEp ? () => changeEpisode("next") : undefined}
                  onPrev={hasPrevEp ? () => changeEpisode("prev") : undefined}
                  hasNext={hasNextEp}
                  hasPrev={hasPrevEp}
                  isTheater={theaterMode}
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheaterMode(!theaterMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                      theaterMode
                        ? "bg-primary text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {theaterMode ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                    {theaterMode ? "Exit Cinema" : "Cinema Mode"}
                  </button>
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                      focusMode
                        ? "bg-primary text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {focusMode ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Focus className="w-4 h-4" />
                    )}
                    {focusMode ? "Exit Focus" : "Focus Mode"}
                  </button>
                </div>
                {!focusMode && (
                  <div className="hidden sm:flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-white">
                      <Bookmark className="w-3 h-3" /> Save
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-white">
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={sidebarClasses}>
            <div className="sticky top-6">
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">Episodes</h3>
                      <p className="text-xs text-gray-400">
                        {episodes.length} total
                      </p>
                    </div>
                    {showDetailedView && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setLayout("column")}
                          className={`p-2 rounded-lg transition ${layout === "column" ? "bg-primary text-black" : "bg-gray-700 text-gray-400"}`}
                        >
                          <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayout("row")}
                          className={`p-2 rounded-lg transition ${layout === "row" ? "bg-primary text-black" : "bg-gray-700 text-gray-400"}`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">
                      {safeEpNumber}
                    </div>
                    <div className="text-xs text-gray-400">Current</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">
                      {episodes.length}
                    </div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={`overflow-y-auto transition-all duration-300 ${showEpisodeList ? "max-h-[60vh] sm:max-h-[70vh]" : "max-h-0"}`}
                  >
                    <Episodes
                      episodes={episodes.map((ep) => ({
                        episode: ep.number,
                        title: ep.title,
                        session: null,
                      }))}
                      currentEp={
                        currentEp ? { episode: currentEp.number } : null
                      }
                      layout={showDetailedView ? layout : "column"}
                      animeId={id}
                      animeTitle={animeTitle}
                      onEpisodeClick={(episodeObj) =>
                        updateParams(episodeObj.episode)
                      }
                    />
                  </div>
                  <button
                    onClick={() => setShowEpisodeList(!showEpisodeList)}
                    className="w-full mt-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1 transition"
                  >
                    {showEpisodeList ? "Hide Episodes" : "Show Episodes"}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${showEpisodeList ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!focusMode && currentEp && (
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
                      <div className="font-medium">
                        Ep {currentEp.number - 1}
                      </div>
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
                      <div className="font-medium">
                        Ep {currentEp.number + 1}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="sr-only">
          <p>
            Watch {animeTitle} Episode {safeEpNumber} online free in HD on
            AnimeWeebs. No ads, fast streaming.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
