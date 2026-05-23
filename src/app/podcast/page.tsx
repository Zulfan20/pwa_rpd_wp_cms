"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Podcast } from "@/lib/supabase";

type CategoryKey = 'siaran_special_2025' | 'siaran_special_2024' | 'siaran_special_hut' | 'archived_2024';

const sidebarCategories: { key: CategoryKey; label: string }[] = [
  { key: 'siaran_special_2025', label: 'Siaran Special 2025' },
  { key: 'siaran_special_2024', label: 'Siaran Special 2024' },
  { key: 'siaran_special_hut', label: 'Siaran Special HUT & Drama' },
  { key: 'archived_2024', label: 'Archieved Podcast 2024' },
];

// Play button component - white triangle
function PlayButton({ onClick, isPlaying }: { onClick: () => void; isPlaying: boolean }) {
  return (
    <button 
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0"
    >
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

// Track item component matching reference design
function TrackItem({ 
  track, 
  onPlay, 
  isPlaying 
}: { 
  track: Podcast; 
  onPlay: () => void; 
  isPlaying: boolean;
}) {
  const displayTitle = track.title;
  const displaySubtitle = track.subtitle || "";
  
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-[#a01a30]/40 hover:bg-[#a01a30]/30 transition-colors ${isPlaying ? 'bg-[#a01a30]/40' : ''}`}>
      <PlayButton onClick={onPlay} isPlaying={isPlaying} />
      <div className="flex-1 min-w-0">
        <p className="text-[#8B1538] font-bold italic text-sm leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {displayTitle}
        </p>
        {displaySubtitle && (
          <p className="text-[#8B1538]/70 font-semibold italic text-xs" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {displaySubtitle}
          </p>
        )}
      </div>
      <span className="text-white font-black text-sm whitespace-nowrap tracking-wide" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        {track.duration || "00:00:00"}
      </span>
    </div>
  );
}

// Sidebar component matching reference design
function Sidebar({ 
  activeCategory, 
  onCategoryChange 
}: { 
  activeCategory: CategoryKey; 
  onCategoryChange: (key: CategoryKey) => void;
}) {
  return (
    <aside className="w-64 bg-[#1a1a1a] p-6 flex-shrink-0 hidden lg:block min-h-[600px]">
      <h2 
        className="text-2xl font-black italic text-white/50 mb-8"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
      >
        Siaran Special
      </h2>
      <nav className="space-y-1">
        {sidebarCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`w-full text-left px-4 py-3 transition-all font-medium italic text-sm flex items-center gap-3 ${
              activeCategory === cat.key 
                ? 'text-white' 
                : 'text-white/40 hover:text-white/70'
            }`}
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            {/* Left indicator line */}
            <span className={`w-6 h-[2px] transition-all ${
              activeCategory === cat.key ? 'bg-white' : 'bg-white/30'
            }`} />
            {cat.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function PodcastPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('siaran_special_2025');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    const { data } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false });
    setPodcasts(data || []);
    setLoading(false);
  };

  const handlePlay = (trackId: string, audioUrl: string | null) => {
    if (!audioUrl) {
      alert("Audio belum tersedia untuk podcast ini");
      return;
    }
    
    if (playingTrack === trackId) {
      setPlayingTrack(null);
      audioRef.current?.pause();
    } else {
      setPlayingTrack(trackId);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          alert("Gagal memutar audio");
        });
      }
    }
  };

  // Filter podcasts by category - handle multiple possible category formats
  const filterByCategory = (categoryMatch: string[]) => {
    return podcasts.filter(p => 
      categoryMatch.some(cat => 
        p.category?.toLowerCase().includes(cat.toLowerCase())
      )
    );
  };

  // Get podcasts for selected sidebar category
  const getSelectedCategoryPodcasts = () => {
    switch (activeCategory) {
      case 'siaran_special_2025':
        return filterByCategory(['2025', 'siaran_special_2025']);
      case 'siaran_special_2024':
        return filterByCategory(['2024']).filter(p => !p.category?.toLowerCase().includes('archived'));
      case 'siaran_special_hut':
        return filterByCategory(['hut', 'drama']);
      case 'archived_2024':
        return filterByCategory(['archived', 'archieve']);
      default:
        return [];
    }
  };

  const siaran2025 = filterByCategory(['2025', 'siaran_special_2025']);
  const siaran2024 = filterByCategory(['2024']).filter(p => !p.category?.toLowerCase().includes('archived'));
  const siaranHUT = filterByCategory(['hut', 'drama']);
  const archived = filterByCategory(['archived', 'archieve']);

  const selectedPodcasts = getSelectedCategoryPodcasts();

  return (
    <div className="min-h-screen text-white flex" style={{
      background: 'linear-gradient(180deg, #4a1520 0%, #3d1018 30%, #2d0a10 60%, #1a0608 100%)'
    }}>
      {/* Fixed Sidebar on the left */}
      <Sidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Section 1 - PODCAST Header */}
        <section className="pt-24 pb-8 relative">
          {/* PODCAST Title with lines */}
          <div className="flex items-center justify-end gap-4 pr-8 md:pr-16 mb-8">
            <div className="h-[3px] flex-1 max-w-[300px] bg-gradient-to-r from-transparent to-white/60" />
            <h1 
              className="text-4xl md:text-6xl font-black italic text-white px-6 py-3 rounded-2xl"
              style={{ 
                fontFamily: 'Fredoka, sans-serif',
                backgroundColor: '#C41E3A',
                letterSpacing: '0.08em',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              PODCAST
            </h1>
          </div>

          {/* Siaran Special 2025 Section */}
          <div className="px-6 md:px-12 lg:px-16">
            <h2 
              className="text-2xl md:text-4xl font-black italic text-white mb-6"
              style={{ 
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {sidebarCategories.find(c => c.key === activeCategory)?.label || 'Siaran Special 2025'}
            </h2>

            {/* Playlist Card - Matching reference design */}
            <div 
              className="rounded-[30px] overflow-hidden border-[4px] border-[#C41E3A]"
              style={{
                background: 'linear-gradient(135deg, #C41E3A 0%, #B91638 100%)'
              }}
            >
              {/* Top pink/light header bar */}
              <div 
                className="h-14 rounded-t-[26px]"
                style={{
                  background: 'linear-gradient(135deg, #f5c6cb 0%, #f8d7da 50%, #e8b4b8 100%)'
                }}
              />
              
              {/* Track list */}
              <div className="max-h-[420px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : selectedPodcasts.length > 0 ? (
                  selectedPodcasts.map((track, index) => (
                    <TrackItem 
                      key={track.id || index}
                      track={track} 
                      onPlay={() => handlePlay(track.id, track.audio_url)}
                      isPlaying={playingTrack === track.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-white/60 italic">
                    Belum ada podcast di kategori ini
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Siaran Special HUT & Drama */}
        <section id="hut-rpd" className="py-12 px-6 md:px-12 lg:px-16 scroll-mt-24">
          <h2 
            className="text-2xl md:text-4xl font-black italic text-white mb-8"
            style={{ 
              fontFamily: 'Fredoka, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Siaran Special HUT & Drama
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video/Image placeholder - dark area */}
            <div className="w-full lg:w-[45%] aspect-[4/5] bg-black/80 rounded-3xl overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" className="w-24 h-24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Playlist with tabs */}
            <div className="flex-1">
              <div 
                className="rounded-[30px] overflow-hidden border-[4px] border-[#C41E3A]"
                style={{
                  background: 'linear-gradient(135deg, #C41E3A 0%, #B91638 100%)'
                }}
              >
                {/* Tab header */}
                <div className="bg-white py-4 px-6 flex items-center gap-4">
                  <span 
                    className="font-black italic text-[#B91638] text-lg border-b-3 border-[#B91638] pb-1"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    Siaran Special HUT Ke-15
                  </span>
                  <span className="text-gray-300">|</span>
                  <span 
                    className="font-semibold italic text-gray-400 text-lg"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    KIZ KULESI
                  </span>
                </div>

                {/* Track list */}
                <div className="max-h-[400px] overflow-y-auto">
                  {siaranHUT.length > 0 ? (
                    siaranHUT.map((track) => (
                      <TrackItem 
                        key={track.id}
                        track={track} 
                        onPlay={() => handlePlay(track.id, track.audio_url)}
                        isPlaying={playingTrack === track.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-white/60 italic">
                      Belum ada podcast di kategori ini
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Background with red curved lines */}
        <section className="py-12 relative overflow-hidden">
          {/* Red curved lines background */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.7
            }}
          />

          <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
            {/* Siaran Special 2024 */}
            <h2 
              className="text-2xl md:text-4xl font-black italic text-white mb-6"
              style={{ 
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Siaran Special 2024
            </h2>

            <div 
              className="rounded-[30px] overflow-hidden border-[4px] border-[#C41E3A] mb-16"
              style={{
                background: 'linear-gradient(135deg, #C41E3A 0%, #B91638 100%)'
              }}
            >
              <div 
                className="h-12 rounded-t-[26px]"
                style={{
                  background: 'linear-gradient(135deg, #f5c6cb 0%, #f8d7da 50%, #e8b4b8 100%)'
                }}
              />
              
              <div className="max-h-[250px] overflow-y-auto">
                {siaran2024.length > 0 ? (
                  siaran2024.map((track) => (
                    <TrackItem 
                      key={track.id}
                      track={track} 
                      onPlay={() => handlePlay(track.id, track.audio_url)}
                      isPlaying={playingTrack === track.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-white/60 italic">
                    Belum ada podcast
                  </div>
                )}
              </div>
            </div>

            {/* Archived Podcast 2024 */}
            <h2 
              className="text-2xl md:text-4xl font-black italic text-white mb-6"
              style={{ 
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Archieved Podcast 2024
            </h2>

            <div 
              className="rounded-[30px] overflow-hidden border-[4px] border-[#C41E3A]"
              style={{
                background: 'linear-gradient(135deg, #C41E3A 0%, #B91638 100%)'
              }}
            >
              <div 
                className="h-12 rounded-t-[26px]"
                style={{
                  background: 'linear-gradient(135deg, #f5c6cb 0%, #f8d7da 50%, #e8b4b8 100%)'
                }}
              />
              
              <div className="max-h-[350px] overflow-y-auto">
                {archived.length > 0 ? (
                  archived.map((track) => (
                    <TrackItem 
                      key={track.id}
                      track={track} 
                      onPlay={() => handlePlay(track.id, track.audio_url)}
                      isPlaying={playingTrack === track.id}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-white/60 italic">
                    Belum ada podcast
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#B21E35] rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">RPD</span>
                  </div>
                  <p className="text-black font-black text-2xl uppercase tracking-tighter">radio<span className="text-[#B21E35]">ppi</span>dunia</p>
                </div>
                <p className="text-gray-500 text-base font-medium leading-relaxed max-w-md">
                  Suara Anak Bangsa, Satu Cinta, Satu Indonesia. 
                  Mengudara 24 jam untuk menghubungkan mahasiswa Indonesia di seluruh dunia.
                </p>
              </div>

              <div>
                <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">Navigation</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li><Link href="/" className="hover:text-[#B21E35] transition-colors">Home</Link></li>
                  <li><Link href="/about" className="hover:text-[#B21E35] transition-colors">About Us</Link></li>
                  <li><Link href="/program" className="hover:text-[#B21E35] transition-colors">Program</Link></li>
                  <li><Link href="/podcast" className="hover:text-[#B21E35] transition-colors">Podcast</Link></li>
                  <li><Link href="/faq" className="hover:text-[#B21E35] transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">Support</h4>
                <ul className="space-y-3 text-gray-400 font-bold text-sm">
                  <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Partnership</li>
                  <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Join Us</li>
                  <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Contact</li>
                </ul>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">Social</h4>
                <div className="flex gap-3">
                  {['FB', 'IG', 'X', 'YT'].map((social, i) => (
                    <div key={i} className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                      <span className="text-xs text-gray-400 font-bold group-hover:text-white">{social}</span>
                    </div>
                  ))}
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

      {/* Hidden audio element for playback */}
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
