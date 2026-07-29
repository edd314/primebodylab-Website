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

12. **Photography.** The site is designed to look right with few images, but real
    photos of you, the studio and hands-on work will lift it considerably. Stock is
    used only for environment and texture — never a stand-in for you or your room.

13. **Social links — please confirm.** We took these from your current site:
    - Instagram: `instagram.com/prime.body.lab/`
    - TikTok: `tiktok.com/@primebodylab_`
    - Facebook: `facebook.com/primebodylab`

## Before switching the domain over

14. **Don't cancel Squarespace yet.** Keep it running until DNS has fully moved and
    the redirects are confirmed working. A few extra days of hosting is cheap
    insurance against downtime.
