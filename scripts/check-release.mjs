import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const path = fileURLToPath(new URL('../src/content/review.json', import.meta.url));
const pending = JSON.parse(readFileSync(path, 'utf8'));

if (pending.length > 0) {
  console.error('Release blocked — German copy awaiting owner approval:\n');
  for (const id of pending) console.error(`  - ${id}`);
  console.error(
    `\n${pending.length} item(s) outstanding. Once Eddie has approved a section,` +
      '\ndelete its id from src/content/review.json.',
  );
  process.exit(1);
}

console.log('Release gate passed — all German copy approved.');
