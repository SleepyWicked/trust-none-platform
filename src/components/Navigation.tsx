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
