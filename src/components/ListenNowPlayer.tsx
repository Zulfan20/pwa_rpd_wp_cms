"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play, Rewind, FastForward } from "lucide-react";
import { usePathname } from "next/navigation";

const DIRECT_STREAM_URL = "http://s1.voscast.com:8080/stream";
const VOSCAST_PLAYER_IFRAME =
  "https://cdn.voscast.com/player/player.php?host=s1.voscast.com&port=8080&mount=/live&autoplay=true&icecast=false";

export default function ListenNowPlayer() {
  const pathname = usePathname();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState<"stream" | "embed">("stream");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFallbackPrompt, setShowFallbackPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // State to hold the dynamic VosCast title
  const [nowPlaying, setNowPlaying] = useState("Memuat info siaran...");

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setIsPlayerOpen(false);
    }
  }, [pathname]);

  // Fetch the now playing info every 15 seconds
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/now-playing");
        const data = await res.json();
        if (data.displayTitle) {
          setNowPlaying(data.displayTitle);
        }
      } catch (err) {
        // Fail silently and keep showing the last known song
      }
    };

    fetchNowPlaying(); 
    const interval = setInterval(fetchNowPlaying, 15000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setPlayerMode("embed");
      setShowFallbackPrompt(true);
    };

    const handleTimeUpdate = () => {
      try {
        setCurrentTime(audio.currentTime || 0);
      } catch {
        setCurrentTime(0);
      }
    };

    const handleLoaded = () => {
      try {
        setDuration(audio.duration || 0);
      } catch {
        setDuration(0);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {
        // ignore
      }
    };
  }, []);

  const playDirectStream = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.src = DIRECT_STREAM_URL + `?t=${Date.now()}`;
      await audioRef.current.play();
      setPlayerMode("stream");
      setShowFallbackPrompt(false);
    } catch {
      setPlayerMode("embed");
      setShowFallbackPrompt(true);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min((audioRef.current.duration || 0), time));
  };

  const formatTime = (s: number) => {
    if (!isFinite(s) || s <= 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const embedPlayer = (
    <div className="flex items-center justify-center rounded-xl bg-black/15 px-4 py-4 overflow-hidden">
      <iframe
        title="VosCast HTML5 Player"
        src={VOSCAST_PLAYER_IFRAME}
        width="150"
        height="30"
        frameBorder="0"
        scrolling="no"
        allow="autoplay"
        className="block"
      />
    </div>
  );

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <AnimatePresence>
        {!isPlayerOpen && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 bottom-[calc(104px+env(safe-area-inset-bottom))] z-40 -translate-x-1/2 lg:bottom-6"
          >
            <button
              onClick={() => setIsPlayerOpen(true)}
              className="bg-[#B21E35] hover:bg-[#8B0000] text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl transition-all hover:scale-105"
            >
              <span className="font-bold uppercase text-xs md:text-sm tracking-widest">Listen Now</span>
              <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 w-full z-[120] px-4 pb-[calc(92px+env(safe-area-inset-bottom))] md:pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-4"
          >
            <div className="max-w-5xl mx-auto relative">
              <button
                onClick={() => setIsPlayerOpen(false)}
                className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-[#B21E35] text-white px-10 py-2 rounded-t-3xl text-[10px] font-black uppercase tracking-widest ${playerMode === "embed" ? "hidden" : ""}`}
              >
                CLOSE PLAYER <ChevronDown className="w-4 h-4 inline ml-2" />
              </button>

              <div className={`relative shadow-2xl border border-white/20 ${playerMode === "embed" ? "mx-auto max-w-[360px] rounded-[26px] border-white/15 bg-gradient-to-br from-[#7f1524] via-[#a51c31] to-[#c11f39] p-3 md:p-4" : "bg-[#B21E35] rounded-[28px] p-4 md:px-8 md:py-6"}`}>
                <div className={`flex flex-col ${playerMode === "embed" ? "gap-3" : "gap-4"}`}>
                  
                  {playerMode === "stream" ? (
                    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                      
                      {/* === LEFT AREA (Info & Mobile Play Button) === */}
                      <div className="flex items-center justify-between w-full md:w-auto md:flex-1 min-w-0 pr-0 md:pr-4">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">Playing Now</p>
                          <div className="relative overflow-hidden w-full group">
                            {/* Changed to truncate for mobile so it fits neatly like Spotify */}
                            <p className="text-white font-display text-sm md:text-base font-bold leading-tight mt-1 truncate md:line-clamp-2 md:whitespace-normal" title={nowPlaying}>
                              {nowPlaying}
                            </p>
                          </div>
                        </div>

                        {/* MOBILE PLAY BUTTON (Hidden on Desktop) */}
                        <div className="md:hidden flex-shrink-0 flex items-center gap-3">
                          <button
                            onClick={isPlaying ? () => audioRef.current?.pause() : playDirectStream}
                            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                            aria-label="Play/Pause"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-[#B21E35] fill-current" />
                            ) : (
                              <Play className="w-6 h-6 text-[#B21E35] fill-current ml-1" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* === CENTER AREA (Desktop Full Controls, Hidden on Mobile) === */}
                      <div className="hidden md:flex items-center gap-6 justify-center">
                        <button
                          onClick={() => seek((audioRef.current?.currentTime || 0) - 10)}
                          className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md border border-white/10 hover:bg-black/80 transition-colors"
                          aria-label="Rewind 10s"
                        >
                          <Rewind className="w-5 h-5 text-white" />
                        </button>

                        <button
                          onClick={isPlaying ? () => audioRef.current?.pause() : playDirectStream}
                          className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-2xl border-2 border-white/10 hover:bg-black/80 transition-colors"
                          aria-label="Play/Pause"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-current" />
                          ) : (
                            <Play className="w-10 h-10 text-white fill-current ml-1" />
                          )}
                        </button>

                        <button
                          onClick={() => seek((audioRef.current?.currentTime || 0) + 10)}
                          className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md border border-white/10 hover:bg-black/80 transition-colors"
                          aria-label="Forward 10s"
                        >
                          <FastForward className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* === RIGHT / BOTTOM AREA (Progress Bar) === */}
                      <div className="w-full md:flex-1 md:max-w-sm flex flex-col md:items-end gap-1 md:gap-2 md:pl-4">
                        <div className="hidden md:block text-white/90 text-sm font-mono">{formatTime(currentTime)}</div>
                        <input
                          type="range"
                          min={0}
                          max={Math.max(1, duration)}
                          value={currentTime}
                          onChange={(e) => seek(Number(e.target.value))}
                          className="w-full h-1.5 md:h-1 appearance-none bg-white/30 rounded-full accent-white cursor-pointer"
                        />
                      </div>
                      
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">BACKUP PLAYER</p>
                        <p className="text-white font-display text-lg font-bold truncate">Embedded radio player</p>
                      </div>
                      <button
                        onClick={() => setIsPlayerOpen(false)}
                        className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 transition hover:bg-white/20"
                        aria-label="Close backup player"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {playerMode === "embed" ? (
                    <div className="rounded-[22px] border border-white/15 bg-black/15 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                      <div className="flex flex-col items-center gap-3 rounded-[20px] bg-white/5 px-3 py-3">
                        <div className="flex items-center gap-2 text-white/85">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-[0.24em]">Backup Player</span>
                        </div>
                        <div className="flex items-center justify-center rounded-full bg-black/20 px-3 py-2 overflow-hidden shadow-inner">
                          {embedPlayer}
                        </div>
                      </div>
                    </div>
                    ) : null}

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {playerMode === "embed" && !isPlayerOpen ? (
        <div className="fixed left-0 top-0 -z-10 opacity-0 pointer-events-none" aria-hidden="true">
          {embedPlayer}
        </div>
      ) : null}

      <audio ref={audioRef} className="hidden" />
    </>
  );
}