"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";

type AuthMode = "login" | "signup";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  openAuth: (mode?: AuthMode, onSignedIn?: () => void) => void;
  signOut: () => Promise<void>;
  /** fetch() that sends the user's access token so API routes can verify them. */
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<{ mode: AuthMode; onSignedIn?: () => void } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const authFetch = useCallback(async (input: string, init: RequestInit = {}) => {
    const { data } = await supabase.auth.getSession();
    const headers = new Headers(init.headers);
    if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
    return fetch(input, { ...init, headers });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      openAuth: (mode = "login", onSignedIn) => setModal({ mode, onSignedIn }),
      signOut: async () => {
        await supabase.auth.signOut();
      },
      authFetch,
    }),
    [user, ready, authFetch]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modal && (
        <AuthModal
          initialMode={modal.mode}
          onClose={() => setModal(null)}
          onSignedIn={() => {
            const next = modal.onSignedIn;
            setModal(null);
            next?.();
          }}
        />
      )}
    </AuthContext.Provider>
  );
}
