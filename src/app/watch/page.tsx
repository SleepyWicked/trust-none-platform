"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import FilmOffers from "@/components/site/FilmOffers";
import { useAuth } from "@/components/site/AuthProvider";

type WatchState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "no-access" }
  | { status: "not-uploaded" }
  | { status: "ready"; embedUrl: string; expiresAt?: string }
  | { status: "error" };

export default function WatchPage() {
  const { user, ready, openAuth, authFetch } = useAuth();
  const [fetched, setFetched] = useState<{ userId: string; state: WatchState } | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    const setState = (state: WatchState) => setFetched({ userId: user.id, state });
    authFetch("/api/watch")
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 402) return setState({ status: "no-access" });
        if (!res.ok) return setState({ status: "error" });
        if (!data.embedUrl) return setState({ status: "not-uploaded" });
        setState({ status: "ready", embedUrl: data.embedUrl, expiresAt: data.expiresAt });
      })
      .catch(() => setState({ status: "error" }));
  }, [ready, user, authFetch]);

  const state: WatchState = !ready
    ? { status: "loading" }
    : !user
      ? { status: "signed-out" }
      : fetched?.userId === user.id
        ? fetched.state
        : { status: "loading" };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        {state.status === "ready" ? (
          <>
            <div className="relative aspect-video w-full bg-void">
              <iframe
                src={state.embedUrl}
                title="Trust None — full movie"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <h1 className="display text-6xl">Trust None</h1>
              {state.expiresAt && (
                <p className="text-sm text-haze">Rental ends {new Date(state.expiresAt).toLocaleString()}</p>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h1 className="display text-8xl">Trust None</h1>
            {state.status === "loading" && <p className="mt-4 text-haze">Loading…</p>}
            {state.status === "signed-out" && (
              <>
                <p className="mt-4 text-chalk">Sign in to watch the movie you rented or bought.</p>
                <button onClick={() => openAuth("login")} className="btn btn-solid mt-6">Sign In</button>
              </>
            )}
            {state.status === "no-access" && (
              <>
                <p className="mb-6 mt-4 text-chalk">Rent or buy Trust None to start watching.</p>
                <div className="flex justify-center"><FilmOffers /></div>
              </>
            )}
            {state.status === "not-uploaded" && (
              <p className="mt-4 text-chalk">You&apos;re all set — the movie is being uploaded. Check back soon.</p>
            )}
            {state.status === "error" && <p className="mt-4 text-chalk">Something went wrong loading the player. Refresh to try again.</p>}
            <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-haze underline underline-offset-4">Back to home</Link>
          </div>
        )}
      </main>
    </>
  );
}
