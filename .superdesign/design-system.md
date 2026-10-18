# Trust None — Design System

## Product context
Self-distributed streaming site for "Trust None", a TV-MA vertical (9:16) micro-drama set in Chicago (Englewood / South Side). Logline: "In the city streets of Chicago, even your own family can't be trusted." Season 1 = 10 episodes of ~2–3 min; episodes 1–3 free, 4–10 cost 3 coins each (coins $0.99; packs 10/$8.99, 30/$24.99, 60/$44.99; full season $24.99). Support tiers $24.99–$499.99 plus pay-what-you-want Founding Supporter. 15% of purchases go to a Crew Fund.
Audience: phone-first viewers of ReelShort/TikTok-style dramas, 18–40, watching in short sessions. Primary jobs: (1) start Episode 1 instantly, (2) binge the free episodes, (3) unlock the rest with coins or season pass, (4) support the show.
Characters: Darius (returns home), Marcus (younger brother on the corners), Lorraine (mother, launders money through her hair salon), Kesha (community organizer), Trevon (rival who set up their father).

## Key page: Home (single page)
Nav → Hero → Trailer (9:16) → About → Episode list → Support tiers → Crew Fund → Social proof → Email capture → Footer. Watch view is a full-screen vertical swipe player.

## Brand & styling (HARD CONSTRAINTS)
- Mode: dark only.
- Colors: background #0a0a0a ("chicago"); surfaces #1a1a1a ("smoke"), #2a2a2a ("asphalt"), #3a3a3a ("concrete"); primary accent gold #d4a520, highlight gold #f5c518, deep gold #b8860b; danger/drama red #8b0000 and #c41e3a. Body text white / #e5e5e5. Muted text must be at least #9a9a9a (the old #6a6a6a fails contrast). No other hues — no purple, blue, pink, neon, or rainbow gradients.
- Typography: Geist (sans) only. Headings font-black, uppercase, tight tracking; the TRUST NONE wordmark uses a gold shimmer. Body 16px, line-height 1.5; nothing below 12px.
- Shapes: rounded-lg to rounded-2xl; subtle 1px white/5–10% borders; gold glow for key CTAs; frosted-glass nav.
- Icons: simple line SVG icons (Lucide style). No emoji as icons.
- Imagery: gritty, cinematic, night-time Chicago — street lights, el tracks, rain on asphalt, warm sodium-vapor gold against deep black. Vertical 9:16 poster and episode thumbnails.

## UX rules
- Mobile-first (375px), works to 1440px. Touch targets ≥ 44×44px. Visible focus rings (gold). Icon-only buttons need labels. Respect prefers-reduced-motion.
- One dominant CTA: "Watch Episode 1 Free". Secondary: "Unlock Season — $24.99".
- No fake stats or invented reviews — show real counts or omit.

## Motion
150–300ms ease-out transitions; subtle gold shimmer on the wordmark; no autoplaying motion that ignores reduced-motion.
