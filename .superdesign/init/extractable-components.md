# Extractable Components

## Navigation
- Source: `src/components/Navigation.tsx`
- Category: layout
- Description: Fixed glass top bar with TRUST NONE wordmark, coin balance, sign-in / user menu
- Extractable props: signedIn (boolean, default: false), coinBalance (number, default: 0)
- Hardcoded: wordmark, menu labels, gold/black styling

## Footer
- Source: `src/components/Footer.tsx`
- Category: layout
- Description: "More shows coming" banner, brand blurb, Platform/Connect link columns, share buttons
- Extractable props: none
- Hardcoded: link labels, logline, handle

## EpisodeCard
- Source: `src/components/EpisodeCard.tsx`
- Category: basic
- Description: Episode row with thumbnail, number, title, runtime, free/locked state, progress bar
- Extractable props: locked (boolean, default: false), progress (number 0–100, default: 0)
- Hardcoded: layout, lock icon

## TierCard
- Source: `src/components/TierCards.tsx`
- Category: basic
- Description: Support-tier pricing card with badge, price, features, CTA
- Extractable props: highlight (boolean, default: false), badge (string)
- Hardcoded: card styling
