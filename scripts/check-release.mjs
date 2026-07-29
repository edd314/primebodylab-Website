import {pendingGermanReview} from '../src/content/review.ts';

if (pendingGermanReview.length > 0) {
  console.error('Release blocked — German copy awaiting owner approval:');
  for (const id of pendingGermanReview) console.error(`  - ${id}`);
  process.exit(1);
}

console.log('Release gate passed — all German copy approved.');
