"use client";

import Link from "next/link";
import { ChevronDown, X, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-[100] bg-black/20 backdrop-blur-md border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between !w-full !h-[70px]">
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
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <div className="relative group/dropdown">
            <button className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              Program <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#121212] border border-white/5 rounded-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all p-2 shadow-2xl">
              <Link href="/program/reguler" className="block px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">Siaran Reguler</Link>
              <Link href="/program/spesial" className="block px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">Siaran Spesial</Link>
              <Link href="/program/event" className="block px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">Event</Link>
            </div>
          </div>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-4 relative">
          <Link href="/admin/login" className="p-2 text-white/60 hover:text-white transition-colors flex items-center gap-2" title="Admin Profile">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-white/80 transition-colors z-[110]"
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
                      href="/1shara6atra" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      1Shara6atra
                    </Link>
                    <Link 
                      href="/podcast" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-4 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Podcast
                    </Link>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </header>
  );
}
