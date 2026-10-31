import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createWordHintLoader } from '../src/data/wordHintCache.js';
import { getWordHints, getHintExampleParts } from '../src/utils/wordHints.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';
import { wordHintFallbacks } from '../scripts/word-hint-fallbacks.mjs';

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

test('hung cache open, read or write cannot block valid online hints or falsely claim offline readiness', async () => {
  const hang = () => new Promise(() => {});
  for (const cacheStorage of [{ open: hang }, { open: async () => ({ match: hang, put: hang }) },
    { open: async () => ({ match: async () => null, put: hang }) }]) {
    const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage, cacheTimeoutMs: 5,
      fetchImpl: async () => Response.json(batch) });
    const result = await load({ id: 1, word: 'hello' });
    assert.equal(result.hints[0].text, 'hello'); assert.equal(result.cached, false);
  }
});

test('a stalled JSON request recovers through a shared validated fallback and saves the same offline batch', async () => {
  const cacheStorage = fakeCache(); let calls = 0, signal;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage, fallbackDelayMs: 5,
    fetchImpl: async (path, options) => { signal = options.signal; return new Promise(() => {}); },
    loadFallback: async path => { calls++; assert.equal(path, tinyManifest.batches[0]); return batch; } });
  const word = { id: 1, word: 'hello' };
  const [first, second] = await Promise.all([load(word), load(word)]);
  assert.deepEqual(first, second); assert.equal(calls, 1); assert.equal(signal.aborted, true);
  assert.equal(first.cached, true);
  const offline = createWordHintLoader({ manifest: tinyManifest, cacheStorage,
    fetchImpl: () => assert.fail('must use offline hints'), loadFallback: () => assert.fail('no fallback request') });
  assert.deepEqual(await offline(word), first);
});

test('fast primary avoids the fallback, and rejected primary starts it without waiting for the delay', async () => {
  const fast = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null, fallbackDelayMs: 1,
    fetchImpl: async () => Response.json(batch), loadFallback: () => assert.fail('no duplicate download') });
  await fast({ id: 1, word: 'hello' });
  await new Promise(resolve => setTimeout(resolve, 5));
  const recover = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null, fallbackDelayMs: 60000,
    fetchImpl: async () => { throw new Error('blocked JSON'); }, loadFallback: async () => batch });
  assert.equal((await recover({ id: 1, word: 'hello' })).hints[0].text, 'hello');
});

test('invalid fallbacks cannot poison hints; both failures and both stalled paths allow retry', async () => {
  let attempt = 0;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null,
    fetchImpl: async () => { throw new Error('blocked JSON'); },
    loadFallback: async () => ++attempt === 1 ? { entries: {}, sources: {} } : batch });
  await assert.rejects(load({ id: 1, word: 'hello' }), /blocked JSON/);
  assert.equal((await load({ id: 1, word: 'hello' })).hints[0].text, 'hello');
  const stalled = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null, timeoutMs: 10, fallbackDelayMs: 1,
    fetchImpl: () => new Promise(() => {}), loadFallback: () => new Promise(() => {}) });
  await assert.rejects(stalled({ id: 1, word: 'hello' }), /超时/);
  await assert.rejects(stalled({ id: 1, word: 'hello' }), /超时/);
});

test('published fallback modules retain all reviewed JSON exactly, including retired words and sources', async () => {
  const plugin = wordHintFallbacks(), emitted = [];
  plugin.configResolved({ command: 'build' });
  await plugin.buildStart.call({ emitFile: asset => emitted.push(asset) });
  assert.equal(emitted.length, Object.keys(manifest.batches).length);
  for (const path of Object.values(manifest.batches)) {
    const module = emitted.find(asset => asset.fileName === path.replace('/data/word-hints/', 'assets/word-hints/').replace(/\.json$/, '.js'));
    assert(module);
    assert.deepEqual((await import(`data:text/javascript;base64,${Buffer.from(module.source).toString('base64')}`)).default,
      await read(`../public${path}`));
  }
});

test('slow hint transfers keep loading beyond the original deadline while bytes continue arriving', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let stream;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null, timeoutMs: 10,
    fetchImpl: async () => new Response(new ReadableStream({ start(controller) { stream = controller; } })) });
  const pending = load({ id: 1, word: 'hello' });
  const tick = () => new Promise(resolve => setImmediate(resolve));
  await tick();
  const bytes = new TextEncoder().encode(JSON.stringify(batch));
  for (let offset = 0; offset < bytes.length; offset += 30) {
    t.mock.timers.tick(8);
    stream.enqueue(bytes.slice(offset, offset + 30));
    await tick();
  }
  stream.close();
  assert.equal((await pending).hints[0].text, 'hello');
});

test('a stalled partial hint response is cancelled and a later retry can recover', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let stream, cancelled = false, calls = 0;
  const load = createWordHintLoader({ manifest: tinyManifest, cacheStorage: null, timeoutMs: 10,
    fetchImpl: async () => ++calls > 1 ? Response.json(batch) : new Response(new ReadableStream({
      start(controller) { stream = controller; }, cancel() { cancelled = true; },
    })) });
  const pending = load({ id: 1, word: 'hello' }), failed = assert.rejects(pending, /超时/);
  await new Promise(resolve => setImmediate(resolve));
  stream.enqueue(new TextEncoder().encode('{"entries":'));
  await new Promise(resolve => setImmediate(resolve));
  t.mock.timers.tick(11); await failed;
  assert.equal(cancelled, true);
  assert.equal((await load({ id: 1, word: 'hello' })).hints[0].text, 'hello');
});
