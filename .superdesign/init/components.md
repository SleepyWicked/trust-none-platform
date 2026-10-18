# Components

Stack: Next.js 16 (App Router, TS), React 19, Tailwind CSS v4 (CSS-first @theme in globals.css, no tailwind.config), Zustand, Framer Motion + lucide-react installed but unused. No component library — all custom; no shared primitive folder. Buttons/cards are inline Tailwind in feature components. The most reusable pieces:

- EpisodeCard — episode row (thumbnail gradient, lock state, progress)
- ShowPoster — CSS-generated 9:16 poster
- TierCards — pricing tier cards
- SocialShare — share buttons

### `src/components/EpisodeCard.tsx`

```tsx
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
  const { unlockedEpisodes, watchProgress } = useAppStore();
  const unlocked = episode.isFree || unlockedEpisodes.includes(episode.id);
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

```

### `src/components/ShowPoster.tsx`

```tsx
"use client";

export default function ShowPoster({ size = "large" }: { size?: "small" | "medium" | "large" }) {
  const dims = {
    small: "w-24 h-42",
    medium: "w-40 h-72",
    large: "w-64 h-[28rem]",
  }[size];

  return (
    <div
      className={`${dims} relative rounded-lg overflow-hidden shadow-2xl flex-shrink-0`}
      style={{
        background: `
          linear-gradient(180deg,
            rgba(0,0,0,0) 0%,
            rgba(139,0,0,0.3) 30%,
            rgba(212,165,32,0.2) 60%,
            rgba(0,0,0,0.95) 100%),
          linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)
        `,
      }}
    >
      {/* City skyline silhouette */}
      <svg
        className="absolute bottom-16 left-0 right-0 w-full opacity-20"
        viewBox="0 0 200 60"
        fill="none"
      >
        <rect x="10" y="20" width="8" height="40" fill="#d4a520" />
        <rect x="22" y="10" width="12" height="50" fill="#d4a520" />
        <rect x="38" y="25" width="6" height="35" fill="#d4a520" />
        <rect x="48" y="5" width="10" height="55" fill="#d4a520" />
        <rect x="62" y="15" width="14" height="45" fill="#d4a520" />
        <rect x="80" y="0" width="8" height="60" fill="#d4a520" />
        <rect x="92" y="20" width="16" height="40" fill="#d4a520" />
        <rect x="112" y="8" width="10" height="52" fill="#d4a520" />
        <rect x="126" y="22" width="8" height="38" fill="#d4a520" />
        <rect x="138" y="12" width="12" height="48" fill="#d4a520" />
        <rect x="154" y="18" width="6" height="42" fill="#d4a520" />
        <rect x="164" y="5" width="14" height="55" fill="#d4a520" />
        <rect x="182" y="15" width="10" height="45" fill="#d4a520" />
      </svg>

      {/* Crosshair/target overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-32 h-32 border-2 border-gold rounded-full" />
        <div className="absolute w-20 h-20 border border-gold rounded-full" />
        <div className="absolute w-0.5 h-16 bg-gold" />
        <div className="absolute w-16 h-0.5 bg-gold" />
      </div>

      {/* Rating badge */}
      <div className="absolute top-3 right-3 bg-black/70 border border-gold/30 px-2 py-0.5 rounded text-xs font-bold text-gold">
        TV-MA
      </div>

      {/* Title area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="text-gold-light text-xs font-bold tracking-[0.3em] uppercase mb-1">
          Season 1
        </div>
        <h2
          className="text-3xl font-black tracking-tight leading-none"
          style={{
            background: "linear-gradient(180deg, #f5c518 0%, #d4a520 50%, #b8860b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TRUST
          <br />
          NONE
        </h2>
        <div className="mt-2 w-12 h-0.5 bg-blood-light" />
        <p className="text-[10px] text-gray-400 mt-2 leading-tight">
          Chicago &middot; Drama &middot; 10 Episodes
        </p>
      </div>
    </div>
  );
}

```

### `src/components/TierCards.tsx`

```tsx
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

```

### `src/components/SocialShare.tsx`

```tsx
"use client";

import { SHOW_INFO } from "@/lib/episodes";

const shareUrl = "https://trustnonemovie.com";
const shareText = `${SHOW_INFO.title} — ${SHOW_INFO.logline} Watch free now!`;

const platforms = [
  {
    name: "X",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Facebook",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Instagram",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    url: `https://www.instagram.com/`,
  },
  {
    name: "TikTok",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    url: `https://www.tiktok.com/`,
  },
];

export default function SocialShare() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-steel mr-1">Share:</span>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-steel hover:text-gold hover:border-gold/30 transition-all"
          title={`Share on ${p.name}`}
        >
          {p.icon}
        </a>
      ))}
    </div>
  );
}

```
