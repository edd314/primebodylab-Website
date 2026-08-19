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

  wellnessMassage: imageSchema.parse({
    src: '/images/eddie-wellness-massage.png',
    alt: {
      de: 'Eddie bei einer Wellness & Recovery Massage',
      en: 'Eddie performing a Wellness & Recovery Massage',
    },
    placeholder: false,
    // Source photo has Eddie's face in the top third and the client/hands
    // lower down; biasing down keeps the actual treatment (hands on the
    // client) in frame on wide crops like the /book hero instead of just
    // showing his face against the wall art.
    focus: 'center 62%',
  }),

  wellnessMassageDetail: imageSchema.parse({
    src: '/images/eddie-wellness-massage-detail.jpg',
    alt: {
      de: 'Eddie bei einer Nackenbehandlung im Studio',
      en: 'Eddie treating a client’s neck in the studio',
    },
    placeholder: false,
    // Source photo is a tall portrait crop; the detail page renders it at
    // 21:9 on desktop, which centers on empty wall/canvas above Eddie's head
    // by default. Biasing down keeps his hands and the client's neck/head in
    // frame instead of just cropping to his face and the artwork behind him.
    focus: 'center 68%',
  }),

  massage: imageSchema.parse({
    src: '/images/eddie-massage.jpg',
    alt: {
      de: 'Eddie bei einer Performance & Recovery Massage',
      en: 'Eddie performing a Performance & Recovery Massage',
    },
    placeholder: false,
    // Source photo has Eddie's face/torso in the top half and the actual
    // treatment (hands on the client's hip/leg) lower down; biasing down
    // keeps the treatment visible on wide crops instead of just his face.
    focus: 'center 68%',
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

  coachingAthletic: imageSchema.parse({
    src: '/images/eddie-coaching-athletic.jpg',
    alt: {
      de: 'Eddie, Gründer von PrimeBodyLab, im Studio',
      en: 'Eddie, founder of PrimeBodyLab, in the studio',
    },
    placeholder: false,
    focus: 'center 20%',
  }),

  bundle: imageSchema.parse({
    src: '/images/eddie-bundle-assisted-stretch.jpg',
    alt: {
      de: 'Eddie beim assistierten Stretching',
      en: 'Eddie performing an assisted stretch',
    },
    placeholder: false,
    // Source photo is dim/low-light with a black letterboxed strip at the
    // very top; biasing down keeps the actual treatment (hands on the
    // client) in frame instead of showing mostly empty dark ceiling/wall.
    focus: 'center 65%',
  }),
} satisfies Record<string, SiteImage>;
