# Routes

File-based Next.js App Router.

| Path | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Renders ClientApp → App. Internal views (not URLs): `landing` (home), `watch` (VerticalPlayer), `dashboard`, `admin` |
| `/success` | `src/app/success/page.tsx` | Post-Stripe-checkout confirmation |
| `/api/stripe/checkout` | `src/app/api/stripe/checkout/route.ts` | POST, creates Checkout Session |
| `/api/stripe/webhook` | `src/app/api/stripe/webhook/route.ts` | Stripe webhook |

## Home (landing view)
Sections top→bottom: Navigation (glass, auth/coins) → HeroSection (title, logline, CTAs, CSS poster) → TrailerSection (9:16 player) → AboutShow (synopsis + metadata) → EpisodeList (10 episodes, 1–3 free, 4–10 cost 3 coins) → TierCards (10 support tiers $5–$499.99) → CrewFund (animated counter) → SocialProof (rating + founding supporters) → EmailCapture → Footer.
