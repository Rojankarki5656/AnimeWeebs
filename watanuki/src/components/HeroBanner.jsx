import {
  FaAngleRight,
  FaCalendarDay,
  FaCirclePlay,
  FaClock,
} from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// import "./hero.css";
import SoundsInfo from "./SoundsInfo";
import { Link } from "react-router-dom";

const HeroBanner = ({ slides }) => {
  return (
    <Swiper
      speed={250}
      grabCursor={true}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation={true}
      className="slider h-[40vh] pt-10 mb-5 sm:h-[40vh] md:h-[50vh] xl:h-[calc(100vh-300px)]"
    >
      {slides &&
        slides.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative h-full overflow-hidden bg-backGround"
          >
            <div className="content w-full h-full">
              <div className="opacity-layer absolute left-0 md:left-[15%] xl:left-[30%] top-0 right-0 bottom-0 overflow-hidden">
                <img
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  alt={item.title}
                  src={item.poster}
                />
              </div>
              <div className=" z-10 ml-2 md:ml-12 min-w-32  md:max-w-2xl absolute bottom-0 sm:bottom-[30px]">
                <div className="text-primary text-base font-semibold mb-2">
                  #{item.rank} Spotlight
                </div>
                <div
                  title={item.title}
                  className=" title text-lg md:text-2xl xl:text-5xl font-bold mb-6 line-clamp-2"
                >
                  {item.title}
                </div>
                <div className="text-base text-white mb-3 gap-5 hidden md:flex">
                  <div className="item">
                    <FaCirclePlay />
                    <span>{item.type}</span>
                  </div>
                  <div className="item">
                    <FaClock />
                    <span>{item.duration}</span>
                  </div>
                  <div className="item">
                    <FaCalendarDay />
                    <span>{item.aired}</span>
                  </div>
                  <div className="item bg-primary text-black text-sm font-bold px-2 rounded-sm">
                    <span className="">{item.quality}</span>
                  </div>
                </div>
                <div className="synopsis">{item.synopsis}</div>
                <div className="desi-buttons z-50 text-sm md:text-base mt-5 flex gap-2">
                  <Link
                    to={`/watch/${item.id}`}
                    className="bg-primary rounded-3xl px-4 py-1 text-black flex justify-center items-center gap-2"
                  >
                    <FaCirclePlay />
                    <span>Watch Now</span>
                  </Link>
                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-btnbg rounded-3xl  px-4 py-1 flex justify-center items-center gap-2"
                  >
                    <span>Detail</span>
                    <FaAngleRight />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default HeroBanner;
