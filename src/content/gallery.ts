import {imageSchema, videoClipSchema, type GalleryItem} from './schema';

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
      src: '/images/gallery-9.jpg',
      alt: {
        de: 'Eddie bei einer Hüftbehandlung im Studio',
        en: 'Eddie performing a hip treatment in the studio',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-10.jpg',
      alt: {
        de: 'Eddie bei einer Tiefengewebsmassage',
        en: 'Eddie performing a deep tissue massage',
      },
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
    kind: 'video',
    ...videoClipSchema.parse({
      src: null,
      alt: {
        de: 'Eddie auf dem Weg zu einem Mobiltermin',
        en: 'Eddie on his way to a mobile appointment',
      },
    }),
  },
];
