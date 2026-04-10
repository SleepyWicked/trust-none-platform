"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function CrewFund() {
  const { crewFundTotal } = useAppStore();
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = crewFundTotal;
    const duration = 2000;
    const start = performance.now();
    const startVal = displayed;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(startVal + (target - startVal) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crewFundTotal]);

  return (
    <section className="py-16 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,165,32,0.03) 0%, transparent 50%, rgba(212,165,32,0.03) 100%)",
        }}
      />
      <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20">
          <span className="text-lg">🎬</span>
          <span className="text-sm font-bold text-gold tracking-wider uppercase">
            Crew Fund
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-2">
          Supporting the People Who Make It
        </h2>
        <p className="text-steel text-sm mb-8 max-w-md mx-auto">
          15% of every purchase goes directly into a pool for the production
          crew. Real money for real work.
        </p>

        {/* Animated counter */}
        <div className="inline-block p-8 rounded-2xl bg-smoke/50 border border-gold/10 gold-glow">
          <div className="text-5xl sm:text-6xl font-black counter-glow text-gold tabular-nums">
            ${displayed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-steel text-sm mt-2">raised for the crew so far</p>
        </div>

        {/* Progress milestones */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-steel">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>$10K reached</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${crewFundTotal >= 25000 ? "bg-green-500" : "bg-white/20"}`} />
            <span>$25K goal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span>$50K stretch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
