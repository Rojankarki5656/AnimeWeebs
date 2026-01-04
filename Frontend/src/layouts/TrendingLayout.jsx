import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TrendingLayout = ({ data }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    const scrollAmount = containerRef.current.offsetWidth; // scroll full visible width
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 px-4 md:px-8 w-full">
      <Heading className="mb-6 text-white text-3xl font-bold">
        Trending
      </Heading>

      <div className="relative w-full">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-hidden pb-4 w-full"
        >
          {data?.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[140px] md:w-[180px]"
            >
              <Link
                to={`/anime/${item.id}`}
                className="block relative bg-lightbg rounded-lg overflow-hidden"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                />

                {/* Rank */}
                <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded">
                  #{item.rank}
                </div>
              </Link>

              <h3
                title={item.title}
                className="mt-2 text-sm font-semibold text-center truncate text-white"
              >
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8
            bg-pink-600 text-white p-2 rounded-full z-20 hidden md:flex
            hover:scale-110 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default TrendingLayout;
