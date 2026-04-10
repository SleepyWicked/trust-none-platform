"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, rgba(212,165,32,0.03), transparent)" }} />
      <div className="max-w-lg mx-auto px-4 relative z-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">Stay in the Loop</h2>
        <p className="text-steel text-sm mb-6">
          Get notified about new episodes, Season 2 updates, and exclusive drops.
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
            <p className="text-gold font-bold">You&apos;re in. We&apos;ll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-smoke border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all flex-shrink-0"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
