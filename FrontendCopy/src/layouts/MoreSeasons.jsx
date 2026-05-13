import { Link } from "react-router-dom";

const MoreSeasons = ({ data }) => {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {data?.map((item) => (
        <Link
          key={item.id}
          to={`/anime/${item.id}`}
          className="group"
        >
          <div
            className={`relative h-20 rounded-lg overflow-hidden border transition
              ${
                item.isActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-gray-700 bg-gray-900/60 hover:bg-gray-800"
              }
            `}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-110"
              style={{ backgroundImage: `url(${item.poster})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 h-full px-3 flex items-center justify-center">
              <p
                className={`text-center text-xs font-semibold leading-tight line-clamp-2
                  ${
                    item.isActive
                      ? "text-indigo-400"
                      : "text-gray-200 group-hover:text-white"
                  }
                `}
              >
                {item.alternativeTitle}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MoreSeasons;
