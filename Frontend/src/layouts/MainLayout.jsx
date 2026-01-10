/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Image from "../components/Image";
import { FaAngleRight } from "react-icons/fa";
import {
  Star,
  TrendingUp,
  Clock,
  Eye,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const MainLayout = ({ title, data, endpoint }) => {
  return (
    <section className="mt-12 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-pink-900/10 rounded-3xl -z-10 blur-2xl opacity-30"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <Link
          to={`/anime/${endpoint}`}
          className="group flex items-center gap-1 text-sm font-medium 
             text-orange-400 hover:text-orange-300 transition-colors"
        >
          <span>View More</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Recommended Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {data.map((item, index) => (
          <Link
            key={item.id}
            to={`/anime/${item.id}`}
            state={{ source: endpoint }} // "top-upcoming"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
          >
            {/* Ranking Badge */}
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />#{index + 1}
                </div>
              </div>
            )}

            {/* Poster Container */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
              {/* Poster Image */}
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-sm md:text-base font-bold text-white truncate mb-2 group-hover:text-orange-300 transition-colors">
                {item.title}
              </h3>

              {/* Meta Info */}
              <div className="flex items-center justify-between mb-3">
                {item.episodes && typeof item.episodes === "object" && (
                  <div className="flex items-center gap-2">
                    {/* SUB */}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full 
      bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      SUB {item.episodes.sub ?? 0}
                    </span>

                    {/* DUB */}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full 
      bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      DUB {item.episodes.dub ?? 0}
                    </span>

                    <span
                      className="text-xs px-2 py-0.5 rounded-full 
      bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      EPS {item.episodes.eps ?? 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover Action Button */}
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
    </section>
  );
};

export default MainLayout;
