# Open questions for Eddie

Everything here came up while building the site. Nothing has been silently
changed — where we deviated, it says so. Resolved items are kept (struck
through) so there's a record of what was decided.

## Still open — needs your decision

5. **Your qualifications — please confirm the exact wording.** The site
   currently shows: Certified Personal Trainer · Certified Sports Massage
   Therapist · Certified Assisted Stretch Specialist (`src/content/site.ts`,
   shown in the footer). This is only version live on the new site — the "two
   versions" were from your old Squarespace site (homepage vs. FAQ footer
   phrased it slightly differently). Is this wording accurate, or should any
   of the three titles change?

14. **Don't cancel Squarespace yet.** Keep it running until DNS has fully moved
    and the redirects are confirmed working. A few extra days of hosting is
    cheap insurance against downtime.

## Resolved

1. ~~All German copy needs your approval.~~ Still tracked in `src/content/review.json`
   (`npm run check:release` lists what's outstanding) — not fully cleared yet,
   but the mechanism is working as intended and copy is being approved section by
   section.

2. ~~Acuity appointment type IDs.~~ Done for all 5 services, including the
   Performance & Recovery Bundle.

3. ~~Missing prices.~~ Done — every service and duration has a real price
   (Performance Coaching remains "Auf Anfrage" / "On request" by design, since
   it's individually scoped).

4 & 5b. ~~Cancellation policy inconsistency.~~ Eddie confirmed: 24 hours' notice
   for studio sessions, 48 hours' for mobile (in-home) sessions; coaching plans
   have their own separate cancellation terms (not yet specified — flag if you
   want those written out explicitly). Now consistent across the homepage FAQ
   and the AGB.

6. ~~Dr. Verena's testimonial closing line.~~ Turned out to already be correct
   in the current build — it ends at "I am truly happy to be working with him,"
   not the mismatched sentence that appears on the old Squarespace site. No
   change needed; the earlier note was based on the old site, not this one.

7. ~~"Micheal Oatah"~~ — confirmed typo, fixed to "Michael Oatah" (was already
   correct in the displayed name; the internal id `micheal-oatah` has been
   corrected too).

8. ~~"What should i wear?" lowercase "i".~~ Corrected.

9. ~~"Extended Performance Recovery Sessions"~~ — dropped from the FAQ per
   Eddie; the FAQ now points to the real Performance & Recovery Bundle instead.

10. ~~"Performance Strategy Session"~~ — Eddie confirmed this refers to booking
    a coaching consultation call, not a separate service to add. No change
    needed.

11. ~~Logo.~~ Replaced with the real PrimeBodyLab anatomy-mark logo, enlarged in
    the header.

12. ~~Photography.~~ Real photos are in for founder portrait, treatment room,
    Wellness & Recovery Massage, Performance & Recovery Massage, Assisted
    Stretch Therapy, Performance Coaching, and a 5-photo homepage gallery. Only
    the Performance & Recovery Bundle still uses a stock placeholder — waiting
    on a suitable real photo from you.

13. ~~Social links.~~ Confirmed by Eddie — Instagram, TikTok, and Facebook as
    listed in `src/content/site.ts`.
