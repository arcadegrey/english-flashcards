import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const databaseName = process.env.D1_DATABASE_NAME;

if (!databaseName) {
  throw new Error('Missing D1_DATABASE_NAME');
}

const runWrangler = (args, options = {}) =>
  execFileSync('wrangler', ['d1', 'execute', databaseName, '--remote', ...args], {
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });

runWrangler(['--file', './worker/schema.sql'], { stdio: 'inherit' });

const output = runWrangler(['--command', 'PRAGMA table_info(user_progress);', '--json']);
const parsed = JSON.parse(output);
const rows = Array.isArray(parsed)
  ? parsed.flatMap((item) => item?.results || item?.result || [])
  : parsed?.results || parsed?.result || [];
const existingColumns = new Set(rows.map((row) => row?.name).filter(Boolean));

const columns = [
  { name: 'word_progress', sql: "ALTER TABLE user_progress ADD COLUMN word_progress TEXT NOT NULL DEFAULT '{}';" },
  { name: 'wrong_words', sql: "ALTER TABLE user_progress ADD COLUMN wrong_words TEXT NOT NULL DEFAULT '[]';" },
  { name: 'study_history', sql: "ALTER TABLE user_progress ADD COLUMN study_history TEXT NOT NULL DEFAULT '[]';" },
];

const missingSql = columns
  .filter((column) => !existingColumns.has(column.name))
  .map((column) => column.sql);

if (missingSql.length === 0) {
  console.log('D1 schema is already up to date.');
  process.exit(0);
}

const dir = mkdtempSync(path.join(tmpdir(), 'ef-d1-migration-'));
const migrationFile = path.join(dir, 'migration.sql');
writeFileSync(migrationFile, `${missingSql.join('\n')}\n`, 'utf8');

try {
  runWrangler(['--file', migrationFile], { stdio: 'inherit' });
  console.log(`Applied ${missingSql.length} D1 schema update(s).`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
