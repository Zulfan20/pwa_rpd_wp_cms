// app/hut-rpd/page.tsx
export default function HutRpdPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center space-y-8">
        {/* Radio ornament */}
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-[#B21E35] animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 12v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
            <path d="M7 12V8a5 5 0 0110 0v4" />
            <circle cx="12" cy="14" r="2" />
          </svg>
        </div>

        <h1
          className="text-5xl md:text-7xl font-black italic text-white leading-none"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          HUT RPD
        </h1>

        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-[#B21E35]" />
          <span className="text-[#B21E35] text-2xl md:text-3xl font-black italic">
            Coming Soon!
          </span>
          <div className="h-px w-16 bg-[#B21E35]" />
        </div>

        <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto">
          Something special is brewing. Stay tuned for the celebration of
          Radio PPI Dunia’s anniversary.
        </p>

        {/* Bottom wave decoration */}
        <div className="flex justify-center opacity-30 pt-8">
          <svg className="w-32 h-6" viewBox="0 0 120 20" fill="none">
            <path
              d="M0 10 Q20 0 40 10 T80 10 T120 10"
              stroke="#FFF1A8"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}