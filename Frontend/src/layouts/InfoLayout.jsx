/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaPlus,
  FaHeart,
  FaShareAlt,
  FaDownload,
  FaStar,
  FaChevronRight,
  FaExpandAlt,
  FaInfoCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdHighQuality } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";

const InfoLayout = ({ data, showBigPoster, isUpcoming }) => {
  const [showFull, setShowFull] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  /* -------------------- helpers -------------------- */
  const genreColors = {
    action: "linear-gradient(135deg,#ff6b6b,#ee5a52)",
    adventure: "linear-gradient(135deg,#48cae4,#0096c7)",
    fantasy: "linear-gradient(135deg,#9d4edd,#560bad)",
    romance: "linear-gradient(135deg,#ffafcc,#ff477e)",
    comedy: "linear-gradient(135deg,#ffd166,#efb366)",
    drama: "linear-gradient(135deg,#caf0f8,#90e0ef)",
    mystery: "linear-gradient(135deg,#6d6875,#4a4e69)",
    sci_fi: "linear-gradient(135deg,#00b4d8,#0077b6)",
    slice_of_life: "linear-gradient(135deg,#83c5be,#006d77)",
  };

  const getGenreColor = (genre) =>
    genreColors[genre.toLowerCase().replace(/\s+/g, "_")] ||
    "linear-gradient(135deg,#adb5bd,#6c757d)";

  const getStudioName = (studios) => {
    if (!studios) return null;
    if (typeof studios === "string") return studios;
    if (Array.isArray(studios)) {
      if (typeof studios[0] === "string") return studios[0];
      if (studios[0]?.name) return studios[0].name;
    }
    return null;
  };

  const slugify = (text) =>
    text
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "";

  const getProducers = (producers) => {
    if (!producers) return [];
    if (typeof producers === "string") return [producers];
    if (Array.isArray(producers)) {
      return producers
        .map((p) => (typeof p === "string" ? p : p?.name))
        .filter(Boolean);
    }
    if (typeof producers === "object" && producers?.name) return [producers.name];
    return [];
  };

  const producers = getProducers(data?.producers);
  const studioName = getStudioName(data?.studios);
  const totalEpisodes = Math.max(data?.episodes?.sub || 0, data?.episodes?.dub || 0);
  const hasBothAudio = data?.episodes?.sub > 0 && data?.episodes?.dub > 0;

  return (
    <section className="relative pt-20 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* LEFT - Poster (centered on mobile) */}
          <div className="lg:w-1/3 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
              <div
                onClick={() => showBigPoster(data?.poster)}
                className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition"
              >
                <img
                  src={data?.poster}
                  alt={`${data?.title} poster – watch free on AnimeWeebs in HD`}
                  className="w-full aspect-[2/3] object-cover"
                  width="320"
                  height="480"
                  loading="eager"
                />
                <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/60 transition">
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm text-white">
                    <FaExpandAlt />
                    Expand
                  </div>
                </div>
                {data?.quality && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold bg-black/70 px-2 py-1 rounded-full text-emerald-400">
                    <MdHighQuality />
                    {data.quality}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Details (mobile optimized) */}
          <div className="lg:w-2/3 text-white">
            {/* Breadcrumb (hidden on mobile, visible md+) */}
            <nav className="hidden md:flex items-center gap-2 text-xs text-gray-400 mb-5">
              <Link to="/" className="hover:text-white">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="capitalize">{data?.type}</span>
              <FaChevronRight className="text-[10px]" />
              <span className="text-white truncate">{data?.title}</span>
            </nav>

            {/* Title - responsive font sizes */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
              {data?.title}
            </h1>
            {data?.alternativeTitle && (
              <p className="text-sm sm:text-base text-gray-400 mt-1">{data.alternativeTitle}</p>
            )}
            {data?.japanese && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-japanese">{data.japanese}</p>
            )}

            {/* Badges - wrap on mobile */}
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-3 py-1 text-xs rounded-full bg-gray-800 border border-gray-700">
                {data?.type}
              </span>
              <span
                className={`px-3 py-1 text-xs rounded-full border ${
                  data?.status === "Ongoing"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-blue-500/20 border-blue-500 text-blue-400"
                }`}
              >
                {data?.status}
              </span>
              {hasBothAudio && (
                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 flex items-center gap-1">
                  <TbLanguage />
                  SUB & DUB
                </span>
              )}
            </div>

            {/* Action Buttons - stack on very small, row on sm+ */}
            <div className="flex flex-wrap gap-3 mt-7">
              {isUpcoming ? (
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-md text-sm sm:text-base">
                  ➕ Add to List
                </button>
              ) : (
                <Link
                  to={`/watch/${slugify(data.title)}-_${data.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-md text-sm sm:text-base"
                  aria-label={`Watch ${data?.title} episode 1 free`}
                >
                  <FaPlay />
                  Watch Now
                </Link>
              )}
              <IconBtn icon={<FaPlus />} active={isSaved} onClick={() => setIsSaved(!isSaved)} />
              <IconBtn icon={<FaHeart />} active={isLiked} onClick={() => setIsLiked(!isLiked)} />
              <IconBtn icon={<FaShareAlt />} />
            </div>

            {/* Synopsis - readable width on mobile */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-indigo-400" />
                <h2 className="font-semibold text-lg">Synopsis</h2>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 sm:p-5">
                <p className={`text-sm text-gray-300 leading-relaxed ${!showFull && "line-clamp-4"}`}>
                  {data?.synopsis}
                </p>
                {data?.synopsis?.length > 200 && (
                  <button
                    onClick={() => setShowFull(!showFull)}
                    className="mt-3 text-indigo-400 text-sm font-medium"
                  >
                    {showFull ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>

            {/* Genres */}
            <div className="mt-8">
              <h2 className="font-semibold mb-3 text-lg">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {data?.genres?.map((genre) => (
                  <Link
                    key={genre}
                    to={`/genre/${genre.toLowerCase()}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-sm hover:scale-105 transition"
                    style={{ background: getGenreColor(genre) }}
                    aria-label={`Browse ${genre} anime free`}
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>

            {/* Studio */}
            {studioName && (
              <div className="mt-8">
                <h3 className="text-xs text-gray-400 mb-1">STUDIO</h3>
                <Link
                  to={`/producer/${studioName.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 text-sm hover:text-indigo-400"
                >
                  {studioName}
                  <FaExternalLinkAlt className="text-xs" />
                </Link>
              </div>
            )}

            {/* Producers */}
            {producers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs text-gray-400 mb-2">PRODUCERS</h3>
                <div className="flex flex-wrap gap-2">
                  {producers.map((producer, index) => (
                    <Link
                      key={index}
                      to={`/producer/${producer.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-1 text-xs sm:text-sm hover:text-indigo-400 bg-gray-800/50 px-2 py-1.5 rounded-lg transition"
                    >
                      {producer}
                      <FaExternalLinkAlt className="text-[10px]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden SEO text */}
            <div className="sr-only">
              <p>
                Watch {data?.title} online free in HD on AnimeWeebs. No ads, fast streaming. 
                Subbed and dubbed episodes available. Best free anime site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------- reusable components -------------------- */
const IconBtn = ({ icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`p-2.5 sm:p-3 rounded-lg border transition ${
      active
        ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
        : "bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700"
    }`}
    aria-label={active ? "Remove from list" : "Add to list"}
  >
    {icon}
  </button>
);

export default InfoLayout;