import { Play, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export function HeroCarousel({ slides }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Hidden H1 for home page (overall site) – only once on page, but safe here */}
      <h1 className="sr-only">
        AnimeWeebs – Watch Anime Online Free, No Ads, HD Quality
      </h1>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
        }}
        className="w-full h-full"
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={item.id}>
            {/* Background Image – with rich alt text */}
            <div className="absolute inset-0">
              <img
                src={item.poster || "/placeholder.svg"}
                alt={`${item.title} – watch online free on AnimeWeebs in HD`}
                className="w-full h-full object-cover"
                width="1920"
                height="1080"
                loading={idx === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16 pb-20">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {item.title}
                </h2>

                <div className="flex items-center gap-4 mb-6 text-gray-300 text-sm flex-wrap">
                  <span className="bg-blue-600 px-3 py-1 rounded">
                    {item.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    8.5/10
                  </span>
                  <span>{item.aired}</span>
                  <span>{item.duration}</span>
                  <span className="bg-green-600/20 text-green-300 px-2 py-0.5 rounded-full text-xs">
                    FREE
                  </span>
                </div>

                <p className="text-gray-200 mb-8 line-clamp-3">
                  {item.synopsis}
                </p>

                <div className="flex gap-4 flex-wrap">
                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
                    aria-label={`Watch ${item.title} now – free streaming`}
                  >
                    <Play size={20} aria-hidden="true" />
                    Watch Now
                  </Link>

                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
                    aria-label={`Add ${item.title} to your watchlist`}
                  >
                    <Plus size={20} aria-hidden="true" />
                    Add to List
                  </Link>
                </div>
              </div>
            </div>

            {/* Hidden JSON‑LD for the featured anime (Slide) */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Movie",
                "name": item.title,
                "description": item.synopsis,
                "image": item.poster,
                "url": `https://animeweebs.app/anime/${item.id}`,
                "keywords": "watch free, no ads, online streaming",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              })}
            </script>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows – accessible */}
      <button
        className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 focus:outline-none focus:ring-2 focus:ring-pink-500"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} aria-hidden="true" />
      </button>

      <button
        className="hero-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 focus:outline-none focus:ring-2 focus:ring-pink-500"
        aria-label="Next slide"
      >
        <ChevronRight size={28} aria-hidden="true" />
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20" />
    </div>
  );
}

export default HeroCarousel;