"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronUp, 
  Headphones, 
  X, 
  Play, 
  Pause,
  SkipBack, 
  SkipForward, 
  Airplay,
  ChevronDown,
  SlidersHorizontal,
  Cookie,
  Mic2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteSetting, Member } from "@/lib/supabase";

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
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        alert("To install: Tap the Share button and select 'Add to Home Screen'");
      } else {
        alert("To install: Open your browser menu and select 'Install app' or 'Add to Home screen'");
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

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { promptInstall } = usePWAInstall();
  
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [featuredMember, setFeaturedMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchCMSData = async () => {
      const [settingsRes, memberRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("members").select("*").eq("is_featured", true).eq("is_active", true).limit(1).single(),
      ]);
      
      if (settingsRes.data) {
        const settingsMap: Record<string, string> = {};
        settingsRes.data.forEach((s: SiteSetting) => {
          settingsMap[s.key] = s.value || "";
        });
        setSettings(settingsMap);
      }
      if (memberRes.data) setFeaturedMember(memberRes.data);
    };
    fetchCMSData();
  }, []);

  useEffect(() => {
    const streamUrl = "/api/stream";
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
      audioRef.current.preload = "none";
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: any) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      if (audio) {
        audio.load();
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
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

  return (
    <div className="bg-[#0a0a0a] overflow-x-hidden min-h-screen text-white font-sans">
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/background-1770059086147.png"
            alt="Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        {/* Faded Background Logo (Mobile) */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="relative w-[150%] aspect-square md:w-[80%]">
             <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/logored-1770059969988.png" 
                alt="Logo Background" 
                fill 
                className="object-contain"
             />
          </div>
        </div>

        {/* Vector Curves */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] z-10 pointer-events-none opacity-80">
          <Image 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/Vector-11-1770059086139.png"
            alt="Curves"
            fill
            className="object-cover object-bottom"
          />
        </div>

        <div className="container relative z-20 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 pt-16 md:pt-20">
          {/* Mic Asset */}
            <motion.div 
              initial={{ opacity: 0, x: -100, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full md:w-1/2 h-40 md:h-full md:aspect-square max-w-[200px] md:max-w-[400px] order-1 md:order-1"
            >
              <div className="absolute top-0 left-0 md:relative md:top-auto md:right-auto w-40 md:w-full h-40 md:h-full">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/mic2-1770060113358.png"
                  alt="Mic"
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  priority
                />
              </div>
            </motion.div>

          {/* Text Content */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4 md:gap-6 w-full md:w-1/2 order-2 md:order-2">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1 md:space-y-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight text-white drop-shadow-lg">
                  {settings.hero_title_1 || "Suara Anak Bangsa"}
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white drop-shadow-md">
                  {settings.hero_title_2 || "Satu Cinta"}
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white drop-shadow-md">
                  {settings.hero_title_3 || "Satu Indonesia"}
                </h2>
              </motion.div>


            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 md:mt-10 mb-20 md:mb-0"
            >
              <Button 
                onClick={promptInstall}
                size="lg" 
                className="bg-[#B21E35] hover:bg-[#8B0000] text-white px-6 md:px-10 py-4 md:py-6 rounded-full text-sm md:text-xl font-bold transition-all hover:scale-105 shadow-[0_10px_30px_rgba(178,30,53,0.4)]"
              >
                Download Now !
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Listen Now Drawer Button */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <button 
            onClick={() => setIsPlayerOpen(true)}
            className="bg-[#B21E35] hover:bg-[#8B0000] text-white px-10 py-3 rounded-full flex items-center gap-3 shadow-xl transition-all hover:scale-105"
          >
            <span className="font-bold uppercase text-xs md:text-sm tracking-widest">Listen Now</span>
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
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
                style={{ height: `${20 + i * 8}px`, marginTop: i === 1 ? 0 : '-10px' }}
              />
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#B21E35] rounded-[40px] md:rounded-[60px] p-6 md:p-10 flex items-center justify-around w-full max-w-2xl shadow-2xl"
          >
            <NavItem icon={<SlidersHorizontal className="w-8 h-8 md:w-12 md:h-12" />} label="PROGRAM" />
            <NavItem icon={<Cookie className="w-8 h-8 md:w-12 md:h-12" />} label="1SHARASATRA" />
            <NavItem icon={<Mic2 className="w-8 h-8 md:w-12 md:h-12" />} label="PODCAST" />
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
          {settings.description_24h || "24 jam mengudara dengan berbagai program menarik, inovatif, dan informatif"}
        </motion.h2>
      </section>

      {/* What is on Section */}
      <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
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
              <p className="text-[#B21E35] italic text-lg md:text-xl font-medium">
                {settings.what_is_on_tagline ? (
                  settings.what_is_on_tagline.split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
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
            </motion.div>
          </div>

          <div className="relative h-[800px] md:h-[600px] mt-12">
            {/* Cards with 3D overlap */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={{ once: true }}
              className="absolute left-0 top-0 bg-white rounded-[50px] p-12 md:p-16 w-full md:w-[65%] h-[350px] md:h-[450px] shadow-2xl flex items-center z-10"
            >
              <h3 className="text-[#B21E35] text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">SIARAN<br />REGULER</h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true }}
              className="absolute right-0 top-[250px] md:top-[150px] bg-[#B21E35] rounded-[50px] p-12 md:p-16 w-full md:w-[60%] h-[350px] md:h-[450px] shadow-2xl flex items-end justify-center z-20 border-[10px] border-[#0a0a0a]"
            >
              <h3 className="text-white text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-center">SIARAN<br />SPESIAL</h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[-50px] md:bottom-[-20px] z-30"
            >
              <Link href="/about">
                <Button className="bg-white text-[#B21E35] hover:bg-gray-100 rounded-full px-16 py-10 text-3xl md:text-4xl font-black italic shadow-2xl transition-transform hover:scale-110 border-8 border-[#0a0a0a]">
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
            
            <div className="relative group">
              <div className="w-64 h-64 md:w-96 md:h-96 bg-[#B21E35] rounded-full overflow-hidden border-[12px] border-white/5 shadow-2xl relative z-10">
                <Image 
                  src={featuredMember?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"}
                  alt={featuredMember?.name || "Sobat Siar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-0 -left-8 md:-left-12 w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center border-4 md:border-8 border-[#B21E35] shadow-2xl rotate-[-15deg] z-20">
                <span className="text-[#B21E35] font-black text-[10px] md:text-sm uppercase">Sobat Siar</span>
                <span className="text-[#B21E35] font-black text-4xl md:text-6xl">#1</span>
              </div>
            </div>
            
            <div className="mt-12 space-y-6">
              <h3 className="text-[#B21E35] text-4xl md:text-6xl font-black italic">
                {featuredMember ? `${featuredMember.name}${featuredMember.country ? ` - ${featuredMember.country}` : ''}` : "SSK Elang - Libya"}
              </h3>
              <div className="inline-block px-10 py-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                <p className="text-white font-bold text-2xl md:text-4xl italic">"{featuredMember?.quote || "Stay Creative, Stay Productive"}"</p>
              </div>
            </div>
          </motion.div>
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
            
            <h3 className="text-[#B21E35] text-4xl md:text-5xl font-black text-center mb-16 italic tracking-tight uppercase">Where to find us</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <SocialItem icon="FB" count="12.4K" label="Fans" />
              <SocialItem icon="IG" count="20.3K" label="Followers" />
              <SocialItem icon="X" count="9.7K" label="Followers" />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 pt-12 border-t-2 border-gray-100">
              <span className="text-[#B21E35] font-black text-xl uppercase tracking-widest">Collab with us !</span>
              <Button className="bg-[#B21E35] hover:bg-[#8B0000] text-white rounded-full px-16 py-8 text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#B21E35] rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">RPD</span>
                </div>
                <p className="text-black font-black text-2xl uppercase tracking-tighter">radio<span className="text-[#B21E35]">ppi</span>dunia</p>
              </div>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm">
                Suara Anak Bangsa, Satu Cinta, Satu Indonesia. 
                Mengudara 24 jam untuk menghubungkan mahasiswa Indonesia di seluruh dunia.
              </p>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-gray-400 font-bold text-sm">
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Home</li>
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Program</li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-8">Support</h4>
              <ul className="space-y-4 text-gray-400 font-bold text-sm">
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Partnership</li>
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Join Us</li>
              </ul>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-8">Social</h4>
              <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center hover:border-[#B21E35] hover:text-[#B21E35] transition-all cursor-pointer">
                    <span className="text-xs">S{i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © 2026 Radio PPI Dunia. Built with Passion for Indonesia.
            </p>
          </div>
        </div>
      </footer>

      {/* Persistent UI Elements */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#B21E35] backdrop-blur-md text-white py-14 px-4 rounded-l-3xl flex flex-col items-center justify-center gap-4 hover:bg-[#8B0000] shadow-2xl transition-all"
        style={{ right: isChatOpen ? '320px' : '0' }}
      >
        <span className="[writing-mode:vertical-lr] text-xs font-black tracking-[0.4em] uppercase">{isChatOpen ? 'CLOSE' : 'CHATBOX'}</span>
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-1/2 -translate-y-1/2 w-[320px] h-[50vh] max-h-[450px] z-30 bg-[#121212] shadow-2xl rounded-l-3xl overflow-hidden border-l-4 border-[#B21E35]"
          >
            <div className="flex items-center justify-between p-4 bg-[#B21E35]">
              <h3 className="text-white font-black uppercase text-xs tracking-widest">Global Chat</h3>
              <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-white" /></button>
            </div>
            <div className="w-full h-[calc(100%-52px)]"><ChatangoWidget /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4"
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
                  <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-8 h-8 text-[#B21E35] fill-[#B21E35]" /> : <Play className="w-8 h-8 text-[#B21E35] fill-[#B21E35] ml-1" />}
                  </button>
                  <SkipForward className="w-8 h-8 text-black/40 cursor-pointer" />
                </div>
                <div className="hidden md:flex flex-1 items-center gap-6">
                  <div className="flex-1 h-2 bg-black/20 rounded-full relative overflow-hidden">
                    <motion.div animate={isPlaying ? { x: ["-100%", "100%"] } : {}} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-white" />
                  </div>
                  <Airplay className={`w-6 h-6 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="text-white group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-white font-black tracking-[0.3em] text-[10px] md:text-xs opacity-90 group-hover:opacity-100 uppercase">{label}</span>
    </div>
  );
}

function SocialItem({ icon, count, label }: { icon: string, count: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-16 h-16 bg-[#B21E35] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6">
        <span className="text-white font-black text-xl">{icon}</span>
      </div>
      <div className="text-center">
        <p className="text-[#B21E35] font-black text-3xl leading-none">{count}</p>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{label}</p>
      </div>
    </div>
  );
}

function ChatangoWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.id = "chatango-script";
    script.src = "https://st.chatango.com/js/gz/emb.js";
    script.async = true;
    script.style.width = "100%";
    script.style.height = "100%";
    const config = { handle: "radioppiduniachat", arch: "js", styles: { a: "#B21E35", b: 100, c: "FFFFFF", d: "FFFFFF", k: "B21E35", l: "B21E35", m: "B21E35", n: "FFFFFF", q: "B21E35", r: 100, p: 10, cnrs: 0.5, usricon: 1 } };
    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
    return () => { script.remove(); };
  }, []);
  return <div ref={containerRef} className="w-full h-full" />;
}
