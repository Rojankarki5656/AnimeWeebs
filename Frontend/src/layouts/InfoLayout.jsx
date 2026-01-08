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

  const getProducers = (producers) => {
    if (!producers) return [];
    if (typeof producers === "string") return [producers];
    if (Array.isArray(producers)) {
      return producers
        .map((p) => (typeof p === "string" ? p : p?.name))
        .filter(Boolean);
    }
    if (typeof producers === "object" && producers?.name)
      return [producers.name];
    return [];
  };

  // Inside your component
  const producers = getProducers(data?.producers);

  const studioName = getStudioName(data?.studios);

  const totalEpisodes = Math.max(
    data?.episodes?.sub || 0,
    data?.episodes?.dub || 0
  );

  const hasBothAudio = data?.episodes?.sub > 0 && data?.episodes?.dub > 0;

  /* -------------------- UI -------------------- */

  return (
    <section className="relative pt-20 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-[320px]">
              <div
                onClick={() => showBigPoster(data?.poster)}
                className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition"
              >
                <img
                  src={data?.poster}
                  alt={data?.title}
                  className="w-full aspect-[2/3] object-cover"
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

              {/* Stats */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <Stat label="EP" value={totalEpisodes} />
                <Stat
                  label="SCORE"
                  value={data?.MAL_score || "N/A"}
                  icon={<FaStar className="text-yellow-400" />}
                />
                <Stat label="MIN" value={data?.duration} />

                {data?.is18Plus && (
                  <Stat
                    label="Age Rating"
                    value="18+"
                    className="text-red-400 font-bold"
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-2/3 text-white">
            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-xs text-gray-400 mb-5">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <FaChevronRight />
              <span className="capitalize">{data?.type}</span>
              <FaChevronRight />
              <span className="text-white truncate">{data?.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
              {data?.title}
            </h1>

            {data?.alternativeTitle && (
              <p className="text-base text-gray-400 mt-1">
                {data.alternativeTitle}
              </p>
            )}

            {data?.japanese && (
              <p className="text-sm text-gray-500 mt-1 font-japanese">
                {data.japanese}
              </p>
            )}

            {/* Badges */}
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

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-7">
              {console.log("Is muji: ",isUpcoming)}
              {isUpcoming ? (
                <button className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-md">
                  ➕ Add to List
                </button>
              ) : (
                <Link
                  to={`/watch/${data?.id}`}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-semibold shadow-md"
                >
                  <FaPlay />
                  Watch Now
                </Link>
              )}

              {/* TODO: Rojan : Add Favorite, Bookmark and Share */}

              <IconBtn
                icon={<FaPlus />}
                active={isSaved}
                onClick={() => setIsSaved(!isSaved)}
              />
              <IconBtn
                icon={<FaHeart />}
                active={isLiked}
                onClick={() => setIsLiked(!isLiked)}
              />
              <IconBtn icon={<FaShareAlt />} />
            </div>

            {/* Synopsis */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-indigo-400" />
                <h3 className="font-semibold">Synopsis</h3>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-5">
                <p
                  className={`text-sm text-gray-300 leading-relaxed ${
                    !showFull && "line-clamp-4"
                  }`}
                >
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
            <div className="mt-10">
              <h3 className="font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {data?.genres?.map((genre) => (
                  <Link
                    key={genre}
                    to={`/genre/${genre.toLowerCase()}`}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-sm hover:scale-105 transition"
                    style={{ background: getGenreColor(genre) }}
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>

            {/* Studio */}
            {studioName && (
              <div className="mt-10">
                <h4 className="text-xs text-gray-400 mb-1">STUDIO</h4>
                <Link
                  to={`/producer/${studioName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 text-sm hover:text-indigo-400"
                >
                  {studioName}
                  <FaExternalLinkAlt className="text-xs" />
                </Link>
              </div>
            )}

            {/* Producers */}
            {producers.length > 0 && (
              <div className="mt-10">
                <h4 className="text-xs text-gray-400 mb-1">PRODUCERS</h4>
                <div className="flex flex-wrap gap-2">
                  {producers.map((producer, index) => (
                    <Link
                      key={index}
                      to={`/producer/${producer
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-sm hover:text-indigo-400 bg-gray-800/50 px-3 py-1.5 rounded-lg transition"
                    >
                      {producer}
                      <FaExternalLinkAlt className="text-xs" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------- small components -------------------- */

const Stat = ({ label, value, icon }) => (
  <div className="bg-gray-800/40 border border-gray-700 rounded-lg px-3 py-2 text-center">
    <div className="text-lg font-semibold text-white flex justify-center gap-1">
      {icon}
      {value}
    </div>
    <div className="text-[10px] tracking-wider text-gray-400">{label}</div>
  </div>
);

const IconBtn = ({ icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg border transition ${
      active
        ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
        : "bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700"
    }`}
  >
    {icon}
  </button>
);

export default InfoLayout;
