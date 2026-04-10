"use client";

import { useState } from "react";
import { episodes } from "@/lib/episodes";
import { tiers, coinPackages } from "@/lib/tiers";
import { useAppStore } from "@/lib/store";

export default function AdminPanel() {
  const { user, crewFundTotal, foundingSupporters, transactions } = useAppStore();
  const [activeTab, setActiveTab] = useState<"overview" | "episodes" | "sales" | "tiers">("overview");

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-steel">Sign in to access admin panel.</p>
      </div>
    );
  }

  const totalRevenue = transactions
    .filter((t) => t.type === "coin_purchase" || t.type === "tier_purchase")
    .reduce((a, t) => a + t.amount, 0);

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "episodes" as const, label: "Episodes" },
    { id: "sales" as const, label: "Sales" },
    { id: "tiers" as const, label: "Tiers" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">Admin Panel</h1>
          <span className="px-3 py-1 text-xs font-bold bg-blood/20 text-blood-light rounded-full border border-blood-light/20">
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-smoke/50 rounded-lg w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === t.id ? "bg-gold text-black" : "text-steel hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div>
            {/* Revenue cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-green-400" },
                { label: "Crew Fund", value: `$${crewFundTotal.toFixed(2)}`, color: "text-gold" },
                { label: "Founding Supporters", value: foundingSupporters.toString(), color: "text-blue-400" },
                { label: "Transactions", value: transactions.length.toString(), color: "text-purple-400" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-smoke/50 border border-white/5">
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-steel mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue chart placeholder */}
            <div className="p-6 rounded-xl bg-smoke/50 border border-white/5 mb-6">
              <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
              <div className="flex items-end gap-1 h-32">
                {[35, 42, 28, 55, 48, 62, 71, 58, 80, 65, 88, 95].map((v, i) => (
                  <div key={i} className="flex-1 bg-gold/20 rounded-t hover:bg-gold/40 transition-all" style={{ height: `${v}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-steel">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>

            {/* Coin economics */}
            <div className="p-6 rounded-xl bg-smoke/50 border border-white/5">
              <h3 className="text-lg font-bold mb-4">Coin Economics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-steel">Price per coin</div>
                  <div className="text-lg font-bold">$0.99</div>
                </div>
                <div>
                  <div className="text-sm text-steel">Coins per episode</div>
                  <div className="text-lg font-bold">3</div>
                </div>
                <div>
                  <div className="text-sm text-steel">Effective ep. price</div>
                  <div className="text-lg font-bold">$2.97</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-steel mb-2">Coin Packages</h4>
                <div className="space-y-1">
                  {coinPackages.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm p-2 rounded bg-black/20">
                      <span>{p.coins} coins</span>
                      <span className="text-gold">${p.price} ({p.savings})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "episodes" && (
          <div className="space-y-3">
            {episodes.map((ep) => (
              <div key={ep.id} className="p-4 rounded-xl bg-smoke/50 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">
                    {ep.number}
                  </div>
                  <div>
                    <h4 className="font-bold">{ep.title}</h4>
                    <p className="text-xs text-steel">{ep.runtime} &middot; {ep.isFree ? "Free" : `${ep.coinCost} coins`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${ep.isFree ? "bg-green-500/20 text-green-400" : "bg-gold/20 text-gold"}`}>
                    {ep.isFree ? "Free" : "Premium"}
                  </span>
                  <button className="px-3 py-1 text-xs bg-white/5 rounded-lg hover:bg-white/10 text-steel">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-steel">No transactions yet. Purchases will appear here.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-smoke/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        tx.type === "tier_purchase" ? "bg-purple-400" :
                        tx.type === "coin_purchase" ? "bg-gold" :
                        tx.type === "episode_unlock" ? "bg-blue-400" : "bg-green-400"
                      }`} />
                      <div>
                        <p className="text-sm">{tx.description}</p>
                        <p className="text-xs text-steel">{new Date(tx.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">
                      {tx.type === "episode_unlock" ? `${tx.amount} coins` : `$${tx.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "tiers" && (
          <div className="space-y-3">
            {tiers.map((tier) => (
              <div key={tier.id} className="p-4 rounded-xl bg-smoke/50 border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{tier.name}</h4>
                    <p className="text-sm text-gold">{tier.priceLabel}</p>
                  </div>
                  <div className="text-right">
                    {tier.limited && (
                      <p className="text-xs text-blood-light">{tier.spotsRemaining}/{tier.totalSpots} remaining</p>
                    )}
                    <button className="mt-1 px-3 py-1 text-xs bg-white/5 rounded-lg hover:bg-white/10 text-steel">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
