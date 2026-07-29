# primebodylab.de

German-first marketing site for PrimeBodyLab — sports massage, assisted stretch
therapy and performance coaching in Pfaffenhofen, Bavaria.

Replaces the previous Squarespace site.

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · next-intl · Zod · Vitest ·
Playwright · Vercel

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build — also validates all content |
| `npm test` | Content and unit tests |
| `npm run test:e2e` | Playwright suite |
| `npm run test:perf` | Lighthouse budget — fails if Core Web Vitals regress |
| `npm run check:release` | Fails while German copy awaits the owner's approval |

## Architecture notes

- **German is the default locale**, served unprefixed; English lives under `/en`.
  Localised pathnames are declared in `src/i18n/routing.ts` — the `app/` directory
  uses internal English paths (`/services`), visitors see the localised ones
  (`/leistungen`).
- Automatic locale detection is **off**. With it on, any request carrying an
  English `Accept-Language` header — including Googlebot — would be redirected
  from `/` to `/en`, leaving the German homepage unindexed at the root.
- All pages are statically generated. A small edge middleware (`src/proxy.ts`)
  handles locale routing only.
- **No third-party script loads before user interaction**, which is why there is
  no cookie banner. See `src/components/booking/BookingGate.tsx`.
- All copy lives in typed files under `src/content/`, validated by Zod at build
  time. A record missing either locale is a build error, not a blank page.

## Content and client docs

- `AGENTS.md` (imported by `CLAUDE.md`) — how to change content safely
- `docs/client-questions.md` — open questions for the owner
- `docs/superpowers/specs/` — the design spec
- `docs/superpowers/plans/` — the implementation plan

## Deployment

Push to `main`; Vercel builds and deploys.

Cutover from Squarespace is documented in
`docs/superpowers/specs/2026-07-29-primebodylab-rebuild-design.md` §9. The site
must not go live while `npm run check:release` fails.
