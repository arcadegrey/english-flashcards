import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createVocabularyLoader } from '../src/data/vocabularyCache.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { needsPlanCatalog } from '../src/utils/dailyPlan.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const [index, full, core] = await Promise.all([
  read('src/data/vocabularyIndex.json'), read('public/data/vocabulary.json'), read('public/data/vocabulary/core.json'),
]);
const canonical = new Map(full.map(word => [String(word.id), word]));
const makeLoader = () => {
  const requests = [];
  const fetchJson = createVocabularyLoader({ version: 'test', cacheStorage: undefined, fetchImpl: async path => {
    requests.push(path.split('?')[0]);
    return Response.json(await read(`public${path.split('?')[0]}`));
  } });
  return { ...createVocabularyDelivery({ fetchJson, index }), requests };
};

test('core plus the extension reconstructs every active record without downloading core twice', async () => {
  const loader = makeLoader();
  await loader.loadCore();
  const [words, concurrent] = await Promise.all([loader.loadFull(), loader.loadFull()]);
  assert.strictEqual(words, concurrent);
  assert.deepEqual(words, [...full].sort((a, b) => a.id - b.id));
  assert.deepEqual(loader.requests, [index.core, index.extended]);
  assert.strictEqual(await loader.loadFull(), words);
  for (const id of [1234, 4293, 3318, 7977]) assert.deepEqual(words.find(word => word.id === id), canonical.get(String(id)));
});

test('a cold all-category plan restores only the requested IDs and becomes ready without the full library', async () => {
  const loader = makeLoader();
  const ids = Object.keys(index.wordPaths).slice(0, 7);
  assert.equal(needsPlanCatalog(core, ids), true);
  const restored = await loader.loadIds([...ids, ids[0]]);
  assert.deepEqual(restored.map(word => String(word.id)).sort(), [...ids].sort());
  for (const word of restored) assert.deepEqual(word, canonical.get(String(word.id)));
  assert.equal(needsPlanCatalog([...core, ...restored], ids), false);
  assert.equal(loader.requests.includes('/data/vocabulary.json'), false);
  assert.equal(loader.requests.includes(index.extended), false);
  assert.equal(loader.requests.length, new Set(ids.map(id => index.wordPaths[id])).size);
  const bytes = (await Promise.all(loader.requests.map(path => readFile(new URL(`public${path}`, root))))).reduce((sum, buffer) => sum + buffer.length, 0);
  const sourceBytes = (await readFile(new URL('public/data/vocabulary.json', root))).length;
  assert(bytes < sourceBytes * 0.1, `Seven restored words should save at least 90 percent: ${bytes}`);
});

test('every indexed word resolves to its unchanged canonical record', async () => {
  const loader = makeLoader();
  const allShards = await Promise.all(index.paths.map(path => read(`public${path}`)));
  for (const [id, pathIndex] of Object.entries(index.wordPaths)) {
    assert.deepEqual(allShards[pathIndex].find(word => String(word.id) === id), canonical.get(id));
  }
  assert.equal(index.coreIds.length + Object.keys(index.wordPaths).length, full.length);
  assert.equal(index.counts.all, full.length);
  for (const category of ['daily', 'cet4', 'cet6', 'toefl', 'ielts']) {
    assert.equal(index.counts[category], full.filter(word => word.categories.includes(category)).length);
  }
  assert.deepEqual(await loader.loadIds([core[0].id]), [core[0]]);
});

test('a large history uses the extension when individual Lists would transfer more bytes', async () => {
  const loader = makeLoader();
  await loader.loadCore();
  const ids = Object.keys(index.wordPaths);
  const words = await loader.loadIds(ids);
  assert.deepEqual(new Set(words.map(word => String(word.id))), new Set(ids));
  assert.deepEqual(loader.requests, [index.core, index.extended]);
});

test('retired and unknown IDs remain unavailable instead of being remapped or triggering whole-library downloads', async () => {
  const loader = makeLoader();
  for (const word of RETIRED_VOCABULARY) assert.equal(loader.hasWord(word.id), false);
  assert.equal(loader.hasWord('custom-example'), false);
  assert.deepEqual(await loader.loadIds([RETIRED_VOCABULARY[0].id, 'custom-example']), []);
  assert.deepEqual(loader.requests, []);
});

test('overlapping lists are deduplicated, bounded to four downloads and filter unrelated words from results', async () => {
  let active = 0, peak = 0;
  const seen = new Set();
  const loader = createVocabularyDelivery({ index, fetchJson: async path => {
    assert.equal(seen.has(path), false); seen.add(path);
    peak = Math.max(peak, ++active);
    await new Promise(resolve => setTimeout(resolve, 1));
    const data = await read(`public${path}`);
    active--;
    return data;
  } });
  const ids = Object.keys(index.wordPaths).filter((id, i) => i % 150 === 0);
  const words = await loader.loadIds(ids);
  assert(peak <= 4 && peak > 1);
  assert.equal(seen.size, new Set(ids.map(id => index.wordPaths[id])).size);
  assert.deepEqual(new Set(words.map(word => String(word.id))), new Set(ids));
});

test('failed or incomplete incremental downloads fail visibly and release full-load retry', async () => {
  const extension = full.filter(word => !index.coreIds.includes(word.id));
  let calls = 0;
  const loader = createVocabularyDelivery({ index, fetchJson: async path => path === index.core ? core : ++calls === 1 ? [] : extension });
  await assert.rejects(loader.loadFull(), /数据不完整/);
  assert.equal((await loader.loadFull()).length, full.length);
  const broken = createVocabularyDelivery({ index, fetchJson: async () => [] });
  await assert.rejects(broken.loadIds([Object.keys(index.wordPaths)[0]]), /数据不完整/);
});

test('an existing complete full-file cache remains usable without any new requests', async () => {
  const fetchJson = () => assert.fail('The prior full cache should remain offline-ready');
  fetchJson.readCached = async path => { assert.equal(path, '/data/vocabulary.json'); return full; };
  const loader = createVocabularyDelivery({ fetchJson, index });
  assert.strictEqual(await loader.loadFull(), full);
});

test('a stale failed selection does not prevent restoring a different account’s public word IDs', async () => {
  const [first, second] = Object.keys(index.wordPaths).filter((id, i, ids) => !i || index.wordPaths[id] !== index.wordPaths[ids[0]]);
  const loader = createVocabularyDelivery({ index, fetchJson: async path => {
    if (path === index.paths[index.wordPaths[first]]) throw new Error('offline');
    return read(`public${path}`);
  } });
  await assert.rejects(loader.loadIds([first]), /offline/);
  assert.deepEqual(await loader.loadIds([second]), [canonical.get(second)]);
});

test('the incremental full download saves at least 40 percent of gzip bytes after core is loaded', async () => {
  const source = await readFile(new URL('public/data/vocabulary.json', root));
  const extended = await readFile(new URL(`public${index.extended}`, root));
  const before = gzipSync(source).length, after = gzipSync(extended).length;
  assert(after < before * 0.6, `Full ${before}, extended ${after}`);
});
