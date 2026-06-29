import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const batchDir = path.resolve(projectRoot, 'output/rewrite-example-batches-100');
const vocabularyPath = path.resolve(projectRoot, 'public/data/vocabulary.json');
const combinedPath = path.resolve(projectRoot, 'output/rewrite-examples-5400-plus-merged.csv');

const expectedHeader = [
  'id',
  'word',
  'phonetic',
  'pos',
  'meaning',
  'category',
  'oldExample',
  'oldExampleCn',
  'newExample',
  'newExampleCn',
];

const parseCsv = (text) => {
  text = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows.filter((item) => !(item.length === 1 && item[0] === ''));
};

const csvCell = (value) => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const writeCsv = (rows) => `${rows.map((row) => row.map(csvCell).join(',')).join('\n')}\n`;

const rowsToObjects = (rows, file) => {
  const header = rows[0];
  if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
    throw new Error(`Unexpected CSV header in ${file}`);
  }

  return rows.slice(1).map((row, index) => ({
    file,
    line: index + 2,
    values: row,
    record: Object.fromEntries(header.map((key, columnIndex) => [key, row[columnIndex] ?? ''])),
  }));
};

const main = async () => {
  const files = (await fs.readdir(batchDir))
    .filter((file) => /^rewrite-examples-batch-\d+-.+\.csv$/.test(file))
    .sort();
  const replacements = new Map();
  const combinedRows = [expectedHeader];

  for (const file of files) {
    const filePath = path.resolve(batchDir, file);
    const rows = parseCsv(await fs.readFile(filePath, 'utf8'));
    for (const { line, values, record } of rowsToObjects(rows, file)) {
      if (!record.id || !record.newExample.trim() || !record.newExampleCn.trim()) {
        throw new Error(`Missing rewrite data in ${file}:${line}`);
      }
      if (replacements.has(record.id)) {
        throw new Error(`Duplicate rewrite id ${record.id}`);
      }
      replacements.set(record.id, {
        example: record.newExample,
        exampleCn: record.newExampleCn,
      });
      combinedRows.push(values);
    }
  }

  const vocabulary = JSON.parse(await fs.readFile(vocabularyPath, 'utf8'));
  let updated = 0;

  for (const word of vocabulary) {
    const replacement = replacements.get(String(word.id));
    if (!replacement) continue;
    word.example = replacement.example;
    word.exampleCn = replacement.exampleCn;
    updated += 1;
  }

  if (updated !== replacements.size) {
    throw new Error(`Updated ${updated} vocabulary entries, expected ${replacements.size}`);
  }

  await fs.writeFile(combinedPath, writeCsv(combinedRows), 'utf8');
  await fs.writeFile(vocabularyPath, `${JSON.stringify(vocabulary, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    files: files.length,
    replacements: replacements.size,
    updated,
    combined: path.relative(projectRoot, combinedPath),
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
