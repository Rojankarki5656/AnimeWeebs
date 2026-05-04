import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
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
  if (Number.isFinite(directNumber) && directNumber > 0) {
    return directNumber;
  }

  const id = String(episode.id || "");
  const episodeMatch = id.match(/(?:^|-)episode-(\d+)(?:$|[/?#])/i);
  if (episodeMatch) {
    return Number(episodeMatch[1]);
  }

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
  if (!rawSlug) {
    return { animeId: "", animeTitle: "" };
  }

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
        ? decodeURIComponent(titlePart)
            .replace(/-/g, " ")
            .trim()
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
  console.log("Raw slug from URL:", slug);
  console.log("Parsed ID:", id);
  console.log("Parsed Title:", parsedAnimeTitle);
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("column");
  const [showEpisodeList, setShowEpisodeList] = useState(true);

  const ep = normalizeEpisodeParam(searchParams.get("ep"));

  const { data, isError, isLoading } = useApi(`/episodes/${id}`);

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

  // Auto-redirect to first episode if no `ep` param exists
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEpisode = getEpisodeParam(episodes[0]);
      if (firstEpisode) {
        updateParams(firstEpisode);
      }
    }
  }, [ep, episodes, updateParams]);

  useEffect(() => {
    if (!ep || !episodes.length) return;

    const hasMatchingEpisode = episodes.some(
      (episode) => normalizeEpisodeParam(getEpisodeParam(episode)) === ep
    );

    if (!hasMatchingEpisode) {
      const firstEpisode = getEpisodeParam(episodes[0]);
      if (firstEpisode) {
        updateParams(firstEpisode);
      }
    }
  }, [ep, episodes, updateParams]);

  if (isError) {
    return <PageNotFound />;
  }

  if (isLoading || !episodes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Loader className="h-16 w-16" />
      </div>
    );
  }

  // 🚫 BLOCK UPCOMING / NO EPISODES
  if (Array.isArray(episodes) && episodes.length === 0) {
    return <Navigate to={`/anime/${id}`} replace />;
  }

  const currentEp =
    episodes &&
    ep !== null &&
    episodes.find(
      (episode) => normalizeEpisodeParam(getEpisodeParam(episode)) === ep
    );

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
      if (!nextEp) return;
      updateParams(getEpisodeParam(nextEp));
    } else {
      const prevEp = episodes[currentIndex - 1];
      if (!prevEp) return;
      updateParams(getEpisodeParam(prevEp));
    }
  };

  const currentEpisodeIndex = currentEp
    ? episodes.findIndex(
        (episode) =>
          normalizeEpisodeParam(getEpisodeParam(episode)) ===
          normalizeEpisodeParam(getEpisodeParam(currentEp))
      )
    : -1;

  const hasNextEp = currentEpisodeIndex > -1
    ? Boolean(episodes[currentEpisodeIndex + 1])
    : false;
  const hasPrevEp = currentEpisodeIndex > -1
    ? Boolean(episodes[currentEpisodeIndex - 1])
    : false;

  const animeTitle = parsedAnimeTitle?.toUpperCase() || "Anime";
  const safeEpNumber = getEpisodeNumberFromEpisode(currentEp) ?? ep ?? "1";
  const title = `Watch ${animeTitle} Episode ${safeEpNumber} Online | AnimeWeebs`;
  const description = `Watch ${animeTitle} Episode ${safeEpNumber} online for free on AnimeWeebs Anime. HD streaming with multiple servers and audio tracks.`;
  const ogTitle = `${animeTitle} Episode ${safeEpNumber} - AnimeWeebs`;

  // Determine if we should show detailed view
  const showDetailedView = episodes.length <= 50;
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 to-black">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={ogTitle} />
      </Helmet>

      {/* Navigation Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/home"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link
              to={`/anime/${id}`}
              title={animeTitle}
              className="text-gray-400 hover:text-white transition-colors block truncate max-w-xs"
            >
              {animeTitle}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-primary font-medium">
              Episode {safeEpNumber}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors">
              <Bookmark className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Player Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              {/* Current Episode Info */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {animeTitle}
                </h1>
                <div className="flex items-center gap-4 text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>Episode {safeEpNumber}</span>
                  </div>
                  {currentEp?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{currentEp.duration}</span>
                    </div>
                  )}
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

          {/* Episodes Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Episodes Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Episodes</h3>
                    <p className="text-sm text-gray-400">
                      {episodes.length} episodes
                    </p>
                  </div>
                  {/* Only show layout toggle for detailed view */}
                  {showDetailedView && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLayout("column")}
                        className={`p-2 rounded-lg transition-colors ${
                          layout === "column"
                            ? "bg-primary text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                        title="Grid View"
                      >
                        <Grid3x3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setLayout("row")}
                        className={`p-2 rounded-lg transition-colors ${
                          layout === "row"
                            ? "bg-primary text-black"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                        title="List View"
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">
                      {safeEpNumber}
                    </div>
                    <div className="text-xs text-gray-400">Current</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">
                      {episodes.length}
                    </div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  {/* <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">
                      {episodes.filter((e) => e.isFiller).length}
                    </div>
                    <div className="text-xs text-gray-400">Filler</div>
                  </div> */}
                </div>
              </div>

              {/* Episodes List */}
              <div className="relative">
                <div
                  className={`
                  overflow-y-auto transition-all duration-300
                  ${showEpisodeList ? "max-h-[70vh]" : "max-h-0"}
                `}
                >
                  {/* Pass episodes array and currentEp object */}
                  <Episodes
                    episodes={episodes}
                    currentEp={currentEp}
                    layout={showDetailedView ? layout : "column"}
                    animeId={id}
                    animeTitle={animeTitle}
                  />
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => setShowEpisodeList(!showEpisodeList)}
                  className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {showEpisodeList ? "Hide Episodes" : "Show Episodes"}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      showEpisodeList ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Episode Navigation */}
        {currentEp && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                {hasPrevEp && (
                  <button
                    onClick={() => changeEpisode("prev")}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors group"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <div className="text-sm text-gray-400">Previous</div>
                      <div className="font-medium">
                        Episode {currentEp.episodeNumber - 1}
                      </div>
                    </div>
                  </button>
                )}
              </div>
              <div>
                {hasNextEp && (
                  <button
                    onClick={() => changeEpisode("next")}
                    className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-black font-medium transition-colors group"
                  >
                    <div className="text-right">
                      <div className="text-sm text-black/70">Next</div>
                      <div>Episode {currentEp.episodeNumber + 1}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
