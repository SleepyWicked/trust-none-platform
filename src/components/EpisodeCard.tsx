"use client";

import { Episode } from "@/lib/episodes";
import { useAppStore } from "@/lib/store";

interface Props {
  episode: Episode;
  onPlay: (ep: Episode) => void;
  onUnlock: (ep: Episode) => void;
  index: number;
}

export default function EpisodeCard({ episode, onPlay, onUnlock, index }: Props) {
  const { isEpisodeUnlocked, watchProgress } = useAppStore();
  const unlocked = episode.isFree || isEpisodeUnlocked(episode.id);
  const progress = watchProgress[episode.id] || 0;
  const progressPct = episode.runtimeSeconds > 0 ? (progress / episode.runtimeSeconds) * 100 : 0;

  return (
    <div
      className="group relative bg-smoke/50 rounded-xl overflow-hidden border border-white/5 hover:border-gold/20 transition-all duration-300 fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div
          className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 cursor-pointer"
          onClick={() => (unlocked ? onPlay(episode) : onUnlock(episode))}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg,
                  rgba(212,165,32,${0.05 + (episode.number * 0.02)}) 0%,
                  rgba(139,0,0,${0.08 + (episode.number * 0.01)}) 50%,
                  rgba(0,0,0,0.9) 100%),
                linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)
              `,
            }}
          />

          {/* Episode number watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black text-white/5">
              {String(episode.number).padStart(2, "0")}
            </span>
          </div>

          {/* Play / Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
            {unlocked ? (
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            ) : (
              <div className="lock-shake flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black/50 border border-gold/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="mt-1 text-xs text-gold font-bold">
                  {episode.coinCost} coins
                </span>
              </div>
            )}
          </div>

          {/* Free badge */}
          {episode.isFree && (
            <div className="absolute top-2 left-2 bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
              Free
            </div>
          )}

          {/* Progress bar */}
          {progressPct > 0 && unlocked && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
              <div className="h-full bg-gold" style={{ width: `${progressPct}%` }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gold text-xs font-bold tracking-wider">
                  EP {String(episode.number).padStart(2, "0")}
                </span>
                <span className="text-steel text-xs">{episode.runtime}</span>
                {!unlocked && (
                  <span className="text-xs text-gold/60 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {episode.coinCost}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-gold transition-colors truncate">
                {episode.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400 line-clamp-2 leading-relaxed">
                {episode.description}
              </p>
            </div>

            {/* Action button */}
            <button
              onClick={() => (unlocked ? onPlay(episode) : onUnlock(episode))}
              className={`flex-shrink-0 mt-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                unlocked
                  ? "bg-gold/10 text-gold hover:bg-gold/20 border border-gold/20"
                  : "bg-white/5 text-steel hover:bg-white/10 border border-white/10"
              }`}
            >
              {unlocked ? "Play" : "Unlock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
