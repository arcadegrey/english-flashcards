import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import readings from '../src/data/readings.js';
import { prepareReadingContent } from '../src/utils/readingLibrary.js';
import { deriveReadingVariants } from '../src/utils/readingText.js';
import { normalizeVocabularyHeadword } from '../shared/vocabularyAliases.js';
import { summarizeVocabularyWord } from '../src/data/vocabularySummary.js';

const root = new URL('../', import.meta.url);
const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 16);
const writeIfChanged = async (path, data) => {
  const target = new URL(path, root), text = JSON.stringify(data);
  if (await readFile(target, 'utf8').catch(() => '') !== text) await writeFile(target, text);
};

export async function buildReadingDelivery() {
  const prepared = prepareReadingContent(readings);
  const vocabulary = JSON.parse(await readFile(new URL('public/data/vocabulary.json', root), 'utf8'));
  // Include every possible lexical candidate, not only today's winning match:
  // custom exact forms can take precedence over a canonical derived form.
  const candidates = new Set(prepared.flatMap(entry => entry.tokens)
    .flatMap(deriveReadingVariants).map(normalizeVocabularyHeadword));
  const readingWords = vocabulary.filter(word => candidates.has(normalizeVocabularyHeadword(word.word)))
    .sort((a, b) => Number(a.id) - Number(b.id));
  const summaries = readingWords.map(summarizeVocabularyWord);
  await writeIfChanged('src/data/readingVocabulary.json', summaries);
  const vocabularyVersion = hash(JSON.stringify(summaries));
  const vocabularyFile = `${vocabularyVersion}.json`;
  const vocabularyDirectory = new URL('public/data/reading-vocabulary/', root);
  await mkdir(vocabularyDirectory, { recursive: true });
  await writeIfChanged(`public/data/reading-vocabulary/${vocabularyFile}`, summaries);
  for (const file of await readdir(vocabularyDirectory)) {
    if (file.endsWith('.json') && file !== vocabularyFile) await unlink(new URL(file, vocabularyDirectory));
  }
  const directory = new URL('public/data/readings/', root);
  await mkdir(directory, { recursive: true });
  const files = new Set(), ids = new Set(), entries = [];
  for (const { article, tokens, estimatedMinutes } of prepared) {
    const id = String(article.id);
    if (!id || !/^[\w-]+$/.test(id) || ids.has(id) || typeof article.title !== 'string'
      || typeof article.content !== 'string' || !article.content.trim()) throw new Error(`Invalid reading article: ${id}`);
    ids.add(id);
    const revision = hash(JSON.stringify(article));
    const file = `${id}-${revision}.json`;
    files.add(file);
    await writeIfChanged(`public/data/readings/${file}`, { revision, article });
    const metadata = { ...article };
    delete metadata.content;
    delete metadata.translation;
    delete metadata.questions;
    entries.push({ article: { ...metadata, estimatedMinutes, questionCount: article.questions?.length || 0,
      contentDeferred: true, contentPath: `/data/readings/${file}`, contentRevision: revision },
      tokens: [...new Set(tokens.map(token => token.toLowerCase()))], estimatedMinutes });
  }
  const config = { version: hash(JSON.stringify(readings)), entries,
    vocabulary: readingWords.map(({ id, word }) => ({ id, word })),
    vocabularyCatalog: { version: vocabularyVersion, path: `/data/reading-vocabulary/${vocabularyFile}` } };
  await writeIfChanged('src/data/readingCatalog.json', config);
  for (const file of await readdir(directory)) if (file.endsWith('.json') && !files.has(file)) await unlink(new URL(file, directory));
  console.log(`Reading delivery: ${entries.length} articles, ${readingWords.length} independent word summaries`);
  return config;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildReadingDelivery();
