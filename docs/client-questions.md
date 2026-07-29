# Open questions for Eddie

Everything here came up while transcribing content from the current Squarespace
site. Nothing has been silently changed — where we deviated, it says so.

## Blocking — the site can't launch without these

1. **All German copy needs your approval.** Every German string on the site is
   currently our translation of your English, not your words. `npm run check:release`
   lists exactly what's outstanding and fails until it's cleared.

2. **Acuity appointment type IDs.** Until we have these, every "Book now" button
   lands on your general Acuity calendar instead of the specific service the
   visitor just clicked. This costs bookings. They go in `src/content/services.ts`.

3. **Missing prices.** Only the 60-minute massage has a price (€80). Still needed:
   - Performance Massage — 90 min, 120 min
   - Assisted Stretch Therapy — 60, 90, 120 min
   - Performance Coaching
   These currently display as "Auf Anfrage" / "On request", which is deliberate —
   nothing ships blank — but published prices convert better.

## Contradictions on the current site

4. **Cancellation policy says two different things.** `/faqs-2` says only "24 hours".
   Your homepage says "Studio sessions require at least 24 hours' notice, while
   mobile (in-home) sessions require 48 hours' notice."
   **We used the homepage version** — it's your wording and it's more accurate.
   Confirm that's right.

5. **Your qualifications are listed two different ways.**
   - Homepage: Certified Personal Trainer · Certified Sports Massage Therapist ·
     Certified Assisted Stretch Specialist
   - FAQ page footer: Certified Personal Trainer · Certified Massage Therapist ·
     Certified Stretch Expert
   **We used the homepage version.** Which is correct?

5b. **Your AGB gives a third figure.** It says "at least 24 hours in advance"
   with no mention of mobile sessions. Between the FAQ, the homepage and the AGB
   there are now three slightly different statements of the same policy. Pick one
   and we'll make all three match.

## New privacy policy section — please confirm

15. Your old privacy policy was written for Squarespace. The new site is hosted
    differently, so we added a section 4, "Hosting and Third-Party Services",
    stating that:
    - the site is hosted by Vercel Inc.
    - fonts are served from our own server, with no connection to Google Fonts
    - the Acuity booking calendar loads **only** after the visitor clicks, and no
      connection to Acuity is made otherwise

    All three are factually true of the site as built. Please read it and confirm
    you're happy with the wording. Everything in sections 1–3 is your original text,
    unchanged.

## Errors we found but did not fix for you

6. **Dr. Verena's review looks like it has text pasted into it by mistake.** It ends
   with: *"Eddie didn't just do that, his approach and passion for what he does is
   inspirational."* — which is the same closing sentence as Micheal Oatah's review,
   and doesn't follow from anything before it in Verena's.
   We reproduced it **exactly as it appears on your site**. Correcting a real
   client's testimonial is your call, not ours. Worth fixing though — it reads as
   a copy-paste slip.

7. **"Micheal Oatah"** — is that the correct spelling, or should it be Michael?

8. **"What should i wear?"** had a lowercase "i" on the live site. We corrected it
   to "I" as an obvious typo. Say the word if you'd rather it stayed.

## Services you mention but don't sell

9. **"Extended Performance Recovery Sessions"** are mentioned in your FAQ but aren't
   a bookable service anywhere. Should they be listed with a price?

10. **"Performance Strategy Session"** is what your FAQ tells people to book when
    they're unsure — but it isn't on your services page. This is a good entry-level
    offer and it's currently invisible. Add it?

## Assets

11. **Logo.** The current one is a small raster (`logo+embedded.png`). An SVG or a
    high-resolution PNG would look sharper, especially on phones.

12. **Photography — where your photos will go.** Every image slot is now filled so
    you can see the shape of it. Two are already yours, taken from your current
    site:

    | Where | Image | Status |
    | --- | --- | --- |
    | Homepage, "Hi, ich bin Eddie" | Your portrait | **Yours** |
    | Booking page | Your treatment room | **Yours** |
    | Performance Massage card + detail page | Hands-on massage | Stock placeholder |
    | Assisted Stretch card + detail page | Therapist stretching a leg | Stock placeholder |
    | Performance Coaching card + detail page | Dumbbells | Stock placeholder |

    The three stock images carry a small **PLATZHALTER** label on the page, on
    purpose — nobody should mistake stock for your studio or your clients, and it
    makes the gaps obvious at a glance. The labels disappear automatically when
    the real photos go in.

    Stock is deliberately limited to hands, equipment and environment with no
    identifiable faces. What we most need from your shoot: you working on a
    client, your studio, and hands-on detail shots.

13. **Social links — please confirm.** We took these from your current site:
    - Instagram: `instagram.com/prime.body.lab/`
    - TikTok: `tiktok.com/@primebodylab_`
    - Facebook: `facebook.com/primebodylab`

## Before switching the domain over

14. **Don't cancel Squarespace yet.** Keep it running until DNS has fully moved and
    the redirects are confirmed working. A few extra days of hosting is cheap
    insurance against downtime.
