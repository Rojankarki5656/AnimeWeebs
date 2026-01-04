/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
const Episodes = ({ episode, currentEp, layout }) => {
  const isCurrent = episode.id === currentEp.id;
  return (
    <>
      {layout === "row" ? (
        <li
          title={episode.title}
          className={`w-full px-2 py-3 text-black
            ${
              isCurrent
                ? "bg-primary"
                : episode.isFiller
                ? "bg-red-500"
                : "bg-btnbg"
            }
          `}
        >
          <Link
            to={`/watch/${episode.id.replaceAll("::", "?")}`}
            className="block w-full"
          >
            <div className="flex gap-3 items-center">
              <button
                className={`text-sm ${
                  isCurrent ? "text-black" : "text-primary"
                }`}
              >
                {episode.episodeNumber}
              </button>
              <li
                className={`flex-1 ${
                  isCurrent ? "text-black" : "text-white"
                } text-sm truncate`}
              >
                {episode.title}
              </li>
              {episode.isFiller && <span title="Filler">👻</span>}
            </div>
          </Link>
        </li>
      ) : (
        <li
          title={episode.title}
          className={` w-full rounded-sm py-1
             ${
               isCurrent
                 ? "bg-primary"
                 : episode.isFiller
                 ? "bg-red-500"
                 : "bg-btnbg"
             }
          `}
        >
          <Link
            to={`/watch/${episode.id.replaceAll("::", "?")}`}
            className="block w-full"
          >
            <p
              className={` text-sm md:text-base text-center ${
                isCurrent ? "text-black" : "text-white"
              }`}
            >
              {episode.episodeNumber}
            </p>
          </Link>
        </li>
      )}
    </>
  );
};

export default Episodes;
