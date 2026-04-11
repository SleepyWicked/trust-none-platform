"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, syncFromDatabase, loadSiteSettings, clearUserData } = useAppStore();

  useEffect(() => {
    // Load site-wide settings (video URLs) for ALL visitors
    loadSiteSettings();

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          createdAt: session.user.created_at,
        });
        syncFromDatabase(session.user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
            createdAt: session.user.created_at,
          });
          syncFromDatabase(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          clearUserData();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, syncFromDatabase, loadSiteSettings, clearUserData]);

  return <>{children}</>;
}
