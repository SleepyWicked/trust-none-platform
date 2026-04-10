"use client";

import { SHOW_INFO } from "@/lib/episodes";
import ShowPoster from "./ShowPoster";

export default function HeroSection() {
  const scrollToTrailer = () => {
    document.getElementById("trailer")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToEpisodes = () => {
    document.getElementById("episodes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cinematic background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(212,165,32,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(139,0,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(26,26,26,1) 0%, rgba(10,10,10,1) 100%)
          `,
        }}
      />

      {/* Animated lines - street grid */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gold"
            style={{
              width: "1px",
              height: "100%",
              left: `${12 + i * 12}%`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute bg-gold"
            style={{
              height: "1px",
              width: "100%",
              top: `${20 + i * 18}%`,
              opacity: 0.2 + (i % 2) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: Info */}
          <div className="flex-1 text-center lg:text-left">
            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
              {SHOW_INFO.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/30 text-gold bg-gold/5"
                >
                  {g}
                </span>
              ))}
              <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-blood-light/30 text-blood-light bg-blood/5">
                {SHOW_INFO.rating}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
              <span className="text-shimmer">TRUST</span>
              <br />
              <span className="text-white">NONE</span>
            </h1>

            {/* Logline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {SHOW_INFO.logline}
            </p>

            {/* Meta */}
            <div className="mt-4 flex items-center gap-4 text-sm text-steel justify-center lg:justify-start">
              <span>Season {SHOW_INFO.season}</span>
              <span className="w-1 h-1 rounded-full bg-steel" />
              <span>{SHOW_INFO.totalEpisodes} Episodes</span>
              <span className="w-1 h-1 rounded-full bg-steel" />
              <span>{SHOW_INFO.year}</span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToTrailer}
                className="px-8 py-4 bg-gold text-black font-bold text-lg rounded-lg hover:bg-gold-light transition-all pulse-gold flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </button>
              <button
                onClick={scrollToEpisodes}
                className="px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-lg hover:bg-white/20 transition-all border border-white/10"
              >
                Start Watching Free
              </button>
            </div>

            {/* Free episode badge */}
            <p className="mt-4 text-sm text-gold/70">
              First {SHOW_INFO.freeEpisodes} episodes free &middot; No account
              needed
            </p>
          </div>

          {/* Right: Poster */}
          <div className="flex-shrink-0 hidden md:block">
            <div className="gold-glow rounded-lg">
              <ShowPoster size="large" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 swipe-hint">
        <svg className="w-6 h-6 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
