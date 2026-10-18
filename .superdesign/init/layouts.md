# Layouts

Single-route SPA: src/app/page.tsx -> ClientApp (ssr:false) -> App, which swaps views via Zustand currentView (landing|watch|dashboard|admin). Navigation + Footer are shared.

### `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trust None | A Chicago Street Drama",
  description:
    "In the city streets of Chicago, even your own family can't be trusted. Stream Season 1 now.",
  keywords: ["Trust None", "Chicago", "street drama", "micro drama", "streaming"],
  openGraph: {
    title: "Trust None | Season 1 Streaming Now",
    description: "In the city streets of Chicago, even your own family can't be trusted.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230a0a0a'/><text x='16' y='23' text-anchor='middle' font-size='18' font-weight='bold' fill='%23d4a520'>T</text></svg>"
        />
      </head>
      <body className="min-h-full bg-chicago text-white">{children}</body>
    </html>
  );
}

```

### `src/components/ClientApp.tsx`

```tsx
"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/components/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="text-center">
        <h1 className="text-4xl font-black text-shimmer">TRUST NONE</h1>
        <p className="text-sm mt-2" style={{ color: "#6a6a6a" }}>Loading...</p>
      </div>
    </div>
  ),
});

export default function ClientApp() {
  return <App />;
}

```

### `src/components/App.tsx`

```tsx
"use client";

import { useAppStore } from "@/lib/store";
import AuthProvider from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrailerSection from "@/components/TrailerSection";
import AboutShow from "@/components/AboutShow";
import EpisodeList from "@/components/EpisodeList";
import TierCards from "@/components/TierCards";
import CrewFund from "@/components/CrewFund";
import SocialProof from "@/components/SocialProof";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import VerticalPlayer from "@/components/VerticalPlayer";
import Dashboard from "@/components/Dashboard";
import AdminPanel from "@/components/AdminPanel";

export default function App() {
  const { currentView } = useAppStore();

  return (
    <AuthProvider>
      <Navigation />
      <AuthModal />

      {currentView === "landing" && (
        <main className="min-h-screen">
          <HeroSection />
          <TrailerSection />
          <AboutShow />
          <EpisodeList />
          <TierCards />
          <CrewFund />
          <SocialProof />
          <EmailCapture />
          <Footer />
        </main>
      )}

      {currentView === "watch" && <VerticalPlayer />}

      {currentView === "dashboard" && (
        <>
          <Dashboard />
          <Footer />
        </>
      )}

      {currentView === "admin" && (
        <>
          <AdminPanel />
          <Footer />
        </>
      )}
    </AuthProvider>
  );
}

```

### `src/components/Navigation.tsx`

```tsx
"use client";

import { useAppStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Navigation() {
  const { user, coinBalance, openAuth, setUser, currentView, setCurrentView } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-md bg-gold/10 border border-gold/30 flex items-center justify-center">
              <span className="text-gold font-black text-sm">T</span>
            </div>
            <span className="text-sm font-black tracking-tight hidden sm:block">
              <span className="text-shimmer">TRUST NONE</span>
            </span>
          </button>

          {/* Center nav */}
          <div className="hidden sm:flex items-center gap-6">
            {[
              { label: "Home", view: "landing" as const },
              { label: "Watch", view: "watch" as const },
              { label: "Dashboard", view: "dashboard" as const },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.view ? "text-gold" : "text-steel hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Coin balance */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
                  <span className="text-sm">🪙</span>
                  <span className="text-sm font-bold text-gold">{coinBalance}</span>
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs"
                  >
                    {user.name[0].toUpperCase()}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-smoke border border-white/10 rounded-xl shadow-xl overflow-hidden">
                      <div className="p-3 border-b border-white/5">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-steel truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setCurrentView("dashboard"); setMenuOpen(false); }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                      >
                        Dashboard
                      </button>
                      {user.email.toLowerCase() === "mickeyelahi@gmail.com" && (
                        <button
                          onClick={() => { setCurrentView("admin"); setMenuOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors"
                        >
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={async () => { await supabase.auth.signOut(); setMenuOpen(false); }}
                        className="w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="px-4 py-1.5 text-sm font-bold bg-gold text-black rounded-lg hover:bg-gold-light transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

```

### `src/components/Footer.tsx`

```tsx
"use client";

import { SHOW_INFO } from "@/lib/episodes";
import SocialShare from "./SocialShare";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        {/* More shows coming soon */}
        <div className="text-center mb-10 p-6 rounded-xl border border-dashed border-white/10">
          <p className="text-lg font-bold text-white mb-1">More shows coming soon</p>
          <p className="text-sm text-steel">
            This is just the beginning. Trust None is the first show on a growing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-black text-xs">T</span>
              </div>
              <span className="font-black text-sm text-shimmer">TRUST NONE</span>
            </div>
            <p className="text-xs text-steel leading-relaxed">{SHOW_INFO.logline}</p>
            <div className="mt-3">
              <SocialShare />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold mb-3">Platform</h4>
            <div className="space-y-2">
              {["Watch Now", "Episodes", "Pricing", "About"].map((link) => (
                <a key={link} href="#" className="block text-sm text-steel hover:text-gold transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="text-sm font-bold mb-3">Connect</h4>
            <div className="space-y-2">
              <p className="text-sm text-steel">{SHOW_INFO.socialHandle}</p>
              <p className="text-sm text-steel">{SHOW_INFO.website}</p>
            </div>
            <div className="mt-4 space-y-2">
              {["Terms of Service", "Privacy Policy", "Contact"].map((link) => (
                <a key={link} href="#" className="block text-xs text-steel/50 hover:text-steel transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-steel/50">
            &copy; {SHOW_INFO.year} {SHOW_INFO.creator}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

```
