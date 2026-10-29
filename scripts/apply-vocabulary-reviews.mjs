import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
const root = new URL('../', import.meta.url);
const registers = await Promise.all(['data/vocabulary-quality-2026-10-25.json', 'data/vocabulary-followup/reviews-2026-10-25.json', 'data/sense-review/reviews-2026-10-26.json', 'data/vocabulary-feedback/reviews-2026-10-29.json', 'data/vocabulary-p1-repair/reviews-2026-10-29.json']
  .map(async path => JSON.parse(await readFile(new URL(path, root), 'utf8'))));
const states = new Map();
for (const register of registers) for (const review of register.reviews) {
  const history = states.get(review.id) || [];
  history.push(review.before, review.after);
  states.set(review.id, history);
}
const path = new URL('public/data/vocabulary.json', root);
const vocabulary = JSON.parse(await readFile(path, 'utf8'));
for (const [id, history] of states) {
  const index = vocabulary.findIndex(word => word.id === id);
  if (index < 0) {
    assert.deepEqual(RETIRED_VOCABULARY.find(word => word.id === id), history.at(-1), `Archived ${id} must retain its last reviewed text`);
    continue;
  }
  assert(index >= 0, `Missing ${id}`);
  assert(history.some(state => isDeepStrictEqual(vocabulary[index], state)), `Unexpected edits to ${id}; review before overwriting`);
  vocabulary[index] = history.at(-1);
}
await writeFile(path, JSON.stringify(vocabulary, null, 2) + '\n');
console.log(`Applied reviewed content for ${states.size} IDs. Rebuild shards, catalog and hint batches.`);
