import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import { getWordCategories } from '../src/utils/wordCategories.js';

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
  const index = { total: vocabulary.length, counts, core: '/data/vocabulary/core.json', extended: '/data/vocabulary/extended.json',
    extendedBytes: Buffer.byteLength(JSON.stringify(extended)), coreIds: core.map(word => word.id),
    paths: selectedPaths, sizes: selectedPaths.map(path => shards.find(shard => shard.path === path).size), wordPaths };
  await writeIfChanged('public/data/vocabulary/extended.json', extended);
  await writeIfChanged('src/data/vocabularyIndex.json', index);
  console.log(`Vocabulary delivery: ${core.length} core + ${extended.length} extended; ${selectedPaths.length} reusable Lists`);
  return index;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildVocabularyDelivery();
