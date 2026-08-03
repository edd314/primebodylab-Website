# Service Finder quiz — design

## Goal

Help an undecided visitor land on the right one of PrimeBodyLab's 5 services
in under 30 seconds, or — if the answers are unclear or contradictory —
route them to book a Performance Strategy Session (a coaching consultation
call) instead of leaving them stuck.

This is explicitly **not** a general-purpose AI chatbot. It is a fixed,
rule-based decision tree: deterministic questions, deterministic branching,
no LLM, no ongoing API cost, no free-text input. That scope is intentional —
see "Non-goals" below.

## Non-goals

- No free-text/natural-language input. Every question is multiple choice.
- No AI/LLM API integration. Nothing here calls an external model.
- No persistence of answers. Each session is stateless; nothing is logged
  server-side or stored beyond the browser tab's lifetime (no localStorage
  needed, since unlike the welcome popup there's no "don't show again"
  requirement).
- No admin UI to edit questions. Content lives in a typed source file, same
  as every other piece of site content — editing it is a code change, not a
  CMS action.

## Entry points

1. A floating chat-bubble button, fixed bottom-right, visible on every page
   (site-wide, like the mobile call/WhatsApp bar) — but distinct from the
   WelcomePopup: it never opens itself, only on click, so it can never
   collide with the one-time welcome popup.
2. A text prompt on `/leistungen` ("Not sure which service fits? Take our
   30-second quiz") linking to the same flow, since that's where an
   undecided visitor is already standing.

## Question tree

**Q1 — Primary goal** (always first)
- Relax and de-stress
- Recover from training or sport
- Improve flexibility & mobility
- Build strength with ongoing coaching
- Not sure

→ "Not sure" ends the flow immediately at the Strategy Session
  recommendation. Every other answer continues to Q2 or Q3 as below.

**Q2 — Only shown if Q1 was "Relax" or "Recover from training"**
(both are massage-family answers; this question splits them)
- Overall relaxation & stress relief → **Wellness & Recovery Massage**
- Targeted muscle soreness / sports recovery → **Performance & Recovery
  Massage**

Q1 = "Improve flexibility & mobility" skips Q2 and goes straight to
**Assisted Stretch Therapy**. Q1 = "Build strength with ongoing coaching"
skips Q2 and Q3 and goes straight to **Performance Coaching** (coaching is
a structured program, not a single-session combination candidate).

**Q3 — Shown to anyone who reached Wellness Massage, Performance Massage,
or Stretch Therapy**
- "Want that combined with assisted stretching in the same visit — a full
  2-hour reset?"
- Yes → overrides the result to **Performance & Recovery Bundle**
- No → keeps the Q1/Q2 result

**Q4 — Frequency** (shown only when the current result is Wellness & Recovery
Massage, Performance & Recovery Massage, or Stretch Therapy — the three
services that actually have session packages, per
`PACKAGE_ELIGIBLE_SLUGS` in `src/lib/packages.ts`. Skipped for Coaching,
skipped for the Bundle — including when Q3 just overrode the result to
Bundle — and skipped on the "Not sure" path.)
- "Just this once, or would you like to come regularly?"
- Regularly → result screen also surfaces that service's 5×/10× session
  package pricing (from `src/lib/packages.ts`, not hand-typed)
- One-time → result screen shows just the single-session starting price

## Result screen

Shows, for the matched service:
- Name, tagline, and starting price — read live from `src/content/services.ts`
  via its slug, never duplicated as separate copy
- A one-line "why this fits" summary assembled from the answers given
- **Book Now**, deep-linking to that service's real `acuityTypeId` (same
  mechanism `BookingGate.tsx` already uses)
- Underneath, always visible regardless of path: "Not quite right? Book a
  Strategy Session instead" — a fallback that's never hidden, since the
  tree can always get it wrong for an edge case

The "Not sure" path at Q1 skips straight to a variant of this screen with
no service card, just the Strategy Session recommendation and booking link.

## Architecture

Pure client component, no backend, no external API:

- **Content**: new `src/content/serviceFinder.ts` — questions, options, and
  result copy, following the exact same `{de: string, en: string}` +
  `serviceSchema`-style Zod validation as every other content file. A
  missing German (or English) string fails `npm test` the same way a
  missing translation anywhere else on the site does today. This directly
  addresses the requirement that German must never be broken or partial.
- **Logic**: a small, pure branching function (`resolveServiceFinderResult`)
  that takes the sequence of answers and returns a result — testable in
  isolation with plain unit tests (no component rendering needed to verify
  the tree's correctness), living in `src/lib/serviceFinder.ts`.
- **UI**: a new `ServiceFinderWidget` client component (bubble + panel),
  mounted once in `src/app/[locale]/layout.tsx` alongside the existing
  `WelcomePopup`. Panel content re-renders per question from the same
  content file; no routing involved, it's a modal/panel state machine.
- **Styling**: reuses existing dark-theme tokens and the same rounded-card /
  pill-button visual language as the rest of the site — no new design
  system.
- **Accessibility**: `role="dialog"`, focus trap, Escape-to-close, and
  `prefers-reduced-motion` handling — same pattern as `WelcomePopup.tsx`
  and `Reveal.tsx` already establish.

## Testing plan

- Unit tests (`vitest`) for `resolveServiceFinderResult` covering every path
  through the tree (all 5 service outcomes + the "Not sure" fallback +
  the Bundle-override branch), asserting on the returned service slug.
- Content test asserting every question/option/result string has both
  `de` and `en` populated (mirrors the existing `parity.test.ts` pattern).
- One e2e test walking a single full path end-to-end (open widget → answer
  4 questions → land on a result → Book Now deep-links correctly) — not
  exhaustive of every branch, just proving the UI wiring works.

## Open questions for Eddie

None blocking — the tree, copy tone, and fallback behavior are all covered
above. If any of the branching logic feels wrong once it's live and being
used, it's a config change in `serviceFinder.ts`, not a rebuild.
