"use client";

import { useState } from "react";
import { coinPackages, FULL_SEASON_PRICE, CREW_FUND_PERCENTAGE } from "@/lib/tiers";
import { useAppStore } from "@/lib/store";

export default function CoinPurchaseModal({ onClose }: { onClose: () => void }) {
  const { addCoins, coinBalance, unlockAllEpisodes, addToCrewFund, addTransaction } =
    useAppStore();
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handlePurchaseCoins = async (pkg: (typeof coinPackages)[0]) => {
    setProcessing(true);
    setSelected(pkg.id);
    // Simulate Stripe checkout
    await new Promise((r) => setTimeout(r, 1500));
    addCoins(pkg.coins);
    addToCrewFund(pkg.price * CREW_FUND_PERCENTAGE);
    addTransaction({
      type: "coin_purchase",
      amount: pkg.price,
      description: `Purchased ${pkg.coins} coins`,
    });
    setProcessing(false);
    setSelected(null);
    onClose();
  };

  const handleFullSeason = async () => {
    setProcessing(true);
    setSelected("season");
    await new Promise((r) => setTimeout(r, 1500));
    unlockAllEpisodes();
    addToCrewFund(FULL_SEASON_PRICE * CREW_FUND_PERCENTAGE);
    addTransaction({
      type: "tier_purchase",
      amount: FULL_SEASON_PRICE,
      description: "Full Season 1 Unlock",
    });
    setProcessing(false);
    setSelected(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-smoke border border-gold/20 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black">Get Coins</h3>
          <button onClick={onClose} className="text-steel hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current balance */}
        <div className="p-3 rounded-lg bg-black/30 border border-gold/10 mb-6 text-center">
          <span className="text-sm text-gray-400">Current balance: </span>
          <span className="text-gold font-bold text-lg">{coinBalance} coins</span>
        </div>

        {/* Full season deal */}
        <div
          className={`mb-6 p-4 rounded-xl border-2 border-gold bg-gold/5 cursor-pointer hover:bg-gold/10 transition-all ${
            selected === "season" ? "ring-2 ring-gold" : ""
          }`}
          onClick={() => !processing && handleFullSeason()}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-gold text-black px-2 py-0.5 rounded-full">
                  BEST VALUE
                </span>
              </div>
              <h4 className="text-lg font-bold mt-1">Full Season Unlock</h4>
              <p className="text-sm text-gray-400">
                All 10 episodes, instant access, forever
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gold">$24.99</span>
              <p className="text-xs text-gray-500 line-through">$29.70</p>
            </div>
          </div>
          {selected === "season" && processing && (
            <div className="mt-3 flex items-center justify-center gap-2 text-gold text-sm">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </div>
          )}
        </div>

        <div className="text-center text-sm text-steel mb-4">— or buy coins —</div>

        {/* Coin packages */}
        <div className="space-y-3">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                pkg.popular
                  ? "border-gold/40 bg-gold/5 hover:bg-gold/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              } ${selected === pkg.id ? "ring-2 ring-gold" : ""}`}
              onClick={() => !processing && handlePurchaseCoins(pkg)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-lg">
                    🪙
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{pkg.coins} Coins</h4>
                      {pkg.popular && (
                        <span className="text-[10px] font-bold bg-gold text-black px-1.5 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-green-400">{pkg.savings}</p>
                  </div>
                </div>
                <span className="text-xl font-bold">${pkg.price}</span>
              </div>
              {selected === pkg.id && processing && (
                <div className="mt-2 flex items-center justify-center gap-2 text-gold text-sm">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Crew fund note */}
        <p className="mt-4 text-center text-xs text-steel">
          15% of every purchase goes to the crew fund 🎬
        </p>

        <p className="mt-2 text-center text-xs text-steel">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
}
