import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
  Calendar,
  Share2,
  Download,
  Bookmark,
} from "lucide-react";
import { Helmet } from "react-helmet";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("column");
  const [showEpisodeList, setShowEpisodeList] = useState(true);

  const ep = searchParams.get("ep");

  const { data, isError, isLoading } = useApi(`/episodes/${id}`);
  const episodes = data?.data || [];

  const updateParams = (newParam) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("ep", newParam);
      return newParams;
    });
  };

  // Auto-redirect to first episode if no `ep` param exists
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const ep = episodes[0].id.split("ep=").pop();
      updateParams(ep);
    }
  }, [ep, episodes, setSearchParams]);

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

  const currentEp =
    episodes &&
    ep !== null &&
    episodes.find((e) => e.id.split("ep=").pop() === ep);

  const changeEpisode = (action) => {
    if (!currentEp) return;
    
    if (action === "next") {
      const nextEp = episodes[currentEp.episodeNumber - 1 + 1];
      if (!nextEp) return;
      updateParams(nextEp.id.split("ep=").pop());
    } else {
      const prevEp = episodes[currentEp.episodeNumber - 1 - 1];
      if (!prevEp) return;
      updateParams(prevEp.id.split("ep=").pop());
    }
  };

  const hasNextEp = currentEp ? Boolean(episodes[currentEp.episodeNumber - 1 + 1]) : false;
  const hasPrevEp = currentEp ? Boolean(episodes[currentEp.episodeNumber - 1 - 1]) : false;

  const animeTitle = id ? id.split("-").slice(0, 2).join(" ") : "Anime";
  const safeEpNumber = currentEp?.episodeNumber ?? "1";
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
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link
              to={`/anime/${id}`}
              className="text-gray-400 hover:text-white transition-colors truncate max-w-xs"
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
                  id={id}
                  episodeId={`${id}?ep=${ep}`}
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
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">
                      {episodes.filter((e) => e.isFiller).length}
                    </div>
                    <div className="text-xs text-gray-400">Filler</div>
                  </div>
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