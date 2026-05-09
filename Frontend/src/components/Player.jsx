/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import {
  Expand,
  Zap,
  PlayCircle,
  SkipForward,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward as SkipForwardIcon,
  Settings,
} from "lucide-react";
import { API_BASE_URL, useApi } from "../services/useApi";

// ----------------------------------------------------------------------
//  Client‑side decryption helper (bypasses Cloudflare)
// ----------------------------------------------------------------------
async function decryptMedia(mediaUrl, userAgent) {
  const DEC_MEGA_URL = "https://enc-dec.app/api/dec-mega";

  // 1. Fetch the encrypted media data from the provided URL
  const mediaResponse = await fetch(mediaUrl, {
    method: "GET",
    headers: {
      "User-Agent": userAgent || navigator.userAgent,
      Accept: "application/json",
    },
    credentials: "include", // send cookies if needed
  });

  if (!mediaResponse.ok) {
    throw new Error(`Failed to fetch media: ${mediaResponse.status}`);
  }

  const mediaData = await mediaResponse.json();
  const encryptedMedia = mediaData.result || "";

  if (!encryptedMedia) {
    throw new Error("No encrypted media found");
  }

  // 2. Decrypt the result using the external API
  const decryptResponse = await fetch(DEC_MEGA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": userAgent || navigator.userAgent,
    },
    body: JSON.stringify({
      text: encryptedMedia,
      agent: userAgent || navigator.userAgent,
    }),
  });

  const decryptData = await decryptResponse.json();

  if (decryptData.status === 200 && decryptData.result) {
    return decryptData.result;
  }
  throw new Error("Media decryption failed");
}

// ----------------------------------------------------------------------
//  Main Player Component
// ----------------------------------------------------------------------
const Player = ({
  token,
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [expanded, setExpanded] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoSkipIntro, setAutoSkipIntro] = useState(true);
  const [showSeasons, setShowSeasons] = useState(false);
  const [selectedServer, setSelectedServer] = useState("");
  const [streamResponse, setStreamResponse] = useState(null);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  // Custom video player states
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile for responsive UI
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CATEGORY_LABELS = {
    sub: "SUB",
    softsub: "SOFT SUB",
    dub: "DUB",
  };

  const CATEGORY_PRIORITY = ["sub", "softsub", "dub"];

  const normalizeCategoryKey = (value = "") => {
    const key = String(value).toLowerCase().trim();
    if (
      ["subbed", "subtitle", "subtitles", "soft sub", "soft-sub"].includes(key)
    )
      return "sub";
    if (["softsub", "soft-subbed"].includes(key)) return "softsub";
    if (["dubbed", "audio"].includes(key)) return "dub";
    return key;
  };

  const episodeToken = token || currentEp?.token || "";

  const {
    data: serversResponse,
    isLoading: isServersLoading,
    isError: isServersError,
  } = useApi(episodeToken ? `/servers/${episodeToken}` : null);

  const serverGroups = useMemo(
    () => serversResponse?.data?.servers || {},
    [serversResponse]
  );

  const availableCategories = useMemo(() => {
    const keys = Object.keys(serverGroups).map(normalizeCategoryKey);
    const uniqueKeys = [...new Set(keys)];
    return uniqueKeys.sort((a, b) => {
      const aIndex = CATEGORY_PRIORITY.indexOf(a);
      const bIndex = CATEGORY_PRIORITY.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [serverGroups]);

  const availableServers = useMemo(
    () => serverGroups[normalizeCategoryKey(category)] ?? [],
    [serverGroups, category]
  );

  useEffect(() => {
    if (!availableCategories.length) {
      setCategory("sub");
      return;
    }
    const normalizedCurrent = normalizeCategoryKey(category);
    if (!availableCategories.includes(normalizedCurrent)) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  useEffect(() => {
    if (!availableServers.length) {
      setSelectedServer("");
      return;
    }
    if (
      !selectedServer ||
      !availableServers.some((s) => s.link_id === selectedServer)
    ) {
      setSelectedServer(availableServers[0].link_id);
    }
  }, [availableServers, selectedServer]);

  const selectedServerData = useMemo(
    () =>
      availableServers.find((server) => server.link_id === selectedServer) ??
      null,
    [availableServers, selectedServer]
  );

  // -------------------------------------------------------------------
  //  Updated stream fetching: backend returns media_url (or embed_url)
  //  and frontend performs the decryption.
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!selectedServerData?.link_id) {
      setStreamResponse(null);
      setIsStreamLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 60000);
    const requestId = ++requestIdRef.current;

    const loadStream = async () => {
      setIsStreamLoading(true);
      setError(null);
      try {
        // 1. Get the basic stream info (embed_url and/or media_url)
        const res = await fetch(
          `${API_BASE_URL}/stream?link_id=${encodeURIComponent(selectedServerData.link_id)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Failed to load stream (${res.status})`);
        const json = await res.json();
        if (requestId !== requestIdRef.current) return;

        const streamData = json?.data ?? json;

        // 2. If we have a media_url, decrypt it in the browser (bypass Cloudflare)
        if (streamData.media_url) {
          try {
            const decryptedData = await decryptMedia(
              streamData.media_url,
              navigator.userAgent
            );
            const finalStreamData = {
              ...streamData,
              sources: decryptedData.sources || [],
              tracks: decryptedData.tracks || [],
              download: decryptedData.download || "",
            };
            if (requestId === requestIdRef.current) {
              setStreamResponse(finalStreamData);
            }
          } catch (decryptErr) {
            console.error("Decryption failed:", decryptErr);
            setError("Failed to decrypt video source. Try another server.");
            setStreamResponse(null);
          }
        }
        // 3. Otherwise use embed_url (iframe) directly
        else if (streamData.embed_url) {
          if (requestId === requestIdRef.current) {
            setStreamResponse(streamData);
          }
        } else {
          setError("No valid stream source found");
          setStreamResponse(null);
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        if (err.name === "AbortError") {
          setError("Request timeout. Try another server.");
        } else {
          setError("Failed to load video. Try a different server.");
        }
        setStreamResponse(null);
      } finally {
        if (requestId === requestIdRef.current) setIsStreamLoading(false);
      }
    };

    loadStream();
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [selectedServerData?.link_id]);

  const streamData = streamResponse;
  const embedUrl =
    streamData?.embed_url ||
    streamData?.embedUrl ||
    streamData?.sources?.file ||
    "";
  const videoSource = streamData?.sources?.[0]?.file || "";
  const streamUrl = embedUrl || videoSource || "";
  const isEmbedStream = Boolean(embedUrl && !videoSource);
  const isLoading = isServersLoading || isStreamLoading;

  useEffect(() => {
    if (isServersError) setError("Failed to fetch servers.");
    else setError(null);
  }, [isServersError]);

  // -------------------------------------------------------------------
  //  Video controls (unchanged)
  // -------------------------------------------------------------------
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => setError("Playback failed"));
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () =>
    videoRef.current && setCurrentTime(videoRef.current.currentTime);
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (autoPlay) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const skip = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setIsMuted(val === 0);
  };
  const changePlaybackRate = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };
  const toggleFullscreen = () => {
    const container = document.getElementById("video-container");
    if (!document.fullscreenElement) container?.requestFullscreen();
    else document.exitFullscreen();
  };
  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (autoNext && hasNextEp) setTimeout(() => changeEpisode("next"), 3000);
  };
  const handleWaiting = () => setBuffering(true);
  const handleCanPlay = () => setBuffering(false);
  const handleVideoError = () => setError("Video error. Try another server.");
  const handleMouseMove = () => {
    if (!videoSource) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };
  useEffect(() => {
    return () =>
      controlsTimeoutRef.current && clearTimeout(controlsTimeoutRef.current);
  }, []);

  const handleIframeLoad = () => setError(null);
  const handleIframeError = () =>
    setError("Iframe failed. Try another server.");
  const changeCategory = (newType) => {
    const norm = normalizeCategoryKey(newType);
    if (norm !== category) {
      setCategory(norm);
      setError(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (!videoSource || !videoRef.current) return;
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      switch (e.key) {
        case " ":
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-15);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(15);
          break;
        case "ArrowUp":
          e.preventDefault();
          const newVol = Math.min(1, volume + 0.1);
          setVolume(newVol);
          if (videoRef.current) videoRef.current.volume = newVol;
          setIsMuted(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          const newVolDown = Math.max(0, volume - 0.1);
          setVolume(newVolDown);
          if (videoRef.current) videoRef.current.volume = newVolDown;
          setIsMuted(newVolDown === 0);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [videoSource, volume, togglePlay, toggleFullscreen]);

  // Example seasons data – replace with real API
  const seasons = [
    { id: 1, name: "Season 1", episodes: 12, current: true },
    { id: 2, name: "OVA", episodes: 3 },
    { id: 3, name: "SP-1", episodes: 1 },
    { id: 4, name: "Season 2", episodes: 24 },
    { id: 5, name: "SP-2", episodes: 2 },
    { id: 6, name: "Season 3", episodes: 12 },
  ];

  const animeTitle = "Anime Title"; // Ideally receive as prop
  const episodeNumber = currentEp?.episodeNumber || "?";

  return (
    <>
      {/* Hidden SEO & Schema */}
      <div className="sr-only" aria-hidden="true">
        <h2>
          Video Player for {animeTitle} Episode {episodeNumber}
        </h2>
        <p>
          Watch {animeTitle} Episode {episodeNumber} online free in HD. No ads,
          fast streaming, multiple servers.
        </p>
      </div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: `${animeTitle} Episode ${episodeNumber}`,
          description: `Watch ${animeTitle} Episode ${episodeNumber} free on AnimeWeebs.`,
          thumbnailUrl: currentEp?.poster || "",
          uploadDate: currentEp?.aired || new Date().toISOString(),
          embedUrl: window.location.href,
          contentUrl: videoSource || embedUrl,
          duration: currentEp?.duration || "",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        })}
      </script>

      {/* Video Player Container */}
      <div
        id="video-container"
        className="w-full bg-black aspect-video relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => videoSource && isPlaying && setShowControls(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading video...</p>
              <p className="text-xs text-gray-500 mt-2">
                This may take a moment
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && !streamUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-yellow-300">No stream available.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-black rounded-lg font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Iframe for embed streams */}
        {streamUrl && !error && isEmbedStream && (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            allowFullScreen
            className="border-0"
            title={`${animeTitle} Episode ${episodeNumber} player`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          />
        )}

        {/* Custom Video Player */}
        {streamUrl && !error && !isEmbedStream && videoSource && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="h-full w-full bg-black cursor-pointer"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnd}
              onWaiting={handleWaiting}
              onCanPlay={handleCanPlay}
              onError={handleVideoError}
              onClick={togglePlay}
              src={videoSource}
              autoPlay={autoPlay}
              playsInline
            />

            {/* Custom Controls Overlay – responsive */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress Bar */}
              <div className="mb-2 sm:mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%)`,
                  }}
                  aria-label="Video progress"
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1 sm:mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls Row – responsive layout */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>

                  <button
                    onClick={() => skip(-15)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Back 15 seconds"
                  >
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">15</span>
                    </div>
                  </button>

                  <button
                    onClick={() => skip(15)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Forward 15 seconds"
                  >
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <SkipForwardIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">15</span>
                    </div>
                  </button>

                  {autoSkipIntro && !isMobile && (
                    <button
                      onClick={() => skip(85)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Skip intro/outro (85 seconds)"
                    >
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-medium">
                          85
                        </span>
                      </div>
                    </button>
                  )}

                  {!isMobile && (
                    <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/10 rounded-lg"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-24 h-1.5 bg-gray-600 rounded-lg"
                        aria-label="Volume"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {!isMobile && (
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-white/10 rounded-lg"
                        aria-label="Playback speed"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="text-xs ml-0.5">{playbackRate}x</span>
                      </button>
                      {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-[100px] z-20 border border-gray-700">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-700 ${
                                playbackRate === rate
                                  ? "text-primary bg-gray-700"
                                  : "text-white"
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-lg"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Buffering Overlay */}
            {buffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">Buffering...</p>
                </div>
              </div>
            )}

            {/* Big Play Button (paused) */}
            {!isPlaying && !buffering && showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={togglePlay}
                  className="pointer-events-auto bg-primary/90 hover:bg-primary text-black rounded-full p-3 sm:p-4 transition-all transform hover:scale-110"
                  aria-label="Play"
                >
                  <Play className="w-8 h-8 sm:w-12 sm:h-12" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Section */}
      <div className="rounded-xl border border-gray-800 mt-4">
        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  expanded
                    ? "bg-primary text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Expand className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {expanded ? "Collapse" : "Expand"}
                </span>
              </button>

              <button
                onClick={() => setLightMode(!lightMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  lightMode
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {lightMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  Light {lightMode ? "On" : "Off"}
                </span>
              </button>

              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoPlay
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Play {autoPlay ? "On" : "Off"}
                </span>
              </button>

              <button
                onClick={() => setAutoNext(!autoNext)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoNext
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <SkipForward className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Next {autoNext ? "On" : "Off"}
                </span>
              </button>

              <button
                onClick={() => setAutoSkipIntro(!autoSkipIntro)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                  autoSkipIntro
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Auto Skip {autoSkipIntro ? "On" : "Off"}
                </span>
              </button>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex flex-wrap justify-end gap-2">
                {(availableCategories.length
                  ? availableCategories
                  : ["sub", "softsub", "dub"]
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => changeCategory(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      normalizeCategoryKey(category) ===
                      normalizeCategoryKey(type)
                        ? "bg-blue-500 text-white font-bold"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {CATEGORY_LABELS[normalizeCategoryKey(type)] ||
                      type.toUpperCase()}
                  </button>
                ))}
              </div>

              {availableServers.length > 0 && (
                <div className="flex flex-wrap justify-end gap-2">
                  {availableServers.map((server) => (
                    <button
                      key={server.link_id}
                      onClick={() => setSelectedServer(server.link_id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedServer === server.link_id
                          ? "bg-primary text-black font-bold"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {server.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PlayCircle className="w-4 h-4 text-primary" />
                <p className="text-gray-400 text-sm">You are watching</p>
              </div>
              <h3 className="text-xl font-bold text-white">
                Episode {currentEp?.episodeNumber}
                {currentEp?.isFiller && (
                  <span className="ml-3 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                    Filler Episode 👻
                  </span>
                )}
              </h3>
              {currentEp?.title && (
                <p className="text-gray-300 mt-1">{currentEp.title}</p>
              )}
            </div>

            <div className="flex gap-3">
              {hasPrevEp && (
                <button
                  onClick={() => changeEpisode("prev")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  title="Previous Episode"
                >
                  <TbPlayerTrackPrevFilled className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
              )}
              {hasNextEp && (
                <button
                  onClick={() => changeEpisode("next")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-black font-medium transition-colors"
                  title="Next Episode"
                >
                  <span className="hidden sm:inline">Next</span>
                  <TbPlayerTrackNextFilled className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                🎮 Video controls: Tap player to play/pause | ←/→ to skip 15s |
                ↑/↓ for volume | F for fullscreen
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <button
              onClick={() => setShowSeasons(!showSeasons)}
              className="flex items-center justify-between w-full mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  Watch more seasons of this anime
                </span>
                {showSeasons ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {showSeasons && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {seasons.map((season) => (
                  <div
                    key={season.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      season.current
                        ? "bg-primary/20 border-primary"
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span
                        className={`text-sm font-medium ${
                          season.current ? "text-primary" : "text-white"
                        }`}
                      >
                        {season.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {season.episodes} episodes
                      </span>
                      {season.current && (
                        <div className="mt-2">
                          <CheckCircle className="w-4 h-4 text-primary mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;