/* eslint-disable react/prop-types */
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  AlertTriangle,
  ChevronDown,
  Grid3x3,
  List,
} from "lucide-react";

const Episodes = ({ episodes = [], currentEp, layout = "column" }) => {
  const totalEpisodes = episodes.length;
  const showNumberOnly = totalEpisodes > 50;
  const chunkSize = 100;

  const ranges = useMemo(() => {
    const result = [];
    for (let i = 0; i < totalEpisodes; i += chunkSize) {
      result.push({
        label: `${i + 1} – ${Math.min(i + chunkSize, totalEpisodes)}`,
        start: i,
        end: i + chunkSize,
      });
    }
    return result;
  }, [totalEpisodes]);

  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Auto-select range containing current episode
  useEffect(() => {
    if (!currentEp || !ranges.length) return;

    const epIndex = episodes.findIndex(
      (ep) =>
        ep.id?.split("ep=").pop() ===
        currentEp.id?.split("ep=").pop()
    );

    if (epIndex !== -1) {
      setSelectedRangeIndex(Math.floor(epIndex / chunkSize));
    }
  }, [currentEp, episodes, ranges]);

  if (!episodes.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No episodes available
      </div>
    );
  }

  const isCurrent = (ep) =>
    ep.id?.split("ep=").pop() ===
    currentEp?.id?.split("ep=").pop();

  const visibleEpisodes = showNumberOnly
    ? episodes.slice(
        ranges[selectedRangeIndex].start,
        ranges[selectedRangeIndex].end
      )
    : episodes;

  // ===============================
  // GRID ITEM
  // ===============================
  const renderGridItem = (episode) => {
    const current = isCurrent(episode);

    return (
      <li
        key={episode.id}
        data-current={current || undefined}
        className="group relative"
      >
        <Link to={`/watch/${episode.id.replaceAll("::", "?")}`}>
          <div
            className={`
              aspect-square flex items-center justify-center rounded-lg border transition
              ${
                current
                  ? "bg-gradient-to-r from-primary to-orange-500 text-black font-bold scale-105"
                  : episode.isFiller
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            {episode.episodeNumber}

            {episode.isFiller && !current && (
              <AlertTriangle className="absolute top-1 right-1 w-3 h-3 text-amber-400" />
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>
      </li>
    );
  };

  // ===============================
  // LIST ITEM
  // ===============================
  const renderListItem = (episode) => {
    const current = isCurrent(episode);

    return (
      <li key={episode.id}>
        <Link to={`/watch/${episode.id.replaceAll("::", "?")}`}>
          <div
            className={`
              flex items-center gap-4 p-4 rounded-xl border transition
              ${
                current
                  ? "bg-primary/20 border-primary"
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
              }
            `}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 text-white font-bold">
              {episode.episodeNumber}
            </div>
            <div className="flex-1">
              <h3 className="text-white">
                Episode {episode.episodeNumber}
              </h3>
            </div>
            <Play className="w-5 h-5 text-primary" />
          </div>
        </Link>
      </li>
    );
  };

  // ===============================
  // GRID VIEW (COLUMN)
  // ===============================
  if (layout === "column" || showNumberOnly) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-white font-medium">
            {totalEpisodes} Episodes
          </div>

          {showNumberOnly && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-sm text-white hover:bg-gray-700"
              >
                Episodes {ranges[selectedRangeIndex]?.label}
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-800 rounded-lg z-20">
                  {ranges.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        setSelectedRangeIndex(idx);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${
                        idx === selectedRangeIndex
                          ? "text-primary bg-gray-800"
                          : "text-gray-300"
                      }`}
                    >
                      Episodes {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {visibleEpisodes.map(renderGridItem)}
        </ul>
      </div>
    );
  }

  // ===============================
  // LIST VIEW (ROW)
  // ===============================
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {episodes.map(renderListItem)}
      </ul>
    </div>
  );
};

export default Episodes;
