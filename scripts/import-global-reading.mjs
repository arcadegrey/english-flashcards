import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parseReadingCsv } from '../src/utils/csvImport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const readingsFilePath = path.resolve(projectRoot, 'src/data/readings.js');

const usage = `
Usage:
  npm run readings:import -- <csv-file-path> [--dry-run] [--upsert]

Examples:
  npm run readings:import -- ./data/new_readings.csv
  npm run readings:import -- ./data/new_readings.csv --dry-run
  npm run readings:import -- ./data/new_readings.csv --upsert
`.trim();

const parseArgs = () => {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const upsert = args.includes('--upsert');
  const csvPath = args.find((arg) => !arg.startsWith('--'));
  return { csvPath, dryRun, upsert };
};

const hasText = (value) => String(value ?? '').trim().length > 0;
const escapeValue = (value) => JSON.stringify(value ?? '');
const normalizeTagList = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list.map((item) => String(item || '').trim()).filter(Boolean);
};
const normalizeQuestionList = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item, index) => {
      const options = Array.isArray(item?.options)
        ? item.options
            .map((option, optionIndex) => {
              if (typeof option === 'string') {
                return {
                  id: String.fromCharCode(65 + optionIndex),
                  label: option.trim(),
                };
              }

              return {
                id: String(option?.id || option?.key || option?.value || String.fromCharCode(65 + optionIndex)).trim(),
                label: String(option?.label || option?.text || option?.value || '').trim(),
              };
            })
            .filter((option) => option.id && option.label)
        : [];

      return {
        id: String(item?.id || `q-${index + 1}`).trim(),
        prompt: String(item?.prompt || item?.question || '').trim(),
        options,
        answer: String(item?.answer || item?.correctAnswer || '').trim(),
        explanation: String(item?.explanation || '').trim(),
      };
    })
    .filter((item) => item.prompt && item.options.length > 0);
};
const buildReadingKey = (item = {}) =>
  `${String(item.title || '').trim().toLowerCase()}::${String(item.level || '').trim().toLowerCase()}`;

const serializeReadings = (list) => {
  const lines = list.map((item) => {
    const fields = [
      `id: ${Number(item.id)}`,
      `title: ${escapeValue(item.title)}`,
      `level: ${escapeValue(item.level || '')}`,
      `category: ${escapeValue(item.category || '')}`,
      `content: ${escapeValue(item.content || '')}`,
      `translation: ${escapeValue(item.translation || '')}`,
      `source: ${escapeValue(item.source || '')}`,
      `tags: ${JSON.stringify(normalizeTagList(item.tags))}`,
      `examType: ${escapeValue(item.examType || '')}`,
      `questions: ${JSON.stringify(normalizeQuestionList(item.questions))}`,
    ];
    return `  { ${fields.join(', ')} },`;
  });

  return `export const readings = [\n${lines.join('\n')}\n];\n\nexport default readings;\n`;
};

const mergeTagList = (baseTags, incomingTags) => {
  const merged = new Set([...normalizeTagList(baseTags), ...normalizeTagList(incomingTags)]);
  return Array.from(merged);
};

const main = async () => {
  const { csvPath, dryRun, upsert } = parseArgs();
  if (!csvPath) {
    console.error(usage);
    process.exit(1);
  }

  const absoluteCsvPath = path.resolve(projectRoot, csvPath);
  const csvText = await fs.readFile(absoluteCsvPath, 'utf8');
  const readingsModule = await import(pathToFileURL(readingsFilePath).href);
  const existingReadings = readingsModule.default || readingsModule.readings || [];

  if (upsert) {
    const { importedReadings, summary } = parseReadingCsv({
      csvText,
      existingReadings: [],
    });

    if (importedReadings.length === 0) {
      console.log(
        `No rows parsed from CSV. totalRows=${summary.totalRows}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}`
      );
      return;
    }

    const merged = [...existingReadings];
    const byKey = new Map(merged.map((item, index) => [buildReadingKey(item), index]).filter(([key]) => key));

    let nextId = Math.max(0, ...merged.map((item) => Number(item.id) || 0)) + 1;
    let updated = 0;
    let inserted = 0;

    importedReadings.forEach((incoming) => {
      const key = buildReadingKey(incoming);
      if (byKey.has(key)) {
        const index = byKey.get(key);
        const current = merged[index];
        merged[index] = {
          ...current,
          title: incoming.title || current.title,
          level: incoming.level || current.level || '',
          category: incoming.category || current.category || '',
          content: incoming.content || current.content,
          translation: incoming.translation || current.translation || '',
          source: incoming.source || current.source || '',
          tags: mergeTagList(current.tags, incoming.tags),
          examType: incoming.examType || current.examType || '',
          questions: normalizeQuestionList(incoming.questions).length > 0
            ? normalizeQuestionList(incoming.questions)
            : normalizeQuestionList(current.questions),
        };
        updated += 1;
      } else {
        merged.push({
          ...incoming,
          id: nextId,
          tags: normalizeTagList(incoming.tags),
          questions: normalizeQuestionList(incoming.questions),
        });
        byKey.set(key, merged.length - 1);
        nextId += 1;
        inserted += 1;
      }
    });

    merged.sort((a, b) => Number(a.id) - Number(b.id));
    const output = serializeReadings(merged);

    if (dryRun) {
      console.log(
        `Dry run complete (upsert): parsed=${importedReadings.length}, updated=${updated}, inserted=${inserted}, skippedInvalid=${summary.skippedInvalid}, sourceRows=${summary.totalRows}, newTotal=${merged.length}`
      );
      return;
    }

    await fs.writeFile(readingsFilePath, output, 'utf8');
    console.log(
      `Upsert complete: updated=${updated}, inserted=${inserted}, skippedInvalid=${summary.skippedInvalid}, total=${merged.length}.`
    );
    return;
  }

  const { importedReadings, summary } = parseReadingCsv({
    csvText,
    existingReadings,
  });

  if (importedReadings.length === 0) {
    console.log(
      `No new readings imported. totalRows=${summary.totalRows}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}`
    );
    return;
  }

  const merged = [...existingReadings, ...importedReadings]
    .map((item) => ({
      ...item,
      tags: normalizeTagList(item.tags),
      questions: normalizeQuestionList(item.questions),
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
  const output = serializeReadings(merged);

  if (dryRun) {
    console.log(
      `Dry run complete: imported=${summary.importedCount}, skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}, newTotal=${merged.length}`
    );
    return;
  }

  await fs.writeFile(readingsFilePath, output, 'utf8');
  console.log(
    `Imported ${summary.importedCount} readings into src/data/readings.js (skippedInvalid=${summary.skippedInvalid}, skippedDuplicate=${summary.skippedDuplicate}, total=${merged.length}).`
  );
};

main().catch((error) => {
  console.error('Import failed:', error?.message || error);
  process.exit(1);
});
