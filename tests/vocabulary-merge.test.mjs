import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mergeVocabularyList } from '../src/utils/vocabularyMerge.js';
import { getPlanWordStats } from '../src/utils/studyPlan.js';

test('loading full vocabulary after core retains every ID and both homograph records', async () => {
  const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
  const full = await read('../public/data/vocabulary.json');
  const core = await read('../public/data/vocabulary/core.json');
  for (const merged of [mergeVocabularyList(core, full), mergeVocabularyList(full, core)]) {
    assert.equal(merged.length, full.length);
    assert.deepEqual(new Set(merged.map(word => word.id)), new Set(full.map(word => word.id)));
    for (const id of [1234, 4293, 3318, 7977]) assert.deepEqual(merged.find(word => word.id === id), full.find(word => word.id === id));
    assert.deepEqual(mergeVocabularyList(merged, full), merged);
    const pair = merged.filter(word => [1234, 4293].includes(word.id));
    assert.equal(getPlanWordStats(pair, {}, [1234], []).remaining, 1);
  }
});

test('same-ID shard updates merge metadata without consuming another ID or ID-less legacy record', () => {
  const first = { id: 1, word: 'same', category: 'daily' };
  const second = { id: 2, word: 'same', category: 'cet4', meaning: 'independent' };
  const merged = mergeVocabularyList([first, second, { word: 'same' }], [{ id: '1', word: 'same', category: 'toefl', meaning: 'updated' }]);
  assert.equal(merged.length, 3);
  assert.deepEqual(merged.find(word => String(word.id) === '1').categories, ['daily', 'toefl']);
  assert.deepEqual(merged.find(word => word.id === 2), second);
});
