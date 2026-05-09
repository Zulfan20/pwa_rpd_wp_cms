"use client";

import Link from "next/link";

export default function ProgramPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Hero Section - Clean Red Boxes Design */}
      <section className="pt-20 md:pt-24 pb-8 md:pb-10 bg-white">
        <div className="max-w-[280px] md:max-w-xs mx-auto px-4">
          {/* Compact 2x2 grid of red boxes */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="aspect-square bg-[#B21E35] rounded" />
            <div className="aspect-square bg-transparent" />
            <div className="aspect-square bg-transparent" />
            <div className="aspect-square bg-[#B21E35]/40 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <div className="aspect-[4/3] bg-[#B21E35]/40 rounded" />
            <div className="aspect-[4/3] bg-[#B21E35] rounded" />
          </div>
        </div>
      </section>

      {/* Jadwal Siaran Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Red curvy lines background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-70"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        <div className="max-w-2xl mx-auto px-4 relative z-10">
          {/* Title - clearly visible */}
          <h1 className="text-xl md:text-3xl font-black italic text-center mb-4 md:mb-6" style={{ 
            fontFamily: 'Fredoka, sans-serif',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(178,30,53,0.5)'
          }}>
            Jadwal Siaran Radio PPI Dunia
          </h1>

          {/* White border container */}
          <div className="border-[3px] md:border-4 border-white rounded-2xl md:rounded-3xl p-1.5 md:p-2 bg-black/30 backdrop-blur-sm">
            <div className="bg-[#B21E35] rounded-xl md:rounded-2xl min-h-[180px] md:min-h-[280px] p-4 md:p-6">
              {/* Schedule content placeholder */}
            </div>
          </div>
        </div>
      </section>

      {/* Where to Find Us Section - Full Width */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom'
          }}
        />

        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-black italic text-[#B21E35] text-center mb-6 md:mb-10" style={{ 
            fontFamily: 'Fredoka, sans-serif'
          }}>
            Where to find us
          </h2>

          <div className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-12 shadow-2xl">
            {/* Social Media Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-12 mb-6 md:mb-10">
              <div className="flex flex-col items-center gap-2 md:gap-4">
                <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-16 md:h-16 text-[#B21E35]" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
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
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#B21E35] font-black text-xl md:text-4xl">9773</p>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-[8px] md:text-xs mt-1">Followers</p>
                </div>
              </div>
            </div>

            {/* Collab CTA */}
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

      {/* Footer - Full Width */}
      <footer className="bg-white pt-16 md:pt-24 pb-8 md:pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-12 h-12 bg-[#B21E35] rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">RPD</span>
                </div>
                <p className="text-black font-black text-2xl uppercase tracking-tighter">radio<span className="text-[#B21E35]">ppi</span>dunia</p>
              </div>
              <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-md">
                Suara Anak Bangsa, Satu Cinta, Satu Indonesia. 
                Mengudara 24 jam untuk menghubungkan mahasiswa Indonesia di seluruh dunia.
              </p>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-4 md:mb-6">Navigation</h4>
              <ul className="space-y-3 md:space-y-4 text-gray-400 font-bold text-sm md:text-base">
                <li><Link href="/" className="hover:text-[#B21E35] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#B21E35] transition-colors">About Us</Link></li>
                <li><Link href="/program" className="hover:text-[#B21E35] transition-colors">Program</Link></li>
                <li><Link href="/faq" className="hover:text-[#B21E35] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-4 md:mb-6">Support</h4>
              <ul className="space-y-3 md:space-y-4 text-gray-400 font-bold text-sm md:text-base">
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Partnership</li>
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Join Us</li>
                <li className="hover:text-[#B21E35] cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <h4 className="text-black font-black uppercase text-sm tracking-widest mb-4 md:mb-6">Social</h4>
              <div className="flex gap-3 md:gap-4">
                {[
                  { name: 'FB', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z' },
                  { name: 'IG', icon: '' },
                  { name: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { name: 'YT', icon: '' }
                ].map((social, i) => (
                  <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#B21E35] hover:bg-[#B21E35] hover:text-white transition-all cursor-pointer group">
                    <span className="text-xs md:text-sm text-gray-400 font-bold group-hover:text-white">{social.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 md:pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest">
              © 2026 Radio PPI Dunia. Built with Passion for Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
