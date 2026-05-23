"use client";

import Link from "next/link";
import { ChevronDown, Home, Info, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/podcast"
      ? pathname?.startsWith("/podcast")
      : pathname === href;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="hidden lg:flex fixed top-0 left-0 z-[100] bg-black/20 backdrop-blur-md border-b border-white/5 px-6 md:px-10 py-3 items-center justify-between !w-full !h-[64px]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-16 md:h-24 w-auto relative">
              <img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/rpd-1770062863392.png?width=8000&height=8000&resize=contain"
              alt="Radio PPI Dunia"
              className="h-full w-auto object-contain" />
            </div>
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-white/80 font-bold text-xs uppercase tracking-widest absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={isActive("/") ? "text-white" : "hover:text-white transition-colors"}>Home</Link>
          <Link href="/about" className={isActive("/about") ? "text-white" : "hover:text-white transition-colors"}>About Us</Link>
          <Link href="/program" className={isActive("/program") ? "text-[#FFB3C0]" : "hover:text-white transition-colors"}>Program</Link>
          <Link href="/podcast" className={isActive("/podcast") ? "text-[#FFB3C0]" : "hover:text-white transition-colors"}>HUT RPD</Link>
          <Link href="/podcast" className={isActive("/podcast") ? "text-[#FFB3C0]" : "hover:text-white transition-colors"}>Podcast</Link>
          <Link href="/faq" className={isActive("/faq") ? "text-white" : "hover:text-white transition-colors"}>FAQ</Link>
        </nav>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-white/80 transition-colors z-[110]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-2 w-56 bg-[#B91638] rounded-2xl shadow-2xl overflow-hidden z-[105]"
              >
                <div className="flex flex-col py-2">
                    <Link 
                      href="/about" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/program" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Program
                    </Link>
                    <Link 
                      href="/podcast" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      HUT RPD
                    </Link>
                    <Link 
                      href="/podcast" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Podcast
                    </Link>
                    <Link 
                      href="/faq" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      FAQ
                    </Link>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100]">
        <div className="mx-auto w-full rounded-none rounded-b-[26px] min-h-[74px] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.45)] border-x border-b border-white/15 bg-white/12 backdrop-blur-2xl saturate-150 px-2.5 py-2.5 sm:px-5 sm:py-3 box-border">
          <div className="flex w-full items-center gap-2 sm:gap-4">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/rpd-1770062863392.png?width=8000&height=8000&resize=contain"
                alt="Radio PPI Dunia"
                className="w-[68px] sm:w-[90px] h-auto object-contain"
              />
            </Link>

            <div className="ml-auto flex min-w-0 items-center justify-end gap-1 sm:gap-2 whitespace-nowrap">
              <Link
                href="/program"
                className={`inline-flex shrink-0 min-w-[58px] sm:min-w-[84px] items-center justify-center rounded-full border px-2 sm:px-4 py-1.5 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-center backdrop-blur-md transition-colors ${isActive("/program") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/20 bg-white/10 text-white hover:bg-white/20"}`}
              >
                Program
              </Link>
              <Link
                href="/podcast"
                className={`inline-flex shrink-0 min-w-[58px] sm:min-w-[84px] items-center justify-center rounded-full border px-2 sm:px-4 py-1.5 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-center backdrop-blur-md transition-colors ${isActive("/podcast") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/20 bg-white/10 text-white hover:bg-white/20"}`}
              >
                HUT RPD
              </Link>
              <Link
                href="/podcast"
                className={`inline-flex shrink-0 min-w-[58px] sm:min-w-[84px] items-center justify-center rounded-full border px-2 sm:px-4 py-1.5 text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-center backdrop-blur-md transition-colors ${isActive("/podcast") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/20 bg-white/10 text-white hover:bg-white/20"}`}
              >
                Podcast
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100]">
        <div className="relative w-full bg-[#151515] px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_32px_rgba(0,0,0,0.45)] border-t border-white/5 box-border">
          <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3">
            <Link
              href="/about"
              aria-label="About Us"
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${isActive("/about") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"}`}
            >
              <Users className="h-10 w-10" strokeWidth={2.1} />
            </Link>

            <Link
              href="/"
              aria-label="Home"
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${isActive("/") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"}`}
            >
              <Home className="h-9 w-9" strokeWidth={2.2} />
            </Link>

            <Link
              href="/faq"
              aria-label="FAQ"
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${isActive("/faq") ? "border-[#FFD0DA] bg-[#B91638] text-white shadow-[0_10px_24px_rgba(185,22,56,0.35)]" : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"}`}
            >
              <Info className="h-10 w-10" strokeWidth={2.1} />
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="hidden lg:block h-[64px]" />
    </>
  );
}
