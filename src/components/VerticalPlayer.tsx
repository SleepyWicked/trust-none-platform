"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { episodes } from "@/lib/episodes";
import { useAppStore } from "@/lib/store";

export default function VerticalPlayer() {
  const {
    currentEpisode,
    setCurrentEpisode,
    unlockedEpisodes,
    setCurrentView,
    watchProgress,
    setWatchProgress,
    episodeVideoUrls,
    user,
    openAuth,
    coinBalance,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const touchStartRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const ep = episodes.find((e) => e.number === currentEpisode) || episodes[0];
  const unlocked = ep.isFree || unlockedEpisodes.includes(ep.id);
  const nextEp = episodes.find((e) => e.number === currentEpisode + 1);
  const prevEp = episodes.find((e) => e.number === currentEpisode - 1);

  // Get video URL: from store (admin-set) or from episode data
  const videoUrl = episodeVideoUrls[ep.id] || ep.videoUrl || "";
  const hasVideo = videoUrl.length > 0;
  const isBunnyPlayer = hasVideo && (videoUrl.includes("mediadelivery.net") || videoUrl.includes("player.mediadelivery.net"));
  // Convert play URL to embed URL for iframe
  const embedUrl = isBunnyPlayer
    ? videoUrl.replace("/play/", "/embed/") + "?autoplay=false&preload=true&responsive=true&playsinline=true"
    : "";

  // ---- REAL VIDEO PLAYBACK ----
  useEffect(() => {
    if (!hasVideo || !unlocked) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setProgress(video.currentTime);
      setWatchProgress(ep.id, video.currentTime);
    };
    const onDurationChange = () => setDuration(video.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (nextEp) {
        setTimeout(() => {
          setCurrentEpisode(nextEp.number);
          setIsPlaying(true);
        }, 1500);
      }
    };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);

    // Restore progress
    const saved = watchProgress[ep.id];
    if (saved && saved > 0 && saved < (video.duration || Infinity)) {
      video.currentTime = saved;
    }

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, currentEpisode, unlocked]);

  // Play/pause real video
  useEffect(() => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying && unlocked) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, hasVideo, unlocked]);

  // ---- SIMULATED PLAYBACK (fallback when no video URL) ----
  useEffect(() => {
    if (hasVideo) return; // skip simulation if real video
    if (isPlaying && unlocked) {
      const startTime = watchProgress[ep.id] || 0;
      setProgress(startTime);
      let currentProgress = startTime;
      timerRef.current = setInterval(() => {
        currentProgress += 1;
        if (currentProgress >= ep.runtimeSeconds) {
          clearInterval(timerRef.current!);
          setProgress(ep.runtimeSeconds);
          setWatchProgress(ep.id, ep.runtimeSeconds);
          setIsPlaying(false);
          if (nextEp) {
            setTimeout(() => {
              setCurrentEpisode(nextEp.number);
              setIsPlaying(true);
            }, 1500);
          }
          return;
        }
        setProgress(currentProgress);
        setWatchProgress(ep.id, currentProgress);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentEpisode, unlocked, hasVideo]);

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

  const totalDuration = hasVideo && duration > 0 ? duration : ep.runtimeSeconds;
  const progressPct = totalDuration > 0 ? (progress / totalDuration) * 100 : 0;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-14">
      <div
        ref={containerRef}
        className="relative w-full max-w-md aspect-[9/16] bg-black mx-auto overflow-hidden select-none"
        onTouchStart={isBunnyPlayer ? undefined : handleTouchStart}
        onTouchEnd={isBunnyPlayer ? undefined : handleTouchEnd}
        onClick={isBunnyPlayer ? undefined : handleTap}
      >
        {/* Bunny.net iframe player */}
        {isBunnyPlayer && unlocked && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0 z-[5]"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}

        {/* Direct video element (non-Bunny URLs like .mp4) */}
        {hasVideo && !isBunnyPlayer && unlocked && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            preload="auto"
            muted={false}
          />
        )}

        {/* Fallback gradient background (no video URL) */}
        {!hasVideo && (
          <>
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-6xl mb-4 opacity-20">{ep.thumbnailIcon}</div>
                <p className="text-white/10 text-xs uppercase tracking-[0.3em]">
                  {isPlaying ? "Now Playing" : "Paused"}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Buffering indicator */}
        {isBuffering && hasVideo && (
          <div className="absolute inset-0 z-15 flex items-center justify-center">
            <svg className="animate-spin w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

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
                    onClick={(e) => { e.stopPropagation(); setCurrentView("landing"); }}
                    className="px-6 py-3 bg-gold text-black font-bold rounded-lg"
                  >
                    Get Coins
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); openAuth("signup"); }}
                  className="px-6 py-3 bg-gold text-black font-bold rounded-lg"
                >
                  Sign Up to Unlock
                </button>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); if (prevEp) navigateEpisode("prev"); }}
                className="block mx-auto mt-3 text-sm text-steel hover:text-white"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Controls overlay — hidden for Bunny iframe (it has its own controls) */}
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
            isBunnyPlayer ? "pointer-events-none opacity-0" :
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); setCurrentView("landing"); }}
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
            <div className="mb-3">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-white/50">
                <span>{formatTime(progress)}</span>
                <span>{hasVideo && duration > 0 ? formatTime(duration) : ep.runtime}</span>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-sm font-bold">{ep.title}</p>
              <p className="text-xs text-white/50 line-clamp-2">{ep.description}</p>
            </div>

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
