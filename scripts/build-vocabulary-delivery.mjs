import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import { getWordCategories } from '../src/utils/wordCategories.js';
import { summarizeVocabularyWord } from '../src/data/vocabularySummary.js';
import { PLAN_CATEGORY_IDS } from '../shared/planPreferences.js';

const toIdRanges = words => {
  const ranges = [];
  for (const id of words.map(word => word.id).sort((a, b) => a - b)) {
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error(`Invalid canonical vocabulary ID: ${id}`);
    const previous = ranges.at(-1);
    if (previous && id <= previous[1]) throw new Error(`Duplicate canonical vocabulary ID: ${id}`);
    if (previous && id === previous[1] + 1) previous[1] = id;
    else ranges.push([id, id]);
  }
  return ranges;
};

const root = new URL('../', import.meta.url);
const readJson = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const writeIfChanged = async (path, data) => {
  const url = new URL(path, root), text = JSON.stringify(data);
  if (await readFile(url, 'utf8').catch(() => '') !== text) await writeFile(url, text);
};

export async function buildVocabularyDelivery() {
  const vocabulary = await readJson('public/data/vocabulary.json');
  const core = await readJson('public/data/vocabulary/core.json');
  const canonical = new Map(vocabulary.map(word => [String(word.id), word]));
  const coreIds = new Set(core.map(word => String(word.id)));
  for (const word of core) {
    if (!isDeepStrictEqual(word, canonical.get(String(word.id)))) throw new Error(`Core vocabulary is stale: ${word.id}`);
  }
  const [toefl, ielts] = await Promise.all([
    readJson('public/data/vocabulary/toefl/manifest.json'),
    readJson('public/data/vocabulary/ielts/manifest.json'),
  ]);
  const paths = [...new Set([
    ...toefl.toefl.levels.flatMap(level => level.lists.map(list => list.path)),
    ...ielts.ielts.lists.map(list => list.path),
  ])];
  const shards = await Promise.all(paths.map(async path => {
    const text = await readFile(new URL(`public${path}`, root), 'utf8');
    return { path, size: Buffer.byteLength(text), words: JSON.parse(text) };
  }));
  // For overlapping TOEFL/IELTS words, request the smaller existing List.
  shards.sort((a, b) => a.size - b.size || a.path.localeCompare(b.path));
  const wordPaths = {};
  const selectedPaths = [];
  for (const shard of shards) {
    for (const word of shard.words) {
      const id = String(word.id);
      if (!isDeepStrictEqual(word, canonical.get(id))) throw new Error(`Vocabulary shard is stale: ${id} in ${shard.path}`);
      if (coreIds.has(id) || Object.hasOwn(wordPaths, id)) continue;
      let index = selectedPaths.indexOf(shard.path);
      if (index === -1) { index = selectedPaths.length; selectedPaths.push(shard.path); }
      wordPaths[id] = index;
    }
  }
  const extended = vocabulary.filter(word => !coreIds.has(String(word.id)));
  if (extended.some(word => !Object.hasOwn(wordPaths, String(word.id)))) throw new Error('Vocabulary index is incomplete');
  const counts = { all: vocabulary.length };
  for (const word of vocabulary) for (const category of getWordCategories(word)) counts[category] = (counts[category] || 0) + 1;
  const generated = { catalog: new Set(), details: new Set() };
  for (const directory of Object.keys(generated)) await mkdir(new URL(`public/data/vocabulary/${directory}/`, root), { recursive: true });
  const writeHashed = async (directory, name, data) => {
    const json = JSON.stringify(data), hash = createHash('sha256').update(json).digest('hex').slice(0, 16);
    const file = `${name}-${hash}.json`;
    generated[directory].add(file);
    await writeIfChanged(`public/data/vocabulary/${directory}/${file}`, data);
    return { path: `/data/vocabulary/${directory}/${file}`, size: Buffer.byteLength(json), count: data.length };
  };
  const catalog = {
    core: await writeHashed('catalog', 'core', core.map(summarizeVocabularyWord)),
    extended: await writeHashed('catalog', 'extended', extended.map(summarizeVocabularyWord)),
    lists: {},
  };
  // On-demand code fallback for a failed/stalled public core JSON request.
  // Same summaries, never examples/full vocabulary in the eager startup graph.
  await writeIfChanged('src/data/coreVocabularyCatalog.json', core.map(summarizeVocabularyWord));
  for (const shard of shards) {
    catalog.lists[shard.path] = await writeHashed('catalog', shard.path.replace('/data/vocabulary/', '').replace(/\.json$/, '').replaceAll('/', '-'), shard.words.map(summarizeVocabularyWord));
  }
  // Category plans fill only the canonical IDs absent from the validated core.
  // Keep exact membership in a lazy index, outside the startup/all-study path.
  const categories = {};
  for (const category of PLAN_CATEGORY_IDS.filter(id => id !== 'all')) {
    const words = vocabulary.filter(word => getWordCategories(word).includes(category));
    const missing = words.filter(word => !coreIds.has(String(word.id)));
    categories[category] = { count: words.length, idRanges: toIdRanges(words),
      missing: { ...await writeHashed('catalog', `category-${category}`, missing.map(summarizeVocabularyWord)),
        idRanges: toIdRanges(missing) } };
  }
  await writeIfChanged('src/data/vocabularyCategoryIndex.json', categories);
  const details = { batchSize: 50, batches: {} }, batches = new Map();
  for (const { id, word, example, exampleCn } of vocabulary) {
    const key = Math.floor(Number(id) / details.batchSize);
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push({ id, word, example, exampleCn });
  }
  for (const [key, entries] of batches) details.batches[key] = (await writeHashed('details', String(key), entries)).path;
  const index = { total: vocabulary.length, counts, core: '/data/vocabulary/core.json', extended: '/data/vocabulary/extended.json',
    extendedBytes: Buffer.byteLength(JSON.stringify(extended)), coreIds: core.map(word => word.id),
    paths: selectedPaths, sizes: selectedPaths.map(path => shards.find(shard => shard.path === path).size), wordPaths, catalog, details };
  await writeIfChanged('public/data/vocabulary/extended.json', extended);
  await writeIfChanged('src/data/vocabularyIndex.json', index);
  await writeIfChanged('src/data/vocabularyDetailsIndex.json', details);
  const idRanges = toIdRanges(vocabulary);
  await writeIfChanged('src/data/vocabularyStartup.json', {
    total: index.total, counts, core: index.core, coreCatalog: catalog.core, coreIdRanges: toIdRanges(core),
    extended: index.extended, catalog: { extended: catalog.extended }, idRanges,
  });
  for (const [directory, files] of Object.entries(generated)) {
    const base = new URL(`public/data/vocabulary/${directory}/`, root);
    for (const file of await readdir(base)) if (file.endsWith('.json') && !files.has(file)) await unlink(new URL(file, base));
  }
  console.log(`Vocabulary delivery: ${core.length} core + ${extended.length} extended; ${selectedPaths.length} reusable Lists`);
  return index;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildVocabularyDelivery();
