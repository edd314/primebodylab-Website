# Admin home-screen app — design

## Goal

Let Eddie add `/admin` to his iPhone's home screen so it opens like a
regular app — full screen, its own icon, no Safari address bar — instead
of him having to open Safari and type/remember the URL every time.

## Non-goals

- No Android-specific work right now (Eddie's phone is an iPhone). The
  approach below happens to also work reasonably on Android via the same
  meta tags, but nothing is being built or tested for it.
- No push notifications, no offline support, no service worker. This is
  purely about the home-screen launch experience.
- No new icon design. The site already renders a branded icon (`src/app/apple-icon.tsx`,
  brown background with a "P" monogram) at the root of the app, which Safari's
  "Add to Home Screen" already picks up for every route, admin included.

## Approach

Add Apple's web-app meta tags to the `/admin` layout only (not the public
site), via Next.js's built-in `appleWebApp` metadata option in
`src/app/admin/layout.tsx`:

- `capable: true` — tells Safari this page can run as a standalone app
  (hides the address bar/tab chrome when launched from the home screen).
- `title: 'PrimeBodyLab Admin'` — the name shown under the home-screen icon.
- `statusBarStyle: 'default'` — standard iOS status bar appearance.

No new files, no new icon, no manifest.json — the existing `apple-icon.tsx`
already covers every route (including `/admin`) since it lives at the root
of the app directory. This is a small, additive metadata change scoped
entirely to the admin layout, which already has its own `metadata` export
(currently just `robots: {index: false, follow: false}`).

## User-facing setup (one-time, on Eddie's phone)

1. Open Safari, go to the admin site, log in if needed.
2. Tap the Share icon (square with an arrow).
3. Tap "Add to Home Screen."
4. Confirm the name ("PrimeBodyLab Admin") and tap "Add."

From then on, tapping that icon opens straight into `/admin` full-screen.
Because the login session already lasts 30 days
(`src/lib/crm/session.ts`'s `MAX_AGE_SECONDS`), Eddie won't need to log in
every time he opens it — only roughly once a month, or sooner if he logs
out manually.

## Testing

- `npm run build` to confirm the metadata change doesn't break the build.
- Manual check after deploy: Eddie adds `/admin` to his home screen and
  confirms it launches full-screen with the right icon and name.
