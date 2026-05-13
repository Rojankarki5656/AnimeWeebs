import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  Settings, Loader2, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { API_BASE_URL } from "../services/useApi";

const Player = ({ session, episodeId, currentEpisode, changeEpisode, hasNextEp, hasPrevEp }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [playData, setPlayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null); // "1080p" or "720p"
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // --- Fetch play data from API ---
  useEffect(() => {
    if (!session || !episodeId) return;
    const fetchPlayData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/play/c80a4484-ea16-e215-0902-39c6ef78ddea?episodeId=6d9b2c13acf2b852a74aa63d1736fcda317287a6ff7e8945abfa9fea6812592a`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.sources || !json.sources.length) throw new Error("No sources found");
        setPlayData(json);
        // Auto-select best quality (1080p > 720p)
        const best = json.sources.find(s => s.resolution === "1080p") || json.sources[0];
        setSelectedQuality(best.resolution);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayData();
  }, [session, episodeId]);

  // --- Initialize HLS player when source is available ---
  const currentSource = playData?.sources?.find(s => s.resolution === selectedQuality) || playData?.sources?.[0];
  const videoSrc = currentSource?.url;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setDuration(video.duration);
        if (autoPlay) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError("HLS error. Try refreshing.");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari)
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => setDuration(video.duration));
    } else {
      setError("Your browser does not support HLS playback.");
    }

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
      video.src = "";
    };
  }, [videoSrc]);

  // Auto-play and keyboard shortcuts
  const [autoPlay] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(e => console.warn(e));
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => setCurrentTime(videoRef.current?.currentTime || 0);
  const handleLoadedMetadata = () => setDuration(videoRef.current?.duration || 0);
  const handleWaiting = () => setBuffering(true);
  const handleCanPlay = () => setBuffering(false);
  const handleEnded = () => {
    setIsPlaying(false);
    if (autoNext && hasNextEp) setTimeout(() => changeEpisode("next"), 3000);
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
  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setIsMuted(val === 0);
  };
  const toggleFullscreen = () => {
    const container = document.getElementById("video-container");
    if (!document.fullscreenElement) container?.requestFullscreen();
    else document.exitFullscreen();
  };
  const changePlaybackRate = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };
  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` : `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };
  useEffect(() => {
    return () => controlsTimeoutRef.current && clearTimeout(controlsTimeoutRef.current);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (!videoRef.current) return;
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
  }, [volume, togglePlay]);

  const autoNext = true;

  if (loading) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !videoSrc) {
    return (
      <div className="aspect-video bg-black rounded-xl flex flex-col items-center justify-center text-red-400">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p>{error || "No video source available"}</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-primary text-black rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="video-container"
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        playsInline
      />

      {/* Quality selector */}
      {playData?.sources?.length > 1 && (
        <div className="absolute top-2 right-2 z-10">
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="bg-black/70 text-white text-xs px-2 py-1 rounded border border-gray-600"
          >
            {playData.sources.map(src => (
              <option key={src.resolution} value={src.resolution}>
                {src.resolution}p {src.isDub ? " (Dub)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overlay controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            if (videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value);
          }}
          className="w-full h-1.5 bg-gray-600 rounded-lg mb-2"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #4b5563 ${(currentTime / (duration || 1)) * 100}%)`,
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="p-1 hover:bg-white/10 rounded">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => skip(-15)} className="p-1">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={() => skip(15)} className="p-1">
              <SkipForward className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolume} className="w-20 h-1.5 bg-gray-600 rounded-lg" />
            </div>
            <span className="text-xs text-gray-300 hidden sm:inline">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-1 flex items-center gap-1">
                <Settings className="w-5 h-5" />
                <span className="text-xs">{playbackRate}x</span>
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded shadow-lg py-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button key={rate} onClick={() => changePlaybackRate(rate)} className={`block w-full px-3 py-1 text-xs text-left hover:bg-gray-700 ${playbackRate === rate ? "text-primary" : ""}`}>
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen}>
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {!isPlaying && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button onClick={togglePlay} className="pointer-events-auto bg-primary/90 p-3 rounded-full">
            <Play className="w-8 h-8 text-black" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Player;