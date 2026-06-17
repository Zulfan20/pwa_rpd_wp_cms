"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// ---------- Schedule Component (inline) ----------
function JadwalSiaran() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/schedule');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Gagal memuat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Correct indices:
  // row 0 = empty, row 1 = title, row 2 = dates, row 3 = days, row 4+ = data
  const dateRow = rows[2] || [];
  const dayRow = rows[3] || [];
  const dataRows = rows.slice(4);

  const cols = dayRow.slice(1).map((day, i) => ({
    day: day || '',
    date: dateRow[i + 1] || '',
  }));
  const times = dataRows.map(r => r[0] || '');
  const grid: string[][] = dataRows.map(r => r.slice(1));

  const stickyTimeTdStyle = (): React.CSSProperties => ({
    position: 'sticky',
    left: 0,
    zIndex: 10,
    background: 'rgba(10,10,10,0.45)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
    borderRight: '1px solid rgba(255,255,255,0.1)',
  });

  const TableContent = ({ isMobile }: { isMobile: boolean }) => (
    <table
      className="w-full border-collapse text-sm"
      style={{ minWidth: isMobile ? `${cols.length * 110 + 80}px` : undefined }}
    >
      <thead>
        <tr className="bg-[#B21E35]">
          <th
            className="py-3 px-4 text-white/60 text-xs font-medium tracking-widest uppercase text-center"
            style={isMobile ? {
              position: 'sticky',
              left: 0,
              zIndex: 20,
              background: '#B21E35',
              minWidth: '80px',
              boxShadow: '2px 0 8px rgba(0,0,0,0.25)',
            } : { width: '90px' }}
          >
            Waktu
          </th>
          {cols.map((col, i) => (
            <th key={i} className="py-1 px-3 text-center" style={{ minWidth: isMobile ? '110px' : undefined }}>
              <div className="text-[#FFF1A8] font-bold text-xs uppercase tracking-wider pt-2">
                {col.day}
              </div>
              <div className="text-[#FFF1A8]/50 text-[10px] pb-2">{col.date}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {times.map((time, ri) => (
          <tr
            key={ri}
            className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
              ri % 2 === 0 ? 'bg-white/[0.03]' : ''
            }`}
          >
            <td
              className="py-2.5 px-4 text-center font-mono text-[#FFF1A8] text-xs font-medium whitespace-nowrap"
              style={isMobile ? stickyTimeTdStyle() : {
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {time}
            </td>
            {cols.map((_, ci) => {
              const prog = grid[ri]?.[ci] || '';
              return (
                <td key={ci} className="py-2.5 px-3 text-center">
                  {prog ? (
                    <span className="inline-block bg-white/10 text-white text-[11px] font-semibold rounded-md px-2.5 py-1 leading-tight">
                      {prog}
                    </span>
                  ) : (
                    <span className="text-white/25 text-xs">—</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <svg
          className="w-5 h-5 text-[#FFF1A8] animate-pulse shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        >
          <path d="M4 12v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
          <path d="M7 12V8a5 5 0 0110 0v4" />
          <circle cx="12" cy="14" r="2" />
        </svg>
        <h4 className="font-black text-white text-base md:text-lg tracking-widest uppercase">
          Program Guide
        </h4>
        <div className="flex-1 h-px bg-gradient-to-r from-white/30 to-transparent" />
        <svg className="w-8 h-4 opacity-40 shrink-0" viewBox="0 0 80 16" fill="none">
          <path d="M0 8 Q10 1 20 8 T40 8 T60 8 T80 8" stroke="#FFF1A8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-white/50 text-sm">Memuat jadwal siaran…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-8 text-center text-red-300 text-sm">
          Gagal memuat: {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !rows.length && (
        <div className="py-8 text-center text-white/50 text-sm italic">
          Jadwal belum tersedia
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
            <TableContent isMobile={false} />
          </div>

          {/* Mobile Table — sticky glassy time col + horizontal scroll */}
          <div
            className="md:hidden rounded-2xl border border-white/15 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            {/* Scroll hint */}
            <div className="flex items-center justify-end gap-1.5 px-3 py-1.5 border-b border-white/10">
              <span className="text-white/30 text-[10px] tracking-wide">geser untuk lihat semua</span>
              <svg className="w-3 h-3 text-white/30" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
            <div className="overflow-x-auto">
              <TableContent isMobile={true} />
            </div>
          </div>
        </>
      )}

      {/* Bottom wave */}
      <div className="flex justify-center mt-5 opacity-20">
        <svg className="w-32 h-5" viewBox="0 0 120 16" fill="none">
          <path d="M0 8 Q15 1 30 8 T60 8 T90 8 T120 8" stroke="#FFF1A8" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
// ---------- End Schedule Component ----------

type Banner = {
  image_url: string;
  alt: string;
};

function BannerCarousel({ title, banners }: { title: string; banners: Banner[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-4xl font-black italic uppercase leading-none text-white">
            {title}
          </h3>
        </div>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="relative w-full">
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={`${banner.alt}-${index}`} className="basis-full md:basis-1/2 lg:basis-1/3">
              <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[26px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)] bg-black/20 max-w-[320px] mx-auto w-full">
                <Image
                  src={banner.image_url}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 border-white/15 bg-black/40 text-white backdrop-blur-md hover:bg-black/60" />
        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 border-white/15 bg-black/40 text-white backdrop-blur-md hover:bg-black/60" />
      </Carousel>
    </div>
  );
}

export default function ProgramPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [regularBanners, setRegularBanners] = useState<Banner[]>([]);
  const [specialBanners, setSpecialBanners] = useState<Banner[]>([]);
  const [scheduleTitle, setScheduleTitle] = useState('Jadwal Siaran Radio PPI Dunia');
  
  // NEW: State to track if the initial data is still loading
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Run both fetches simultaneously for speed
        const [progRes, schedRes] = await Promise.all([
          fetch("/api/program").catch(() => null),
          fetch("/api/schedule").catch(() => null)
        ]);

        if (progRes && progRes.ok) {
          const progData = await progRes.json();
          setSettings({
            what_is_on_tagline: progData.what_is_on_tagline || "",
            what_is_on_date: progData.what_is_on_date || "",
          });
          setRegularBanners(progData.regularBanners || []);
          setSpecialBanners(progData.specialBanners || []);
        }

        if (schedRes && schedRes.ok) {
          const schedData = await schedRes.json();
          if (schedData?.[1]?.[0]) setScheduleTitle(schedData[1][0]);
        }
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setPageLoading(false); // Done loading! Remove the spinners.
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      {/* What is on Section */}
      <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
            <div>
              <h2 className="text-white text-5xl md:text-7xl font-black italic uppercase leading-[0.8]">
                What is on <br />
                <span className="text-[#B21E35]">RADIO PPI DUNIA</span>
                <span className="text-white"> ?</span>
              </h2>
            </div>
            
            {/* DYNAMIC TEXT CONTAINER WITH LOADER */}
            <div className="text-left md:text-right flex flex-col justify-center min-h-[100px]">
              {pageLoading ? (
                <div className="flex flex-col items-start md:items-end gap-3 mt-4">
                  <div className="w-8 h-8 border-4 border-[#B21E35]/30 border-t-[#B21E35] rounded-full animate-spin" />
                  <span className="text-[#B21E35] text-sm italic font-bold">Memuat info...</span>
                </div>
              ) : (
                <>
                  {settings.what_is_on_tagline && (
                    <p className="text-[#B21E35] italic text-lg md:text-xl font-medium">
                      {settings.what_is_on_tagline.split("\n").map((line, index) => (
                        <span key={index} className="block">{line}</span>
                      ))}
                    </p>
                  )}
                  {settings.what_is_on_date && (
                    <span className="text-white font-black text-2xl md:text-4xl mt-4 block">
                      -{settings.what_is_on_date}-
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-12 space-y-14 md:space-y-20">
            {regularBanners.length > 0 && (
              <BannerCarousel title="Siaran Reguler" banners={regularBanners} />
            )}
            {specialBanners.length > 0 && (
              <BannerCarousel title="Siaran Spesial" banners={specialBanners} />
            )}
            <div className="flex justify-center pt-2">
              <Link href="/about">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 has-[>svg]:px-3 bg-white text-[#B21E35] hover:bg-gray-100 rounded-full px-10 py-4 text-lg md:text-2xl font-black italic shadow-2xl transition-transform hover:scale-105 border-4 md:border-8 border-[#0a0a0a]">
                  Know more about us !
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jadwal Siaran Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-70"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Dynamic title from API WITH LOADER */}
          <h1
            className="text-xl md:text-3xl font-black italic text-center mb-4 md:mb-6 min-h-[40px] flex items-center justify-center"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(178,30,53,0.5)',
            }}
          >
            {pageLoading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              scheduleTitle
            )}
          </h1>
          <div className="border-[3px] md:border-4 border-white rounded-2xl md:rounded-3xl p-1.5 md:p-2 bg-black/30 backdrop-blur-sm">
            <JadwalSiaran />
          </div>
        </div>
      </section>

      {/* Where to Find Us Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
          }}
        />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <h2
            className="text-2xl md:text-4xl font-black italic text-[#B21E35] text-center mb-6 md:mb-10"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Where to find us
          </h2>
          <div className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-12 shadow-2xl">
            <div className="grid grid-cols-3 gap-4 md:gap-12 mb-6 md:mb-10">
              <div className="flex flex-col items-center gap-2 md:gap-4">
                <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-16 md:h-16 text-[#B21E35]" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#B21E35] font-black text-xl md:text-4xl">12410</p>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-[8px] md:text-xs mt-1">Fans</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 md:gap-4">
                <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-16 md:h-16 text-[#B21E35]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#B21E35] font-black text-xl md:text-4xl">20.338</p>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-[8px] md:text-xs mt-1">Followers</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 md:gap-4">
                <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-16 md:h-16 text-[#B21E35]" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#B21E35] font-black text-xl md:text-4xl">9773</p>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-[8px] md:text-xs mt-1">Followers</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 md:pt-8 border-t-2 border-gray-100">
              <span className="text-[#B21E35] font-black text-lg md:text-2xl italic" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Collab with us !
              </span>
              <button className="bg-[#B21E35] hover:bg-[#8B0000] text-white rounded-full px-8 md:px-12 py-3 md:py-4 font-bold text-sm md:text-lg shadow-xl transition-all hover:scale-105">
                Contact Us
              </button>
            </div>
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
                      {/* Partnership → sales */}
                      <li>
                        <a
                          href="https://mail.google.com/mail/u/0/?fs=1&to=sales.radioppid@gmail.com&su=PERMOHONAN+PARTNERSHIP&body=Isi+pesan&tf=cm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#B21E35] transition-colors cursor-pointer"
                        >
                          Partnership
                        </a>
                      </li>
                      {/* Join Us → plain text */}
                      <li>
                        <a
                          href="https://radioppidunia.org/gabung/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#B21E35] transition-colors cursor-pointer"
                        >
                          Join Us
                        </a>
                      </li>
                      {/* Contact → publicrelations */}
                      <li>
                        <a
                          href="https://mail.google.com/mail/u/0/?fs=1&to=publicrelations.rpd@gmail.com&su=PERMOHONAN+MEDIA+PARTNER&body=Isi+pesan&tf=cm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#B21E35] transition-colors cursor-pointer"
                        >
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>
      
                  <div className="flex flex-col items-start md:items-end">
                    <h4 className="text-black font-black uppercase text-sm tracking-widest mb-5">Social</h4>
                    <div className="flex gap-3">
                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/radioppidunia?igsh=NGpkdmJtNmw4b3Yx"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white">
                          <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .6 1.4 1.1.4.5.6 1.2.7 2 .1 1.1.1 1.5.1 4.1s0 3-.1 4.1c-.1 1.1-.3 1.9-.7 2.4-.4.5-.8.9-1.4 1.1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.6-1.4-1.1-.4-.5-.6-1.2-.7-2-.1-1.1-.1-1.5-.1-4.1s0-3 .1-4.1c.1-1.1.3-1.9.7-2.4.4-.5.8-.9 1.4-1.1.5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 2.2c-3 0-3.4 0-4.5.1-1.1.1-1.7.2-2.1.4-.5.2-.9.5-1.3 1-.4.4-.7.8-.9 1.3-.2.4-.3 1-.4 2.1C3 10.6 3 11 3 12s0 1.4.1 2.9c.1 1.1.2 1.7.4 2.1.2.5.5.9 1 1.3.4.4.8.7 1.3.9.4.2 1 .3 2.1.4 1.1.1 1.5.1 4.1.1s3 0 4.1-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.5 1.3-1 .4-.4.7-.8.9-1.3.2-.4.3-1 .4-2.1.1-1.1.1-1.5.1-4.1s0-3-.1-4.1c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-1-1.3-.4-.4-.8-.7-1.3-.9-.4-.2-1-.3-2.1-.4C15.4 4.4 15 4.4 12 4.4zm0 3.8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 1.8c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2-1-2.2-2.2-2.2zm4.8-1.6c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" />
                        </svg>
                      </a>
      
                      {/* X (Twitter) */}
                      <a
                        href="https://x.com/_radioppidunia_?s=21"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
      
                      {/* TikTok */}
                      <a
                        href="https://www.tiktok.com/@radioppidunia?_r=1&_t=ZS-976z1ixMawb"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                        className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                      </a>
      
                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@radioppidunia"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-400 group-hover:text-white">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
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