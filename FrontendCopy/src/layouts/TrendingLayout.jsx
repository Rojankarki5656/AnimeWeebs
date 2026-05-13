// TrendingLayout.js
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

  if (!data || data.length === 0) return null;

  return (
    <section className="py-8 w-full" aria-labelledby="trending-heading">
      <Heading id="trending-heading" className="mb-6 text-white text-3xl font-bold">
        {heading}
      </Heading>

      <div className="relative w-full">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 w-full scroll-smooth hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {data.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] md:w-[180px] transition-transform duration-300 hover:scale-105"
            >
              <Link
                to={`/anime/${item.id}`}
                className="block relative bg-gray-800 rounded-lg overflow-hidden"
                aria-label={`Watch ${item.title}`}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                />
                {item.rank && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                    #{item.rank}
                  </div>
                )}
              </Link>
              <h3 className="mt-2 text-sm font-semibold text-center truncate text-white group-hover:text-pink-400">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default TrendingLayout;