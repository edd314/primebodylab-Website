/**
 * Content ids whose German text is our translation of the owner's English,
 * not the owner's own approved wording.
 *
 * Clear an id from this list once Eddie has approved that German copy.
 * `npm run check:release` fails while this array is non-empty.
 */
export const pendingGermanReview: string[] = [
  'site.qualifications',
];
