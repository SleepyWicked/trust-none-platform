"use client";

import { episodes } from "@/lib/episodes";
import { useAppStore } from "@/lib/store";

export default function Dashboard() {
  const { user, coinBalance, unlockedEpisodes, watchProgress, transactions, purchasedTiers, setCurrentView, setCurrentEpisode } = useAppStore();

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-steel">Sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const unlockedEps = episodes.filter((e) => e.isFree || unlockedEpisodes.includes(e.id));
  const totalWatchTime = Object.values(watchProgress).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Dashboard</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Coin Balance", value: coinBalance.toString(), icon: "🪙" },
            { label: "Episodes Unlocked", value: `${unlockedEps.length}/10`, icon: "🔓" },
            { label: "Watch Time", value: `${Math.floor(totalWatchTime / 60)}m`, icon: "⏱️" },
            { label: "Tiers Owned", value: purchasedTiers.length.toString(), icon: "🏆" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-smoke/50 border border-white/5">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-gold">{s.value}</div>
              <div className="text-xs text-steel">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Unlocked episodes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Episodes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {episodes.map((ep) => {
              const unlocked = ep.isFree || unlockedEpisodes.includes(ep.id);
              const prog = watchProgress[ep.id] || 0;
              const pct = ep.runtimeSeconds > 0 ? (prog / ep.runtimeSeconds) * 100 : 0;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    if (unlocked) {
                      setCurrentEpisode(ep.number);
                      setCurrentView("watch");
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    unlocked
                      ? "bg-smoke/50 border-gold/10 hover:border-gold/30 cursor-pointer"
                      : "bg-black/30 border-white/5 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="text-xs text-gold font-bold">EP {ep.number}</div>
                  <div className="text-sm font-bold truncate mt-0.5">{ep.title}</div>
                  <div className="text-[10px] text-steel mt-1">{ep.runtime}</div>
                  {unlocked && pct > 0 && (
                    <div className="mt-2 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  {!unlocked && (
                    <div className="mt-2 text-[10px] text-steel flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Locked
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-steel text-sm">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 20).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-smoke/50 border border-white/5">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-steel">
                      {new Date(tx.date).toLocaleDateString()} &middot;{" "}
                      {new Date(tx.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gold">
                    {tx.type === "coin_purchase" || tx.type === "tier_purchase"
                      ? `$${tx.amount.toFixed(2)}`
                      : `-${tx.amount} coins`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
