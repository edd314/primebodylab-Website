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
      src: '/images/gallery-1.jpg',
      alt: {
        de: 'Eddie bei der Hüft- und Piriformis-Mobilisation',
        en: 'Eddie performing a hip and piriformis release',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-2.jpg',
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
      src: '/images/gallery-3.jpg',
      alt: {de: 'Eddie bei einer Tischdehnung', en: 'Eddie performing a table stretch'},
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-5.jpg',
      alt: {
        de: 'Eddie bei einer Nacken- und Schultermassage',
        en: 'Eddie performing a neck and shoulder massage',
      },
      placeholder: false,
    }),
  },
  {
    kind: 'image',
    ...imageSchema.parse({
      src: '/images/gallery-6.jpg',
      alt: {de: 'Der Behandlungsraum von PrimeBodyLab', en: 'The PrimeBodyLab treatment room'},
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
