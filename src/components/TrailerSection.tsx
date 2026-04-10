"use client";

import { useState } from "react";

export default function TrailerSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="trailer" className="py-20 relative">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-center text-3xl sm:text-4xl font-black mb-2 tracking-tight">
          <span className="text-shimmer">OFFICIAL TRAILER</span>
        </h2>
        <p className="text-center text-steel mb-10">Season 1</p>

        {/* Vertical trailer player */}
        <div className="flex justify-center">
          <div
            className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden gold-glow cursor-pointer group"
            onClick={() => setPlaying(!playing)}
            style={{
              background: `
                linear-gradient(180deg,
                  rgba(0,0,0,0.3) 0%,
                  rgba(139,0,0,0.2) 40%,
                  rgba(212,165,32,0.15) 70%,
                  rgba(0,0,0,0.9) 100%),
                linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)
              `,
            }}
          >
            {/* City skyline backdrop */}
            <svg
              className="absolute bottom-32 left-0 right-0 w-full opacity-15"
              viewBox="0 0 300 80"
              fill="none"
            >
              <rect x="10" y="30" width="12" height="50" fill="#d4a520" />
              <rect x="28" y="10" width="16" height="70" fill="#d4a520" />
              <rect x="50" y="35" width="8" height="45" fill="#d4a520" />
              <rect x="64" y="5" width="14" height="75" fill="#d4a520" />
              <rect x="84" y="20" width="20" height="60" fill="#d4a520" />
              <rect x="110" y="0" width="10" height="80" fill="#d4a520" />
              <rect x="126" y="25" width="18" height="55" fill="#d4a520" />
              <rect x="150" y="15" width="12" height="65" fill="#d4a520" />
              <rect x="168" y="30" width="10" height="50" fill="#d4a520" />
              <rect x="184" y="8" width="16" height="72" fill="#d4a520" />
              <rect x="206" y="22" width="8" height="58" fill="#d4a520" />
              <rect x="220" y="12" width="20" height="68" fill="#d4a520" />
              <rect x="246" y="18" width="14" height="62" fill="#d4a520" />
              <rect x="266" y="28" width="12" height="52" fill="#d4a520" />
              <rect x="284" y="5" width="10" height="75" fill="#d4a520" />
            </svg>

            {/* Animated scan lines */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-white"
                  style={{ marginTop: `${3 + i * 3.3}%` }}
                />
              ))}
            </div>

            {/* Trailer coming soon / Play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {!playing ? (
                <>
                  {/* Play button */}
                  <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center group-hover:bg-gold/30 transition-all group-hover:scale-110">
                    <svg
                      className="w-8 h-8 text-gold ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-gold font-bold text-lg tracking-wide">
                    WATCH TRAILER
                  </p>
                  <p className="mt-1 text-steel text-sm">2:30</p>
                </>
              ) : (
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gold font-bold text-xl mb-2">Trailer Coming Soon</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The official trailer is in post-production.
                    <br />
                    Drop your email below to get notified.
                  </p>
                  <div className="mt-4 w-12 h-0.5 bg-gold/30 mx-auto" />
                </div>
              )}
            </div>

            {/* Title overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase">
                Trust None
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Season 1 &middot; Official Trailer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
