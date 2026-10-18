---
version: "superdesign-alpha"
name: "Backlot Reel Noir"
description: "A full-bleed cinematic video shell: near-black letterboxed frame, a single white circular play control at dead-center, condensed display wordmark top-left, and quoted italic testimonial pinned bottom-right."
colors:
  background: "#191919"
  surface: "#000000"
  text-primary: "#FFFFFF"
  text-secondary: "#FAFAFA"
  accent: "#007CBA"
typography:
  body-md:
    fontFamily: "Open Sans"
    fontSize: "17px"
    fontWeight: 100
    lineHeight: "1.3"
  display-wordmark:
    fontFamily: "Six Caps"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "1"
  label-caption:
    fontFamily: "Open Sans"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "1.3"
  accent-serif:
    fontFamily: "Times New Roman"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "1.3"
    style: "italic"
  icon-font:
    fontFamily: "FontAwesome"
spacing:
  base: "10px"
  gap: "20px"
  section-padding: "40px"
rounded:
  control: "50px"
  card: "50px"
  pill: "50px"
pill: "9999px"
components:
  button-play-primary:
    background: "rgba(0,0,0,0.3)"
    border: "2px solid #FFFFFF"
    text-color: "#FFFFFF"
    radius: "50px"
    height: "68px"
    shadow: "rgba(0, 0, 0, 0.2) 0px 0px 40px 0px"
  button-icon-utility:
    background: "transparent"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "24px"
  nav-hamburger:
    background: "transparent"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "24px"
  card-panel:
    background: "#191919"
    radius: "0px"
    padding: "0px"
    shadow: "rgba(0, 0, 0, 0.15) 0px 3px 15px 0px"
---
# Backlot Reel Noir
Source: https://trustnonemovie.com

## Overview
This is a single-screen cinematic shell, not a scrolling marketing page: a full-bleed desaturated video frame IS the background, with UI reduced to four fixed overlays — logotype, hamburger, play control, quote. The aesthetic sits between editorial/typographic (a tall condensed display wordmark used as logo) and minimal film-site convention: near-black negative space at the frame edges, muted on-screen photography carrying all color, and interface chrome kept to thin white strokes and small caption-weight type. Nothing is boxed, carded, or bordered in the traditional component sense — the "page" is one viewport-height stage.

## Composition
The eye lands first on the stacked wordmark at top-left (a tall condensed sans in two lines plus a small caption line beneath), then is pulled to the dead-center white-ringed play button sitting directly over the video, then down to a right-aligned quote block in the lower third. A thin horizontal progress/scrubber tick row sits at the bottom-left, mirrored by a row of social icons bottom-right. There is no second section visible in scroll sampling below the fold at this capture — the design commits fully to a one-shot hero-as-interface rather than a conventional hero-then-content-bands descent. The deliberate choice is maximal restraint: one circular control, one quote, one logo, everything else is the film frame — rejecting any card grid, nav bar fill, or scroll-revealed content band.

## Colors
The pixel field is dominated by desaturated video mid-tones (`#606060` ~24%, `#787878` ~8%, `#484848` ~6%, a warm `#604848` ~5%) sitting on a near-black UI ground (`#181818`/`#191919`, ~45–54% combined) — confirming the chrome and letterbox are true near-black, not pure `#000000` (reserved at ~0.3% for deepest shadow accents only). Text and iconography run in flat `#FFFFFF`/`#FAFAFA` with no tint. There is no saturated brand hue anywhere in the interface chrome; the only accent values that exist are inherited editor tokens (`#007CBA`, `#7A00DF`) and are not visibly deployed on screen — color is entirely rationed to the embedded footage itself (the red theater-marquee band, muted car-paint greens). The rebuild must resist adding any chrome accent color: the system is monochrome white-on-black interface over a naturally colored film plate.

## Typography
Three families carry distinct jobs. The wordmark uses Six Caps, an ultra-condensed tall display face, set in stacked all-caps lines at a dominant size relative to everything else on screen, with a small Open Sans caption line beneath it at roughly a sixth of its height. Body/quote copy runs in Open Sans at 17px/1.3, white, right-aligned in the lower-right block. Inside that same quote block a short attribution-style clause breaks into an italic Times New Roman serif — the one typographic accent in the system, reserved for a single short line, never used in headings or labels. FontAwesome supplies the icon glyphs (play ring, hamburger, social row) at icon scale, matching the 17–24px interface rhythm.

## Layout
There is no multi-column grid: this is an absolute-positioned overlay system on a 100vw/100vh video canvas, effectively a single full-bleed "card" with corner-anchored content (logo top-left, hamburger top-right, play true-center, quote bottom-right, scrubber bottom-left, social icons bottom-right below the quote). Spacing between stacked text lines and icon rows follows the small end of the scale (10px, 15px, 20px) rather than the larger 30–40px section paddings, keeping all overlay clusters compact against the expansive video field. Any measured content max-width (1000px) would apply to a future text/content band below the fold, not to this hero stage, which is intentionally edge-to-edge.

## Components
- **Navbar (hamburger utility, top-right)**: a single icon-only control, no visible bar/fill/shape — transparent, sitting directly on the video at the frame's top-right corner; no logo pairing here (logo is independently anchored top-left), no nav links, no CTA button beside it. This is a pure slide-out-menu trigger, not a bounded bar.
- **Wordmark lockup (top-left, hero)**: stacked two-line Six Caps display type plus one Open Sans caption line underneath; functions as the page's only "logo" component; no container, shadow, or background — sits directly on the video.
- **Play button (hero primary, center-stage)**: the single most emphasized control on the first screen — an observed near-transparent black fill (`rgba(0,0,0,~0.3)`) with a crisp white stroke ring, full-pill/circular radius (50px token, true circle at this scale), a white triangle glyph centered inside, diffuse outer glow shadow `rgba(0, 0, 0, 0.2) 0px 0px 40px 0px`. This is the hero primary — not a filled solid chip but a glass-dark ringed circle; no competing filled button exists on this screen.
- **Quote block (lower-right overlay)**: right-aligned stack — two lines of Open Sans body quote text in white, a short italic Times New Roman attribution line beneath truncated with a mid-line pipe separator pattern, then a small all-caps Open Sans label line below that. No card background, no border — floats directly on the video with a tight 10–15px internal line-gap.
- **Scrubber/progress row (bottom-left)**: a horizontal row of small tick/dash marks in white, flush to the bottom-left corner, reading as a frame-timeline indicator; no numerals or labels attached.
- **Social icon row (bottom-right)**: a horizontal cluster of flat white FontAwesome glyphs (sharing icon scale ~16-20px), unbounded, no background chips, evenly gapped at the small end of the spacing scale.
- **Card/panel family (measured, ×3 pattern)**: full-width panels, `#191919` fill, 0px radius (hard square corners throughout — no rounding anywhere in this system except the play-button pill and icon circles), 0px padding, shadow `rgba(0, 0, 0, 0.15) 0px 3px 15px 0px`; each panel carries a top media slot plus body text and internally splits into two equal-width tiles (100% | 100% row composition — i.e., a two-up stacked tile pairing per panel). These belong to content bands below the captured fold, not the hero.

## Graphics & Effects
The hero's only "graphic" is the embedded video frame itself — a desaturated, slightly blurred urban storefront plate under natural daylight, functioning as a live-video surface with no CSS gradient overlay or scrim darkening it at this capture (text legibility is achieved by placement in open-sky/pavement zones of the frame, not by a gradient wash). Shadow vocabulary is restrained to three verbatim values: a hairline UI shadow `rgba(0, 0, 0, 0.1) 0px 0px 1px 0px` for flat edge definition, a panel-lift shadow `rgba(0, 0, 0, 0.15) 0px 3px 15px 0px` for the card family, and a soft diffuse glow `rgba(0, 0, 0, 0.2) 0px 0px 40px 0px` used on the play button to separate it from the busy video beneath. No noise, grain, or pattern texture is added by the interface — any grain visible is native to the video source footage.

## Motion
Interface transitions are uniform and linear: `background-color, border-color, color, outline-color` all animate on a flat `0.3s linear`, giving hover/focus state changes an even, mechanical speed with no easing curve or overshoot — consistent with a restrained, non-playful system. Structural reveals (menu open, modal/lightbox entry, loading states) use named keyframe routines — fade-in for overlay menus, an appear animation for modals, a slide-in for panel entries, plus dedicated loading and button-busy animation loops — but none of these imply bounce, spring, or parallax; motion throughout is utilitarian and fast, in service of state change rather than decoration.

## Guardrails
- Never fill the hero frame with a saturated gradient or color wash — color stays confined to the embedded video plate; chrome stays monochrome white-on-near-black.
- Never round the panel/card family — 0px radius is structural to this system; reserve all circular/pill radius for the play control and icon glyphs only.
- Never replace the center play-ring with a solid filled button — it is a stroked, dark-glass circle with outer glow, not a filled pill.
- Never give the hamburger or social icons a background chip, border, or container — they must sit bare on the video.
- Reserve the italic Times New Roman serif for a single short attribution-style clause — do not apply it to headings, labels, or body paragraphs.
- Keep all interface spacing tight (10–20px) even though a larger 40px section rhythm exists for below-fold content — do not stretch hero overlay spacing to match.