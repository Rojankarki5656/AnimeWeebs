import { useRef, useState } from "react";
import { Loader2, AlertCircle, Download, SkipBack, SkipForward } from "lucide-react";

const Player = ({
  episodeNumber,
  animeTitle,
  sources = [],
  downloads = [],
  isLoading,
  isError,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  isTheater = false, // optional, for theater mode styling
}) => {
  const iframeRef = useRef(null);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);

  // Auto-select first source when sources change
  if (sources.length && selectedSourceIndex >= sources.length) {
    setSelectedSourceIndex(0);
  }

  const currentSource = sources[selectedSourceIndex];
  const embedUrl = currentSource?.file;

  // If still loading (from parent)
  if (isLoading) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Error or no source
  if (isError || !sources.length || !embedUrl) {
    return (
      <div className="aspect-video bg-black rounded-xl flex flex-col items-center justify-center text-red-400">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p>{isError ? "Failed to load video" : "No video source available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-primary text-black rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // Determine if source is HLS (m3u8) or iframe
  const isHls = embedUrl.includes('.m3u8');

  return (
    <div className={`relative aspect-video bg-black rounded-xl overflow-hidden group ${isTheater ? 'rounded-none' : ''}`}>
      {isHls ? (
        // HLS video (you would need a library like hls.js)
        <video
          src={embedUrl}
          controls
          className="w-full h-full"
          poster=""
        />
      ) : (
        // Iframe embed (works for megaplay.buzz, kwik, etc.)
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          frameBorder="0"
          scrolling="no"
          title={`${animeTitle} Episode ${episodeNumber}`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"
        />
      )}

      {/* Overlay controls (only if needed) */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {/* Source / Language selector (SUB/ DUB) */}
        {sources.length > 1 && (
          <select
            value={selectedSourceIndex}
            onChange={(e) => setSelectedSourceIndex(Number(e.target.value))}
            className="bg-black/70 text-white text-xs px-2 py-1 rounded border border-gray-600"
          >
            {sources.map((src, idx) => (
              <option key={idx} value={idx}>
                {src.label || (src.isDub ? "DUB" : "SUB")}
              </option>
            ))}
          </select>
        )}

        {/* Downloads (if any) */}
        {downloads.length > 0 && (
          <div className="relative group/download">
            <button className="bg-black/70 p-1 rounded hover:bg-black/90">
              <Download className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded shadow-lg p-2 hidden group-hover/download:block z-20">
              {downloads.map((d, idx) => (
                <a
                  key={idx}
                  href={d.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs px-3 py-1 hover:bg-gray-700 whitespace-nowrap"
                >
                  {d.quality} {d.isDub ? "(Dub)" : ""}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next/Prev buttons (optional – can be placed outside player) */}
      {(hasNext || hasPrev) && (
        <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center pointer-events-none">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="pointer-events-auto ml-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              aria-label="Previous episode"
            >
              <SkipBack className="w-6 h-6" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="pointer-events-auto mr-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              aria-label="Next episode"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Player;