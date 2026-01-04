import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { useApi } from "../services/useApi";
import Loader from "../components/Loader";

const VoiceActorsLayout = ({ id }) => {
  const { data, isLoading, isError } = useApi(`/characters/${id}`);

  if (isLoading) return <Loader />;
  if (isError || !data?.data?.response?.length) return null;

  const characters = data.data.response.slice(0, 6);

  return (
    <section className="mt-12 rounded-xl border border-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-semibold text-white">
          Characters & Voice Actors
        </h2>

        <Link
          to={`/characters/${id}`}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-400 transition"
        >
          View more
          <FaAngleRight />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {characters.map((item) => {
          const characterPath = `/${item.id.replace(":", "/")}`;
          const va = item.voiceActors?.[0];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900/40 backdrop-blur px-4 py-3 hover:bg-gray-800/60 transition"
            >
              {/* Character */}
              <div className="flex items-center gap-3 min-w-0">
                <Link to={characterPath}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <Link to={characterPath}>
                    <p className="text-xs font-semibold text-white truncate hover:text-indigo-400 transition">
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-[11px] text-gray-400 truncate">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Voice Actor */}
              {va && (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-right min-w-0">
                    <Link to={`/${va.id.replace(":", "/")}`}>
                      <p className="text-xs font-semibold text-white truncate hover:text-indigo-400 transition">
                        {va.name}
                      </p>
                    </Link>
                    <p className="text-[11px] text-gray-400">Japanese</p>
                  </div>

                  <Link to={`/${va.id.replace(":", "/")}`}>
                    <img
                      src={va.imageUrl}
                      alt={va.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VoiceActorsLayout;
