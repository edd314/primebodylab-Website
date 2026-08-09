import {imageSchema, type SiteImage} from './schema';

/**
 * Every photograph on the site, in one place.
 *
 * `placeholder: false` — Eddie's own photography, taken from his current site.
 * `placeholder: true`  — licensed stock standing in until his shoot is done.
 *                        These render with a visible "Platzhalter" chip so no
 *                        visitor mistakes stock for his studio or his clients.
 *
 * To swap in a real photo: drop the file into public/images/, point `src` at it,
 * and set `placeholder: false`. Nothing else needs to change — the layouts are
 * already sized for these crops.
 *
 * Stock sources are Unsplash (Unsplash License: free for commercial use, no
 * attribution required). Recorded here so they can be traced and replaced.
 */
export const images = {
  founder: imageSchema.parse({
    src: '/images/eddie-founder.jpg',
    alt: {
      de: 'Eddie Ekanem, Gründer von PrimeBodyLab',
      en: 'Eddie Ekanem, founder of PrimeBodyLab',
    },
    placeholder: false,
  }),

  heroPortrait: imageSchema.parse({
    src: '/images/eddie-hero.jpg',
    alt: {
      de: 'Eddie Ekanem, Gründer von PrimeBodyLab',
      en: 'Eddie Ekanem, founder of PrimeBodyLab',
    },
    placeholder: false,
    // Source photo has generous headroom above the head and a chair/stool
    // in frame below the arms — biasing the crop toward the top keeps the
    // whole head in frame on the tall 4/5–3/4 hero crop instead of the
    // default center crop cutting into the top of the head.
    focus: 'center 12%',
  }),

  treatmentRoom: imageSchema.parse({
    src: '/images/treatment-room.webp',
    alt: {
      de: 'Behandlungsraum von PrimeBodyLab in Pfaffenhofen',
      en: 'The PrimeBodyLab treatment room in Pfaffenhofen',
    },
    placeholder: false,
  }),

  wellnessMassage: imageSchema.parse({
    src: '/images/eddie-wellness-massage.png',
    alt: {
      de: 'Eddie bei einer Wellness & Recovery Massage',
      en: 'Eddie performing a Wellness & Recovery Massage',
    },
    placeholder: false,
  }),

  wellnessMassageDetail: imageSchema.parse({
    src: '/images/eddie-wellness-massage-detail.jpg',
    alt: {
      de: 'Eddie bei einer Nackenbehandlung im Studio',
      en: 'Eddie treating a client’s neck in the studio',
    },
    placeholder: false,
  }),

  massage: imageSchema.parse({
    src: '/images/eddie-massage.jpg',
    alt: {
      de: 'Eddie bei einer Performance & Recovery Massage',
      en: 'Eddie performing a Performance & Recovery Massage',
    },
    placeholder: false,
  }),

  stretch: imageSchema.parse({
    src: '/images/eddie-stretch.jpg',
    alt: {
      de: 'Eddie bei der Behandlung eines Klienten',
      en: 'Eddie treating a client',
    },
    placeholder: false,
  }),

  coaching: imageSchema.parse({
    src: '/images/eddie-coaching.jpg',
    alt: {
      de: 'Eddie beim Kraftraining im Clever Fit Studio',
      en: 'Eddie strength training at Clever Fit',
    },
    placeholder: false,
    focus: 'center 25%',
  }),

  bundle: imageSchema.parse({
    src: '/images/eddie-bundle-massage.png',
    alt: {
      de: 'Eddie bei einer Bein- und Wadenbehandlung',
      en: 'Eddie treating a client’s calf and leg',
    },
    placeholder: false,
  }),
} satisfies Record<string, SiteImage>;
