// InfoLayout.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPlus, FaHeart, FaShareAlt, FaExpandAlt, FaInfoCircle, FaExternalLinkAlt } from "react-icons/fa";
import { TbLanguage } from "react-icons/tb";

const InfoLayout = ({ data, showBigPoster, isUpcoming }) => {
  const [showFull, setShowFull] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Helper to safely get string name from studio/producer (could be string or object)
  const getName = (item) => (typeof item === "string" ? item : item?.name || item?.id || "Unknown");

  return (
    <section className="relative pt-20 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="lg:w-1/3 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
              <div
                onClick={() => showBigPoster(data.poster)}
                className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition"
              >
                <img
                  src={data.poster}
                  alt={data.title}
                  className="w-full aspect-[2/3] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 transition">
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm text-white">
                    <FaExpandAlt /> Expand
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-2/3 text-white">
            <nav className="hidden md:flex items-center gap-2 text-xs text-gray-400 mb-5">
              <Link to="/" className="hover:text-white">Home</Link>
              <FaExternalLinkAlt className="text-[10px]" />
              <span className="capitalize">{data.format || "TV"}</span>
              <FaExternalLinkAlt className="text-[10px]" />
              <span className="text-white truncate">{data.title}</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold">{data.title}</h1>
            {data.english && <p className="text-sm sm:text-base text-gray-400 mt-1">{data.english}</p>}
            {data.native && <p className="text-xs sm:text-sm text-gray-500 mt-1">{data.native}</p>}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-3 py-1 text-xs rounded-full bg-gray-800 border border-gray-700">
                {data.format || "TV"}
              </span>
              <span className={`px-3 py-1 text-xs rounded-full border ${
                data.status === "Releasing" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-blue-500/20 border-blue-500 text-blue-400"
              }`}>
                {data.status || "Unknown"}
              </span>
              {data.episodes && (
                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 flex items-center gap-1">
                  <TbLanguage /> {data.airing.nextEpisode} eps
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-7">
              {isUpcoming ? (
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500">
                  ➕ Add to List
                </button>
              ) : (
                <Link
                  to={`/watch/${data.id}?ep=1`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  <FaPlay /> Watch Now
                </Link>
              )}
              <IconBtn icon={<FaPlus />} active={isSaved} onClick={() => setIsSaved(!isSaved)} />
              <IconBtn icon={<FaHeart />} active={isLiked} onClick={() => setIsLiked(!isLiked)} />
              <IconBtn icon={<FaShareAlt />} />
            </div>

            {/* Synopsis */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-indigo-400" />
                <h2 className="font-semibold text-lg">Synopsis</h2>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 sm:p-5">
                <p className={`text-sm text-gray-300 leading-relaxed ${!showFull && "line-clamp-4"}`}>
                  {data.description || "No description available."}
                </p>
                {data.description?.length > 200 && (
                  <button onClick={() => setShowFull(!showFull)} className="mt-3 text-indigo-400 text-sm">
                    {showFull ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>

            {/* Genres (safe mapping) */}
            {data.genres?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-3 text-lg">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre, idx) => {
                    const genreName = typeof genre === "string" ? genre : genre.name || genre.id;
                    return (
                      <Link
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-700 text-white hover:bg-indigo-600"
                      >
                        {genreName}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Studios (safe) */}
            {data.studios?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs text-gray-400 mb-1">STUDIO</h3>
                <div className="flex flex-wrap gap-2">
                  {data.studios.map((studio, idx) => (
                    <span key={idx} className="text-sm text-white">{getName(studio)}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Producers (safe) */}
            {data.producers?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs text-gray-400 mb-2">PRODUCERS</h3>
                <div className="flex flex-wrap gap-2">
                  {data.producers.map((producer, idx) => (
                    <span key={idx} className="text-xs bg-gray-800/50 px-2 py-1.5 rounded-lg">{getName(producer)}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Info grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-gray-800 pt-6">
              <div><span className="text-gray-400">Score:</span> {data.averageScore ? `${data.averageScore/10}` : 'N/A'}</div>
              <div><span className="text-gray-400">Popularity:</span> {data.popularity || 'N/A'}</div>
              <div><span className="text-gray-400">Favorites:</span> {data.favorites || 'N/A'}</div>
              <div><span className="text-gray-400">Season:</span> {data.season || 'N/A'}</div>
              <div><span className="text-gray-400">Duration:</span> {data.episodeDuration ? `${data.episodeDuration} min` : 'N/A'}</div>
              <div><span className="text-gray-400">Source:</span> {data.source || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const IconBtn = ({ icon, onClick, active }) => (
  <button onClick={onClick} className={`p-2.5 sm:p-3 rounded-lg border transition ${
    active ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700"
  }`}>
    {icon}
  </button>
);

export default InfoLayout;