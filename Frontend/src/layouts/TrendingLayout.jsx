import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TrendingLayout = ({ data, heading = "Trending Now 🔥" }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // If no data, don't render the section (improves UX for empty states)
  if (!data || data.length === 0) return null;

  return (
    <section
      className="py-8 px-4 md:px-8 w-full"
      aria-labelledby="trending-heading"
    >
      <Heading
        id="trending-heading"
        className="mb-6 text-white text-3xl font-bold"
      >
        {heading}
      </Heading>

      <div className="relative w-full">
        {/* Left Scroll Button (desktop only) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll left to see more trending anime"
          title="Scroll left"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-hidden pb-4 w-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {data.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] md:w-[180px]"
              itemScope
              itemType="https://schema.org/Thing"
            >
              <Link
                to={`/anime/${item.id}`}
                className="block relative bg-lightbg rounded-lg overflow-hidden"
                aria-label={`Watch ${item.title} online free – trending now`}
              >
                <img
                  src={item.poster}
                  alt={`Watch ${item.title} free on AnimeWeebs – subbed and dubbed`}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                  width="180"
                  height="270"
                />
                {/* Rank Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                  #{item.rank}
                </div>
              </Link>

              <h3
                title={item.title}
                className="mt-2 text-sm font-semibold text-center truncate text-white"
                itemProp="name"
              >
                {item.title}
              </h3>
              <p className="sr-only" itemProp="description">
                Watch {item.title} online free in HD. No ads, fast streaming.
              </p>
            </div>
          ))}
        </div>

        {/* Right Scroll Button (desktop only) */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll right to see more trending anime"
          title="Scroll right"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Hidden JSON‑LD for structured data (ItemList) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Trending Anime on AnimeWeebs",
          "description": "Most popular anime currently trending – watch online free in HD.",
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

export default TrendingLayout;