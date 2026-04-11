"use client";

import { useState } from "react";
import { tiers, CREW_FUND_PERCENTAGE } from "@/lib/tiers";
import { useAppStore } from "@/lib/store";

export default function TierCards() {
  const { user, openAuth, purchaseTier, purchasedTiers, unlockAllEpisodes, addToCrewFund, addTransaction } = useAppStore();
  const [processing, setProcessing] = useState<number | null>(null);
  const [checkoutData, setCheckoutData] = useState<Record<string, string>>({});

  const handlePurchase = async (tier: typeof tiers[0]) => {
    if (!user) { openAuth("signup"); return; }
    if (purchasedTiers.includes(tier.id)) return;
    if (tier.collectAtCheckout && tier.collectAtCheckout.length > 0) {
      const missing = tier.collectAtCheckout.filter(f => !checkoutData[`${tier.id}-${f}`]);
      if (missing.length > 0) return;
    }
    setProcessing(tier.id);
    // Collect checkout field data as metadata
    const metadata: Record<string, string> = {};
    if (tier.collectAtCheckout) {
      tier.collectAtCheckout.forEach(field => {
        metadata[field.replace(/\s+/g, "_")] = checkoutData[`${tier.id}-${field}`] || "";
      });
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tier.id === 10 ? "founding" : "tier",
          tierId: String(tier.id),
          amount: tier.id === 10 ? (Number(checkoutData[`${tier.id}-amount`]) || tier.price) : undefined,
          userId: user?.id,
          metadata,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setProcessing(null);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      setProcessing(null);
    }
  };

  const tierColors = [
    "border-gold/30",     // Season Pass
    "border-blue-500/30", // Insider
    "border-green-500/30",// Early Bird
    "border-purple-500/30",// Superfan
    "border-amber-500/30",// Producer
    "border-red-500/30",  // Name Char
    "border-cyan-500/30", // Set Visit
    "border-pink-500/30", // Meet & Greet
    "border-gold/50",     // EP
    "border-white/20",    // Founding
  ];

  return (
    <section id="tiers" className="py-20 relative">
      <div className="absolute inset-0 street-texture" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Support the Show
          </h2>
          <p className="text-steel mt-2 max-w-lg mx-auto">
            Every tier includes the full Season Pass. Pick the experience level that matches your fandom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((tier, i) => {
            const owned = purchasedTiers.includes(tier.id);
            return (
              <div
                key={tier.id}
                className={`tier-card relative rounded-xl border p-5 ${tierColors[i]} ${
                  tier.highlight ? "bg-gold/5 ring-1 ring-gold/20" : "bg-smoke/50"
                } ${owned ? "opacity-70" : ""}`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-2 right-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tier.badge === "Most Popular" ? "bg-gold text-black" :
                      tier.badge === "VIP" ? "bg-pink-500 text-white" :
                      tier.badge === "Ultra Rare" ? "bg-gradient-to-r from-gold to-amber-400 text-black" :
                      tier.badge === "Rare" ? "bg-red-500 text-white" :
                      tier.badge === "Limited" ? "bg-green-500 text-black" :
                      "bg-white/20 text-white"
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Tier name & price */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-gold">{tier.priceLabel}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-4">{tier.description}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Limited spots */}
                {tier.limited && tier.spotsRemaining !== undefined && (
                  <div className="mb-3 p-2 rounded-lg bg-black/30 text-center">
                    <span className="text-xs text-blood-light font-bold">
                      {tier.spotsRemaining} of {tier.totalSpots} spots remaining
                    </span>
                    <div className="mt-1 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blood-light rounded-full"
                        style={{ width: `${((tier.totalSpots! - tier.spotsRemaining) / tier.totalSpots!) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checkout fields */}
                {tier.collectAtCheckout && tier.collectAtCheckout.map(field => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    className="w-full mb-3 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gold/50 text-white placeholder-gray-500"
                    value={checkoutData[`${tier.id}-${field}`] || ""}
                    onChange={e => setCheckoutData(d => ({ ...d, [`${tier.id}-${field}`]: e.target.value }))}
                  />
                ))}

                {/* Buy button */}
                <button
                  onClick={() => handlePurchase(tier)}
                  disabled={owned || processing === tier.id}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                    owned
                      ? "bg-green-500/20 text-green-400 cursor-default"
                      : processing === tier.id
                      ? "bg-gold/20 text-gold cursor-wait"
                      : "bg-gold text-black hover:bg-gold-light"
                  }`}
                >
                  {owned ? "✓ Purchased" : processing === tier.id ? "Processing..." : `Get ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
