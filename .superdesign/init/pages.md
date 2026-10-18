# Pages

## / (Home, landing view)
Entry: src/app/page.tsx
Dependencies:
- src/components/ClientApp.tsx
  - src/components/App.tsx
    - src/components/AuthProvider.tsx (lib/supabase, lib/store)
    - src/components/Navigation.tsx (lib/store)
    - src/components/AuthModal.tsx
    - src/components/HeroSection.tsx
      - src/components/ShowPoster.tsx
    - src/components/TrailerSection.tsx
    - src/components/AboutShow.tsx (lib/episodes)
    - src/components/EpisodeList.tsx (lib/episodes, lib/store)
      - src/components/EpisodeCard.tsx
      - src/components/CoinPurchaseModal.tsx (lib/tiers)
    - src/components/TierCards.tsx (lib/tiers)
    - src/components/CrewFund.tsx
    - src/components/SocialProof.tsx
    - src/components/EmailCapture.tsx
    - src/components/Footer.tsx
      - src/components/SocialShare.tsx
- src/app/globals.css
- src/lib/episodes.ts, src/lib/tiers.ts

## watch view
- src/components/VerticalPlayer.tsx (lib/episodes, lib/store)

## dashboard view
- src/components/Dashboard.tsx

## /success
- src/app/success/page.tsx
