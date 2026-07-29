/**
 * Content ids whose German text is our translation of the owner's English,
 * not the owner's own approved wording.
 *
 * Clear an id from this list once Eddie has approved that German copy.
 * `npm run check:release` fails while this array is non-empty, so unapproved
 * copy cannot reach production by accident.
 */
export const pendingGermanReview: string[] = [
  'site.qualifications',
  'services.performance-massage',
  'services.stretch-therapy',
  'services.performance-coaching',
  'faqs.booking',
  'faqs.treatments',
  'faqs.coaching',
  'testimonials.tom-steggemen',
  'testimonials.dr-verena',
  'testimonials.micheal-oatah',
  'testimonials.dr-moritz',
];
