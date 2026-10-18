"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FILM_OFFERS, RENTAL_HOURS, formatPrice } from "@/lib/catalog";
import { useAuth } from "./AuthProvider";

type Access = { access: "none" | "owned" | "rented" | "signed-out"; expiresAt?: string };

export default function FilmOffers() {
  const { user, ready, openAuth, authFetch } = useAuth();
  // Fetched access for a given user id; signed-out state is derived, not stored.
  const [fetched, setFetched] = useState<{ userId: string; access: Access } | null>(null);
  const [busy, setBusy] = useState<"rent" | "buy" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !user) return;
    authFetch("/api/watch")
      .then((r) => r.json())
      .then((d: Access) => setFetched({ userId: user.id, access: d }))
      .catch(() => setFetched({ userId: user.id, access: { access: "none" } }));
  }, [ready, user, authFetch]);

  const access: Access | null = !ready ? null : !user ? { access: "signed-out" } : fetched?.userId === user.id ? fetched.access : null;

  // After signing in from the modal, `user` in this closure is still null, so
  // the post-sign-in callback goes straight to startCheckout.
  const checkout = (kind: "rent" | "buy") => (user ? startCheckout(kind) : openAuth("signup", () => startCheckout(kind)));

  const startCheckout = async (kind: "rent" | "buy") => {
    setBusy(kind);
    setError("");
    try {
      const res = await authFetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const data = await res.json();
      if (data.url) return window.location.assign(data.url);
      setError(data.error ?? "Checkout is unavailable right now");
    } catch {
      setError("Checkout is unavailable right now");
    }
    setBusy(null);
  };

  if (access?.access === "owned" || access?.access === "rented") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/watch" className="btn btn-solid">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z" /></svg>
          Watch Now
        </Link>
        <p className="text-sm text-haze">
          {access.access === "owned"
            ? "You own Trust None."
            : `Your rental ends ${new Date(access.expiresAt!).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => checkout("rent")} disabled={busy !== null} className="btn btn-solid">
          {busy === "rent" ? "Opening checkout…" : `Rent ${formatPrice(FILM_OFFERS.rent.priceCents)}`}
        </button>
        <button onClick={() => checkout("buy")} disabled={busy !== null} className="btn btn-ghost">
          {busy === "buy" ? "Opening checkout…" : `Buy ${formatPrice(FILM_OFFERS.buy.priceCents)}`}
        </button>
      </div>
      <p className="mt-3 text-sm text-haze">
        Rent: {RENTAL_HOURS} hours to watch. Buy: yours to stream anytime.
      </p>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
