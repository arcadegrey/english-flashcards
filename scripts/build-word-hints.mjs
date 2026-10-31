import { readFile, mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getWordHints, getHintExampleParts } from '../src/utils/wordHints.js';
import { RETIRED_VOCABULARY } from '../shared/retiredVocabulary.js';

const root = new URL('../', import.meta.url);
const vocabulary = JSON.parse(await readFile(new URL('public/data/vocabulary.json', root), 'utf8'));
const batches = new Map();
for (const word of [...vocabulary, ...RETIRED_VOCABULARY].sort((a, b) => a.id - b.id)) {
  const key = String(Math.floor(Number(word.id) / 200));
  const batch = batches.get(key) || { entries: {}, sources: {} };
  const hints = getWordHints(word).map(hint => {
    const { sources, examples, ...rest } = hint;
    for (const source of sources || []) batch.sources[source.id] = source;
    return { ...rest,
      ...(sources ? { sourceIds: sources.map(source => source.id) } : {}),
      ...(examples ? { examples: examples.map(example => ({ en: example.en, zh: example.zh,
        parts: getHintExampleParts(example, hint.exampleWords) })) } : {}),
    };
  });
  batch.entries[word.id] = { word: word.word, hints,
    ...(word.examples ? { guards: Object.fromEntries(['pos', 'meaning', 'phonetic', 'example', 'exampleCn'].map(key => [key, word[key]])) } : {}) };
  batches.set(key, batch);
}
const directory = new URL('public/data/word-hints/', root);
await mkdir(directory, { recursive: true });
const manifest = { batchSize: 200, count: vocabulary.length + RETIRED_VOCABULARY.length, batches: {} };
const files = new Set();
for (const [key, batch] of batches) {
  const json = JSON.stringify(batch);
  const hash = createHash('sha256').update(json).digest('hex').slice(0, 16);
  const name = `${key}-${hash}.json`;
  files.add(name);
  await writeFile(new URL(name, directory), json);
  manifest.batches[key] = `/data/word-hints/${name}`;
}
for (const name of await readdir(directory)) if (/^\d+-[a-f0-9]+\.json$/.test(name) && !files.has(name)) await unlink(new URL(name, directory));
await writeFile(new URL('src/data/wordHintsManifest.json', root), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Word hints: ${manifest.count} records in ${files.size} on-demand batches.`);
