import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import readings from '../src/data/readings.js';
import { prepareReadingContent } from '../src/utils/readingLibrary.js';

const root = new URL('../', import.meta.url);
const hash = text => createHash('sha256').update(text).digest('hex').slice(0, 16);
const writeIfChanged = async (path, data) => {
  const target = new URL(path, root), text = JSON.stringify(data);
  if (await readFile(target, 'utf8').catch(() => '') !== text) await writeFile(target, text);
};

export async function buildReadingDelivery() {
  const directory = new URL('public/data/readings/', root);
  await mkdir(directory, { recursive: true });
  const files = new Set(), ids = new Set(), entries = [];
  for (const { article, tokens, estimatedMinutes } of prepareReadingContent(readings)) {
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
  const config = { version: hash(JSON.stringify(readings)), entries };
  await writeIfChanged('src/data/readingCatalog.json', config);
  for (const file of await readdir(directory)) if (file.endsWith('.json') && !files.has(file)) await unlink(new URL(file, directory));
  console.log(`Reading delivery: ${entries.length} metadata entries and article files`);
  return config;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await buildReadingDelivery();
