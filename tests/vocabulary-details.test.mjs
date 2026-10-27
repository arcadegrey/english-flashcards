import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createVocabularyLoader } from '../src/data/vocabularyCache.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { summarizeVocabularyWord, applyWordDetails, needsWordDetails } from '../src/data/vocabularySummary.js';
import { buildHiddenSentence, createFillBlankRound } from '../src/utils/assessmentRounds.js';
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
  return { ...createVocabularyDelivery({ fetchJson, index }), requests, fetchJson };
};

test('all 8699 summaries plus detail batches reconstruct unchanged complete canonical records', async () => {
  const loader = makeLoader();
  const summaries = await loader.loadFullCatalog();
  const details = new Map((await Promise.all(Object.values(index.details.batches).map(path => read(`public${path}`))))
    .flat().map(word => [String(word.id), word]));
  assert.equal(summaries.length, full.length);
  assert.equal(details.size, full.length);
  for (const word of summaries) {
    assert.equal(Object.hasOwn(word, 'example'), false);
    assert.equal(Object.hasOwn(word, 'exampleCn'), false);
    assert.deepEqual(applyWordDetails(word, details.get(String(word.id))), canonical.get(String(word.id)));
    assert.equal(word.fillBlankAvailable !== false, Boolean(buildHiddenSentence(canonical.get(String(word.id)).example, word.word)));
  }
  assert.deepEqual(loader.requests, [index.catalog.core.path, index.catalog.extended.path]);
});

test('core and full summary requests are shared without eagerly downloading any examples', async () => {
  const loader = makeLoader();
  await loader.loadCoreCatalog();
  const [first, second] = await Promise.all([loader.loadFullCatalog(), loader.loadFullCatalog()]);
  assert.strictEqual(first, second);
  assert.strictEqual(await loader.loadFullCatalog(), first);
  assert.deepEqual(loader.requests, [index.catalog.core.path, index.catalog.extended.path]);
  assert(first.every(word => word.exampleDeferred));
});

test('ID restoration and selected exam Lists return complete metadata without detail downloads', async () => {
  const loader = makeLoader(), ids = ['1', '3', '4', '5', '6', '7', '8'];
  const words = await loader.loadCatalogIds([...ids, '1']);
  assert.deepEqual(new Set(words.map(word => String(word.id))), new Set(ids));
  for (const word of words) assert.deepEqual(word, summarizeVocabularyWord(canonical.get(String(word.id))));
  assert(loader.requests.every(path => path.startsWith('/data/vocabulary/catalog/')));
  const path = index.paths[index.wordPaths['1']];
  const list = await loader.loadListCatalog(path);
  for (const word of list) assert.deepEqual(word, summarizeVocabularyWord(canonical.get(String(word.id))));
});

test('large histories use summary extension instead of flooding the network with Lists', async () => {
  const loader = makeLoader();
  const ids = Object.keys(index.wordPaths);
  const words = await loader.loadCatalogIds(ids);
  assert.deepEqual(new Set(words.map(word => String(word.id))), new Set(ids));
  assert.deepEqual(loader.requests, [index.catalog.core.path, index.catalog.extended.path]);
});

test('two words in the same detail batch share one request, with a synchronous cache for revisits', async () => {
  const loader = makeLoader();
  const group = await read(`public${Object.values(index.details.batches)[0]}`);
  const [first, second] = group.slice(0, 2).map(word => summarizeVocabularyWord(canonical.get(String(word.id))));
  const [a, b] = await Promise.all([loader.loadDetails(first), loader.loadDetails(second)]);
  assert.equal(loader.requests.length, 1);
  assert.strictEqual(loader.peekDetails(first), a);
  assert.strictEqual(await loader.loadDetails(second), b);
  assert.deepEqual(applyWordDetails(first, a), canonical.get(String(first.id)));
  assert.deepEqual(applyWordDetails(second, b), canonical.get(String(second.id)));
});

test('same-headword records keep independent IDs and bilingual examples', async () => {
  const loader = makeLoader();
  for (const id of [1234, 4293, 3318, 7977]) {
    const summary = summarizeVocabularyWord(canonical.get(String(id)));
    assert.deepEqual(applyWordDetails(summary, await loader.loadDetails(summary)), canonical.get(String(id)));
  }
  const a = canonical.get('1234'), b = canonical.get('4293');
  assert.throws(() => applyWordDetails(summarizeVocabularyWord(a), b), /不匹配/);
  assert.throws(() => applyWordDetails(summarizeVocabularyWord(a), { ...a, word: 'another word' }), /不匹配/);
});

test('custom and retired inline examples never fetch or borrow public canonical content', async () => {
  const loader = makeLoader();
  const custom = { ...full[0], example: 'My private custom sentence.', exampleCn: '自己的例句。' };
  assert.equal(needsWordDetails({ ...custom, exampleDeferred: true }), false);
  assert.equal(needsWordDetails(summarizeVocabularyWord(full[0])), true);
  assert.strictEqual(await loader.loadDetails(custom), custom);
  assert.strictEqual(await loader.loadDetails(RETIRED_VOCABULARY[0]), RETIRED_VOCABULARY[0]);
  assert.equal(await loader.loadDetails({ id: 'custom-1', word: 'custom' }), null);
  assert.deepEqual(await loader.loadCatalogIds([RETIRED_VOCABULARY[0].id, 'custom-1']), []);
  assert.deepEqual(loader.requests, []);
});

test('old complete caches retain offline core and full-library availability', async () => {
  const fetchJson = () => assert.fail('must use existing offline vocabulary');
  fetchJson.readCached = async path => path === index.core ? core : path === '/data/vocabulary.json' ? full : null;
  const loader = createVocabularyDelivery({ index, fetchJson });
  assert.strictEqual(await loader.loadCoreCatalog(), core);
  assert.strictEqual(await loader.loadFullCatalog(), full);
  assert.strictEqual(await loader.loadFull(), full);
});

test('a later offline bookmark can reuse cached full-study summaries without its List being downloaded', async () => {
  const summaryExtension = await read(`public${index.catalog.extended.path}`);
  const fetchJson = () => assert.fail('must reuse already cached full-study metadata');
  fetchJson.readCached = async path => path === index.catalog.extended.path ? summaryExtension : null;
  const loader = createVocabularyDelivery({ index, fetchJson });
  assert.deepEqual(await loader.loadCatalogIds(['1', '3']), ['1', '3'].map(id => summarizeVocabularyWord(canonical.get(id))));
});

test('incomplete summary files do not become permanent cache hits and a retry succeeds', async () => {
  let calls = 0;
  const data = await read(`public${index.catalog.core.path}`);
  const fetchJson = createVocabularyLoader({ version: 'incomplete', cacheStorage: undefined, fetchImpl: async () => Response.json(++calls === 1 ? data.slice(1) : data) });
  const loader = createVocabularyDelivery({ index, fetchJson });
  await assert.rejects(loader.loadCoreCatalog(), /格式无效/);
  assert.deepEqual(await loader.loadCoreCatalog(), data);
  assert.equal(calls, 2);
});

test('a detail download failure can recover from old complete cache without fetching a whole library', async () => {
  const calls = [], word = summarizeVocabularyWord(full[0]);
  const fetchJson = async path => { calls.push(path); throw new Error('offline'); };
  fetchJson.readCached = async path => path === '/data/vocabulary.json' ? full : null;
  const loader = createVocabularyDelivery({ index, fetchJson });
  assert.deepEqual(applyWordDetails(word, await loader.loadDetails(word)), full[0]);
  assert.equal(calls.length, 1);
  assert(calls[0].includes('/details/'));
});

test('failed details release retry, and a mismatched target never populates the synchronous cache', async () => {
  let calls = 0;
  const word = summarizeVocabularyWord(full[0]);
  const batch = await read(`public${index.details.batches[Math.floor(Number(word.id) / index.details.batchSize)]}`);
  const fetchJson = createVocabularyLoader({ version: 'retry', cacheStorage: undefined, fetchImpl: async () => {
    calls++;
    return Response.json(calls === 1 ? [{ id: word.id, word: 'incorrect', example: 'Wrong.', exampleCn: '错误。' }] : batch);
  } });
  const loader = createVocabularyDelivery({ index, fetchJson });
  await assert.rejects(loader.loadDetails(word), /格式无效/);
  assert.equal(loader.peekDetails(word), null);
  assert.deepEqual(applyWordDetails(word, await loader.loadDetails(word)), full[0]);
  assert.equal(calls, 2);
});

test('a stricter target check revalidates earlier memory data instead of permanently poisoning retries', async () => {
  const word = summarizeVocabularyWord(full[0]);
  const path = index.details.batches[Math.floor(Number(word.id) / index.details.batchSize)];
  const batch = await read(`public${path}`);
  let calls = 0;
  const fetchJson = createVocabularyLoader({ version: 'strict', cacheStorage: undefined, fetchImpl: async () => Response.json(++calls === 1 ? [] : batch) });
  await fetchJson(path, 'weak check');
  assert.equal(await fetchJson.readCached(path, data => data.length === batch.length), null);
  const loader = createVocabularyDelivery({ index, fetchJson });
  assert.deepEqual(applyWordDetails(word, await loader.loadDetails(word)), full[0]);
  assert.equal(calls, 2);
});

test('saved detail batches survive a new app instance and load while offline', async () => {
  const entries = new Map();
  const cache = { match: async key => entries.get(key)?.clone(), put: async (key, response) => { entries.set(key, response.clone()); }, delete: async key => entries.delete(key) };
  const cacheStorage = { open: async () => cache, keys: async () => [], delete: async () => {} };
  const word = summarizeVocabularyWord(full[0]);
  const online = createVocabularyDelivery({ index, fetchJson: createVocabularyLoader({ version: 'offline', cacheStorage,
    fetchImpl: async path => Response.json(await read(`public${path.split('?')[0]}`)),
  }) });
  await online.loadDetails(word);
  await new Promise(resolve => setTimeout(resolve, 0));
  const offline = createVocabularyDelivery({ index, fetchJson: createVocabularyLoader({ version: 'offline', cacheStorage, fetchImpl: () => assert.fail('must use cached details') }) });
  assert.deepEqual(applyWordDetails(word, await offline.loadDetails(word)), full[0]);
});

test('fill-blank summaries preserve eligibility, scope, distractors and the exact hidden sentence', async () => {
  const loader = makeLoader();
  const eligible = full.find(word => buildHiddenSentence(word.example, word.word));
  const unusable = { id: 'custom-unhideable', word: 'plan', meaning: '计划', example: 'Another sentence.', exampleCn: '另一个句子。' };
  const other = { id: 'custom-blank', word: 'blank', meaning: '空白', example: '', exampleCn: '' };
  const vocabulary = [eligible, unusable, other].map(summarizeVocabularyWord);
  const before = structuredClone(vocabulary);
  const round = createFillBlankRound(vocabulary);
  assert.equal(round.error, '');
  assert.equal(round.question.id, eligible.id);
  assert.equal(round.sentence, '');
  assert.equal(round.options.filter(word => word.id === eligible.id).length, 1);
  const question = applyWordDetails(round.question, await loader.loadDetails(round.question));
  assert.equal(buildHiddenSentence(question.example, question.word), buildHiddenSentence(eligible.example, eligible.word));
  assert.deepEqual(vocabulary, before);
  assert(createFillBlankRound(vocabulary.slice(1)).error);
});

test('basic download bytes shrink by more than half and detail groups contain at most fifty active words', async () => {
  for (const [original, summary] of [[index.core, index.catalog.core.path], [index.extended, index.catalog.extended.path]]) {
    const [a, b] = await Promise.all([readFile(new URL(`public${original}`, root)), readFile(new URL(`public${summary}`, root))]);
    assert(gzipSync(b).length < gzipSync(a).length * 0.5);
  }
  for (const [key, path] of Object.entries(index.details.batches)) {
    const words = await read(`public${path}`);
    assert(words.length <= 50 && words.length > 0);
    for (const word of words) assert.equal(String(Math.floor(word.id / 50)), key);
  }
});
