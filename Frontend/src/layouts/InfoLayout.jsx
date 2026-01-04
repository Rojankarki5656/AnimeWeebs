/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaPlus,
  FaHeart,
  FaShareAlt,
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaTv,
  FaStar,
  FaChevronRight,
  FaExpandAlt,
  FaInfoCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdHighQuality } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";

const InfoLayout = ({ data, showBigPoster }) => {
  const [showFull, setShowFull] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Color palette for genre tags
  const genreColors = {
    action: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
    adventure: "linear-gradient(135deg, #48cae4, #0096c7)",
    fantasy: "linear-gradient(135deg, #9d4edd, #560bad)",
    romance: "linear-gradient(135deg, #ffafcc, #ff477e)",
    comedy: "linear-gradient(135deg, #ffd166, #efb366)",
    drama: "linear-gradient(135deg, #caf0f8, #90e0ef)",
    isekai: "linear-gradient(135deg, #38b000, #2d6a4f)",
    shounen: "linear-gradient(135deg, #ff595e, #c1121f)",
    supernatural: "linear-gradient(135deg, #7209b7, #3a0ca3)",
    mystery: "linear-gradient(135deg, #6d6875, #4a4e69)",
    sci_fi: "linear-gradient(135deg, #00b4d8, #0077b6)",
    slice_of_life: "linear-gradient(135deg, #83c5be, #006d77)",
  };

  const getGenreColor = (genre) => {
    const key = genre.toLowerCase().replace(/\s+/g, "_");
    return genreColors[key] || "linear-gradient(135deg, #adb5bd, #6c757d)";
  };

  const formatStudioPath = (studioName) => {
    if (typeof studioName === "string") {
      return `/producer/${studioName.toLowerCase().replace(/\s+/g, "-")}`;
    }
    return "/producer/unknown";
  };

  // Calculate episode availability
  const totalEpisodes = Math.max(
    data.episodes?.sub || 0,
    data.episodes?.dub || 0
  );
  const hasBothAudio = data.episodes?.sub > 0 && data.episodes?.dub > 0;

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-900 to-gray-950 pt-20 pb-10 overflow-hidden">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M30%200l15%2026H15z%22%20fill%3D%22%234f46e5%22%20opacity%3D%22.1%22/%3E%3C/svg%3E')]"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/70 to-transparent"></div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Poster Section - Left */}
          <div className="lg:w-2/5 xl:w-1/3 flex flex-col items-center lg:items-start">
            {/* Poster with Hover Effects */}
            <div className="group relative w-full max-w-sm">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-3xl"
                onClick={() => showBigPoster(data.poster)}
              >
                {/* Poster Image */}
                <img
                  src={data.poster}
                  alt={data.title}
                  className="w-full aspect-[2/3] object-cover"
                  loading="eager"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <FaExpandAlt className="text-lg" />
                    <span className="text-sm font-semibold">
                      Click to Expand
                    </span>
                  </div>
                </div>

                {/* Quality Badge */}
                {data.quality && (
                  <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                      <MdHighQuality className="text-xs" />
                      {data.quality}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">
                    {totalEpisodes}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">EPISODES</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {data.MAL_score || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">SCORE</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">
                    {data.duration}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">DURATION</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section - Right */}
          <div className="lg:w-3/5 xl:w-2/3 text-white">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <FaChevronRight className="text-xs" />
              <Link
                to={`/category/${data.type?.toLowerCase()}`}
                className="hover:text-white transition-colors capitalize"
              >
                {data.type}
              </Link>
              <FaChevronRight className="text-xs" />
              <span className="text-white font-medium truncate">
                {data.title}
              </span>
            </nav>

            {/* Title Section */}
            <div className="mb-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {data.title}
              </h1>
              <div className="text-xl lg:text-2xl text-gray-400 mt-2">
                {data.alternativeTitle}
              </div>
              {data.japanese && (
                <div className="text-lg text-gray-500 mt-1 font-japanese">
                  {data.japanese}
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  data.status === "Ongoing"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {data.status}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-800 text-gray-300 border border-gray-700">
                {data.type}
              </span>
              {hasBothAudio && (
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                  <TbLanguage className="text-sm" />
                  SUB & DUB
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to={`/watch/${data.id}`}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <FaPlay className="text-xl" />
                WATCH NOW
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isSaved
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <FaPlus className="text-xl" />
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isLiked
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <FaHeart className="text-xl" />
                </button>
                <button className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700 transition-colors">
                  <FaShareAlt className="text-xl" />
                </button>
                <button className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700 transition-colors">
                  <FaDownload className="text-xl" />
                </button>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Synopsis</h3>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <p
                  className={`text-gray-300 leading-relaxed ${
                    !showFull && "line-clamp-4"
                  }`}
                >
                  {data.synopsis}
                </p>
                {data.synopsis?.length > 200 && (
                  <button
                    onClick={() => setShowFull(!showFull)}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2 transition-colors"
                  >
                    {showFull ? "Show Less" : "Read More"}
                    <FaChevronRight
                      className={`text-xs transition-transform ${
                        showFull ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 text-gray-400 mb-2">
                  <FaCalendarAlt />
                  <span className="text-sm font-semibold">AIRED</span>
                </div>
                <div className="text-white font-medium">
                  {data.aired.from} {data.aired.to && `→ ${data.aired.to}`}
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 text-gray-400 mb-2">
                  <FaClock />
                  <span className="text-sm font-semibold">DURATION</span>
                </div>
                <div className="text-white font-medium">{data.duration}</div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 text-gray-400 mb-2">
                  <FaTv />
                  <span className="text-sm font-semibold">TYPE</span>
                </div>
                <div className="text-white font-medium">{data.type}</div>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
              <div className="flex flex-wrap gap-3">
                {data.genres?.map((genre) => (
                  <Link
                    key={genre}
                    to={`/genre/${genre.toLowerCase()}`}
                    className="group relative overflow-hidden rounded-full px-5 py-2.5 font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ background: getGenreColor(genre) }}
                  >
                    <span className="relative z-10 text-gray-900">{genre}</span>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Studio & Producers */}
            <div className="flex flex-wrap gap-6">
              {data.studios && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">STUDIO</h4>
                  <Link
                    to={formatStudioPath(data.studios)}
                    className="text-white hover:text-indigo-400 transition-colors font-medium flex items-center gap-2"
                  >
                    {data.studios}
                    <FaExternalLinkAlt className="text-xs" />
                  </Link>
                </div>
              )}

              {data.producers && data.producers.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">PRODUCERS</h4>
                  <div className="flex flex-wrap gap-3">
                    {data.producers.map((producer, index) => (
                      <Link
                        key={`${producer}-${index}`}
                        to={`/producer/${producer
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-gray-300 hover:text-white transition-colors text-sm font-medium bg-gray-800/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg"
                      >
                        {producer}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap");
        .font-japanese {
          font-family: "Noto Sans JP", sans-serif;
        }

        /* Glowing effect for action button */
        .group:hover .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
          }
          to {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.8),
              0 0 40px rgba(99, 102, 241, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default InfoLayout;
