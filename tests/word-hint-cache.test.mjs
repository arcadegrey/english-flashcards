import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createWordHintLoader } from '../src/data/wordHintCache.js';
import { getWordHints, getHintExampleParts } from '../src/utils/wordHints.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const manifest = await read('../src/data/wordHintsManifest.json');
const words = [...await read('../public/data/vocabulary.json'), ...RETIRED_VOCABULARY];
const batch = { entries: { 1: { word: 'hello', hints: [{ label: '用法', text: 'hello', sourceIds: ['a'] }] } }, sources: { a: { id: 'a', url: 'https://example.test' } } };
const tinyManifest = { batchSize: 200, batches: { 0: '/data/word-hints/0-test.json' } };
const fakeCache = () => {
  const entries = new Map();
  return { open: async () => ({ match: async path => entries.get(path)?.clone(), put: async (path, response) => entries.set(path, response.clone()), delete: async path => entries.delete(path) }) };
};

test('compiled batches cover all active/retired IDs and use content-addressed files', async () => {
  const entries = new Map();
  for (const path of Object.values(manifest.batches)) {
    const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
    assert(path.includes(createHash('sha256').update(bytes).digest('hex').slice(0, 16)));
    const data = JSON.parse(bytes);
    for (const [id, entry] of Object.entries(data.entries)) {
      assert(!entries.has(id)); entries.set(id, entry);
      for (const hint of entry.hints) for (const sourceId of hint.sourceIds || []) assert(data.sources[sourceId]?.url);
    }
  }
  assert.equal(entries.size, words.length);
  for (const word of words) assert.equal(entries.get(String(word.id))?.word, word.word);
});

test('on-demand hints retain reviewed content, references and exact example emphasis', async () => {
  const load = createWordHintLoader({ manifest, cacheStorage: null, fetchImpl: async path => new Response(await readFile(new URL(`../public${path}`, import.meta.url))) });
  for (const word of words) {
    const result = await load(word);
    assert.equal(result.cached, false);
    assert.deepEqual(result.hints, JSON.parse(JSON.stringify(getWordHints(word).map(hint => ({ ...hint, ...(hint.examples ? { examples: hint.examples.map(example => ({ en: example.en, zh: example.zh, parts: getHintExampleParts(example, hint.exampleWords) })) } : {}) })))));
    assert.equal(await load({ ...word, word: 'different snapshot' }), null);
  }
});

test('concurrent loads share a request and a new offline loader restores cached hints', async () => {
  const cacheStorage = fakeCache(); let calls = 0;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage, fetchImpl: async () => { calls++; return new Response(JSON.stringify(batch)); } });
  const word = { id: 1, word: 'hello' };
  const [first, second] = await Promise.all([load(word), load(word)]);
  assert.deepEqual(first, second); assert.equal(calls, 1); assert.equal(first.cached, true);
  const offline = createWordHintLoader({ manifest: tinyManifest, cacheStorage, fetchImpl: async () => { throw new Error('offline'); } });
  assert.deepEqual(await offline(word), first);
});

test('quota failures never claim offline readiness and failed requests remain retryable', async () => {
  let calls = 0;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage: { open: async () => ({ match: async () => null, put: async () => { throw new Error('quota'); } }) }, fetchImpl: async () => {
    if (!calls++) throw new Error('offline'); return new Response(JSON.stringify(batch));
  } });
  const word = { id: 1, word: 'hello' };
  await assert.rejects(load(word), /offline/);
  assert.equal((await load(word)).cached, false);
});

test('corrupt cached batches are discarded and a valid network response repairs them', async () => {
  const cacheStorage = fakeCache();
  const cache = await cacheStorage.open();
  await cache.put(tinyManifest.batches[0], new Response(JSON.stringify({ entries: {}, sources: {} })));
  let requests = 0;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage, fetchImpl: async () => {
    requests++; return new Response(JSON.stringify(batch));
  } });
  assert.equal((await load({ id: 1, word: 'hello' })).cached, true);
  assert.equal(requests, 1);
});

test('hung loads time out and an unknown word does not trigger a content request', async () => {
  const load = createWordHintLoader({ manifest: tinyManifest, timeoutMs: 15, cacheStorage: null, fetchImpl: () => new Promise(() => {}) });
  assert.equal(await load({ id: 'custom', word: 'hello' }), null);
  await assert.rejects(load({ id: 1, word: 'hello' }), /超时/);
});
