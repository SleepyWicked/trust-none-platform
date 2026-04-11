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
