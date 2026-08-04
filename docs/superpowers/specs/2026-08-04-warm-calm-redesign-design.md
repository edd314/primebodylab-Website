# Warm Calm Redesign — Design Spec

**Status:** Approved by Eddie, 2026-08-04 (mockup shown via the visual-companion browser tool, approved as-is). Reference: soulhouse.me, a German massage/modern-bodywork brand, screenshotted directly for this spec (soulhouse.me/en, several sections). Replaces the currently-live "Athletic Evolution" black/neon theme (`docs/superpowers/specs/2026-08-04-athletic-evolution-redesign-design.md`), itself the second of three full theme swaps this project has now done.

## Goal

Retheme PrimeBodyLab from the black-background/neon-yellow-green "athletic performance" identity to a warm, calm, light identity — cream/beige backgrounds, a coffee-brown primary accent, an olive-green secondary accent, and softer editorial typography — site-wide, with no changes to content, structure, booking flow, or bilingual copy. The explicit goal, in Eddie's words, is psychological: bring visiting clients into "a calm presence," not project his own athletic taste. Structure stays as-is (two-column hero, ticker bar, card layouts, etc. built during the Athletic Evolution redesign) — only color and type change.

## What's driving this

Eddie decided the black/neon look, while one he personally likes, doesn't serve the actual goal of the site: making clients feel calm and cared for before a massage/recovery appointment, not energized like a gym. He named Soulhouse specifically as the reference. Real screenshots of soulhouse.me (not just a text description) show it is **light**, not dark: white/cream page background, warm beige/tan alternating section blocks (~`#E8E1D3`-ish), a coffee-brown primary accent used for their solid "BOOK" pill button, a soft serif with an elegant italic used for headline accent words, a clean sans for everything else, muted warm-toned editorial photography, and consistently rounded/pill-shaped UI elements. This directly contradicted Eddie's own first description ("dark olive green... dark") — that mismatch was surfaced and resolved with him directly: he chose to follow the actual Soulhouse reference (light) over his own initial wording, and separately confirmed the type should soften to match (not stay in the bold condensed "athletic" style).

## Architecture: same token-level mechanism, third time

Exactly like the previous two full theme swaps, this repoints the 7 existing `@theme` color tokens and 2 font tokens in `src/styles/globals.css` / `src/lib/fonts.ts`. Every component that already reads tokens by name updates for free.

**This swap needs less component-level surgery than the Athletic Evolution swap did.** That swap broke the `bg-forest` + `text-ink` button pairing because `forest` flipped from dark-green to bright neon, and light-on-bright/bright-on-light both failed contrast — an 11-file, ~15-line-edit fix. This time, `bone` (page background) and `forest` (accent fill) are flipping brightness *together*: `bone` goes from near-black to light cream, and `forest` goes from bright neon to a **dark-enough** coffee brown that light text stays readable on it. The existing `bg-forest` + `text-bone` convention (established last redesign, used in ~14 places: buttons, the Service Finder bubble, active pills) keeps working unchanged — `bone`'s new cream value is still light enough to read clearly on `forest`'s new brown value. No cross-cutting contrast-fix task is needed this time; implementation should still spot-check this claim (see Testing), but no dedicated sweep task is required the way Task 1 needed one last time.

## Token values

| Token | Role | Current (Athletic Evolution) | New (Warm Calm) |
|---|---|---|---|
| `--color-bone` | page background | `#0A0A0A` (near-black) | `#F7F1E7` (warm cream) |
| `--color-ink` | primary text | `#F5F5F0` (off-white) | `#2B2116` (warm espresso, not pure black) |
| `--color-forest` | primary accent — buttons, fills | `#D7FF3D` (neon yellow-green) | `#6B4A31` (coffee brown) |
| `--color-sage` | secondary accent — taglines, hero last line, hover | `#D7FF3D` (same neon as forest) | `#5C6640` (olive green — **distinct from `forest` this time**, see note) |
| `--color-muted` | secondary/body text | `#9A9A93` | `#7A6B54` (warm taupe-brown) |
| `--color-line` | borders/dividers | `#2A2A2A` | `#DCCEB0` (soft warm tan) |
| `--color-surface` | elevated panels, alternating section backgrounds, ticker bar | `#141414` | `#EFE6D3` (deeper cream, one step down from `bone`) |

**Note on `sage` no longer matching `forest`:** in the Athletic Evolution palette, `forest` and `sage` were the same neon value because the design used one electric accent throughout. Eddie's original message named two colors — "dark olive green **or** beige, coffee brown" — and the approved mockup used both: coffee brown (`forest`) for solid-fill buttons, and a distinct olive green (`sage`) for the italicized last word of the hero headline and other text-only accents (taglines, hover states). This gives the palette more depth than a single accent would, and honestly reflects that Eddie named two colors, not one. Exact hex values above are what the approved mockup used; final contrast should still be spot-checked during implementation (see Testing) rather than treated as immutably locked.

## Typography

Swap in `src/lib/fonts.ts`:
- `Anton` → `Fraunces` (display font — headlines). Fraunces is a soft, warm editorial serif with a genuine italic, matching the Soulhouse reference directly (their headline accent words use a similar serif italic).
- `Epilogue` → `Inter` (body font). Note: Inter was this project's *original* body font, before either the Athletic Evolution or the original dark-theme redesign changed it — this isn't a new, unproven choice, it's a reversion to something already validated in production.

Both ship via `next/font/google` (self-hosted, satisfies the no-Google-Fonts-CDN rule — unchanged from prior redesigns).

**Case change:** the Hero's `<h1>` currently has `uppercase` (added for the athletic redesign). Remove it — bold all-caps fights a calm mood. Sentence case, matching the approved mockup and Soulhouse's own headlines.

**Italic accent:** the hero headline's last line (already styled with the `sage` color token via the existing "last line accent" pattern in `Hero.tsx`) additionally gets `italic` — this is a one-class addition to code that already exists, not new logic.

**Header wordmark:** currently uses `font-display` (would become Fraunces) with `uppercase tracking-tight` (added last redesign for the bold-caps athletic look). An all-caps tracked *serif* wordmark doesn't read as cleanly as an all-caps tracked *sans* one — the approved mockup uses the body font (Inter) for the wordmark, uppercase and tracked, which is also literally how Soulhouse treats their own nav wordmark (sans caps logo, serif headlines elsewhere in the page). Change the wordmark span's font from `font-display` to the default body font, keeping `uppercase tracking-tight`.

## Component-level changes

Everything below is either a token-only inheritance (no code change) or a small, explicitly-scoped tweak:

- **Header wordmark** — font-family change only (see Typography above). Icon mark, layout, and the mobile-wrap fix from an earlier session are untouched.
- **Hero** — remove `uppercase` from the `<h1>`, add `italic` to the last-line span (see Typography above). The background anatomy-mark watermark stays (Eddie hasn't asked to remove it), but drops from `opacity-20` to `opacity-10` — at the new, lower-contrast-by-design palette, the same opacity that worked as a bold graphic on black would read as too heavy/graphic against a soft cream background; a fainter mark better matches a "quiet decorative accent" role (closer to how Soulhouse uses subtle recurring motifs like dried flowers) rather than a loud statement piece. Positioning/sizing mechanism (fixed to the copy column, not the whole section — the fix from the last redesign's review round) is unchanged.
- **ServiceTicker** — currently a solid loud `bg-forest` bar with bold uppercase `text-bone`. For a calm design, keep the bar but switch its background from the loud accent fill (`bg-forest`) to the quieter `bg-surface` (warm tan, not a shouting brown block), with `text-ink` instead of `text-bone` — matches the approved mockup, and is a two-class change in `ServiceTicker.tsx`.
- **Everything else** (Footer, ServiceCard, ServiceDetail, FaqAccordion, TestimonialRow, PillarGrid, CtaBand, PackageList, BookingGate, WelcomePopup, Service Finder widget, booking/legal pages) — retheme purely via the token swap. No component changes. (`CtaBand`, specifically, already sits on `bg-bone` with a `bg-forest`/`text-bone` button after the last redesign's final-review fix — that structure is already correct for this palette too, nothing to touch.)

## Photography

No change — photography is already full color (reverted from the Athletic Evolution grayscale treatment earlier), and the existing warm-toned real photos (treatment room, Eddie's portraits, gallery) suit a warm calm palette at least as well as they suited the black/neon one, likely better.

## Out of scope for this round

- Any change to booking flow, pricing, or bilingual copy.
- Re-shooting or re-cropping photos.
- Changing the anatomy-mark logo artwork itself (only its opacity changes).
- Animating the ticker bar (stays static, as it already is).
- Importing Soulhouse's own page structure/features (their city+goal search bar, star-rating badges, etc.) — Eddie was explicit: use their *color/type concept*, keep the *current site's structure*.

## Testing

- Existing Vitest content/unit tests and Playwright e2e suite must both pass unchanged — this is a pure retheme plus two small class-level tweaks (Hero case/italic, ServiceTicker background), none of which touch content, structure, or behavior the tests assert on.
- Manual visual check across mobile/tablet/desktop widths (320–1280px, both locales), focused on: the Header wordmark's new font doesn't reintroduce the mobile-overlap bug fixed earlier this session; the `bg-forest`/`text-bone` contrast claim above actually holds visually at the new hex values, spot-checked on at least the Hero CTA, a ServiceCard button, and the Service Finder bubble; the hero background mark at its new lower opacity is still perceptible, not so faint it's pointless.
- Compare the built homepage against the approved visual-companion mockup before considering this complete.
