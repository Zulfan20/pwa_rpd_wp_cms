"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Airplay, ChevronDown, ChevronUp, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ListenNowPlayer() {
  const pathname = usePathname();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [streamAvailable, setStreamAvailable] = useState<boolean | null>(null);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setIsPlayerOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Initialize audio element without src to avoid early network requests
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "none";
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      try {
        audio?.pause();
        audio!.src = "";
        audio?.load();
      } catch (err) {
        console.error("Error resetting audio after playback error:", err);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      try {
        audio.pause();
        audio.src = "";
      } catch (err) {
        /* ignore */
      }
    };
  }, []);

  // Probe the proxy endpoint once on mount so we can give quick feedback
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const probe = async () => {
      try {
        const res = await fetch(`/api/stream?t=${Date.now()}`, { method: "GET", signal: controller.signal });
        if (!cancelled) setStreamAvailable(res.ok);
        // try to cancel any streaming body quickly
        try {
          (res.body as any)?.cancel?.();
        } catch (e) {
          // ignore
        }
      } catch (e) {
        if (!cancelled) setStreamAvailable(false);
      }
    };

    probe();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const probeNow = async () => {
    setProbing(true);
    try {
      const res = await fetch(`/api/stream?t=${Date.now()}`, { method: "GET" });
      setStreamAvailable(res.ok);
      try {
        (res.body as any)?.cancel?.();
      } catch (e) {
        // ignore
      }
    } catch (e) {
      setStreamAvailable(false);
    } finally {
      setProbing(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (streamAvailable === false) {
        alert("Stream currently unavailable. Try again or contact the stream provider.");
        return;
      }
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = "/api/stream?t=" + Date.now();
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Playback failed:", error);
    }
  };

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
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#B21E35] text-white px-10 py-2 rounded-t-3xl text-[10px] font-black uppercase tracking-widest"
              >
                CLOSE PLAYER <ChevronDown className="w-4 h-4 inline ml-2" />
              </button>
              <div className="bg-[#B21E35] rounded-full p-4 md:px-10 md:py-6 shadow-2xl flex items-center gap-8 border border-white/20">
                <div className="hidden md:block flex-1">
                  <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">NOW ON AIR</p>
                  <p className="text-white font-display text-lg font-bold truncate">Radio PPI Dunia Stream</p>
                </div>
                <div className="flex items-center gap-8 mx-auto md:mx-0">
                  <SkipBack className="w-8 h-8 text-black/40 cursor-pointer" />
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-8 h-8 text-[#B21E35] fill-[#B21E35]" /> : <Play className="w-8 h-8 text-[#B21E35] fill-[#B21E35] ml-1" />}
                    </button>
                    {streamAvailable === false ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/80">Stream unavailable</span>
                        <button onClick={probeNow} disabled={probing} className="text-xs px-2 py-1 bg-white/10 rounded-md text-white hover:bg-white/20">
                          {probing ? "Checking..." : "Retry"}
                        </button>
                      </div>
                    ) : streamAvailable === null ? (
                      <span className="text-xs text-white/80 mt-1">Checking...</span>
                    ) : null}
                  </div>
                  <SkipForward className="w-8 h-8 text-black/40 cursor-pointer" />
                </div>
                <div className="hidden md:flex flex-1 items-center gap-6">
                  <div className="flex-1 h-2 bg-black/20 rounded-full relative overflow-hidden">
                    <motion.div animate={isPlaying ? { x: ["-100%", "100%"] } : {}} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-white" />
                  </div>
                  <Airplay className={`w-6 h-6 text-white ${isPlaying ? "animate-pulse" : ""}`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}