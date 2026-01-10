/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Image = ({ data }) => {
  return (
    <div className="group">
      <Link to={`/anime/${data.id}`}>
        <div className="relative w-full rounded-t-2xl overflow-hidden bg-[#545454]">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
            <img
              src={data.poster}
              alt={data.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Episodes Info */}
            {data.episodes && typeof data.episodes === "object" && (
              <div className="absolute bottom-2 left-2 flex gap-2 text-xs z-10">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SUB {data.episodes.sub ?? 0}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  DUB {data.episodes.dub ?? 0}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  EPS {data.episodes.eps ?? 0}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Type / Duration */}
      {data.type && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
          <h4>{data.type}</h4>
          <div className="h-1 w-1 bg-primary rounded-full"></div>
          <h4>{data.duration}</h4>
        </div>
      )}
    </div>
  );
};

export default Image;
