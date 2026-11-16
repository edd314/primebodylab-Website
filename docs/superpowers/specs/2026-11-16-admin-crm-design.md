# Admin CRM (`/admin`) — design

## Goal

Replace Eddie's current "memory + WhatsApp scrollback + calendar entries"
system for tracking clients with a simple, private page on his own site. It
needs to answer, at a glance: who are my clients, what package do they have
left, are they a studio/home/corporate client, where did they come from, and
who do I need to follow up with today.

This is explicitly a **solo-operator internal tool**, not a product yet. It
is scoped for Eddie's day-to-day use only. A later phase may turn this into
something sellable (echoing the "build your own system" ambition from the
Justin Vetsavong discussion) — that phase is out of scope here and changes
nothing about how this is built now.

## Non-goals

- No multi-user accounts or roles. One password, one operator.
- No automatic duplicate-contact merging. A lead that already exists as a
  client and submits a second form (e.g. Welcome popup, then later a
  corporate request with the same email) creates a second, clearly sourced
  and timestamped record. Eddie merges/ignores by eye. Real deduplication
  logic isn't worth the complexity for a handful of leads a week.
- No bilingual (DE/EN) UI. `/admin` is only ever seen by Eddie, so unlike the
  rest of the site, it does not need `{de, en}` content and is not subject to
  the `review.json` German-copy-approval gate. It's built directly in
  English.
- No calendar/scheduling logic, and no route planning for home visits. Visit
  type (Studio/Home/Both/Corporate) is a label for organizing the client
  list, nothing more.
- No automatic duplicate/spam protection beyond what the existing lead routes
  already do. This is a low-traffic, low-volume internal tool.

## Architecture & access

`/admin` is a new section inside the existing Next.js app — no new app, no
new domain, nothing extra for Eddie to install. It is protected by a single
shared secret (an `ADMIN_PASSWORD` environment variable, set the same way
`RESEND_API_KEY` etc. already are on Vercel):

- A login page at `/admin/login` takes the password, checks it server-side,
  and on success sets a signed, httpOnly cookie (long-lived, so Eddie isn't
  re-entering it constantly).
- Middleware guards every other `/admin/*` route: no valid cookie → redirect
  to `/admin/login`. No cookie, no password, no access — nothing sensitive is
  reachable by a visitor who just guesses the URL.
- This is deliberately not a full auth system (no NextAuth, no user table).
  One operator, one password, is the actual requirement.

Data lives in a new Postgres database, added via Vercel's own Postgres
integration (Vercel Storage, Neon-backed) — a few clicks on the existing
Vercel project, same place the site already deploys. Eddie never interacts
with the database directly; it's purely the storage behind `/admin`.

Queries are plain SQL via `@vercel/postgres` (tagged template queries), not
an ORM — the schema here is small (two tables, see below) and the project
doesn't use an ORM anywhere else, so this keeps the same lightweight style as
the rest of the codebase.

## Data model

**`clients` table** — one row per person/company:

| Field | Notes |
| --- | --- |
| `id` | primary key |
| `name` | required |
| `phone` | optional |
| `email` | optional |
| `visit_type` | `studio` \| `home` \| `both` \| `corporate` |
| `status` | `browsing` \| `inquiry` \| `booked` \| `active` \| `lapsed` |
| `source` | free text — `"Welcome popup"`, `"Corporate request"`, or manually typed (referral, Instagram, walk-in, phone) |
| `next_follow_up_at` | nullable date |
| `next_follow_up_note` | nullable text |
| `created_at` / `updated_at` | automatic |

**`packages` table** — many per client, since someone can buy more than one
over time:

| Field | Notes |
| --- | --- |
| `id` | primary key |
| `client_id` | foreign key → `clients` |
| `label` | e.g. `"5er-Karte Wellness Massage"` |
| `total_sessions` | integer |
| `used_sessions` | integer, defaults 0 — remaining is always computed as `total - used`, never stored separately, so it can't drift out of sync |
| `price_paid` | optional, in EUR |
| `payment_method` | `revolut` \| `sumup` \| `payment_link` \| `other` |
| `purchased_at` | date |

**`activity_log` table** — many per client, the running timeline:

| Field | Notes |
| --- | --- |
| `id` | primary key |
| `client_id` | foreign key → `clients` |
| `note` | free text |
| `created_at` | automatic — this is the timestamp shown, no separate "entry date" field |

A corporate lead's quote details (team size, duration, rhythm, commitment,
estimated price) are written into this client's first `activity_log` entry
as a formatted note, rather than modeled as separate columns — that data is a
one-time snapshot of what they asked for, not something queried or updated
later like a package is.

## Day-to-day workflow

`/admin` (the dashboard) shows, top to bottom:

1. **Follow-ups due** — every client whose `next_follow_up_at` is today or
   earlier, so nothing owed gets buried under everyone else.
2. **Client list** — searchable by name/phone, filterable by `status` and
   `visit_type`.

Opening a client (`/admin/clients/[id]`) shows their full record and lets
Eddie: add an activity-log line, change status, add/edit a package (and bump
`used_sessions` after a session), set/clear the next follow-up. A
"+ Add client" action on the dashboard opens a short manual-entry form
(name, phone, visit type, source) for walk-ins, phone calls, and referrals.

## Website integration

Both of the site's existing lead-capture routes gain a best-effort write
into this CRM, following the exact pattern already used for Mailchimp/email
in `src/app/api/corporate-lead/route.ts` — wrapped in its own try/catch, logged
on failure, never allowed to block or fail the visitor-facing response:

- **`src/app/api/subscribe/route.ts`** (Welcome popup): on a successful
  subscribe, create a `clients` row — `status: browsing`,
  `source: "Welcome popup"`, `email` set, `name`/`phone` left blank (the
  popup never collects them). Eddie fills those in later if/when the person
  actually books.
- **`src/app/api/corporate-lead/route.ts`**: on submission, create a
  `clients` row — `status: inquiry`, `source: "Corporate request"`,
  `visit_type: corporate`, `name`/`email`/`phone` from the form, with the
  quote details written as the first activity-log entry as described above.

## Error handling

- CRM writes are additive and best-effort, same as the Mailchimp/email
  pattern: if the database call fails, the route still returns its normal
  success response to the visitor (the popup still shows the discount code;
  the corporate page still opens WhatsApp), and the error is logged
  server-side so it isn't silently lost.
- Wrong `/admin/login` password: show an inline error, no lockout/attempt
  tracking — this is a single-operator password gate, not a multi-user
  system with abuse concerns at this scale.
- A missing/invalid session cookie on any `/admin/*` route redirects to
  `/admin/login` rather than erroring.

## Testing

- Vitest unit tests for the pure logic: remaining-sessions calculation
  (`total_sessions - used_sessions`), and the mapping from each lead route's
  submitted data into a `clients`/`activity_log` write.
- `npm run build` to catch type errors and missing-translation issues on the
  rest of the (still-bilingual) site — `/admin` itself is exempt from the
  bilingual requirement per Non-goals above.
- Manual walkthrough before shipping: create a test client, add a package,
  log an activity entry, set and clear a follow-up, then submit a test
  Welcome-popup signup and a test corporate request and confirm both create
  the expected `clients`/`activity_log` rows.

## Rollout dependency

Vercel Postgres must be added to the Vercel project before this can go live
— a short dashboard step on Eddie's end (same shape as adding the Resend env
vars earlier), to be walked through at implementation time.
