"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Member } from "@/lib/supabase";

// Directorate configuration
const directorates = [
  { key: 'bod', label: 'BOD', icon: 'command' },
  { key: 'sobat_siar', label: 'Sobat Siar', icon: 'users' },
  { key: 'operational', label: 'Operational', icon: 'settings', divisions: ['HRD', 'Program', 'Broadcast'] },
  { key: 'technology', label: 'Technology', icon: 'edit', divisions: ['Mobile & Web Development', 'Technical Division', 'Music Division'] },
  { key: 'komunikasi', label: 'Komunikasi', icon: 'message', divisions: ['Public Relation', 'Community Relations', 'Research'] },
  { key: 'marketing', label: 'Marketing', icon: 'trending', divisions: ['Social Media', 'Sales & Partnership'] },
  { key: 'produksi', label: 'Produksi', icon: 'image', divisions: ['Visual Design', 'Audio', 'Video', 'Event'] },
];

// Icon components
function DirectorateIcon({ type }: { type: string }) {
  const color = 'white';
  
  switch (type) {
    case 'command':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.07-5.07l-4.24 4.24m-1.66-1.66L7.93 7.93m0 8.14l4.24-4.24m1.66 1.66l4.24 4.24" />
        </svg>
      );
    case 'edit':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      );
    case 'message':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'trending':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 'image':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-6 h-6">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    default:
      return null;
  }
}

// Member card component for popup
function MemberCard({ member }: { member: Member }) {
  const photoUrl = member.photo_url || member.image_url || null;
  
  return (
    <div className="bg-[#6B1028] rounded-2xl overflow-hidden flex-shrink-0 w-40 h-52 md:w-44 md:h-56">
      {photoUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={photoUrl}
            alt={member.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
            <p className="text-white font-bold text-xs truncate">{member.name}</p>
            <p className="text-white/70 text-[10px] truncate">{member.position || member.role}</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[#6B1028]">
          <div className="w-14 h-14 rounded-full bg-[#4A0A1C] flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-white font-bold text-xs text-center">{member.name}</p>
          <p className="text-white/70 text-[10px] text-center">{member.position || member.role}</p>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeDirectorate, setActiveDirectorate] = useState<string | null>(null);
  const [activeDivision, setActiveDivision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: true });
    setMembers(data || []);
    setLoading(false);
  };

  const getMembersByDirectorate = (directorate: string) => {
    return members.filter(m => m.directorate === directorate);
  };

  const getMembersByDivision = (directorate: string, division: string) => {
    return members.filter(m => m.directorate === directorate && m.division === division);
  };

  const activeDir = activeDirectorate ? directorates.find(d => d.key === activeDirectorate) : null;
  const mobileMembers = activeDir
    ? activeDir.divisions && activeDivision
      ? getMembersByDivision(activeDirectorate as string, activeDivision)
      : getMembersByDirectorate(activeDirectorate)
    : [];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
            alt="About Us Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#B21E35]/80 via-[#8B0000]/60 to-black/40" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
              Suara Anak Bangsa
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
              Satu Cinta
            </h2>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
              Satu Indonesia
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <Button 
              size="lg" 
              className="bg-[#B21E35] hover:bg-[#8B0000] text-white px-12 py-8 rounded-full text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(178,30,53,0.4)]"
            >
              JOIN US
            </Button>
          </motion.div>
        </div>

        </section>

      {/* Second Section: Tentang Radio PPI Dunia */}
      <section className="relative py-32 px-6 bg-black min-h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative Curved Lines Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-0 right-0 w-full h-full text-[#B21E35] opacity-60" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M1000,0 Q800,200 900,400 T1000,800" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M1000,50 Q850,250 950,450 T1000,850" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M1000,100 Q900,300 1000,500" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-full text-[#B21E35] opacity-60" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,1000 Q200,800 100,600 T0,200" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M0,950 Q150,750 50,550 T0,150" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          {/* Broad red curves from the design */}
          <svg className="absolute inset-0 w-full h-full text-[#B21E35] opacity-40" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path d="M-100,600 C200,800 600,200 1540,400" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M-100,650 C200,850 600,250 1540,450" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 w-full">
          {/* Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-16 shadow-[0_40px_100px_rgba(178,30,53,0.2)]"
          >
            {/* Floating Badge Title */}
            <div className="absolute -top-6 left-10 md:left-20">
              <h2 className="text-[#B21E35] text-3xl md:text-5xl font-black italic whitespace-nowrap drop-shadow-[0_2px_0_#fff] paint-order-stroke stroke-white stroke-[8px]">
                <span className="relative z-10">Tentang Radio PPI Dunia</span>
                <span className="absolute inset-0 -z-10 text-white translate-y-[2px]" style={{ WebkitTextStroke: '8px white' }}>Tentang Radio PPI Dunia</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-8">
              {/* Left Column: Logo and History */}
              <div className="space-y-10">
                <div className="flex flex-col items-center lg:items-start gap-6">
                    <div className="relative w-72 h-40 md:w-80 md:h-44">
                      <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/logorpd-1770132929601.png?width=8000&height=8000&resize=contain"
                        alt="Radio PPI Dunia Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    Radio PPI Dunia adalah radio online streaming yang digagas oleh Perhimpunan Pelajar Indonesia di seluruh dunia sejak 18 Mei 2009. Peluncuran Radio PPI Dunia ditandai dengan dilakukannya siaran langsung berantai dari Sobat Siar (SS) di Jerman, Mesir, Belanda, Rusia, Korea Selatan, Malaysia, Inggris, dan Australia.
                  </p>
                </div>
              </div>

              {/* Right Column: Present Status and Growth */}
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Saat ini Radio PPI Dunia mengudara 24 jam non-stop yang dimotori oleh Sobat Siar (SS), Sobat Kru (SK), dan Sobat Siar Kru (SSK) yang merupakan pelajar Indonesia yang tersebar di berbagai negara di seluruh dunia.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Perkembangan jumlah SS, SK, dan SSK yang bergabung dengan Radio PPI Dunia menunjukkan semakin berkembangnya Radio PPI Dunia.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed font-bold">
                    Kini terdapat 25 SS, 71 SK, dan 19 SSK Radio PPI Dunia yang menawarkan berbagai informasi edukatif melalui berbagai program siaran.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Third Section: Persebaran Anggota Radio PPI Dunia */}
      <section className="relative py-20 md:py-32 bg-[#1a1a1a] flex items-center overflow-hidden">
        {/* Red curved lines background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Bottom left decorative lines */}
          <svg className="absolute bottom-0 left-0 w-full h-full text-[#B21E35]" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path d="M-50,700 Q100,750 150,650 Q200,550 400,600 Q700,700 1000,500 Q1200,350 1500,400" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
            <path d="M-50,750 Q100,800 150,700 Q200,600 400,650 Q700,750 1000,550 Q1200,400 1500,450" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
            <path d="M-50,800 Q100,850 150,750 Q200,650 400,700 Q700,800 1000,600 Q1200,450 1500,500" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
          </svg>
          {/* Small loop decoration */}
          <svg className="absolute bottom-20 left-20 w-32 h-32 text-[#B21E35]" viewBox="0 0 100 100">
            <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" transform="rotate(-30 50 50)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Left: Title Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0"
            >
              <div 
                className="bg-[#B91638] rounded-r-[30px] py-8 px-8 md:px-12 inline-block"
                style={{ marginLeft: '-1.5rem' }}
              >
                <h2 
                  className="text-white text-2xl md:text-4xl lg:text-5xl font-black italic leading-tight"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Persebaran<br />
                  Anggota Radio<br />
                  PPI Dunia
                </h2>
              </div>
            </motion.div>

            {/* Right: Map Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full"
            >
              <div className="bg-white rounded-[30px] p-4 md:p-6 shadow-2xl">
                <div className="relative w-full aspect-[16/10] md:aspect-[16/9]">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/map-1770130489474.png?width=8000&height=8000&resize=contain"
                    alt="Persebaran Anggota Radio PPI Dunia"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Be part of US button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end mt-8 md:mt-12"
          >
            <Link href="/join">
              <button 
                className="bg-[#B91638] hover:bg-[#9a1230] text-white font-black italic text-lg md:text-xl px-8 md:px-12 py-4 rounded-full transition-all hover:scale-105 shadow-lg"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Be part of US
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

        {/* Fourth Section: Our Team Members */}
        <section className="relative py-20 md:py-32 bg-[#0f0f0f] overflow-hidden">
          {/* Decorative red lines on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-64 h-96 text-[#B21E35]" viewBox="0 0 200 400">
              <path d="M200,50 Q100,100 150,200 Q200,300 100,350" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
              <path d="M200,80 Q120,130 170,230 Q200,330 120,380" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Mobile layout */}
            <div className="md:hidden mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-white text-4xl font-black italic text-center mb-6 leading-none"
                style={{ fontFamily: 'Fredoka, sans-serif', textShadow: '0 4px 0 #fff' }}
              >
                Our Team Members
              </motion.h2>

              <div className="flex items-stretch gap-4">
                <div className="w-[84px] bg-[#B91638] rounded-[34px] py-6 px-0 flex flex-col items-center justify-between min-h-[560px] shadow-2xl">
                  {directorates.map((dir, index) => (
                    <div key={dir.key} className="flex flex-col items-center w-full">
                      <button
                        onClick={() => {
                          if (activeDirectorate === dir.key) {
                            setActiveDirectorate(null);
                            setActiveDivision(null);
                          } else {
                            setActiveDirectorate(dir.key);
                            setActiveDivision(null);
                          }
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          activeDirectorate === dir.key ? 'bg-white/20 scale-110' : 'hover:bg-white/10'
                        }`}
                        title={dir.label}
                        aria-label={dir.label}
                      >
                        <DirectorateIcon type={dir.icon} />
                      </button>
                      {index < directorates.length - 1 && (
                        <div className="w-10 h-[3px] bg-white/30 rounded-full my-5" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex-1 bg-white rounded-[32px] p-4 pt-5 shadow-2xl min-h-[560px]">
                  <div className="mb-5">
                    {activeDir?.divisions ? (
                      <div className="relative">
                        <select
                          value={activeDivision || ''}
                          onChange={(e) => setActiveDivision(e.target.value || null)}
                          className="w-full appearance-none rounded-full border-4 border-[#B91638] bg-white px-5 py-3 pr-14 text-[#B91638] text-2xl font-black outline-none"
                          style={{ fontFamily: 'Fredoka, sans-serif' }}
                        >
                          <option value="">Division</option>
                          {activeDir.divisions.map((division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          ))}
                        </select>
                        <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#B91638]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    ) : (
                      <div className="rounded-full border-4 border-[#B91638] bg-white px-5 py-3 text-[#B91638] text-2xl font-black text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                        {activeDir?.label || 'Directorate'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 max-h-[470px] overflow-y-auto pr-1">
                    {mobileMembers.length > 0 ? (
                      mobileMembers.map((member) => (
                        <div key={member.id} className="rounded-[18px] bg-[#6B1028] overflow-hidden shadow-xl min-h-[260px]">
                          <div className="relative h-[220px] bg-[#5a0d22]">
                            <Image
                              src={member.photo_url || member.image_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <p className="text-[#B91638] font-black text-lg leading-tight truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                              {member.name}
                            </p>
                            <p className="text-[#6f6f6f] text-sm font-semibold truncate">
                              {member.position || member.role || activeDir?.label || 'Member'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] bg-[#6B1028] min-h-[260px] flex items-center justify-center text-white/60 font-semibold">
                        {activeDirectorate ? 'No members in this section' : 'Select a directorate'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-white text-4xl md:text-6xl font-black italic text-center mb-10"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Our Team Members
              </motion.h2>

              {/* Directorate Icons Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center mb-8 relative"
              >
                <div className="bg-[#B91638] rounded-full px-6 py-3 flex items-center gap-2 md:gap-4">
                  {directorates.map((dir, index) => (
                    <div key={dir.key} className="flex items-center relative">
                      <button
                          onClick={() => {
                            if (activeDirectorate === dir.key) {
                              setActiveDirectorate(null);
                              setActiveDivision(null);
                            } else {
                              setActiveDirectorate(dir.key);
                              setActiveDivision(null);
                            }
                          }}
                          className={`p-2 rounded-full transition-all ${
                            activeDirectorate === dir.key 
                              ? 'bg-white/20 scale-110' 
                              : 'hover:bg-white/10'
                          }`}
                          title={dir.label}
                        >
                        <DirectorateIcon type={dir.icon} />
                      </button>
                      {index < directorates.length - 1 && (
                        <div className="w-px h-6 bg-white/30 mx-1 md:mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Popup Modal for Team Content */}
              <AnimatePresence>
                {activeDirectorate && activeDir && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Triangle pointer */}
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: '16px solid transparent',
                        borderRight: '16px solid transparent',
                        borderBottom: '16px solid #B91638',
                      }}
                    />
                    
                    {/* Main popup card */}
                    <div className="bg-[#B91638] rounded-[30px] p-6 md:p-8 relative">
                      {/* Close button */}
                      <button 
                        onClick={() => setActiveDirectorate(null)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>

                      {loading ? (
                        <div className="flex items-center justify-center py-16">
                          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      ) : (
                          <>
                            {/* Division Tabs - Only show for directorates with divisions */}
                            {activeDir.divisions ? (
                              <div className="flex flex-wrap gap-0 mb-6">
                                {activeDir.divisions.map((division, idx) => {
                                  const isActive = activeDivision === division;
                                  const isFirst = idx === 0;
                                  const isLast = idx === activeDir.divisions!.length - 1;
                                  return (
                                    <button 
                                      key={division}
                                      onClick={() => setActiveDivision(isActive ? null : division)}
                                      className={`px-6 py-3 font-bold text-sm transition-all ${
                                        isActive 
                                          ? 'bg-white text-[#B91638]' 
                                          : 'bg-[#6B1028] text-white hover:bg-[#5a0d22]'
                                      } ${isFirst ? 'rounded-l-xl' : ''} ${isLast ? 'rounded-r-xl' : ''}`}
                                    >
                                      {division}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="mb-6">
                                <h3 className="text-white font-bold text-xl">{activeDir.label}</h3>
                              </div>
                            )}

                            {/* Members Grid with Horizontal Scroll */}
                            {activeDir.divisions ? (
                              <>
                                {activeDivision ? (
                                  /* Show only the selected division's members */
                                  <div 
                                    className="flex gap-4 overflow-x-auto pb-4"
                                    style={{ scrollbarWidth: 'thin' }}
                                  >
                                    {getMembersByDivision(activeDirectorate, activeDivision).length > 0 ? (
                                      getMembersByDivision(activeDirectorate, activeDivision).map((member) => (
                                        <MemberCard key={member.id} member={member} />
                                      ))
                                    ) : (
                                      <div className="w-full text-center py-10">
                                        <div className="w-16 h-16 rounded-full bg-[#6B1028] flex items-center justify-center mx-auto mb-3">
                                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8 opacity-50">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                          </svg>
                                        </div>
                                        <p className="text-white/50">No members in {activeDivision}</p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* No division selected - show instruction */
                                  <div className="w-full text-center py-10">
                                    <p className="text-white/60">Click on a division above to view members</p>
                                  </div>
                                )}
                              </>
                            ) : (
                              /* For BOD and Sobat Siar - show all members in horizontal scroll */
                              <div 
                                className="flex gap-4 overflow-x-auto pb-4"
                                style={{ scrollbarWidth: 'thin' }}
                              >
                                {getMembersByDirectorate(activeDirectorate).length > 0 ? (
                                  getMembersByDirectorate(activeDirectorate).map((member) => (
                                    <MemberCard key={member.id} member={member} />
                                  ))
                                ) : (
                                  <div className="w-full text-center py-10">
                                    <p className="text-white/50">No members in this section</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instruction text when no directorate is selected */}
              {!activeDirectorate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/40 text-center text-sm mt-4"
                >
                  Click on an icon above to view team members
                </motion.p>
              )}
            </div>
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
  );
}
