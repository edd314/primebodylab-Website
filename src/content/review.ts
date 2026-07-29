import ids from './review.json';

/**
 * Content ids whose German text is our translation of the owner's English,
 * not the owner's own approved wording.
 *
 * The list itself lives in `review.json` so that `scripts/check-release.mjs`
 * can read it without needing TypeScript — plain JSON works on every Node
 * version, which a .ts import does not.
 *
 * Delete an id from review.json once Eddie has approved that German copy.
 * `npm run check:release` fails while the list is non-empty, so unapproved
 * copy cannot reach production by accident.
 */
export const pendingGermanReview: string[] = ids;
