"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: "coin_purchase" | "episode_unlock" | "tier_purchase" | "founding_supporter";
  amount: number;
  description: string;
  date: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthModalOpen: boolean;
  authMode: "login" | "signup";
  setUser: (user: User | null) => void;
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;

  // Coins
  coinBalance: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // Episodes
  unlockedEpisodes: number[];
  unlockEpisode: (episodeId: number) => void;
  unlockAllEpisodes: () => void;

  // Watch progress
  watchProgress: Record<number, number>;
  setWatchProgress: (episodeId: number, seconds: number) => void;

  // Crew Fund
  crewFundTotal: number;
  addToCrewFund: (amount: number) => void;

  // Founding Supporters
  foundingSupporters: number;
  addFoundingSupporter: () => void;

  // Tier purchases
  purchasedTiers: number[];
  purchaseTier: (tierId: number) => void;

  // Video URLs
  episodeVideoUrls: Record<number, string>;
  trailerUrl: string;
  setEpisodeVideoUrl: (episodeId: number, url: string) => void;
  setTrailerUrl: (url: string) => void;

  // UI
  currentView: "landing" | "watch" | "dashboard" | "admin";
  currentEpisode: number;
  setCurrentView: (view: "landing" | "watch" | "dashboard" | "admin") => void;
  setCurrentEpisode: (ep: number) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;

  // Supabase sync
  syncFromDatabase: (userId: string) => Promise<void>;
  loadSiteSettings: () => Promise<void>;
  clearUserData: () => void;
  saveWatchProgressToDb: (episodeId: number, seconds: number) => void;
}

// Debounce helper for watch progress saves
let watchProgressTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthModalOpen: false,
      authMode: "login",
      setUser: (user) => set({ user }),
      openAuth: (mode = "login") =>
        set({ isAuthModalOpen: true, authMode: mode }),
      closeAuth: () => set({ isAuthModalOpen: false }),

      // Coins
      coinBalance: 0,
      addCoins: (amount) => {
        set((s) => ({ coinBalance: s.coinBalance + amount }));
        // Sync to Supabase
        const user = get().user;
        if (user) {
          const newBalance = get().coinBalance;
          supabase
            .from("profiles")
            .update({ coin_balance: newBalance })
            .eq("id", user.id)
            .then();
        }
      },
      spendCoins: (amount) => {
        const state = get();
        if (state.coinBalance >= amount) {
          const newBalance = state.coinBalance - amount;
          set({ coinBalance: newBalance });
          if (state.user) {
            supabase
              .from("profiles")
              .update({ coin_balance: newBalance })
              .eq("id", state.user.id)
              .then();
          }
          return true;
        }
        return false;
      },

      // Episodes - episodes 1-3 are always unlocked (free)
      unlockedEpisodes: [1, 2, 3],
      unlockEpisode: (episodeId) => {
        set((s) => ({
          unlockedEpisodes: s.unlockedEpisodes.includes(episodeId)
            ? s.unlockedEpisodes
            : [...s.unlockedEpisodes, episodeId],
        }));
        const user = get().user;
        if (user) {
          supabase
            .from("user_episodes")
            .upsert({ user_id: user.id, episode_id: episodeId }, { onConflict: "user_id,episode_id" })
            .then();
        }
      },
      unlockAllEpisodes: () => {
        set({ unlockedEpisodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
        const user = get().user;
        if (user) {
          const rows = [4, 5, 6, 7, 8, 9, 10].map((ep) => ({
            user_id: user.id,
            episode_id: ep,
          }));
          supabase
            .from("user_episodes")
            .upsert(rows, { onConflict: "user_id,episode_id" })
            .then();
        }
      },

      // Watch progress
      watchProgress: {},
      setWatchProgress: (episodeId, seconds) => {
        set((s) => ({
          watchProgress: { ...s.watchProgress, [episodeId]: seconds },
        }));
        // Debounced save to DB (every 5 seconds)
        get().saveWatchProgressToDb(episodeId, seconds);
      },

      // Crew Fund
      crewFundTotal: 14847.52,
      addToCrewFund: (amount) =>
        set((s) => ({ crewFundTotal: s.crewFundTotal + amount })),

      // Founding Supporters
      foundingSupporters: 312,
      addFoundingSupporter: () =>
        set((s) => ({ foundingSupporters: s.foundingSupporters + 1 })),

      // Tiers
      purchasedTiers: [],
      purchaseTier: (tierId) => {
        set((s) => ({
          purchasedTiers: s.purchasedTiers.includes(tierId)
            ? s.purchasedTiers
            : [...s.purchasedTiers, tierId],
        }));
        const user = get().user;
        if (user) {
          supabase
            .from("user_tiers")
            .upsert({ user_id: user.id, tier_id: tierId }, { onConflict: "user_id,tier_id" })
            .then();
        }
      },

      // Video URLs (stored in Supabase site_settings for all users)
      episodeVideoUrls: {},
      trailerUrl: "",
      setEpisodeVideoUrl: (episodeId, url) => {
        const updated = { ...get().episodeVideoUrls, [episodeId]: url };
        set({ episodeVideoUrls: updated });
        // Save to Supabase
        supabase
          .from("site_settings")
          .upsert({ key: "episode_video_urls", value: updated, updated_at: new Date().toISOString() }, { onConflict: "key" })
          .then();
      },
      setTrailerUrl: (url) => {
        set({ trailerUrl: url });
        supabase
          .from("site_settings")
          .upsert({ key: "trailer_url", value: JSON.stringify(url), updated_at: new Date().toISOString() }, { onConflict: "key" })
          .then();
      },

      // UI
      currentView: "landing",
      currentEpisode: 1,
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentEpisode: (ep) => set({ currentEpisode: ep }),

      // Transactions
      transactions: [],
      addTransaction: (tx) => {
        const newTx = {
          ...tx,
          id: Math.random().toString(36).slice(2),
          date: new Date().toISOString(),
        };
        set((s) => ({ transactions: [newTx, ...s.transactions] }));
        // Write to Supabase
        const user = get().user;
        if (user) {
          supabase
            .from("transactions")
            .insert({
              user_id: user.id,
              type: tx.type,
              amount: tx.amount,
              description: tx.description,
            })
            .then();
        }
      },

      // Supabase sync — load all user data from database
      syncFromDatabase: async (userId: string) => {
        try {
          // Load profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("coin_balance, name")
            .eq("id", userId)
            .single();

          if (profile) {
            set({ coinBalance: profile.coin_balance || 0 });
          }

          // Load unlocked episodes
          const { data: episodes } = await supabase
            .from("user_episodes")
            .select("episode_id")
            .eq("user_id", userId);

          if (episodes && episodes.length > 0) {
            const episodeIds = episodes.map((e) => e.episode_id);
            // Always include free episodes
            const allUnlocked = [...new Set([1, 2, 3, ...episodeIds])];
            set({ unlockedEpisodes: allUnlocked });
          }

          // Load tiers
          const { data: tiers } = await supabase
            .from("user_tiers")
            .select("tier_id")
            .eq("user_id", userId);

          if (tiers && tiers.length > 0) {
            set({ purchasedTiers: tiers.map((t) => t.tier_id) });
          }

          // Load watch progress
          const { data: progress } = await supabase
            .from("watch_progress")
            .select("episode_id, seconds_watched")
            .eq("user_id", userId);

          if (progress && progress.length > 0) {
            const wp: Record<number, number> = {};
            progress.forEach((p) => { wp[p.episode_id] = p.seconds_watched; });
            set({ watchProgress: wp });
          }

          // Load transactions
          const { data: txs } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);

          if (txs && txs.length > 0) {
            set({
              transactions: txs.map((t) => ({
                id: String(t.id),
                type: t.type as Transaction["type"],
                amount: Number(t.amount),
                description: t.description || "",
                date: t.created_at,
              })),
            });
          }
        } catch (err) {
          console.error("Failed to sync from database:", err);
        }
      },

      // Load site-wide settings (video URLs) — runs for ALL visitors
      loadSiteSettings: async () => {
        try {
          const { data } = await supabase
            .from("site_settings")
            .select("key, value");
          if (data) {
            for (const row of data) {
              if (row.key === "episode_video_urls" && row.value) {
                set({ episodeVideoUrls: row.value as Record<number, string> });
              }
              if (row.key === "trailer_url" && row.value) {
                const url = typeof row.value === "string" ? row.value : String(row.value).replace(/^"|"$/g, "");
                set({ trailerUrl: url });
              }
            }
          }
        } catch (err) {
          console.error("Failed to load site settings:", err);
        }
      },

      clearUserData: () => {
        set({
          coinBalance: 0,
          unlockedEpisodes: [1, 2, 3],
          watchProgress: {},
          purchasedTiers: [],
          transactions: [],
        });
      },

      saveWatchProgressToDb: (episodeId: number, seconds: number) => {
        if (watchProgressTimer) clearTimeout(watchProgressTimer);
        watchProgressTimer = setTimeout(() => {
          const user = get().user;
          if (user) {
            supabase
              .from("watch_progress")
              .upsert(
                {
                  user_id: user.id,
                  episode_id: episodeId,
                  seconds_watched: Math.floor(seconds),
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id,episode_id" }
              )
              .then();
          }
        }, 5000);
      },
    }),
    {
      name: "trust-none-storage",
    }
  )
);
