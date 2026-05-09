"use client";

import { motion } from "framer-motion";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Red curvy lines background */}
      <div 
        className="absolute inset-0 z-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/18bad06e-616d-4a15-a836-96eb191d8378/garisbackground-1770065981834.png?width=8000&height=8000&resize=contain')`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* FAQ Title with red/white outline style */}
        <div className="relative z-20 mb-[-40px] ml-4 md:ml-12">
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter" style={{ 
            fontFamily: 'Fredoka, sans-serif',
            color: 'white',
            WebkitTextStroke: '4px #cc0000',
            paintOrder: 'stroke fill'
          }}>
            FAQ
          </h1>
        </div>

        {/* White border container */}
        <div className="w-full max-w-5xl mx-auto border-[6px] border-white rounded-[40px] p-8 md:p-20 pt-16 md:pt-24 min-h-[60vh] bg-black/40 backdrop-blur-md relative">
          <div className="grid gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#cc0000]">What is Radio PPI Dunia?</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Radio PPI Dunia is a global radio station managed by Indonesian students abroad, serving as a bridge between the nation's children across the globe.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#cc0000]">How can I listen?</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                You can listen directly through our website, mobile app, or various radio streaming platforms. Just click the player at the bottom of the page!
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#cc0000]">Can I join as a broadcaster?</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                We periodically open recruitment for Indonesian students abroad (Sobat Siar). Stay tuned to our social media for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
