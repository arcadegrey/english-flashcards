import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const vocabularyPath = path.resolve(projectRoot, 'public/data/vocabulary.json');
const outputPath = path.resolve(projectRoot, 'output/rewrite-examples-5400-plus.csv');

const TEMPLATE_RE = /^Students often meet the word "([^"]+)" in reading and daily communication\.$/;

const columns = [
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

const csvCell = (value) => {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const rowToCsv = (row) => columns.map((column) => csvCell(row[column])).join(',');

const main = async () => {
  const vocabulary = JSON.parse(await fs.readFile(vocabularyPath, 'utf8'));
  const rows = vocabulary
    .filter((word) => {
      const id = Number(word.id);
      const example = String(word.example || '').trim();
      return Number.isFinite(id) && id >= 5400 && TEMPLATE_RE.test(example);
    })
    .map((word) => ({
      id: word.id,
      word: word.word,
      phonetic: word.phonetic,
      pos: word.pos,
      meaning: word.meaning,
      category: word.category,
      oldExample: word.example,
      oldExampleCn: word.exampleCn,
      newExample: '',
      newExampleCn: '',
    }));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${columns.join(',')}\n${rows.map(rowToCsv).join('\n')}\n`, 'utf8');

  console.log(JSON.stringify({
    output: path.relative(projectRoot, outputPath),
    rows: rows.length,
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
