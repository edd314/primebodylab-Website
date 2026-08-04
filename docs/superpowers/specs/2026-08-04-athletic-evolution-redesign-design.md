# Athletic Evolution Redesign — Design Spec

**Status:** Approved by Eddie, 2026-08-04. Reference: Justin's "Option A" mockup
(3 homepage-hero directions, this one captioned "ANTON + EPILOGUE · HIS
CURRENT FONTS"), shown to Eddie mid-project. Site is live in production at
primebodylab.de; this redesign lands on top of the currently-live warm
dark-green/bronze theme (see `docs/superpowers/specs/2026-07-29-primebodylab-rebuild-design.md`
for that theme's rationale).

## Goal

Replace the site's current warm dark-green/bronze/serif visual identity with
a bold, black-background, neon-yellow-green-accented "athletic performance"
identity, site-wide, while keeping all existing content, structure, and
functionality (bilingual copy, booking flow, service finder, packages)
unchanged.

## What's driving this

Eddie picked "Athletic Evolution" over the other two mockup directions
("Recovery Clinic" — light, editorial, serif; "Dark Luxe" — near-black,
warm bronze, photo-led) because it reads as energetic and performance-first,
closest to how he wants his strength/recovery work to feel. This is a
deliberate, bigger visual swing than the site's prior (already-approved)
dark theme — not a refinement of it.

## Architecture: token-level retheme + two structural rebuilds

The site already centralizes color and type in `src/styles/globals.css`'s
`@theme` block (`--color-bone`, `--color-ink`, `--color-forest`,
`--color-sage`, `--color-muted`, `--color-line`, `--color-surface`,
`--font-display`, `--font-body`). Every component reads these tokens by
name rather than hardcoding colors — this is exactly how the site's *last*
full theme swap (light → warm dark) was done: token names stayed stable,
only values moved, and every component picked up the new theme with zero
class-name changes.

This redesign uses the same mechanism: repoint the seven color tokens and
two font tokens to new values, and the vast majority of the site (buttons,
cards, bands, taglines, borders) retheme automatically. Two places need
actual structural/layout changes on top of the token swap:

- **Header** (`src/components/layout/Header.tsx`) — wordmark font changes
  from serif to bold condensed sans; no layout change beyond that (the
  mobile-wrap fix landed just before this spec is unaffected).
- **Hero** (`src/components/sections/Hero.tsx`) — current layout is a
  single centered text column with no photo. The mockup is a left-aligned
  two-column split (copy + CTAs left, photo right), plus a new ticker bar
  underneath that doesn't exist on the site today.

Everything else — `Footer`, `ServiceCard`, `ServiceDetail`, `FaqAccordion`,
`TestimonialRow`, `PillarGrid`, `CtaBand`, `PackageList`, booking pages,
legal pages, the Service Finder widget — gets restyled purely by the token
swap. No component logic changes.

## Token values

| Token | Role | Current (warm dark) | New (Athletic Evolution) |
|---|---|---|---|
| `--color-bone` | page background | `#1C160F` (warm near-black) | `#0A0A0A` (true near-black) |
| `--color-ink` | primary text / inverted surface | `#F3EBDD` (warm cream) | `#F5F5F0` (off-white) |
| `--color-forest` | primary accent — buttons, bands | `#2E4636` (dark green) | `#D7FF3D` (neon yellow-green) |
| `--color-sage` | secondary accent — taglines, hero last line, hover | `#C99A68` (bronze) | `#D7FF3D` (same neon — see note) |
| `--color-muted` | secondary/body text | `#A89D8A` | `#9A9A93` (neutral gray) |
| `--color-line` | borders/dividers | `#3A3226` | `#2A2A2A` (dark gray) |
| `--color-surface` | elevated panels | `#2A2318` | `#141414` (off-black) |

Note on `forest`/`sage` sharing one neon value: the mockup uses a single
electric accent color throughout (eyebrow label, headline's last word,
primary button, ticker bar) rather than two distinct accent shades. Since
`forest` (buttons/bands, solid fills) and `sage` (text accents, hover
states) are used as solid-fill vs. text-color roles respectively, sharing
one hex works visually without a token rename. Exact hex values above are
a starting point sampled by eye from the mockup — they'll be fine-tuned
against the actual mockup image during implementation/review, not treated
as final-locked numbers.

## Typography

Swap in `src/lib/fonts.ts`:
- `Instrument_Serif` → `Anton` (display font — headlines only)
- `Inter` → `Epilogue` (body font)

Both ship via `next/font/google`, same self-hosting mechanism as today
(downloaded at build time, served from the site's own origin — satisfies
the project's no-Google-Fonts-CDN rule; no `<link>` tags involved).

Headlines (`h1`/hero) move from serif to bold uppercase condensed. Add
`uppercase` to the hero headline and any other display-font headings that
should shout (h1 primarily); body copy, nav, and buttons stay their
current case — the mockup doesn't uppercase everything, just the
headline treatment.

## Component changes

### Header
- Wordmark switches from `font-display` (serif) styling to a bold sans
  treatment — likely `font-body font-extrabold uppercase tracking-tight`
  rather than pulling in a third font family, matching the mockup's blocky
  sans wordmark without adding a third typeface to maintain.
- Anatomy-mark icon (`logo-mark.png`) stays next to the wordmark, small,
  as today — decided in brainstorming: keep it as a persistent identity
  mark on every page.
- "Book Now" button becomes a small solid-neon pill (currently an
  outlined pill) — one class change, no structural change.

### Hero — rebuilt as two-column
- Desktop: CSS grid, two columns (copy left ~55%, photo right ~45%);
  stacks to a single column (photo below copy) on mobile, matching how
  `ServiceCard` already handles its own image/copy grid responsively.
- Left column: small solid-neon eyebrow pill (replacing today's plain
  uppercase kicker text), bold uppercase 3-line headline with the last
  line in the neon accent (the codebase already has this "last line
  accent" pattern in `Hero.tsx` — reuse it, just change the color source),
  body copy, two CTAs (one solid-neon primary, one outlined secondary —
  same as today's CTA pair, just restyled).
- The anatomy-mark logo appears large and clearly visible (not a faint
  watermark) behind the hero content — Eddie's explicit correction during
  brainstorming: sized to read as a deliberate background graphic, not a
  barely-there texture. Positioned so it doesn't fight the headline or
  photo for attention — behind/around the copy column, using the mark's
  natural transparency (it's already a light line-art PNG) with reduced
  opacity against the black background, but large enough to actually see
  the figure, not just a hint of it.
- Right column: existing hero/founder photo, desaturated (see Photo
  treatment below).

### New: ServiceTicker component
- `src/components/sections/ServiceTicker.tsx`, rendered directly under
  the Hero on the homepage only.
- Solid-neon horizontal bar listing each service's name + "ab €X" / "from
  €X" (the existing lowest-duration-price logic already used in
  `ServiceCard.tsx` — reused, not reimplemented), separated by dots,
  pulled live from `src/content/services.ts` — no hardcoded service names
  or prices, so it can't drift out of sync with the real service list.
- Static bar (not an animated marquee) for v1 — matches the mockup's
  static screenshot, avoids adding scroll-animation complexity/motion-
  sensitivity concerns for a first pass.

### Photo treatment
- `Figure.tsx` gets a `grayscale` filter (Tailwind `grayscale` utility,
  plus a small contrast bump) applied to its rendered `<Image>`, site-wide
  — one change point in the shared component, so every photo on every
  page (hero, service cards, service detail pages, gallery, founder
  block, testimonials context) picks it up automatically. Decided in
  brainstorming: full desaturation everywhere, not hero-only, for visual
  consistency against the black/neon palette.

## Out of scope for this round

- Animating the ticker bar (marquee/scroll effect) — static for v1.
- Any change to booking flow, content, pricing, or bilingual copy.
- Re-shooting or re-cropping photos beyond the desaturation filter.
- Changing the logo mark's artwork itself (only its size/placement in the
  hero background changes).

## Testing

- Existing Vitest content/unit tests and Playwright e2e suite must both
  pass unchanged (they assert on content and behavior, not colors, so a
  pure retheme shouldn't break them — the Hero restructure and new
  ServiceTicker component are the pieces that need new/updated test
  coverage).
- Manual visual check across mobile/tablet/desktop widths (320–1280px,
  both locales) for the Header and Hero specifically, same method used
  for the recent header mobile-overlap fix — screenshot comparison via
  Playwright at each breakpoint before calling it done.
- Compare the built Hero against the mockup screenshot side-by-side
  before considering the redesign complete.
