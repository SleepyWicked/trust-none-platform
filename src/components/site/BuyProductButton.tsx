"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { useAuth } from "./AuthProvider";

export default function BuyProductButton({ productId, priceCents }: { productId: string; priceCents: number | null }) {
  const { authFetch } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (priceCents === null) {
    return <p className="eyebrow flex min-h-12 items-center text-haze">Coming soon</p>;
  }

  const buy = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await authFetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "product", productId }),
      });
      const data = await res.json();
      if (data.url) return window.location.assign(data.url);
      setError(data.error ?? "Checkout is unavailable right now");
    } catch {
      setError("Checkout is unavailable right now");
    }
    setBusy(false);
  };

  return (
    <div>
      <button onClick={buy} disabled={busy} className="btn btn-solid w-full">
        {busy ? "Opening checkout…" : `Buy ${formatPrice(priceCents)}`}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
