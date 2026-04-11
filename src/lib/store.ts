"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
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
}

interface Transaction {
  id: string;
  type: "coin_purchase" | "episode_unlock" | "tier_purchase" | "founding_supporter";
  amount: number;
  description: string;
  date: string;
}

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
      addCoins: (amount) =>
        set((s) => ({ coinBalance: s.coinBalance + amount })),
      spendCoins: (amount) => {
        const state = get();
        if (state.coinBalance >= amount) {
          set({ coinBalance: state.coinBalance - amount });
          return true;
        }
        return false;
      },

      // Episodes - episodes 1-3 are always unlocked (free)
      unlockedEpisodes: [1, 2, 3],
      unlockEpisode: (episodeId) =>
        set((s) => ({
          unlockedEpisodes: s.unlockedEpisodes.includes(episodeId)
            ? s.unlockedEpisodes
            : [...s.unlockedEpisodes, episodeId],
        })),
      unlockAllEpisodes: () =>
        set({ unlockedEpisodes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),

      // Watch progress
      watchProgress: {},
      setWatchProgress: (episodeId, seconds) =>
        set((s) => ({
          watchProgress: { ...s.watchProgress, [episodeId]: seconds },
        })),

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
      purchaseTier: (tierId) =>
        set((s) => ({
          purchasedTiers: s.purchasedTiers.includes(tierId)
            ? s.purchasedTiers
            : [...s.purchasedTiers, tierId],
        })),

      // Video URLs
      episodeVideoUrls: {},
      trailerUrl: "",
      setEpisodeVideoUrl: (episodeId, url) =>
        set((s) => ({
          episodeVideoUrls: { ...s.episodeVideoUrls, [episodeId]: url },
        })),
      setTrailerUrl: (url) => set({ trailerUrl: url }),

      // UI
      currentView: "landing",
      currentEpisode: 1,
      setCurrentView: (view) => set({ currentView: view }),
      setCurrentEpisode: (ep) => set({ currentEpisode: ep }),

      // Transactions
      transactions: [],
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            {
              ...tx,
              id: Math.random().toString(36).slice(2),
              date: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        })),
    }),
    {
      name: "trust-none-storage",
    }
  )
);
