"use client";

import { useEffect, useRef, useState, useMemo } from "react";

function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00";
  const roundedSeconds = Math.floor(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;
  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }
  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function PlayButton({ onClick, isPlaying }: { onClick: () => void; isPlaying: boolean }) {
  return (
    <button onClick={onClick} className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0" aria-label={isPlaying ? "Pause podcast" : "Play podcast"}>
      {isPlaying ? (
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

function TrackItem({
  track,
  onPlay,
  isPlaying,
  duration,
}: {
  track: any;
  onPlay: () => void;
  isPlaying: boolean;
  duration: string;
}) {
  const bars = [18, 28, 12, 22, 16, 26, 14, 20];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-[#a01a30]/40 hover:bg-[#a01a30]/30 transition-colors ${isPlaying ? "bg-[#a01a30]/40" : ""}`}>
      <PlayButton onClick={onPlay} isPlaying={isPlaying} />
      <div className="flex-1 min-w-0">
        <p className="text-[#FFF1A8] font-black italic text-sm leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" style={{ fontFamily: "Fredoka, sans-serif" }}>
          {track.title}
        </p>
        {track.subtitle ? (
          <p className="text-[#A7F3FF] font-semibold italic text-xs mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" style={{ fontFamily: "Fredoka, sans-serif" }}>
            {track.subtitle}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-3">
          <div className="h-[2px] flex-1 rounded-full bg-white/20 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r from-[#FFF1A8] via-[#A7F3FF] to-white ${isPlaying ? "w-full animate-pulse" : "w-3/5"}`} />
          </div>
          <div className="flex h-4 items-end gap-[2px]">
            {bars.map((height, index) => (
              <span
                key={index}
                className={`w-1 rounded-full bg-white/75 ${isPlaying ? "animate-pulse" : ""}`}
                style={{ height: `${height}px`, animationDelay: `${index * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="text-[#FFF1A8] font-black text-sm whitespace-nowrap tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" style={{ fontFamily: "Fredoka, sans-serif" }}>
        {duration || "00:00"}
      </span>
    </div>
  );
}

export default function PodcastPage() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch("/api/podcast");
        const data = await res.json();
        setPodcasts(data);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handlePlay = (trackId: string, audioUrl: string | null) => {
    if (!audioUrl) {
      alert("Audio belum tersedia untuk podcast ini");
      return;
    }

    if (playingTrack === trackId) {
      setPlayingTrack(null);
      audioRef.current?.pause();
      return;
    }

    setPlayingTrack(trackId);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
        alert("Gagal memutar audio");
      });
    }
  };

  const siaranSpesial2025 = useMemo(
    () =>
      podcasts.filter((podcast) =>
        podcast.category?.toLowerCase().includes("2025") ||
        podcast.category?.toLowerCase().includes("siaran_special_2025")
      ),
    [podcasts]
  );

  useEffect(() => {
    let cancelled = false;

    const loadDurations = async () => {
      const entries = await Promise.all(
        siaranSpesial2025.map(
          (podcast) =>
            new Promise<[string, string | null]>((resolve) => {
              if (!podcast.audio_url) {
                resolve([podcast.id, podcast.duration || null]);
                return;
              }

              const audio = document.createElement("audio");
              audio.preload = "metadata";
              audio.src = podcast.audio_url;

              const cleanup = () => {
                audio.removeAttribute("src");
                audio.load();
              };

              audio.onloadedmetadata = () => {
                resolve([podcast.id, formatDuration(audio.duration)]);
                cleanup();
              };

              audio.onerror = () => {
                resolve([podcast.id, podcast.duration || null]);
                cleanup();
              };
            })
        )
      );

      if (!cancelled) {
        const nextDurations: Record<string, string> = {};
        entries.forEach(([id, duration]) => {
          if (duration) nextDurations[id] = duration;
        });
        setDurations(nextDurations);
      }
    };

    if (siaranSpesial2025.length > 0) {
      loadDurations();
    } else {
      setDurations({});
    }

    return () => {
      cancelled = true;
    };
  }, [siaranSpesial2025]);

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(180deg, #4a1520 0%, #3d1018 30%, #2d0a10 60%, #1a0608 100%)" }}>
      <section className="pt-24 pb-12 px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-end gap-4 mb-8">
          <div className="h-[3px] flex-1 max-w-[300px] bg-gradient-to-r from-transparent to-white/60" />
          <h1
            className="text-3xl md:text-6xl font-black italic text-white px-6 py-3 rounded-2xl text-right"
            style={{
              fontFamily: "Fredoka, sans-serif",
              backgroundColor: "#C41E3A",
              letterSpacing: "0.06em",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Siaran Podcast Radio PPI Dunia
          </h1>
        </div>

        <div className="rounded-[30px] overflow-hidden border-[4px] border-[#C41E3A]" style={{ background: "linear-gradient(135deg, #C41E3A 0%, #B91638 100%)" }}>
          <div className="h-14 rounded-t-[26px]" style={{ background: "linear-gradient(135deg, #f5c6cb 0%, #f8d7da 50%, #e8b4b8 100%)" }} />

          <div className="max-h-[520px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : siaranSpesial2025.length > 0 ? (
              siaranSpesial2025.map((track, index) => (
                <TrackItem
                  key={track.id || index}
                  track={track}
                  onPlay={() => handlePlay(track.id, track.audio_url)}
                  isPlaying={playingTrack === track.id}
                  duration={durations[track.id] || track.duration || "00:00"}
                />
              ))
            ) : (
              <div className="text-center py-12 text-white/60 italic">Belum ada podcast di kategori ini</div>
            )}
          </div>
        </div>
      </section>

      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setPlayingTrack(null)}
        onError={() => {
          setPlayingTrack(null);
          alert("Error loading audio file");
        }}
      />
    </div>
  );
}