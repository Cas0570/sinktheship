import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const expected = readFileSync(
  new URL('./masterprompt.sha256', import.meta.url),
  'utf8',
).trim();
const actual = createHash('sha256')
  .update(readFileSync(new URL('../docs/00-masterprompt.md', import.meta.url)))
  .digest('hex');
if (actual !== expected) {
  console.error(
    'The original masterprompt changed. Restore its exact bytes; do not regenerate the baseline.',
  );
  process.exitCode = 1;
} else console.log('Original masterprompt SHA-256 verified.');
