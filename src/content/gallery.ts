import {imageSchema, type GalleryItem} from './schema';

/**
 * Homepage "behind the scenes" gallery — candid session/studio photos and
 * (soon) a short ambient clip, no captions.
 *
 * To add a photo: push `{kind: 'image', ...}` with a real `src` in
 * public/images/ and `placeholder: false`, same pattern as `images.ts`.
 *
 * To add the video: drop the file in public/videos/, set its `src` below
 * (replacing `null`), and add a `poster` (a still frame in public/images/)
 * so there's something to show before it plays.
 */
export const gallery: GalleryItem[] = [
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/eddie-hamstring-stretch.png',
      alt: {
        de: 'Eddie beim Dehnen der Oberschenkelrückseite',
        en: 'Eddie stretching a client’s hamstrings',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-8.jpg',
      alt: {de: 'Eddie, Gründer von PrimeBodyLab', en: 'Eddie, founder of PrimeBodyLab'},
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/eddie-wellness-massage-detail.jpg',
      alt: {
        de: 'Eddie bei einer Nackenbehandlung im Studio',
        en: 'Eddie treating a client’s neck in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/eddie-bundle-massage.png',
      alt: {
        de: 'Eddie bei einer Bein- und Wadenbehandlung',
        en: 'Eddie treating a client’s calf and leg',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/eddie-wellness-massage.png',
      alt: {
        de: 'Eddie bei einer Wellness & Recovery Massage',
        en: 'Eddie performing a Wellness & Recovery Massage',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-12.jpg',
      alt: {de: 'Der Behandlungsraum von PrimeBodyLab', en: 'The PrimeBodyLab treatment room'},
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/client-transformation-before.jpg',
      alt: {
        de: 'Klientin vor ihrem Trainingsprogramm mit Eddie (Gesicht unkenntlich gemacht)',
        en: 'Client before her training programme with Eddie (face blurred)',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/client-transformation-after.jpg',
      alt: {
        de: 'Klientin nach ihrem Trainingsprogramm mit Eddie (Gesicht unkenntlich gemacht)',
        en: 'Client after her training programme with Eddie (face blurred)',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-13.jpg',
      alt: {
        de: 'Eddie bei einer Rückenbehandlung im Studio',
        en: 'Eddie performing a back treatment in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-14.jpg',
      alt: {
        de: 'Eddie bei einer Rückenbehandlung im Studio',
        en: 'Eddie performing a back treatment in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-15.jpg',
      alt: {
        de: 'Eddie bei einer Rückenmassage im Studio',
        en: 'Eddie performing a back massage in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-16.jpg',
      alt: {
        de: 'Eddie bei einer Nacken- und Kopfbehandlung im Studio',
        en: 'Eddie performing a neck and head treatment in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-17.jpg',
      alt: {
        de: 'Eddie bei einer Bauchmassage',
        en: 'Eddie performing an abdominal massage',
      },
      placeholder: false,
    }),
  },
];
