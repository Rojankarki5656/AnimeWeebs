/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon, 
  PlayCircle, 
  Film,
  Calendar,
  Clock
} from "lucide-react";

const Related = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const MAX_ITEMS = 4;
  const items = expanded ? data : data.slice(0, MAX_ITEMS);
  const hiddenCount = data.length - MAX_ITEMS;

  // Helper function to get episode count
  const getEpisodeCount = (episodes) => {
    if (!episodes) return 'N/A';
    if (typeof episodes === 'number') return episodes;
    if (typeof episodes === 'object') {
      return episodes.eps || episodes.sub || episodes.dub || 'N/A';
    }
    return 'N/A';
  };

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Related Series</h2>
            <p className="text-sm text-gray-400 mt-1">{data.length} related titles</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-300">Available</span>
        </div>
      </div>

      {/* Related Items Grid */}
      <div className="relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 rounded-3xl -z-10"></div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-500 ${
          expanded ? 'max-h-[600px] overflow-y-auto p-2' : 'max-h-[300px]'
        }`}>
          {items.map((item, index) => (
            <Link
              key={item.id}
              to={`/anime/${item.id}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Simple Tooltip for Full Title */}
              {hoveredIndex === index && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-2xl min-w-max max-w-xs">
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    {item.alternativeTitle && (
                      <p className="text-xs text-gray-400 mt-1">{item.alternativeTitle}</p>
                    )}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-b border-r border-gray-700"></div>
                  </div>
                </div>
              )}
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-5"></div>
              
              <div className="flex items-start p-4 gap-4">
                {/* Poster with Ranking */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-20 md:w-18 md:h-24 overflow-hidden rounded-xl shadow-lg group-hover:shadow-purple-500/20 transition-shadow">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150x200/1f2937/9ca3af?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      #{index + 1}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {/* Title with tooltip trigger */}
                      <div className="relative">
                        <h3 
                          className="text-sm md:text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors cursor-pointer"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                        {item.alternativeTitle && (
                          <p className="text-xs text-gray-400 truncate mt-1" title={item.alternativeTitle}>
                            {item.alternativeTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    {item.type && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-800/50 rounded-full text-gray-300">
                        <Film className="w-3 h-3" />
                        {item.type}
                      </span>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="space-y-2">
                    {item.episodes && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <PlayCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-gray-300">Episodes</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {item.episodes.sub > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-blue-400">SUB: {item.episodes.sub}</span>
                              </div>
                            )}
                            {item.episodes.dub > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-green-400">DUB: {item.episodes.dub}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-1 rounded">
                          Total: {getEpisodeCount(item.episodes)}
                        </span>
                      </div>
                    )}

                    {/* Duration if available */}
                    {item.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">{item.duration}</span>
                      </div>
                    )}

                    {/* Status if available */}
                    {item.status && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'Completed' ? 'bg-green-500' :
                          item.status === 'Ongoing' ? 'bg-yellow-500' :
                          item.status === 'Upcoming' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-xs text-gray-400">{item.status}</span>
                      </div>
                    )}

                    {/* Year/Release if available */}
                    {item.released && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">{item.released}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Simple Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-1 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {data.length > MAX_ITEMS && (
          <div className="relative mt-6">
            <div className="absolute inset-x-0 -top-4 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="relative z-10 w-full py-3 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/10"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  Show Less
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  Show {hiddenCount} More Related Titles
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Connection Lines Decoration */}
      <div className="absolute top-12 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -z-10"></div>
    </section>
  );
};

export default Related;