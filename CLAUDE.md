@AGENTS.md

# Trust None — Movie Site

## Project Overview
Official site and storefront for **Trust None** (2015), "A Classic Chicago Movie" — a Chicago street feature film from Wicked Entertainment Network Inc. Visitors watch the trailer, **rent or buy** the full movie to stream, and buy DVDs, music and merch.

The future vertical micro-drama series lives in a separate repo: **sleepywicked/trust-none-series**. Do not mix series content (Darius/Marcus characters, episodes, coins, support tiers) into this repo.

## Film facts (from the original trustnonemovie.com — don't invent plot, quotes or stats)
- Rated R. Starring Eric "Lil E" Brown as "LiL E"; E.C Illa aka WhiteFolks (writer/director); Konee Rok (co-director, DP, editor, producer); Yungbuk and Psyde of Psychodrama; The Legendary Traxster, Big Rap, Crucial Conflict, Cap 1. Executive producer Sleepy Wicked.
- All film content lives in `src/lib/film.ts`; everything for sale in `src/lib/catalog.ts`.

## Brand
Monochrome white on near-black (#191919), Six Caps display + Open Sans text, square corners, ringed dark-glass play button. All colour comes from film stills. Tokens in `src/app/globals.css`; full guide in `.superdesign/design-system-original-site.md`.

## Tech Stack
Next.js 16 (App Router, TS), Tailwind CSS v4, Supabase (auth + Postgres), Stripe Checkout, Bunny Stream for video.

## Architecture
```
src/app/
  page.tsx               Home (static): hero, trailer + rent/buy, stills, cast & crew, shop preview, credits, email
  watch/page.tsx         Player for signed-in users with an active rental or purchase
  shop/page.tsx          All products
  success/page.tsx       Post-checkout confirmation (read-only; grants nothing)
  api/checkout           Creates Stripe Checkout sessions; prices come from catalog.ts on the server
  api/stripe/webhook     The ONLY place purchases are recorded (signature required)
  api/watch              Returns a signed Bunny embed URL only if the user has access
  api/subscribe          Newsletter signup
src/components/site/     Header, footer, auth, trailer, rent/buy, product card, email
src/lib/                 film.ts, catalog.ts, entitlements.ts, bunny.ts, stripe.ts, supabase.ts
supabase-schema.sql      profiles, purchases (read-own only), email_signups
```

## Security rules
- Never grant access client-side or from the success page; only the verified Stripe webhook writes `purchases`.
- Never send the movie's Bunny ids/URL to the browser except via `/api/watch` after an access check.
- API routes identify users from the `Authorization: Bearer` access token, never from a user id in the request body.

## Monetization
Rent $4.99 (48 hours) or buy $14.99 — set in `catalog.ts`. Shop products in `catalog.ts`; `priceCents: null` shows "Coming soon".

## Environment
See `.env.example`.

## Open TODOs
- Fill real shop products (names, prices, images) and the synopsis.
- Copy logo/stills into `/public` and set `MEDIA_BASE` to "" in `film.ts` before pointing trustnonemovie.com at this app.
- Add Privacy Policy / Contact pages (footer currently links to the old WordPress site) and real social links.
- Remove legacy series files still in `src/components/*.tsx` (top level), `src/lib/store.ts`, `src/lib/episodes.ts`, `src/lib/tiers.ts` — unused, kept until removal is approved.
- Cast headshots.

## Owner
GitHub: sleepywicked · Email: mickeyelahi@gmail.com
