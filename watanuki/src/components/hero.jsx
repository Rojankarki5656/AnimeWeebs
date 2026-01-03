import { Play, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export function HeroCarousel({ slides }) {
  return (
    <div className="relative w-full h-screen bg-black">
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
        {slides?.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.poster || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16 pb-20">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {item.title}
                </h1>

                <div className="flex items-center gap-4 mb-6 text-gray-300 text-sm">
                  <span className="bg-blue-600 px-3 py-1 rounded">
                    {item.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    8.5/10
                  </span>
                  <span>{item.aired}</span>
                  <span>{item.duration}</span>
                </div>

                <p className="text-gray-200 mb-8 line-clamp-3">
                  {item.synopsis}
                </p>

                <div className="flex gap-4">
                  <Link
                    to={`/watch/${item.id}`}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
                  >
                    <Play size={20} />
                    Watch Now
                  </Link>

                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold transition"
                  >
                    <Plus size={20} />
                    Add to List
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20">
        <ChevronLeft size={28} />
      </button>

      <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20">
        <ChevronRight size={28} />
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20" />
    </div>
  );
}

export default HeroCarousel;
