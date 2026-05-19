import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parseVocabularyCsv } from '../src/utils/csvImport.js';
import {
  getWordCategories,
  mergeCategoryLists,
  wordHasExternalExamCategory,
  wordHasIeltsCategory,
  wordHasToeflCategory,
} from '../src/utils/wordCategories.js';
import { splitVocabulary } from './split-vocabulary.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const vocabularyFilePath = path.resolve(projectRoot, 'public/data/vocabulary.json');
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

const normalizeNumericTag = (value) => {
  const text = String(value ?? '').trim();
  if (!text) return '';

  const match = text.match(/\d+/);
  if (!match) return '';

  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed) || parsed <= 0) return '';
  return String(parsed);
};

export const mergeVocabularyUpsertWord = (current, incoming) => {
  const categories = mergeCategoryLists(
    current.categories,
    current.category,
    incoming.categories,
    incoming.category
  );
  const mergedCategory = current.category || incoming.category || categories[0] || 'daily';
  const nextWord = {
    ...current,
    category: mergedCategory,
    categories: categories.length > 0 ? categories : [mergedCategory],
  };

  if (wordHasExternalExamCategory(nextWord)) {
    const nextLevel = normalizeNumericTag(current.level) || normalizeNumericTag(incoming.level);
    const nextList = normalizeNumericTag(current.list) || normalizeNumericTag(incoming.list);
    const nextIeltsList =
      normalizeNumericTag(incoming.ieltsList) ||
      (wordHasIeltsCategory(incoming) ? normalizeNumericTag(incoming.list) : '') ||
      normalizeNumericTag(current.ieltsList);

    if (wordHasToeflCategory(nextWord) && nextLevel) {
      nextWord.level = nextLevel;
    } else {
      delete nextWord.level;
    }

    if (wordHasToeflCategory(nextWord) && nextList) {
      nextWord.list = nextList;
    } else {
      delete nextWord.list;
    }

    if (wordHasIeltsCategory(nextWord) && nextIeltsList) {
      nextWord.ieltsList = nextIeltsList;
    } else {
      delete nextWord.ieltsList;
    }
  } else {
    delete nextWord.level;
    delete nextWord.list;
    delete nextWord.ieltsList;
  }

  return nextWord;
};

const loadExistingVocabulary = async () => {
  const text = await fs.readFile(vocabularyFilePath, 'utf8');
  const vocabulary = JSON.parse(text);
  return Array.isArray(vocabulary) ? vocabulary : [];
};

const serializeVocabulary = (list) => `${JSON.stringify(list, null, 2)}\n`;

const main = async () => {
  const { csvPath, dryRun, upsert } = parseArgs();
  if (!csvPath) {
    console.error(usage);
    process.exit(1);
  }

  const absoluteCsvPath = path.resolve(projectRoot, csvPath);
  const csvText = await fs.readFile(absoluteCsvPath, 'utf8');

  const categoriesModule = await import(pathToFileURL(categoriesFilePath).href);

  const existingVocabulary = await loadExistingVocabulary();
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
        merged[idx] = mergeVocabularyUpsertWord(current, incoming);
        updated += 1;
      } else {
        const nextWord = {
          ...incoming,
          id: nextId,
        };

        if (!wordHasExternalExamCategory(nextWord)) {
          delete nextWord.level;
          delete nextWord.list;
          delete nextWord.ieltsList;
        } else if (!wordHasToeflCategory(nextWord)) {
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
    await splitVocabulary(merged);
    console.log(
      `Upsert complete: updated=${updated}, inserted=${inserted}, skippedInvalid=${summary.skippedInvalid}, total=${merged.length}. Split files refreshed.`
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
  await splitVocabulary(merged);

  console.log(
    `Imported ${summary.importedCount} words into public/data/vocabulary.json (skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}, total=${merged.length}). Split files refreshed.`
  );
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('Import failed:', error.message || error);
    process.exit(1);
  });
}
