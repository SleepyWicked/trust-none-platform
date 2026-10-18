# Theme

## Part 1 — Token summary
Tailwind v4 `@theme` tokens in `src/app/globals.css`:
- Colors: gold #d4a520, gold-light #f5c518, gold-dark #b8860b, blood #8b0000, blood-light #c41e3a, chicago (page bg) #0a0a0a, smoke #1a1a1a, asphalt #2a2a2a, concrete #3a3a3a, steel #6a6a6a (muted text; ~3.7:1 on bg — fails AA)
- Font: Geist (next/font, `--font-geist`), heavy use of font-black uppercase headings
- Mood: black / gold / blood red, dark-only, gritty Chicago street drama, "premium streaming" (ReelShort/Netflix)
- Radius: rounded-lg/xl/2xl; effects: gold glow, text-shimmer, counter-glow, glass nav
- No light mode. No tailwind.config file.

## Part 2 — Raw source

### `src/app/globals.css`

```tsx
@import "tailwindcss";

@theme inline {
  --color-gold: #d4a520;
  --color-gold-light: #f5c518;
  --color-gold-dark: #b8860b;
  --color-blood: #8b0000;
  --color-blood-light: #c41e3a;
  --color-chicago: #0a0a0a;
  --color-smoke: #1a1a1a;
  --color-asphalt: #2a2a2a;
  --color-concrete: #3a3a3a;
  --color-steel: #6a6a6a;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #0a0a0a;
  color: #f0f0f0;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

.text-shimmer {
  background: linear-gradient(90deg, #d4a520 0%, #f5c518 25%, #d4a520 50%, #f5c518 75%, #d4a520 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer { to { background-position: 200% center; } }

.gold-glow { box-shadow: 0 0 30px rgba(212,165,32,0.15), 0 0 60px rgba(212,165,32,0.05); }
.red-glow { box-shadow: 0 0 30px rgba(196,30,58,0.2), 0 0 60px rgba(139,0,0,0.1); }

.pulse-gold { animation: pulseGold 2s ease-in-out infinite; }
@keyframes pulseGold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,165,32,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(212,165,32,0); }
}

.coin-spin { animation: coinSpin 1s ease-in-out; }
@keyframes coinSpin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(720deg); } }

.counter-glow { text-shadow: 0 0 20px rgba(212,165,32,0.6), 0 0 40px rgba(212,165,32,0.3); }

.fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.lock-shake:hover { animation: lockShake 0.5s ease-in-out; }
@keyframes lockShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg)} 75%{transform:rotate(5deg)} }

.swipe-hint { animation: swipeUp 1.5s ease-in-out infinite; }
@keyframes swipeUp { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(-10px);opacity:1} }

.glass {
  background: rgba(26,26,26,0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(212,165,32,0.1);
}

.tier-card { transition: all 0.3s ease; }
.tier-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,165,32,0.1); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.modal-backdrop { background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); }

.street-texture {
  background-image:
    linear-gradient(135deg, rgba(212,165,32,0.03) 0%, transparent 50%),
    linear-gradient(225deg, rgba(139,0,0,0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 20% 50%, rgba(212,165,32,0.05) 0%, transparent 50%);
}

```
