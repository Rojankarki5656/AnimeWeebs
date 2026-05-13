// MainLayout.js
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp } from "lucide-react";

const MainLayout = ({ title, data, endpoint, showRank = false }) => {
  if (!data || data.length === 0) return null;

  const HeadingTag = title === "Latest Episode" ? "h3" : "h2";

  return (
    <section className="mt-12 relative" aria-labelledby={`section-${endpoint}`}>
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-pink-900/10 rounded-3xl -z-10 blur-2xl opacity-30" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <HeadingTag
            id={`section-${endpoint}`}
            className="text-2xl font-bold text-white"
          >
            {title}
          </HeadingTag>
        </div>
        <Link
          to={`/list/${endpoint}`}
          className="group flex items-center gap-1 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
          aria-label={`View more ${title.toLowerCase()}`}
        >
          <span>View More</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {data.map((item, index) => (
          <Link
            key={item.id}
            to={
              item.title === "Latest Episodes"
                ? `/watch/${item.id}`
                : `/anime/${item.id}`
            }
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
            aria-label={`Watch ${item.title} free`}
          >
            {/* Rank badge (top 3 or forced showRank) */}
            {(showRank || index < 3) && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />#{item.rank || index + 1}
                </div>
              </div>
            )}

            <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            <div className="p-4">
              <h3 className="text-sm md:text-base font-bold text-white truncate mb-2 group-hover:text-orange-300 transition-colors">
                {item.title}
              </h3>
              {item.episodes && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.episodes.sub > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                      SUB {item.episodes.sub}
                    </span>
                  )}
                  {item.episodes.dub > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                      DUB {item.episodes.dub}
                    </span>
                  )}
                  {item.episodes.eps > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                      EPS {item.episodes.eps}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Hover action button */}
            <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-12 overflow-hidden transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-600/90 to-pink-600/90 flex items-center justify-center h-full">
                <span className="text-sm font-medium text-white">
                  Watch Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainLayout;
