import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getCoreWordHints } from '../src/utils/wordHints.js';
import { beforeQualityReview, beforeFollowupReview } from './helpers/vocabulary-history.mjs';
const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const vocabulary = await read('../public/data/vocabulary.json');
const register = await read('../data/vocabulary-quality-2026-10-25.json');

test('reviewed corrections preserve all unrelated records, IDs, categories and spoken text', () => {
  assert.equal(register.reviews.length, 16);
  assert.equal(vocabulary.length, 8699);
  for (const review of register.reviews) {
    assert.deepEqual(beforeFollowupReview(vocabulary).find(word => word.id === review.id), review.after);
    for (const key of ['id', 'word', 'example', 'phonetic', 'category', 'categories', 'level', 'list', 'ieltsList', 'ieltsLists']) assert.deepEqual(review.before[key], review.after[key], `${review.id} ${key}`);
    assert(review.sources.length);
    assert(review.sources.every(source => source.checkedAt && source.url.startsWith('https://www.merriam-webster.com/dictionary/')));
  }
  const original = JSON.stringify(beforeQualityReview(vocabulary), null, 2) + '\n';
  assert.equal(createHash('sha256').update(original).digest('hex'), register.baselineSha256);
});

test('high-risk meanings and corresponding hint senses are aligned', () => {
  const word = id => vocabulary.find(entry => entry.id === id);
  assert.match(word(6356).meaning, /青少年/);
  assert.match(word(6958).meaning, /感到无聊/);
  assert.match(word(6914).meaning, /冒犯/);
  assert.match(word(5947).exampleCn, /全部配料/);
  for (const [id, sense] of [[5873, /销售/], [5941, /州/], [5947, /配料/], [6258, /副词/]]) {
    const [hint] = getCoreWordHints(word(id));
    assert.match(hint.scope, sense);
    assert.equal(hint.examples.length, 2);
    assert(hint.sources.every(source => source.checkedAt === '2026-10-25'));
  }
});
