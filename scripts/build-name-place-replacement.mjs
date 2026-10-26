// Idempotent second replacement stage. New IDs never inherit archived progress.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { beforeSenseReview } from '../shared/vocabularyHistory.js';
const root = new URL('../', import.meta.url);
const base = 'data/name-place-replacement/';
const read = path => readFile(new URL(path, root), 'utf8');
const json = async path => JSON.parse(await read(path));
const write = (path, value) => writeFile(new URL(path, root), JSON.stringify(value, null, 2) + '\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const retired = await json(base + 'retired-2026-10-26.json');
const sources = await json(base + 'sources-2026-10-26.json');
const phonetics = await json(base + 'phonetics-2026-10-26.json');
const rows = (await read(base + 'practical-2026-10-26.tsv')).trim().split('\n').map(line => line.split('\t'));
assert.equal(rows.length, retired.length);
assert.equal(rows.length, 80);
const noteSources = {}, groups = {}, notes = {};
const additions = rows.map(([word, pos, meaning, en, zh, en2, zh2, note, slug, ...extra], index) => {
  assert(!extra.length && word && note.length > 20 && en && zh && en2 && zh2 && slug);
  const id = 8947 + index, key = word.toLowerCase(), sourceId = `practical-2026-10-26-${id}`;
  const evidence = sources.find(item => item.word === word);
  assert(evidence?.status === 'source-checked' && evidence.fact && evidence.sha256, `Source: ${word}`);
  assert(phonetics[key]?.ipa && phonetics[key]?.method, `IPA: ${word}`);
  noteSources[sourceId] = { title: `${evidence.publisher} · ${word}`, url: evidence.url, checkedAt: '2026-10-26', use: 'factual-reference' };
  groups[sourceId] = { words: [key], comparisonType: 'usage', sense: `${pos} · ${meaning}`, note,
    examples: [{ en, zh }, { en: en2, zh: zh2 }], sourceIds: [sourceId], review: { status: 'source-checked', checkedAt: '2026-10-26' } };
  if (word === 'be supposed to') for (const example of groups[sourceId].examples) {
    example.forms = [{ word: key, form: 'are supposed to', sourceIds: [sourceId], review: { status: 'source-checked', checkedAt: '2026-10-26' } }];
  }
  notes[key] = { synonymGroup: sourceId };
  return { id, word, phonetic: phonetics[key].ipa, pos, meaning, example: en, exampleCn: zh, category: 'daily', categories: ['daily'] };
});
const active = await json('public/data/vocabulary.json');
const removed = new Map(retired.map((word, i) => [word.id, { before: word, after: additions[i] }]));
const added = new Map(additions.map(word => [word.id, word]));
for (const word of active) {
  if (removed.has(word.id)) assert.deepEqual(word, removed.get(word.id).before, `Unexpected edit: ${word.id}`);
  if (added.has(word.id)) assert.deepEqual(word, added.get(word.id), `Do not reuse ID: ${word.id}`);
}
const baseline = beforeSenseReview(active).map(word => added.has(word.id) ? retired[word.id - 8947] : word);
const updated = active.map(word => removed.get(word.id)?.after || word);
assert.equal(active.length, 8699);
assert.equal(new Set(updated.map(word => word.id)).size, 8699);
assert(updated.every(word => !removed.has(word.id)));
assert.equal(updated.filter(word => added.has(word.id)).length, 80);
const allKnown = new Set([...baseline, ...retired].map(word => word.word.toLowerCase()));
for (const word of additions) { assert(!allKnown.has(word.word.toLowerCase()), `Duplicate: ${word.word}`); allKnown.add(word.word.toLowerCase()); }
await write('public/data/vocabulary.json', updated);
await write(base + 'practical-2026-10-26.json', additions);
await write(base + 'replacement-manifest.json', { date: '2026-10-26', baselineSha256: hash(JSON.stringify(baseline, null, 2) + '\n'),
  activeCount: updated.length, removedIds: retired.map(word => word.id), addedIds: additions.map(word => word.id),
  replacements: retired.map((word, index) => ({ retiredId: word.id, retiredWord: word.word, newId: additions[index].id, newWord: additions[index].word,
    reason: ['lewis', 'ruth', 'ulster', 'surrey', 'morgan', 'charlotte', 'kong'].includes(word.word)
      ? '少见同形义与人名／地名提示或例句混淆，按本轮实用词优先方向整条替换；并非否认该普通词义存在。'
      : '当前以具体人名、姓氏、地名或具名人物／天体为教学内容。' })),
  policy: 'Preserve archived IDs and snapshots; never transfer progress, rewrite history, or label unverified additions CET4.' });
await writeFile(new URL('src/data/namePlaceWordNotes.js', root), '// Original notes and bilingual examples; source facts and IPA methods are registered separately.\n'
  + `export const NAME_PLACE_NOTE_SOURCES = ${JSON.stringify(noteSources, null, 2)};\n`
  + `export const NAME_PLACE_SYNONYM_GROUPS = ${JSON.stringify(groups, null, 2)};\n`
  + `export const NAME_PLACE_WORD_NOTES = ${JSON.stringify(notes, null, 2)};\n`);
console.log(`Replaced ${retired.length} records; ${updated.length} active IDs; new IDs 8947–9026.`);
