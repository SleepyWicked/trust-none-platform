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
