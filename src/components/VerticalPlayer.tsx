"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { episodes } from "@/lib/episodes";
import { useAppStore } from "@/lib/store";

export default function VerticalPlayer() {
  const {
    currentEpisode,
    setCurrentEpisode,
    isEpisodeUnlocked,
    setCurrentView,
    watchProgress,
    setWatchProgress,
    user,
    openAuth,
    coinBalance,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const touchStartRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const ep = episodes.find((e) => e.number === currentEpisode) || episodes[0];
  const unlocked = ep.isFree || isEpisodeUnlocked(ep.id);
  const nextEp = episodes.find((e) => e.number === currentEpisode + 1);
  const prevEp = episodes.find((e) => e.number === currentEpisode - 1);

  // Simulated playback
  useEffect(() => {
    if (isPlaying && unlocked) {
      const startTime = watchProgress[ep.id] || 0;
      setProgress(startTime);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 1;
          if (next >= ep.runtimeSeconds) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            // Auto-advance
            if (nextEp) {
              setTimeout(() => {
                setCurrentEpisode(nextEp.number);
                setIsPlaying(true);
              }, 1500);
            }
            return ep.runtimeSeconds;
          }
          setWatchProgress(ep.id, next);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentEpisode, unlocked]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => { if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current); };
  }, [showControls, isPlaying]);

  // Check if locked
  useEffect(() => {
    if (!unlocked) {
      setShowUnlockPrompt(true);
      setIsPlaying(false);
    } else {
      setShowUnlockPrompt(false);
    }
  }, [unlocked, currentEpisode]);

  const handleTap = () => {
    setShowControls(true);
    if (unlocked) {
      setIsPlaying((p) => !p);
    }
  };

  const navigateEpisode = useCallback((direction: "next" | "prev") => {
    const target = direction === "next" ? nextEp : prevEp;
    if (target) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentEpisode(target.number);
      setTimeout(() => setIsPlaying(true), 300);
    }
  }, [nextEp, prevEp, setCurrentEpisode]);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 60) {
      navigateEpisode(diff > 0 ? "next" : "prev");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = ep.runtimeSeconds > 0 ? (progress / ep.runtimeSeconds) * 100 : 0;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-14">
      <div
        ref={containerRef}
        className="relative w-full max-w-md aspect-[9/16] bg-black mx-auto overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleTap}
      >
        {/* Video background simulation */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `
              radial-gradient(circle at ${30 + (progress % 40)}% ${40 + (progress % 20)}%,
                rgba(212,165,32,${isPlaying ? 0.08 : 0.04}) 0%, transparent 50%),
              radial-gradient(circle at ${70 - (progress % 30)}% ${60 - (progress % 15)}%,
                rgba(139,0,0,${isPlaying ? 0.1 : 0.05}) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
            `,
          }}
        />

        {/* Episode scene simulation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <div className="text-6xl mb-4 opacity-20">{ep.thumbnailIcon}</div>
            <p className="text-white/10 text-xs uppercase tracking-[0.3em]">
              {isPlaying ? "Now Playing" : "Paused"}
            </p>
          </div>
        </div>

        {/* Unlock prompt overlay */}
        {showUnlockPrompt && !unlocked && (
          <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-1">Episode {ep.number}</h3>
              <p className="text-gold font-bold mb-2">{ep.title}</p>
              <p className="text-sm text-gray-400 mb-6">{ep.coinCost} coins to unlock</p>

              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    Balance: <span className="text-gold font-bold">{coinBalance} coins</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentView("landing");
                    }}
                    className="px-6 py-3 bg-gold text-black font-bold rounded-lg"
                  >
                    Get Coins
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuth("signup");
                  }}
                  className="px-6 py-3 bg-gold text-black font-bold rounded-lg"
                >
                  Sign Up to Unlock
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (prevEp) navigateEpisode("prev");
                }}
                className="block mx-auto mt-3 text-sm text-steel hover:text-white"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(false);
                  setCurrentView("landing");
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <p className="text-xs text-gold font-bold">EP {ep.number}</p>
                <p className="text-xs text-white/70">{ep.title}</p>
              </div>
              <div className="w-8" />
            </div>
          </div>

          {/* Center play/pause */}
          {unlocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center transition-all ${
                  !isPlaying ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Progress bar */}
            <div className="mb-3">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-white/50">
                <span>{formatTime(progress)}</span>
                <span>{ep.runtime}</span>
              </div>
            </div>

            {/* Episode info */}
            <div className="mb-2">
              <p className="text-sm font-bold">{ep.title}</p>
              <p className="text-xs text-white/50 line-clamp-2">{ep.description}</p>
            </div>

            {/* Swipe hint */}
            <div className="text-center mt-2">
              <div className="swipe-hint inline-flex items-center gap-1 text-[10px] text-white/30">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Swipe for next episode
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows (desktop) */}
        <div className="hidden sm:block">
          {prevEp && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateEpisode("prev"); }}
              className="absolute top-1/2 -translate-y-1/2 -left-12 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {nextEp && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateEpisode("next"); }}
              className="absolute top-1/2 -translate-y-1/2 -right-12 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
