import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import Loader from "../components/Loader";
import { useApi } from "../services/useApi";
import notify from "../utils/Toast";

const RecentlyUpdates = () => {
  const [page, setPage] = useState(1);
  const { id: endpoint } = useParams();
  const { data, isLoading, error, isError } = useApi(
    `/${endpoint}?page=${page}`,
  );

  useEffect(() => {
    if (isError) {
      notify("error", error?.message || "Failed to load recent updates");
    }
  }, [isError, error]);

  const items = data?.items || [];
  const hasNextPage = data?.hasNextPage || false;
  const currentPage = data?.page || page;

  const handlePrevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (hasNextPage) setPage(currentPage + 1);
  };

  // Helper to slugify title (kept consistent with MainLayout)
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const buildWatchPath = (item) => {
    // Use the slug from API response (already URL-friendly)
    // Append episode parameter (currentEpisode)
    if (item.currentEpisode) {
      return `/watch/${item.slug}?ep=${item.currentEpisode}`;
    }
    return `/watch/${item.slug}`;
  };

  if (isLoading && !data) {
    return <Loader className="h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>
          Recently Updated Anime – Watch Latest Episodes Free | AnimeWeebs
        </title>
        <meta
          name="description"
          content="Browse recently updated anime episodes. Watch the latest subbed and dubbed episodes of your favorite anime series, updated daily. No ads, free streaming."
        />
        <link rel="canonical" href="https://animeweebs.app/recently-updates" />
        <meta
          property="og:title"
          content="Recently Updated Anime – Watch New Episodes Free"
        />
        <meta
          property="og:description"
          content="Stay up to date with the newest anime episodes. Stream sub and dub in HD, completely free."
        />
        <meta
          property="og:url"
          content="https://animeweebs.app/recently-updates"
        />
        <meta
          name="twitter:title"
          content="Recently Updated Anime – Watch New Episodes Free"
        />
        <meta
          name="twitter:description"
          content="Catch the latest anime episodes as soon as they release. No ads, high quality."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Recently Updated Anime
          </h1>
          <p className="text-gray-300 text-lg">
            Watch the newest episodes – updated daily
          </p>
        </div>

        {/* Grid */}
        {items.length === 0 && !isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No updates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {items.map((item, idx) => (
              <Link
                key={item.id}
                to={buildWatchPath(item)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
                aria-label={`Watch ${item.title} episode ${item.currentEpisode}`}
              >
                {/* Optional rank badge (only if we want to show rank globally; not needed but kept for consistency) */}
                {idx < 3 && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />#{idx + 1}
                    </div>
                  </div>
                )}

                <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
                  <img
                    src={item.poster}
                    alt={`${item.title} – watch episode ${item.currentEpisode} free`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4">
                  <h2 className="text-sm md:text-base font-bold text-white truncate mb-2 group-hover:text-orange-300 transition-colors">
                    {item.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.subEpisodes > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        SUB {item.subEpisodes}
                      </span>
                    )}
                    {item.dubEpisodes > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        DUB {item.dubEpisodes}
                      </span>
                    )}
                    {item.totalEpisodes && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        EPS {item.totalEpisodes}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Current: Ep {item.currentEpisode || "?"}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-12 overflow-hidden transition-all duration-300">
                  <div className="bg-gradient-to-r from-orange-600/90 to-pink-600/90 backdrop-blur-sm flex items-center justify-center h-full">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <span>Watch Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/30"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-white bg-gray-800 px-4 py-2 rounded-full text-sm">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
              !hasNextPage
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/30"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* JSON-LD structured data for paginated list */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Recently Updated Anime",
            description:
              "Watch the latest anime episodes online free. Updated daily with sub and dub.",
            url: "https://animeweebs.app/recently-updates",
            numberOfItems: items.length,
            itemListElement: items.map((item, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `https://animeweebs.app/watch/${item.slug}`,
              name: item.title,
            })),
          })}
        </script>
      </div>
    </div>
  );
};

export default RecentlyUpdates;
