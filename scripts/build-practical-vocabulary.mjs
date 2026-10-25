import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const writeJson = (path, value) => writeFile(new URL(path, root), JSON.stringify(value, null, 2) + '\n');
const source = 'data/vocabulary-replacement/';
const metadata = JSON.parse(await read(`${source}sources-2026-10-25.json`));
const phonetics = JSON.parse(await read(`${source}phrase-phonetics-2026-10-25.json`));
const rows = (await read(`${source}practical-2026-10-25.tsv`)).trim().split('\n').map(line => line.split('\t'));
assert.equal(rows.length, 247);
assert.equal(RETIRED_VOCABULARY.length, 247);
const sources = {}, groups = {}, notes = {};
const added = rows.map(([word, pos, meaning, en, zh, en2, zh2, note, ...extra], index) => {
  assert(!extra.length && note?.length > 20 && en2 && zh2, word);
  const key = word.toLowerCase();
  const evidence = metadata.find(item => item.word.toLowerCase() === key);
  assert(evidence, `Missing evidence: ${word}`);
  const sourceId = `practical-${8700 + index}`;
  sources[sourceId] = { title: `牛津学习词典 · ${word}`, url: evidence.url, checkedAt: '2026-10-25', use: 'factual-reference' };
  groups[sourceId] = {
    words: [key], comparisonType: 'usage', sense: `${pos} · ${meaning}`, note,
    examples: [{ en, zh }, { en: en2, zh: zh2 }], sourceIds: [sourceId],
    review: { status: 'source-checked', checkedAt: '2026-10-25' },
  };
  notes[key] = { synonymGroup: sourceId };
  return { id: 8700 + index, word, phonetic: phonetics[key] || evidence.phonetics[0], pos, meaning,
    example: en, exampleCn: zh, category: 'daily', categories: ['daily'] };
});
assert(added.every(word => word.phonetic));
const active = JSON.parse(await read('public/data/vocabulary.json'));
const retiredIds = new Set(RETIRED_VOCABULARY.map(word => word.id));
const replacements = new Map(RETIRED_VOCABULARY.map((word, index) => [word.id, added[index]]));
const freshIds = new Set(added.map(word => word.id));
for (const word of active.filter(word => freshIds.has(word.id))) {
  assert.equal(added.find(item => item.id === word.id)?.word, word.word, 'Do not reorder TSV rows or reuse a released ID for a different word');
}
// Idempotent; retain the relative order and content of every unrelated record.
const updated = active.map(word => replacements.get(word.id) || (freshIds.has(word.id) ? added.find(item => item.id === word.id) : word));
assert.equal(updated.length, 8699);
assert(!updated.some(word => retiredIds.has(word.id)));
assert.equal(new Set(updated.map(word => word.id)).size, updated.length);
assert.equal(updated.filter(word => freshIds.has(word.id)).length, 247);
const headwords = new Set(updated.filter(word => !freshIds.has(word.id)).map(word => word.word.toLowerCase()));
for (const word of added) { assert(!headwords.has(word.word.toLowerCase()), word.word); headwords.add(word.word.toLowerCase()); }
await writeJson('public/data/vocabulary.json', updated);
await writeJson(`${source}practical-2026-10-25.json`, added);
await writeJson(`${source}replacement-manifest.json`, {
  date: '2026-10-25', removedIds: [...retiredIds], addedIds: [...freshIds],
  activeCount: updated.length, archiveCount: RETIRED_VOCABULARY.length,
  archivedSha256: createHash('sha256').update(JSON.stringify(RETIRED_VOCABULARY)).digest('hex'),
  policy: 'Removed from active learning and new assignments; old IDs remain reference-only. No ID reuse or user-progress rewrite.',
});
await writeFile(new URL('src/data/practicalWordNotes.js', root),
  '// Original examples/notes. Dictionary sources verify senses; phrase IPA is editor-transcribed.\n'
  + `export const PRACTICAL_NOTE_SOURCES = ${JSON.stringify(sources, null, 2)};\n`
  + `export const PRACTICAL_SYNONYM_GROUPS = ${JSON.stringify(groups, null, 2)};\n`
  + `export const PRACTICAL_WORD_NOTES = ${JSON.stringify(notes, null, 2)};\n`);
console.log(`Active: ${updated.length}; archived: ${RETIRED_VOCABULARY.length}; new practical entries: ${added.length}`);
