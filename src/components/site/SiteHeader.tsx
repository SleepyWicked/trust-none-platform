"use client";

import Link from "next/link";
import { LOGO_URL } from "@/lib/film";
import { useAuth } from "./AuthProvider";

const NAV = [
  { href: "/#watch", label: "Watch" },
  { href: "/#cast", label: "Cast & Crew" },
  { href: "/shop", label: "Shop" },
];

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { user, ready, openAuth, signOut } = useAuth();

  return (
    <header className={`${overlay ? "absolute" : "relative border-b border-line"} inset-x-0 top-0 z-30`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" aria-label="Trust None home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Trust None" className="h-12 w-auto" />
        </Link>
        <nav aria-label="Main" className="flex items-center">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hidden min-h-11 items-center px-3 text-sm font-semibold uppercase tracking-[0.14em] sm:flex">
              {item.label}
            </Link>
          ))}
          <Link href="/shop" className="flex min-h-11 items-center px-3 text-sm font-semibold uppercase tracking-[0.14em] sm:hidden">
            Shop
          </Link>
          {ready &&
            (user ? (
              <button onClick={signOut} className="min-h-11 px-3 text-sm text-haze underline-offset-4 hover:underline">
                Sign out
              </button>
            ) : (
              <button onClick={() => openAuth("login")} className="min-h-11 px-3 text-sm font-semibold uppercase tracking-[0.14em]">
                Sign in
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}
