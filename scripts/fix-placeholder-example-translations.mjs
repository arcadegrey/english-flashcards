import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cachePath = path.resolve(projectRoot, '.tmp-example-translation-cache.json');
const execFileAsync = promisify(execFile);
const TRANSLATION_BATCH_SIZE = 8;

const jsonTargets = [
  path.resolve(projectRoot, 'public/data/vocabulary.json'),
  path.resolve(projectRoot, 'public/data/vocabulary/core.json'),
];

const PLACEHOLDER_RE = /^这个例句(?:帮助理解|展示了)“.+?”在(?:进阶|四级|日常).+?中的(?:用法|常见用法)。$/;
const FALLBACK_RE = /^参考译文：这句话中的“.+?”可理解为“.+?”。$/;

const readJson = async (filePath, fallback) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const primaryMeaning = (word) => {
  const text = String(word?.meaning || '')
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\s*(?:n|v|vt|vi|adj|adv|prep|conj|pron|num|interj|a)\.\s*/i, '').trim())
    .map((line) => line.replace(/^\[[^\]]+\]\s*/, '').trim())
    .find(Boolean) || String(word?.word || '').trim();

  return text
    .split(/[;,，；、]/)
    .map((part) => part.trim())
    .find(Boolean) || text.trim();
};

const localTranslation = (word) => {
  const headword = String(word?.word || '').trim();
  const example = String(word?.example || '').trim();
  const meaning = primaryMeaning(word);

  if (!example) return '';

  if (example === `Students often meet the word "${headword}" in reading and daily communication.`) {
    return `学生在阅读和日常交流中经常会遇到“${headword}”这个词。`;
  }

  if (example === 'We often dine with friends in this restaurant.') {
    return '我们经常和朋友在这家餐厅用餐。';
  }

  return `参考译文：这句话中的“${headword}”可理解为“${meaning}”。`;
};

const translateWithMyMemory = async (text) => {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', 'en|zh-CN');

  const { stdout } = await execFileAsync('curl', ['-sS', '--max-time', '12', String(url)], {
    maxBuffer: 1024 * 1024,
  });
  const payload = JSON.parse(stdout);
  if (payload?.quotaFinished) {
    throw new Error('translation quota finished');
  }

  const translated = String(payload?.responseData?.translatedText || '').trim();
  if (!translated || /MYMEMORY WARNING/i.test(translated) || /^[\x00-\x7F\s.,!?;:'"()/-]+$/.test(translated)) {
    throw new Error('translation response unusable');
  }

  return translated;
};

const translateEntry = async (entry, cache, { preferRemote = false } = {}) => {
  const example = String(entry.example || '').trim();
  if (!example) return '';

  const local = localTranslation(entry);
  if (!preferRemote && example.startsWith('Students often meet the word "')) {
    return local;
  }

  if (cache[example]) {
    return cache[example];
  }

  try {
    const translated = await translateWithMyMemory(example);
    cache[example] = translated;
    return translated;
  } catch {
    return local;
  }
};

const updateVocabularyFile = async (filePath, translationsByExample) => {
  const vocabulary = await readJson(filePath, []);
  let updated = 0;

  for (const word of vocabulary) {
    const exampleCn = String(word.exampleCn || '');
    if (!PLACEHOLDER_RE.test(exampleCn) && !FALLBACK_RE.test(exampleCn)) continue;

    const translated = translationsByExample.get(String(word.example || '').trim());
    if (!translated) continue;

    word.exampleCn = translated;
    updated += 1;
  }

  await writeJson(filePath, vocabulary);
  return updated;
};

const main = async () => {
  const coreVocabulary = await readJson(path.resolve(projectRoot, 'public/data/vocabulary/core.json'), []);
  const affected = coreVocabulary.filter((word) => {
    const exampleCn = String(word.exampleCn || '');
    return PLACEHOLDER_RE.test(exampleCn) || FALLBACK_RE.test(exampleCn);
  });
  const cache = await readJson(cachePath, {});
  const translationsByExample = new Map();
  const uniqueAffected = [];

  for (let index = 0; index < affected.length; index += 1) {
    const word = affected[index];
    const example = String(word.example || '').trim();
    if (!example || translationsByExample.has(example)) continue;
    translationsByExample.set(example, '');
    uniqueAffected.push(word);
  }

  translationsByExample.clear();

  for (let index = 0; index < uniqueAffected.length; index += TRANSLATION_BATCH_SIZE) {
    const batch = uniqueAffected.slice(index, index + TRANSLATION_BATCH_SIZE);
    const translatedBatch = await Promise.all(
      batch.map(async (word) => {
        const example = String(word.example || '').trim();
        const translated = await translateEntry(word, cache, {
          preferRemote: FALLBACK_RE.test(String(word.exampleCn || '')),
        });
        return [example, translated];
      })
    );

    translatedBatch.forEach(([example, translated]) => {
      translationsByExample.set(example, translated);
    });

    await writeJson(cachePath, cache);

    if ((translationsByExample.size % 50) === 0) {
      console.log(`translated ${translationsByExample.size} unique examples...`);
    }
  }

  const results = {};
  for (const filePath of jsonTargets) {
    results[path.relative(projectRoot, filePath)] = await updateVocabularyFile(filePath, translationsByExample);
  }

  console.log(JSON.stringify({
    affected: affected.length,
    uniqueExamples: translationsByExample.size,
    updated: results,
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
