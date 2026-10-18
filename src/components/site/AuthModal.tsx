"use client";

import { useEffect, useId, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  initialMode: "login" | "signup";
  onClose: () => void;
  onSignedIn: () => void;
};

const inputClass =
  "w-full min-h-12 border border-line bg-transparent px-3.5 text-paper placeholder:text-haze focus:border-paper focus:outline-none";

export default function AuthModal({ initialMode, onClose, onSignedIn }: Props) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const titleId = useId();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const { data, error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) return setError(authError.message);
    if (!data.session) {
      // Email confirmation is on: the account exists but isn't signed in yet.
      return setNotice("Check your email to confirm your account, then sign in.");
    }
    onSignedIn();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm border border-line bg-ink p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id={titleId} className="display text-5xl">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <p className="mt-1 text-sm text-haze">
              {mode === "login" ? "Welcome back." : "You'll use this to watch what you rent or buy."}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {error && <p role="alert" className="mb-4 border border-red-400/40 p-3 text-sm text-red-300">{error}</p>}
        {notice && <p role="status" className="mb-4 border border-line p-3 text-sm text-chalk">{notice}</p>}

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="eyebrow mb-1.5 block">Email</span>
            <input ref={emailRef} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="eyebrow mb-1.5 block">Password</span>
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {mode === "signup" && <span className="mt-1 block text-xs text-haze">At least 8 characters.</span>}
          </label>
          <button type="submit" disabled={loading} className="btn btn-solid w-full">
            {loading ? "One moment…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setNotice("");
          }}
          className="mt-4 min-h-11 w-full text-sm text-chalk underline underline-offset-4"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
