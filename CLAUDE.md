@AGENTS.md

# Trust None — Streaming Platform

## Project Overview
Self-distributing platform for "Trust None," a vertical micro-drama series set in Chicago.
Built to look and function like a premium streaming service (think ReelShort/Netflix).

## Show Details
- **Title:** Trust None
- **Logline:** In the city streets of Chicago, even your own family can't be trusted.
- **Genre:** Street Life, Drama, Comedy, Adventure
- **Rating:** TV-MA
- **Season 1:** 10 episodes (1-3 free, 4-10 cost 3 coins each)
- **Format:** Vertical 9:16 (TikTok/Reels style)
- **Website:** trustnonemovie.com
- **Social:** @TrustNoneShow

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **State:** Zustand with localStorage persistence
- **Payments:** Stripe.js (integration ready, currently simulated)
- **Animations:** Framer Motion (installed), CSS animations
- **Icons:** Lucide React (installed)

## Architecture
```
src/
├── app/
│   ├── layout.tsx          # Root layout (Server Component)
│   ├── page.tsx            # Imports ClientApp (Server Component)
│   └── globals.css         # Tailwind + custom animations
├── components/
│   ├── ClientApp.tsx       # Dynamic import wrapper (ssr:false)
│   ├── App.tsx             # Main app shell (client-side only)
│   ├── Navigation.tsx      # Glass nav bar with auth/coins
│   ├── HeroSection.tsx     # Landing hero with CTAs
│   ├── TrailerSection.tsx  # 9:16 trailer player
│   ├── AboutShow.tsx       # Synopsis + metadata
│   ├── EpisodeList.tsx     # All 10 episodes with unlock logic
│   ├── EpisodeCard.tsx     # Individual episode row
│   ├── VerticalPlayer.tsx  # TikTok-style swipe player
│   ├── TierCards.tsx       # All 10 support tiers
│   ├── CoinPurchaseModal.tsx # Coin packages + full season
│   ├── CrewFund.tsx        # Animated crew fund counter
│   ├── SocialProof.tsx     # Ratings + founding supporters
│   ├── AuthModal.tsx       # Sign in/up modal
│   ├── Dashboard.tsx       # User stats + episodes + history
│   ├── AdminPanel.tsx      # Revenue, episodes, sales, tiers
│   ├── EmailCapture.tsx    # Newsletter signup
│   ├── SocialShare.tsx     # X, FB, IG, TikTok share buttons
│   ├── ShowPoster.tsx      # CSS-generated show poster
│   └── Footer.tsx          # Links + "more shows coming"
└── lib/
    ├── episodes.ts         # 10 episode definitions
    ├── tiers.ts            # 10 tier definitions + coin packages
    └── store.ts            # Zustand store (auth, coins, episodes, UI)
```

## Key Design Decisions
- **Client-side only rendering** via `dynamic(() => import("@/components/App"), { ssr: false })` in ClientApp.tsx — eliminates Zustand hydration issues
- **No `isEpisodeUnlocked` store method** — was calling `get()` during render causing "Cannot update component" errors. Components use `unlockedEpisodes.includes(id)` directly instead.
- **All visual assets are CSS/SVG** — no external images. Poster, thumbnails, backgrounds are gradient-based.
- **Color palette:** Black (#0a0a0a), Gold (#d4a520/#f5c518), Blood red (#8b0000/#c41e3a)

## Monetization Model
- **Free episodes:** 1-3 (no account needed)
- **Coin price:** $0.99 each, episodes cost 3 coins
- **Coin packages:** 10/$8.99, 30/$24.99, 60/$44.99
- **Full Season Unlock:** $24.99
- **10 Support Tiers:** $24.99 to $499.99 + Pay What You Want
- **Crew Fund:** 15% of every purchase

## Current State
- ✅ All UI built and functional
- ✅ Zero console errors
- ✅ Builds successfully (`npm run build`)
- ✅ 2 commits on main branch
- ⏳ GitHub push pending (need `gh auth login`)
- ⏳ Netlify deploy pending (free tier, commercial use allowed)
- ⏳ Stripe integration is simulated (ready for real keys)
- ⏳ Videos are simulated (ready for real video files)
- ⏳ Auth is localStorage (ready for Firebase/Supabase)

## Owner
- **GitHub:** sleepywicked
- **Email:** mickeyelahi@gmail.com
- **Git config:** repo-local (not global)

## Next Steps (When Resuming)
1. Run `gh auth login` to authenticate GitHub CLI
2. Push to GitHub: `gh repo create trust-none-platform --public --source=. --push`
3. Deploy to Netlify (free tier, commercial allowed)
4. Connect real Stripe keys for payments
5. Add real video files to the player
6. Connect trustnonemovie.com domain
