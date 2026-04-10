"use client";

import { SHOW_INFO } from "@/lib/episodes";
import SocialShare from "./SocialShare";

export default function AboutShow() {
  return (
    <section className="py-16 relative">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">About the Show</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              When Darius returns to Chicago&apos;s Englewood neighborhood after three years, he expects a fresh start. Instead, he finds his younger brother Marcus deep in the streets, his mother Lorraine hiding dangerous secrets, and a web of betrayal that traces back to their father&apos;s unsolved death.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              <em>Trust None</em> is a raw, unapologetic look at family loyalty when the streets are watching. Part drama, part dark comedy, every episode drops a revelation that changes everything you thought you knew.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SHOW_INFO.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-steel border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="text-steel">Season</span>
                <span className="ml-2 font-bold">{SHOW_INFO.season}</span>
              </div>
              <div>
                <span className="text-steel">Episodes</span>
                <span className="ml-2 font-bold">{SHOW_INFO.totalEpisodes}</span>
              </div>
              <div>
                <span className="text-steel">Rating</span>
                <span className="ml-2 font-bold">{SHOW_INFO.rating}</span>
              </div>
              <div>
                <span className="text-steel">Format</span>
                <span className="ml-2 font-bold">Vertical (9:16)</span>
              </div>
            </div>

            <SocialShare />
          </div>
        </div>
      </div>
    </section>
  );
}
