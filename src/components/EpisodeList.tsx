"use client";

import { useState } from "react";
import { episodes, SHOW_INFO } from "@/lib/episodes";
import { useAppStore } from "@/lib/store";
import EpisodeCard from "./EpisodeCard";
import CoinPurchaseModal from "./CoinPurchaseModal";

export default function EpisodeList() {
  const { isEpisodeUnlocked, spendCoins, unlockEpisode, coinBalance, user, openAuth, addTransaction, setCurrentView, setCurrentEpisode } =
    useAppStore();
  const [unlockModal, setUnlockModal] = useState<number | null>(null);
  const [coinModal, setCoinModal] = useState(false);

  const unlockedCount = episodes.filter(
    (e) => e.isFree || isEpisodeUnlocked(e.id)
  ).length;

  const handlePlay = (ep: typeof episodes[0]) => {
    setCurrentEpisode(ep.number);
    setCurrentView("watch");
    window.scrollTo(0, 0);
  };

  const handleUnlock = (ep: typeof episodes[0]) => {
    if (ep.isFree || isEpisodeUnlocked(ep.id)) {
      handlePlay(ep);
      return;
    }
    if (!user) {
      openAuth("signup");
      return;
    }
    setUnlockModal(ep.id);
  };

  const confirmUnlock = (epId: number) => {
    const ep = episodes.find((e) => e.id === epId);
    if (!ep) return;
    if (coinBalance >= ep.coinCost) {
      spendCoins(ep.coinCost);
      unlockEpisode(epId);
      addTransaction({
        type: "episode_unlock",
        amount: ep.coinCost,
        description: `Unlocked Episode ${ep.number}: ${ep.title}`,
      });
      setUnlockModal(null);
    } else {
      setUnlockModal(null);
      setCoinModal(true);
    }
  };

  return (
    <>
      <section id="episodes" className="py-20 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(212,165,32,0.04) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Episodes
              </h2>
              <p className="text-steel mt-1">
                Season {SHOW_INFO.season} &middot; Episodes 1-
                {SHOW_INFO.totalEpisodes}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gold font-bold">
                {unlockedCount} of {SHOW_INFO.totalEpisodes} unlocked
              </div>
              <div className="mt-1 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{
                    width: `${(unlockedCount / SHOW_INFO.totalEpisodes) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Free episodes banner */}
          <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-gold"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm text-gold/80">
              <span className="font-bold text-gold">
                First {SHOW_INFO.freeEpisodes} episodes are free
              </span>{" "}
              — no account needed. Start watching now.
            </p>
          </div>

          {/* Episode list */}
          <div className="space-y-3">
            {episodes.map((ep, i) => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                onPlay={handlePlay}
                onUnlock={handleUnlock}
                index={i}
              />
            ))}
          </div>

          {/* More coming soon */}
          <div className="mt-8 p-6 rounded-xl border border-dashed border-gold/20 text-center">
            <p className="text-gold font-bold text-lg">More episodes coming soon</p>
            <p className="text-steel text-sm mt-1">
              Season 1, Part 2 is in production. Stay tuned.
            </p>
          </div>
        </div>
      </section>

      {/* Unlock confirmation modal */}
      {unlockModal !== null && (
        <div
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
          onClick={() => setUnlockModal(null)}
        >
          <div
            className="bg-smoke border border-gold/20 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const ep = episodes.find((e) => e.id === unlockModal);
              if (!ep) return null;
              const canAfford = coinBalance >= ep.coinCost;
              return (
                <>
                  <h3 className="text-xl font-bold mb-1">
                    Unlock Episode {ep.number}
                  </h3>
                  <p className="text-gold font-bold mb-3">{ep.title}</p>
                  <p className="text-sm text-gray-400 mb-4">{ep.description}</p>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 mb-4">
                    <span className="text-sm text-gray-400">Cost</span>
                    <span className="text-gold font-bold">
                      {ep.coinCost} coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/30 mb-6">
                    <span className="text-sm text-gray-400">Your balance</span>
                    <span
                      className={`font-bold ${canAfford ? "text-green-400" : "text-red-400"}`}
                    >
                      {coinBalance} coins
                    </span>
                  </div>

                  {canAfford ? (
                    <button
                      onClick={() => confirmUnlock(unlockModal)}
                      className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all"
                    >
                      Unlock for {ep.coinCost} Coins
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUnlockModal(null);
                        setCoinModal(true);
                      }}
                      className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all"
                    >
                      Buy Coins ({ep.coinCost - coinBalance} more needed)
                    </button>
                  )}
                  <button
                    onClick={() => setUnlockModal(null)}
                    className="w-full py-2 mt-2 text-steel text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {coinModal && <CoinPurchaseModal onClose={() => setCoinModal(false)} />}
    </>
  );
}
