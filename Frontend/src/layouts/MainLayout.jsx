/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";

const MainLayout = ({ title, data, endpoint }) => {
  if (!data || data.length === 0) return null;

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Determine heading tag (H3 for Latest Episode, H2 for others – keep structure)
  const HeadingTag = title === "Latest Episode" ? "h3" : "h2";

  return (
    <section className="mt-12 relative" aria-labelledby={`section-${endpoint}`}>
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-pink-900/10 rounded-3xl -z-10 blur-2xl opacity-30"></div>

      {/* Header */}
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
          to={`/anime/${endpoint}`}
          className="group flex items-center gap-1 text-sm font-medium 
             text-orange-400 hover:text-orange-300 transition-colors"
          aria-label={`View more ${title.toLowerCase()} – free anime online`}
        >
          <span>View More</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>

      {/* Grid of anime cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {data.map((item, index) => {
          const watchId = item.detailId || item.id;
          const watchPath =
            title === "Latest Episode" && watchId
              ? `/watch/${slugify(item.title)}-_${watchId}?ep=${item.episodes?.sub ?? 0}`
              : `/anime/${item.id}`;

          return (
            <Link
              key={item.id}
              to={watchPath}
              state={{ source: endpoint }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
              aria-label={`Watch ${item.title} free – ${item.episodes?.sub ?? 0} subbed episodes`}
            >
              {/* Ranking Badge (top 3) */}
              {index < 3 && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" aria-hidden="true" />
                    #{index + 1}
                  </div>
                </div>
              )}

              {/* Poster Container */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
                {/* Poster Image – SEO‑rich alt text */}
                <img
                  src={item.poster}
                  alt={`${item.title} – watch online free in HD on AnimeWeebs`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  width="200"
                  height="300"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm md:text-base font-bold text-white truncate mb-2 group-hover:text-orange-300 transition-colors">
                  {item.title}
                </h3>

                {/* Episode info */}
                {title !== "Top Upcoming" && item.episodes && typeof item.episodes === "object" && (
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {item.episodes.sub !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        SUB {item.episodes.sub}
                      </span>
                    )}
                    {item.episodes.dub !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        DUB {item.episodes.dub}
                      </span>
                    )}
                    {item.episodes.eps !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        EPS {item.episodes.eps}
                      </span>
                    )}
                  </div>
                )}

                {/* Optional hidden description for SEO */}
                <p className="sr-only">
                  Watch {item.title} free, no ads, high quality. Latest episodes updated daily.
                </p>
              </div>

              {/* Hover Action Button */}
              <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-12 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-r from-orange-600/90 to-pink-600/90 backdrop-blur-sm flex items-center justify-center h-full">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <span>Watch Now</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* JSON‑LD for the entire collection as an ItemList */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `${title} on AnimeWeebs`,
          "description": `Watch ${title.toLowerCase()} online free. No ads, HD streaming.`,
          "numberOfItems": data.length,
          "itemListElement": data.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `https://animeweebs.app/anime/${item.id}`,
            "name": item.title,
            "image": item.poster,
          })),
        })}
      </script>
    </section>
  );
};

export default MainLayout;