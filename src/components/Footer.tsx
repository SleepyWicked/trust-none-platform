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
