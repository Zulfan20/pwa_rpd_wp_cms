"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Mic2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

// Local Type Definitions
type HomeBanner = {
  image_url: string;
  alt: string;
  section?: string;
};

type Member = {
  name: string;
  country?: string;
  quote: string;
  image_url: string;
};

type MusicItem = {
  id: number;
  title: string;
  artist: string;
  image_url: string | null;
  spotify_url: string | null;
};

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install: Tap the Share button and select 'Add to Home Screen'");
      } else {
        alert(
          "To install: Open your browser menu and select 'Install app' or 'Add to Home screen'"
        );
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);
    setDeferredPrompt(null);
  };

  return { promptInstall };
}

function RadioVibeStrip() {
  const bars: number[] = [18, 34, 24, 42, 28, 38, 20, 32];

  return (
    <div className="mt-2 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-[24px] border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.28)] sm:max-w-none sm:justify-end sm:gap-3 sm:rounded-full sm:px-4 sm:py-3">
      <div className="flex h-6 items-end gap-1 sm:h-8 sm:gap-1.5">
        {bars.map((height, index) => (
          <motion.span
            key={index}
            animate={{ height: [height * 0.6, height, height * 0.75] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              delay: index * 0.08,
            }}
            className="w-1.5 rounded-full bg-gradient-to-t from-[#8B0000] via-[#B21E35] to-[#ff6780] sm:w-1.5"
            style={{ height: height * 0.7 }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/55 sm:text-[10px] sm:tracking-[0.5em]">
          Melody Tune
        </span>
        <span className="hidden text-sm font-bold text-white sm:block">
          Feels like live radio energy
        </span>
        <span className="text-[11px] font-semibold text-white/85 sm:hidden">
          Live radio vibe
        </span>
      </div>

      <div className="ml-1 flex items-center gap-1 text-white/80 sm:ml-2">
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatType: "mirror" }}
          className="text-base sm:text-lg"
        >
          ♪
        </motion.span>
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.2,
          }}
          className="text-sm sm:text-base"
        >
          ♫
        </motion.span>
      </div>
    </div>
  );
}

export default function Home() {
  const { promptInstall } = usePWAInstall();

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [featuredMember, setFeaturedMember] = useState<Member | null>(null);
  const [clbkTracks, setClbkTracks] = useState<MusicItem[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [regularBanners, setRegularBanners] = useState<HomeBanner[]>([]);
  const [specialBanners, setSpecialBanners] = useState<HomeBanner[]>([]);
  const [regularBannerIndex, setRegularBannerIndex] = useState(0);
  const [specialBannerIndex, setSpecialBannerIndex] = useState(0);
  
  // Master loading state
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchWPData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/homepage?t=${timestamp}`, {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch from WordPress");

        const data = await response.json();

        if (data.settings) setSettings(data.settings);
        if (data.featuredMember) setFeaturedMember(data.featuredMember);
        if (data.musicList) setClbkTracks(data.musicList);

        if (data.banners) {
          const groupedRegular = data.banners
            .filter((banner: HomeBanner) => banner.section === "regular")
            .map((banner: HomeBanner) => ({
              image_url: banner.image_url,
              alt: "Siaran Reguler",
            }));

          const groupedSpecial = data.banners
            .filter((banner: HomeBanner) => banner.section === "special")
            .map((banner: HomeBanner) => ({
              image_url: banner.image_url,
              alt: "Siaran Spesial",
            }));

          setRegularBanners(groupedRegular);
          setSpecialBanners(groupedSpecial);
        }
      } catch (error) {
        console.error("Error fetching WordPress data:", error);
      } finally {
        setPageLoading(false); // Done loading!
      }
    };

    fetchWPData();
  }, []);

  useEffect(() => {
    if (clbkTracks.length > 0 && activeTrackIndex > clbkTracks.length - 1) {
      setActiveTrackIndex(0);
    }
  }, [activeTrackIndex, clbkTracks.length]);

  useEffect(() => {
    if (regularBanners.length > 0 && regularBannerIndex > regularBanners.length - 1) {
      setRegularBannerIndex(0);
    }
  }, [regularBannerIndex, regularBanners.length]);

  useEffect(() => {
    if (specialBanners.length > 0 && specialBannerIndex > specialBanners.length - 1) {
      setSpecialBannerIndex(0);
    }
  }, [specialBannerIndex, specialBanners.length]);

  const activeTrack = clbkTracks[activeTrackIndex] || null;

  const goToNextTrack = () => {
    if (clbkTracks.length > 0) {
      setActiveTrackIndex((prev) => (prev + 1) % clbkTracks.length);
    }
  };

  const goToPreviousRegularBanner = () => {
    if (regularBanners.length === 0) return;
    setRegularBannerIndex((prev) => (prev - 1 + regularBanners.length) % regularBanners.length);
  };

  const goToNextRegularBanner = () => {
    if (regularBanners.length === 0) return;
    setRegularBannerIndex((prev) => (prev + 1) % regularBanners.length);
  };

  const goToPreviousSpecialBanner = () => {
    if (specialBanners.length === 0) return;
    setSpecialBannerIndex((prev) => (prev - 1 + specialBanners.length) % specialBanners.length);
  };

  const goToNextSpecialBanner = () => {
    if (specialBanners.length === 0) return;
    setSpecialBannerIndex((prev) => (prev + 1) % specialBanners.length);
  };

  return (
    <div className="bg-[#0a0a0a] overflow-x-hidden min-h-screen text-white font-sans">
      {/* Hero Section */}
      <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/background-1770059086147.png"
            alt="Background"
            fill
            className="object-cover opacity-25 blur-[1px] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(178,30,53,0.55),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(10,10,10,0.78)_60%,#0a0a0a_100%)]" />
        </div>

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute left-0 top-10 h-[70%] w-[55%] rounded-full bg-[#B21E35]/20 blur-3xl pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 hidden h-[42%] pointer-events-none opacity-95 md:block">
          <svg viewBox="0 0 1440 420" className="h-full w-full" preserveAspectRatio="none">
            <path d="M-40 120 C 220 40, 330 290, 560 220 C 720 170, 790 30, 1010 84 C 1185 128, 1270 262, 1480 210" fill="none" stroke="#B21E35" strokeWidth="20" strokeLinecap="round" />
            <path d="M-40 170 C 210 95, 360 320, 570 260 C 735 214, 810 92, 1015 136 C 1200 175, 1285 300, 1480 255" fill="none" stroke="#ef3858" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[34%] pointer-events-none opacity-95 md:hidden">
          <svg viewBox="0 0 390 180" className="h-full w-full" preserveAspectRatio="none">
            <path d="M-20 74 C 40 40, 78 122, 122 98 C 155 80, 170 30, 212 42 C 252 54, 278 108, 324 96 C 352 88, 372 64, 408 70" fill="none" stroke="#B21E35" strokeWidth="12" strokeLinecap="round" />
            <path d="M-20 96 C 42 62, 84 140, 128 116 C 160 98, 178 52, 218 64 C 258 76, 284 126, 330 116 C 356 110, 374 92, 408 98" fill="none" stroke="#f08a9a" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="pointer-events-none absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 md:block md:w-[52vw] lg:w-[46vw]">
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-start"
          >
            <div className="relative z-10 ml-0 mt-[-32px] w-[66vw] max-w-[250px] aspect-[4/5] sm:mt-[-12px] sm:max-w-[320px] md:mt-0 md:w-full md:max-w-[620px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/mic2-1770060113358.png"
                alt="Mic"
                fill
                className="object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
                priority
              />
            </div>
          </motion.div>
        </div>

        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-16 md:items-start md:px-12 md:pb-28 md:pt-20">
          <div className="grid w-full items-start justify-items-center gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:justify-items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative order-2 z-10 mt-0 w-full self-center md:order-2 md:mt-0 md:self-auto md:-translate-y-10 lg:-translate-y-14 md:col-start-2"
            >
              <div className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-white/10 bg-black/25 px-5 py-7 shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6 md:max-w-none md:rounded-[34px] md:px-10 md:py-14">
                <div className="relative text-center md:text-right">
                  <div className="mb-4 flex justify-center md:mb-6 md:justify-end">
                    <RadioVibeStrip />
                  </div>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/75 sm:text-sm sm:tracking-[0.5em] md:mb-4">
                    Radio PPI Dunia
                  </p>
                  
                  {/* Hero Title Loading State */}
                  {pageLoading ? (
                    <div className="flex justify-center md:justify-end py-4">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <h1 className="font-display text-3xl font-black leading-[0.92] tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] sm:text-4xl md:text-6xl lg:text-7xl">
                      <span className="block">{settings.hero_title_1 || "Suara Anak Bangsa"}</span>
                      <span className="mt-2 block">{settings.hero_title_2 || "Satu Cinta"}</span>
                      <span className="mt-2 block">{settings.hero_title_3 || "Satu Indonesia"}</span>
                    </h1>
                  )}

                  <div className="mt-6 flex flex-col items-center gap-4 md:mt-8 md:items-end">
                    <Button
                      onClick={promptInstall}
                      size="lg"
                      className="rounded-full bg-[#B21E35] px-6 py-3 text-xs font-black text-white shadow-[0_14px_40px_rgba(178,30,53,0.45)] transition-transform hover:scale-105 hover:bg-[#8B0000] sm:px-7 sm:py-4 sm:text-sm md:px-10 md:py-6 md:text-lg"
                    >
                      Download Now !
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Program Icons Section */}
      <section className="relative py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                whileInView={{ width: 100 + i * 40 }}
                viewport={{ once: true }}
                className="border-t-[3px] border-[#B21E35] rounded-[100%]"
                style={{ height: `${20 + i * 8}px`, marginTop: i === 1 ? 0 : "-10px" }}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#B21E35] rounded-[40px] md:rounded-[60px] p-6 md:p-10 flex items-center justify-around w-full max-w-2xl shadow-2xl"
          >
            <NavItem icon={<Calendar className="w-8 h-8 md:w-12 md:h-12" />} label="PROGRAM" href="/program" />
            <NavItem icon={<SlidersHorizontal className="w-8 h-8 md:w-12 md:h-12" />} label="HUT RPD" href="/hut-rpd" />
            <NavItem icon={<Mic2 className="w-8 h-8 md:w-12 md:h-12" />} label="PODCAST" href="/podcast" />
          </motion.div>
        </div>
      </section>

      {/* 24 Jam Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center py-20 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <path d="M-100,400 Q100,300 200,200 T500,100 T800,50" fill="none" stroke="#B21E35" strokeWidth="2" />
            <path d="M-100,420 Q120,320 220,220 T520,120 T820,70" fill="none" stroke="#B21E35" strokeWidth="2" />
            <path d="M-100,440 Q140,340 240,240 T540,140 T840,90" fill="none" stroke="#B21E35" strokeWidth="2" />
          </svg>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-white text-xl md:text-3xl font-bold text-center italic max-w-4xl px-4"
        >
          {pageLoading ? (
            <span className="animate-pulse">Mengambil informasi siaran...</span>
          ) : (
            settings.description_24h || "24 jam mengudara dengan berbagai program menarik, inovatif, dan informatif"
          )}
        </motion.h2>
      </section>

      {/* What is on Section */}
      <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-white text-5xl md:text-7xl font-black italic uppercase leading-[0.8]">
                What is on <br />
                <span className="text-[#B21E35]">RADIO PPI DUNIA</span>
                <span className="text-white"> ?</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left md:text-right"
            >
              {pageLoading ? (
                <div className="flex flex-col items-start md:items-end gap-3 mt-4">
                  <div className="w-8 h-8 border-4 border-[#B21E35]/30 border-t-[#B21E35] rounded-full animate-spin" />
                  <span className="text-[#B21E35] text-sm italic font-bold">Memuat info...</span>
                </div>
              ) : (
                <>
                  <p className="text-[#B21E35] italic text-lg md:text-xl font-medium">
                    {settings.what_is_on_tagline ? (
                      settings.what_is_on_tagline.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))
                    ) : (
                      <>
                        "Melangkah Menuju Awal Baru<br />
                        bersama Radio PPI Dunia"
                      </>
                    )}
                  </p>
                  <span className="text-white font-black text-2xl md:text-4xl mt-4 block">
                    -{settings.what_is_on_date || "December 2025"}-
                  </span>
                </>
              )}
            </motion.div>
          </div>

          <div className="relative h-[650px] md:h-[600px] mt-8 md:mt-12">
            {/* Siaran Reguler – on top */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true }}
              className="absolute left-0 top-0 bg-white rounded-[32px] md:rounded-[50px] p-6 md:p-10 w-full md:w-[65%] h-[280px] md:h-[450px] shadow-2xl flex items-center z-20 overflow-hidden hover:-translate-y-4 hover:z-50 transition-transform duration-300 cursor-pointer"
            >
              {pageLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#B21E35]/20 border-t-[#B21E35] rounded-full animate-spin" />
                  <span className="text-[#B21E35] font-black uppercase text-xs">Memuat Program...</span>
                </div>
              ) : (
                <>
                  {regularBanners.length > 0 && (
                    <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="relative aspect-square w-[34vw] max-w-[280px] overflow-hidden rounded-[20px] md:rounded-[32px]">
                        <Image
                          src={regularBanners[regularBannerIndex]?.image_url}
                          alt={regularBanners[regularBannerIndex]?.alt || "Siaran Reguler"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 flex h-full w-full flex-col justify-between md:justify-between">
                    <div className="flex items-start justify-between gap-2 md:gap-4 mt-auto md:mt-0">
                      <div className="max-w-[55%] md:max-w-[52%]">
                        <h3 className="text-[#B21E35] text-2xl sm:text-3xl md:text-6xl font-black leading-tight">
                          SIARAN REGULER
                        </h3>
                        <p className="mt-2 text-[11px] sm:text-xs md:text-base text-black/70 line-clamp-3 md:line-clamp-none">
                          Program siaran rutin yang menemani pendengar setiap hari dengan berita, musik, dan obrolan ringan.
                        </p>
                      </div>
                      {regularBanners.length > 0 && (
                        <div className="flex flex-col items-end gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-black/35">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span>{String(regularBannerIndex + 1).padStart(2, "0")}</span>
                            <span className="h-px w-6 md:w-8 bg-black/15" />
                            <span>{String(regularBanners.length).padStart(2, "0")}</span>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3">
                            <button
                              type="button"
                              onClick={goToPreviousRegularBanner}
                              className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-[#B21E35]/15 bg-white text-[#B21E35] shadow transition-transform hover:scale-105 hover:bg-[#B21E35] hover:text-white pointer-events-auto"
                            >
                              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={goToNextRegularBanner}
                              className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-[#B21E35]/15 bg-white text-[#B21E35] shadow transition-transform hover:scale-105 hover:bg-[#B21E35] hover:text-white pointer-events-auto"
                            >
                              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Siaran Spesial – behind */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 2 }}
              viewport={{ once: true }}
              className="absolute right-0 top-[260px] md:top-[150px] bg-[#B21E35] rounded-[32px] md:rounded-[50px] px-6 pb-6 pt-10 md:p-10 w-full md:w-[60%] h-[300px] md:h-[450px] shadow-2xl flex items-end justify-center z-10 overflow-hidden hover:-translate-y-4 hover:z-50 transition-transform duration-300 cursor-pointer"
            >
              {pageLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {specialBanners.length > 0 && (
                    <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none mt-2 md:mt-0">
                      <div className="relative aspect-square w-[34vw] max-w-[280px] overflow-hidden rounded-[20px] md:rounded-[32px]">
                        <Image
                          src={specialBanners[specialBannerIndex]?.image_url}
                          alt={specialBanners[specialBannerIndex]?.alt || "Siaran Spesial"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 flex h-full w-full flex-col justify-end md:justify-between text-white pb-2 md:pb-0">
                    <div className="flex items-start justify-between gap-2 md:gap-4 mt-auto md:mt-0">
                      <div className="max-w-[55%] md:max-w-[52%]">
                        <h3 className="text-white text-2xl sm:text-3xl md:text-6xl font-black leading-tight">
                          SIARAN SPESIAL
                        </h3>
                        <p className="mt-2 text-[11px] sm:text-xs md:text-base text-white/80 line-clamp-3 md:line-clamp-none">
                          Segmen istimewa dengan topik-tema khusus, kolaborasi, dan tamu spesial yang menghadirkan perspektif berbeda.
                        </p>
                      </div>
                      {specialBanners.length > 0 && (
                        <div className="flex flex-col items-end gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-white/60">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span>{String(specialBannerIndex + 1).padStart(2, "0")}</span>
                            <span className="h-px w-6 md:w-8 bg-white/20" />
                            <span>{String(specialBanners.length).padStart(2, "0")}</span>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3">
                            <button
                              type="button"
                              onClick={goToPreviousSpecialBanner}
                              className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow transition-transform hover:scale-105 hover:bg-white hover:text-[#B21E35] pointer-events-auto"
                            >
                              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={goToNextSpecialBanner}
                              className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow transition-transform hover:scale-105 hover:bg-white hover:text-[#B21E35] pointer-events-auto"
                            >
                              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Interactive "Know more about us" Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 md:bottom-[-20px] z-30"
            >
              <Link href="/about">
                <Button className="bg-white text-[#B21E35] hover:bg-gray-100 rounded-full px-12 md:px-16 py-8 md:py-10 text-2xl md:text-4xl font-black italic shadow-2xl transition-transform hover:scale-110 border-[6px] md:border-8 border-[#0a0a0a]">
                  Know more<br />about us !
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sobat Siar of The Month Section */}
      <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-[#B21E35] text-5xl md:text-8xl font-black italic mb-16 leading-none">
              Sobat Siar of<br />The Month
            </h2>

            {pageLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 border-4 border-[#B21E35]/30 border-t-[#B21E35] rounded-full animate-spin" />
              </div>
            ) : featuredMember ? (
              <>
                <div className="relative group">
                  <div className="w-64 h-64 md:w-96 md:h-96 bg-[#B21E35] rounded-full overflow-hidden border-[12px] border-white/5 shadow-2xl relative z-10">
                    <Image
                      src={featuredMember.image_url}
                      alt={featuredMember.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-0 -left-8 md:-left-12 w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center border-4 md:border-8 border-[#B21E35] shadow-2xl rotate-[-15deg] z-20">
                    <span className="text-[#B21E35] font-black text-[10px] md:text-sm uppercase">
                      Sobat Siar
                    </span>
                    <span className="text-[#B21E35] font-black text-4xl md:text-6xl">#1</span>
                  </div>
                </div>

                <div className="mt-12 space-y-6">
                  <h3 className="text-[#B21E35] text-4xl md:text-6xl font-black italic">
                    {featuredMember.name}{featuredMember.country ? ` - ${featuredMember.country}` : ""}
                  </h3>
                  <div className="inline-block px-10 py-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-white font-bold text-2xl md:text-4xl italic">
                      "{featuredMember.quote}"
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-white/40 italic">Belum ada Sobat Siar of The Month</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CLBK Section */}
      <section className="relative pt-8 pb-28 px-4 md:px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-24 left-0 right-0 h-64 bg-gradient-to-t from-[#B21E35]/60 to-transparent" />
          <svg className="hidden md:block absolute top-8 right-0 w-[420px] h-[220px] text-[#B21E35]/60" viewBox="0 0 420 220" preserveAspectRatio="none">
            <path d="M10,200 C120,120 220,180 420,40" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10,215 C130,140 240,200 420,70" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="md:hidden absolute top-0 left-0 w-full h-56 text-[#B21E35]/50" viewBox="0 0 360 224" preserveAspectRatio="none">
            <path d="M0,140 C70,90 130,160 360,40" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M0,160 C90,110 160,180 360,60" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col items-center md:items-end mb-6 md:mb-8 pr-1 md:pr-4">
            <h2 className="text-[#C3124A] text-3xl md:text-6xl font-black leading-none text-center md:text-right" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Chart Lagu Baru terKini!
            </h2>
            <span className="mt-2 md:mt-3 bg-white text-[#B21E35] rounded-full px-4 md:px-7 py-1 md:py-2 text-xs md:text-2xl font-black" style={{ fontFamily: "Fredoka, sans-serif" }}>
              versi Radio PPI Dunia
            </span>
          </div>

          <div className="relative bg-[#E7E7E7] rounded-[24px] md:rounded-[28px] p-5 md:p-8 min-h-[520px] md:min-h-[560px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col">
            {pageLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 border-4 border-[#B21E35]/30 border-t-[#B21E35] rounded-full animate-spin" />
                 <p className="mt-4 text-[#B21E35] font-black tracking-widest text-sm">MEMUAT CHART...</p>
              </div>
            ) : clbkTracks.length > 0 ? (
              <>
                <div className="grid grid-cols-[72px_1fr] md:grid-cols-[84px_1fr] gap-4 md:gap-8 flex-1">
                  <div className="overflow-y-auto max-h-[430px] md:max-h-[460px] pr-1 space-y-2 md:space-y-3">
                    {clbkTracks.map((track, index) => {
                      const isActive = index === activeTrackIndex;
                      return (
                        <button
                          key={track.id}
                          onClick={() => setActiveTrackIndex(index)}
                          className={`w-full text-left rounded-xl md:rounded-2xl overflow-hidden transition-all border ${
                            isActive ? "border-[#B21E35] bg-[#B21E35]" : "border-transparent bg-[#B21E35]/95 hover:bg-[#A51A31]"
                          }`}
                          aria-label={`CLBK ${index + 1}: ${track.title}`}
                        >
                          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-[#B21E35] overflow-hidden flex-shrink-0">
                            {track.image_url ? (
                              <Image src={track.image_url} alt={track.title} fill className="object-cover" />
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col justify-between min-h-[430px] md:min-h-[460px]">
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-1 md:px-2">
                      <motion.div
                        key={activeTrack?.id}
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className="w-full flex flex-col items-center"
                      >
                        <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-2xl bg-[#B21E35] overflow-hidden shadow-2xl">
                          {activeTrack?.image_url ? (
                            <Image src={activeTrack.image_url} alt={activeTrack.title} fill className="object-cover" />
                          ) : null}
                        </div>
                        <p className="mt-6 text-[#B21E35] text-xl md:text-4xl font-black leading-tight" style={{ fontFamily: "Fredoka, sans-serif" }}>
                          {activeTrack?.title}
                        </p>
                        <p className="mt-2 text-[#5A5A5A] text-sm md:text-xl font-semibold">
                          {activeTrack?.artist || "Unknown Artist"}
                        </p>
                      </motion.div>
                    </div>

                    <div className="flex items-end justify-end pt-4">
                      <button
                        onClick={goToNextTrack}
                        className="text-[#B21E35] text-2xl md:text-4xl font-black hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "Fredoka, sans-serif" }}
                      >
                        NEXT &gt;&gt;&gt;
                      </button>
                    </div>
                  </div>
                </div>

                {activeTrack?.spotify_url ? (
                  <a
                    href={activeTrack.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute -left-2 md:-left-36 bottom-[-18px] md:bottom-8 bg-[#B21E35] hover:bg-[#8B0000] rounded-2xl md:rounded-r-[22px] md:rounded-l-none px-6 md:px-14 py-4 md:py-7 text-white font-black text-lg md:text-4xl shadow-2xl transition-all"
                    style={{ fontFamily: "Fredoka, sans-serif" }}
                  >
                    Listen on Spotify
                  </a>
                ) : (
                  <div
                    className="absolute -left-2 md:-left-36 bottom-[-18px] md:bottom-8 bg-[#B21E35] rounded-2xl md:rounded-r-[22px] md:rounded-l-none px-6 md:px-14 py-4 md:py-7 text-white/80 font-black text-lg md:text-4xl shadow-2xl"
                    style={{ fontFamily: "Fredoka, sans-serif" }}
                  >
                    Listen on Spotify
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <p className="text-gray-500 font-bold italic">Belum ada daftar lagu CLBK bulan ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Where to Find Us Section */}
      <section className="relative py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[60px] p-12 md:p-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B21E35]/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <h3 className="text-[#B21E35] text-4xl md:text-5xl font-black text-center mb-16 italic tracking-tight uppercase">
              Where to find us
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <SocialItem icon="FB" count="12.4K" label="Fans" />
              <SocialItem icon="IG" count="20.3K" label="Followers" />
              <SocialItem icon="X" count="9.7K" label="Followers" />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 pt-12 border-t-2 border-gray-100">
              <span className="text-[#B21E35] font-black text-xl uppercase tracking-widest">
                Collab with us !
              </span>
              <Button className="bg-[#B21E35] hover:bg-[#8B0000] text-white rounded-full px-16 py-8 text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-5">
                <div className="relative w-56 h-16">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/logorpd-1770132929601.png?width=8000&height=8000&resize=contain"
                    alt="Radio PPI Dunia Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
              <p className="text-gray-500 text-base font-medium leading-relaxed max-w-md">
                Suara Anak Bangsa, Satu Cinta, Satu Indonesia. Mengudara 24 jam untuk
                menghubungkan mahasiswa Indonesia di seluruh dunia.
              </p>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">
                Navigation
              </h4>
              <ul className="space-y-3 text-gray-400 font-bold text-sm">
                <li><Link href="/" className="hover:text-[#B21E35] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#B21E35] transition-colors">About Us</Link></li>
                <li><Link href="/program" className="hover:text-[#B21E35] transition-colors">Program</Link></li>
                <li><Link href="/podcast" className="hover:text-[#B21E35] transition-colors">Podcast</Link></li>
                <li><Link href="/faq" className="hover:text-[#B21E35] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">
                Support
              </h4>
              <ul className="space-y-3 text-gray-400 font-bold text-sm">
                <li>
                  <a href="https://mail.google.com/mail/u/0/?fs=1&to=sales.radioppid@gmail.com&su=PERMOHONAN+PARTNERSHIP&body=Isi+pesan&tf=cm" target="_blank" rel="noopener noreferrer" className="hover:text-[#B21E35] transition-colors cursor-pointer">
                    Partnership
                  </a>
                </li>
                <li>
                  <a href="https://radioppidunia.org/gabung/" target="_blank" rel="noopener noreferrer" className="hover:text-[#B21E35] transition-colors cursor-pointer">
                    Join Us
                  </a>
                </li>
                <li>
                  <a href="https://mail.google.com/mail/u/0/?fs=1&to=publicrelations.rpd@gmail.com&su=PERMOHONAN+MEDIA+PARTNER&body=Isi+pesan&tf=cm" target="_blank" rel="noopener noreferrer" className="hover:text-[#B21E35] transition-colors cursor-pointer">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">
                Social
              </h4>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/radioppidunia?igsh=NGpkdmJtNmw4b3Yx" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .6 1.4 1.1.4.5.6 1.2.7 2 .1 1.1.1 1.5.1 4.1s0 3-.1 4.1c-.1 1.1-.3 1.9-.7 2.4-.4.5-.8.9-1.4 1.1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.6-1.4-1.1-.4-.5-.6-1.2-.7-2-.1-1.1-.1-1.5-.1-4.1s0-3 .1-4.1c.1-1.1.3-1.9.7-2.4.4-.5.8-.9 1.4-1.1.5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 2.2c-3 0-3.4 0-4.5.1-1.1.1-1.7.2-2.1.4-.5.2-.9.5-1.3 1-.4.4-.7.8-.9 1.3-.2.4-.3 1-.4 2.1C3 10.6 3 11 3 12s0 1.4.1 2.9c.1 1.1.2 1.7.4 2.1.2.5.5.9 1 1.3.4.4.8.7 1.3.9.4.2 1 .3 2.1.4 1.1.1 1.5.1 4.1.1s3 0 4.1-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.5 1.3-1 .4-.4.7-.8.9-1.3.2-.4.3-1 .4-2.1.1-1.1.1-1.5.1-4.1s0-3-.1-4.1c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-1-1.3-.4-.4-.8-.7-1.3-.9-.4-.2-1-.3-2.1-.4C15.4 4.4 15 4.4 12 4.4zm0 3.8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 1.8c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2-1-2.2-2.2-2.2zm4.8-1.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" /></svg>
                </a>
                <a href="https://x.com/_radioppidunia_?s=21" target="_blank" rel="noopener noreferrer" aria-label="X" className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@radioppidunia?_r=1&_t=ZS-976z1ixMawb" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                </a>
                <a href="https://www.youtube.com/@radioppidunia" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © 2026 Radio PPI Dunia. Built with Passion for Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// NavItem component
function NavItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="text-white group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-white font-black tracking-[0.3em] text-[10px] md:text-xs opacity-90 group-hover:opacity-100 uppercase">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

// SocialItem component
function SocialItem({
  icon,
  count,
  label,
}: {
  icon: string;
  count: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-16 h-16 bg-[#B21E35] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6">
        <span className="text-white font-black text-xl">{icon}</span>
      </div>
      <div className="text-center">
        <p className="text-[#B21E35] font-black text-3xl leading-none">{count}</p>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
          {label}
        </p>
      </div>
    </div>
  );
}