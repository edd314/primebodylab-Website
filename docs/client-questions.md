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

15. **Refund / cancellation / withdrawal policy — legal review needed before
    treating as final.** The AGB (`src/content/legal.ts`) now has: a concrete
    cancellation clause (free up to 24h studio / 48h mobile; 100% charged for
    later cancellations and no-shows; mobile may add a travel-cost share),
    a Gift Vouchers clause (3-year validity, no cash payout, transferable,
    not combinable), and a full Widerrufsrecht (14-day right of withdrawal)
    section. The Gutscheine page shows a short version of the voucher terms.
    All of this is an unreviewed draft — an imprecise Storno-/Widerruf clause
    is a common Abmahnung target in Germany. Run it past a lawyer or a
    generator service (eRecht24, IT-Recht Kanzlei) before considering it done.

16. **Consent checkbox at booking is still missing.** The Widerrufsrecht clause
    only becomes enforceable against a client who has already had the session
    if they gave explicit, recorded consent at booking to start the service
    before the 14 days are up (and acknowledged the right ends on full
    performance). This site's booking is on Acuity, so it has to be added
    there — either a required checkout consent field (plan-tier dependent) or a
    required acknowledgment line on the intake form so there's a timestamped
    record per booking. Suggested German wording:
    "Ich verlange ausdrücklich, dass PrimeBodyLab bereits vor Ablauf der
    Widerrufsfrist mit der Ausführung der gebuchten Leistung beginnt. Mir ist
    bekannt, dass ich mit vollständiger Vertragserfüllung mein Widerrufsrecht
    verliere."

17. **Coaching-plan cancellation terms** are referenced in the AGB ("communicated
    separately") but not written down anywhere yet. Decide the actual terms and
    where clients see them.

18. **Session packages / bundles (5er / 10er).** Not built and no AGB clause yet.
    When they launch, add a bundle clause: e.g. 12-month validity; unused
    sessions refundable but recalculated at the full single-session price of
    sessions already taken (difference to the package price not refunded);
    unused sessions expire after the validity period.

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
