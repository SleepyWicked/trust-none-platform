"use client";

import { useAppStore } from "@/lib/store";

export default function SocialProof() {
  const { foundingSupporters } = useAppStore();

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating placeholder */}
          <div className="p-6 rounded-xl bg-smoke/50 border border-white/5">
            <h3 className="text-lg font-bold mb-4">Viewer Ratings</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-5 h-5 ${s <= 4 ? "text-gold" : "text-gold/30"}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl font-black text-gold">4.8</span>
              <span className="text-sm text-steel">/ 5.0</span>
            </div>
            <p className="text-sm text-gray-400">Based on early viewer feedback</p>
            <div className="mt-4 space-y-2">
              {[
                { stars: 5, pct: 72 },
                { stars: 4, pct: 18 },
                { stars: 3, pct: 7 },
                { stars: 2, pct: 2 },
                { stars: 1, pct: 1 },
              ].map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-steel">{stars}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-steel">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Founding supporters */}
          <div className="p-6 rounded-xl bg-smoke/50 border border-gold/10">
            <h3 className="text-lg font-bold mb-4">Founding Supporters</h3>
            <div className="text-center py-4">
              <div className="text-5xl font-black text-gold counter-glow tabular-nums">
                {foundingSupporters}
              </div>
              <p className="text-sm text-steel mt-2">people supporting the movement</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1 justify-center">
              {["Alex M.", "Tanya R.", "Chris B.", "Deja W.", "Marcus T.", "Keisha L.", "Jordan P.", "Nia H.", "DeShawn K.", "Aaliyah J.", "Tony G.", "Priya S."].map((name) => (
                <span key={name} className="px-2 py-0.5 text-[10px] rounded-full bg-gold/10 text-gold/70 border border-gold/10">
                  {name}
                </span>
              ))}
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-steel">
                +{foundingSupporters - 12} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
