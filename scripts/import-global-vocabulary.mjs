import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parseVocabularyCsv } from '../src/utils/csvImport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const vocabularyFilePath = path.resolve(projectRoot, 'src/data/vocabulary.js');
const categoriesFilePath = path.resolve(projectRoot, 'src/data/categories.js');

const usage = `
Usage:
  npm run words:import -- <csv-file-path> [--dry-run] [--upsert]

Examples:
  npm run words:import -- ./data/new_words.csv
  npm run words:import -- ./data/new_words.csv --dry-run
  npm run words:import -- ./data/new_words.csv --upsert
`.trim();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const upsert = args.includes('--upsert');
  const csvPath = args.find((arg) => !arg.startsWith('--'));
  return { csvPath, dryRun, upsert };
};

const escapeValue = (value) => JSON.stringify(value ?? '');
const hasText = (value) => String(value ?? '').trim().length > 0;
const normalizeNumericTag = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return '';

  const match = text.match(/\d+/);
  if (!match) return '';

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed) || parsed <= 0) return '';
  return String(parsed);
};

const serializeVocabulary = (list) => {
  const lines = list.map((word) => {
    const id = Number(word.id);
    const fields = [
      `id: ${id}`,
      `word: ${escapeValue(word.word)}`,
      `phonetic: ${escapeValue(word.phonetic)}`,
      `pos: ${escapeValue(word.pos)}`,
      `meaning: ${escapeValue(word.meaning)}`,
      `example: ${escapeValue(word.example)}`,
      `exampleCn: ${escapeValue(word.exampleCn)}`,
      `category: ${escapeValue(word.category)}`,
    ];

    if (hasText(word.level)) {
      fields.push(`level: ${escapeValue(normalizeNumericTag(word.level) || String(word.level).trim())}`);
    }
    if (hasText(word.list)) {
      fields.push(`list: ${escapeValue(normalizeNumericTag(word.list) || String(word.list).trim())}`);
    }

    return `  { ${fields.join(', ')} },`;
  });

  return `export const vocabulary = [\n${lines.join('\n')}\n];\n\nexport default vocabulary;\n`;
};

const main = async () => {
  const { csvPath, dryRun, upsert } = parseArgs();
  if (!csvPath) {
    console.error(usage);
    process.exit(1);
  }

  const absoluteCsvPath = path.resolve(projectRoot, csvPath);
  const csvText = await fs.readFile(absoluteCsvPath, 'utf8');

  const vocabularyModule = await import(pathToFileURL(vocabularyFilePath).href);
  const categoriesModule = await import(pathToFileURL(categoriesFilePath).href);

  const existingVocabulary = vocabularyModule.default || vocabularyModule.vocabulary || [];
  const categoryList = categoriesModule.default || categoriesModule.categories || [];
  const categoryIds = categoryList.map((item) => item.id);

  if (upsert) {
    const { importedWords, summary } = parseVocabularyCsv({
      csvText,
      existingWords: [],
      validCategoryIds: categoryIds,
    });

    if (importedWords.length === 0) {
      console.log(
        `No rows parsed from CSV. totalRows=${summary.totalRows}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}`
      );
      return;
    }

    const merged = [...existingVocabulary];
    const byWord = new Map(
      merged.map((item, index) => [String(item.word || '').trim().toLowerCase(), index]).filter(([key]) => key)
    );

    let nextId = Math.max(0, ...merged.map((item) => Number(item.id) || 0)) + 1;
    let updated = 0;
    let inserted = 0;

    importedWords.forEach((incoming) => {
      const key = incoming.word.toLowerCase();
      if (byWord.has(key)) {
        const idx = byWord.get(key);
        const current = merged[idx];
        const mergedCategory = incoming.category || current.category || 'daily';
        const nextWord = {
          ...current,
          phonetic: incoming.phonetic || current.phonetic || '',
          pos: incoming.pos || current.pos || '',
          meaning: incoming.meaning || current.meaning || '',
          example: incoming.example || current.example || '',
          exampleCn: incoming.exampleCn || current.exampleCn || '',
          category: mergedCategory,
        };

        if (mergedCategory === 'toefl') {
          const nextLevel = normalizeNumericTag(incoming.level) || normalizeNumericTag(current.level);
          const nextList = normalizeNumericTag(incoming.list) || normalizeNumericTag(current.list);

          if (nextLevel) {
            nextWord.level = nextLevel;
          } else {
            delete nextWord.level;
          }

          if (nextList) {
            nextWord.list = nextList;
          } else {
            delete nextWord.list;
          }
        } else {
          delete nextWord.level;
          delete nextWord.list;
        }

        merged[idx] = nextWord;
        updated += 1;
      } else {
        const nextWord = {
          ...incoming,
          id: nextId,
        };

        if (nextWord.category !== 'toefl') {
          delete nextWord.level;
          delete nextWord.list;
        }

        merged.push(nextWord);
        byWord.set(key, merged.length - 1);
        nextId += 1;
        inserted += 1;
      }
    });

    merged.sort((a, b) => Number(a.id) - Number(b.id));
    const output = serializeVocabulary(merged);

    if (dryRun) {
      console.log(
        `Dry run complete (upsert): parsed=${importedWords.length}, updated=${updated}, inserted=${inserted}, skippedInvalid=${summary.skippedInvalid}, sourceRows=${summary.totalRows}, newTotal=${merged.length}`
      );
      return;
    }

    await fs.writeFile(vocabularyFilePath, output, 'utf8');
    console.log(
      `Upsert complete: updated=${updated}, inserted=${inserted}, skippedInvalid=${summary.skippedInvalid}, total=${merged.length}.`
    );
    return;
  }

  const { importedWords, summary } = parseVocabularyCsv({
    csvText,
    existingWords: existingVocabulary,
    validCategoryIds: categoryIds,
  });

  if (importedWords.length === 0) {
    console.log(
      `No new words imported. totalRows=${summary.totalRows}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}`
    );
    return;
  }

  const merged = [...existingVocabulary, ...importedWords].sort((a, b) => Number(a.id) - Number(b.id));
  const output = serializeVocabulary(merged);

  if (dryRun) {
    console.log(
      `Dry run complete: imported=${summary.importedCount}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}, newTotal=${merged.length}`
    );
    return;
  }

  await fs.writeFile(vocabularyFilePath, output, 'utf8');

  console.log(
    `Imported ${summary.importedCount} words into src/data/vocabulary.js (skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}, total=${merged.length}).`
  );
};

main().catch((error) => {
  console.error('Import failed:', error.message || error);
  process.exit(1);
});
