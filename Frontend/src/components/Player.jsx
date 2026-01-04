/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import {
  Expand,
  Zap,
  PlayCircle,
  SkipForward,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("vidWish");
  const [expanded, setExpanded] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkipIntro, setAutoSkipIntro] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("HD-1");
  const [showSeasons, setShowSeasons] = useState(false);

  const changeCategory = (newType) => {
    if (newType !== category) {
      setCategory(newType);
    }
  };

  const changeServer = (newServer) => {
    if (newServer !== server) setServer(newServer);
  };

  // Sample seasons data
  const seasons = [
    { id: 1, name: "Season 1", episodes: 12, current: true },
    { id: 2, name: "OVA", episodes: 3 },
    { id: 3, name: "SP-1", episodes: 1 },
    { id: 4, name: "Season 2", episodes: 24 },
    { id: 5, name: "SP-2", episodes: 2 },
    { id: 6, name: "Season 3", episodes: 12 },
  ];

  // Quality options
  const qualities = ["HD-1", "HD-2", "720p", "480p"];

  return (
    <>
      {/* Video Player */}
      <div className="w-full bg-black aspect-video relative rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        <iframe
          src={`https://${
            server === "vidWish" ? "vidwish.live" : "megaplay.buzz"
          }/stream/s-2/${episodeId.split("ep=").pop()}/${category}`}
          width="100%"
          height="100%"
          allowFullScreen
          className="border-0"
        />
        
      </div>

      {/* Controls Section */}
      <div className="rounded-xl border border-gray-800 mt-4">
        {/* Top Controls Row */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: Toggle Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Expand Button */}
              <button
                onClick={() => setExpanded(!expanded)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  expanded
                    ? "bg-primary text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Expand className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {expanded ? "Collapse" : "Expand"}
                </span>
              </button>

              {/* Light Mode Toggle */}
              <button
                onClick={() => setLightMode(!lightMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  lightMode
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {lightMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  Light {lightMode ? "On" : "Off"}
                </span>
              </button>

              {/* Auto Play Toggle */}
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoPlay
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Play {autoPlay ? "On" : "Off"}
                </span>
              </button>

              {/* Auto Next Toggle */}
              <button
                onClick={() => setAutoNext(!autoNext)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoNext
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <SkipForward className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Next {autoNext ? "On" : "Off"}
                </span>
              </button>

              {/* Auto Skip Intro Toggle */}
              <button
                onClick={() => setAutoSkipIntro(!autoSkipIntro)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoSkipIntro
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Skip Intro {autoSkipIntro ? "On" : "Off"}
                </span>
              </button>
            </div>

            {/* Right Side: Server & Audio Controls */}
            <div className="flex items-center gap-4">
              {/* Server Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => changeServer("vidWish")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    server === "vidWish"
                      ? "bg-primary text-black font-bold"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  VidWish
                </button>
                <button
                  onClick={() => changeServer("megaPlay")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    server === "megaPlay"
                      ? "bg-primary text-black font-bold"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  MegaPlay
                </button>
              </div>

              {/* Audio Track Selection */}
              <div className="flex gap-2">
                {["sub", "dub"].map((type) => (
                  <button
                    key={type}
                    onClick={() => changeCategory(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      category === type
                        ? "bg-blue-500 text-white font-bold"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Current Episode Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PlayCircle className="w-4 h-4 text-primary" />
                <p className="text-gray-400 text-sm">You are watching</p>
              </div>
              <h3 className="text-xl font-bold text-white">
                Episode {currentEp.episodeNumber}
                {currentEp.isFiller && (
                  <span className="ml-3 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                    Filler Episode 👻
                  </span>
                )}
              </h3>
              {currentEp.title && (
                <p className="text-gray-300 mt-1">{currentEp.title}</p>
              )}
            </div>

            {/* Episode Navigation Buttons */}
            <div className="flex gap-3">
              {hasPrevEp && (
                <button
                  onClick={() => changeEpisode("prev")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  title="Previous Episode"
                >
                  <TbPlayerTrackPrevFilled className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
              )}
              {hasNextEp && (
                <button
                  onClick={() => changeEpisode("next")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-black font-medium transition-colors"
                  title="Next Episode"
                >
                  <span className="hidden sm:inline">Next</span>
                  <TbPlayerTrackNextFilled className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Quality and Seasons */}
        <div className="p-4">
          {/* Server Warning */}
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                If current server doesn't work please try other servers beside.
              </p>
            </div>
          </div>

          {/* Quality Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-300">SUB:</span>
              </div>
              <div className="flex gap-2">
                {qualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedQuality === quality
                        ? "bg-primary text-black font-bold"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seasons Section */}
          <div className="border-t border-gray-800 pt-4">
            <button
              onClick={() => setShowSeasons(!showSeasons)}
              className="flex items-center justify-between w-full mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  Watch more seasons of this anime
                </span>
                {showSeasons ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {showSeasons && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {seasons.map((season) => (
                  <div
                    key={season.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      season.current
                        ? "bg-primary/20 border-primary"
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span
                        className={`text-sm font-medium ${
                          season.current ? "text-primary" : "text-white"
                        }`}
                      >
                        {season.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {season.episodes} episodes
                      </span>
                      {season.current && (
                        <div className="mt-2">
                          <CheckCircle className="w-4 h-4 text-primary mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;