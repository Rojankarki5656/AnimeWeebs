import React from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Clock, Eye, Sparkles, ChevronRight } from "lucide-react";

const Recommended = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Recommended for You</h2>
        </div>
        <div className="text-center py-12 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Watch more anime to get personalized recommendations based on your viewing history.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-pink-900/10 rounded-3xl -z-10 blur-2xl opacity-30"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg shadow-orange-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
            <p className="text-sm text-gray-400 mt-1">Personalized picks based on your preferences</p>
          </div>
        </div>
      </div>

      {/* Recommended Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {data.map((item, index) => (
          <Link
            key={item.id}
            to={`/anime/${item.id}`}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10"
          >
            {/* Ranking Badge */}
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  #{index + 1}
                </div>
              </div>
            )}

            {/* Poster Container */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
              {/* Poster Image */}
              <img
                src={item.image || item.poster}
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
                <div className="flex items-center gap-2">
                  {item.type && (
                    <span className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-300">
                      {item.type}
                    </span>
                  )}
                  {item.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-400">{item.duration}</span>
                    </div>
                  )}
                </div>
                {item.episodes && (
                  <span className="text-xs font-medium text-orange-400">
                    Ep {typeof item.episodes === 'object' ? item.episodes?.eps || item.episodes?.sub || 'N/A' : item.episodes}
                  </span>
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

      {/* Decorative Footer */}
      <div className="mt-8 pt-6 border-t border-gray-800/50">
        <div className="flex items-center justify-center gap-6">
          {[
            { icon: Sparkles, label: 'Personalized', color: 'from-orange-500 to-pink-500' },
            { icon: TrendingUp, label: 'Trending', color: 'from-blue-500 to-purple-500' },
            { icon: Star, label: 'Highly Rated', color: 'from-yellow-500 to-red-500' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}></div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommended;