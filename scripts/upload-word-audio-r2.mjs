import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SOURCE_DIR = 'public/audio/words';
const DEFAULT_PREFIX = 'audio/words';
const DEFAULT_CONCURRENCY = 6;

function parseArgs(argv) {
  const args = {
    sourceDir: DEFAULT_SOURCE_DIR,
    prefix: DEFAULT_PREFIX,
    concurrency: DEFAULT_CONCURRENCY,
    dryRun: false,
    limit: 0,
    start: 0,
    bucket: process.env.R2_AUDIO_BUCKET || '',
    wrangler: process.env.WRANGLER_CMD || 'npx wrangler@4',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      return argv[i];
    };

    if (arg === '--bucket') args.bucket = next();
    else if (arg === '--source') args.sourceDir = next();
    else if (arg === '--prefix') args.prefix = next();
    else if (arg === '--concurrency') args.concurrency = Number(next());
    else if (arg === '--limit') args.limit = Number(next());
    else if (arg === '--start') args.start = Number(next());
    else if (arg === '--wrangler') args.wrangler = next();
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(args.concurrency) || args.concurrency < 1) {
    throw new Error('--concurrency must be a positive integer');
  }

  if (!Number.isInteger(args.limit) || args.limit < 0) {
    throw new Error('--limit must be a non-negative integer');
  }

  if (!Number.isInteger(args.start) || args.start < 0) {
    throw new Error('--start must be a non-negative integer');
  }

  args.prefix = args.prefix.replace(/^\/+|\/+$/g, '');
  return args;
}

function printHelp() {
  console.log(`Upload generated Kokoro word audio to Cloudflare R2.

Usage:
  npm run audio:upload-r2 -- --bucket english-flashcards-audio

Options:
  --bucket <name>       R2 bucket name. Can also use R2_AUDIO_BUCKET.
  --source <dir>        Local audio root. Default: ${DEFAULT_SOURCE_DIR}
  --prefix <prefix>     R2 object prefix. Default: ${DEFAULT_PREFIX}
  --concurrency <n>     Parallel uploads. Default: ${DEFAULT_CONCURRENCY}
  --start <n>           Skip the first n files after sorting.
  --limit <n>           Upload only the first n files.
  --wrangler <command>  Wrangler command. Default: npx wrangler@4
  --dry-run             Print what would upload without writing to R2.
`);
}

async function collectFiles(sourceDir) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.mp3') || entry.name === 'manifest.json')) {
        files.push(fullPath);
      }
    }
  }

  await walk(sourceDir);
  return files.sort();
}

function getContentType(filePath) {
  if (filePath.endsWith('.mp3')) return 'audio/mpeg';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function getCacheControl(filePath) {
  if (filePath.endsWith('.mp3')) return 'public, max-age=31536000, immutable';
  return 'public, max-age=300';
}

function splitCommand(command) {
  const parts = command.trim().split(/\s+/);
  return { command: parts[0], args: parts.slice(1) };
}

function uploadWithWrangler({ wrangler, bucket, key, filePath }) {
  const base = splitCommand(wrangler);
  const args = [
    ...base.args,
    'r2',
    'object',
    'put',
    `${bucket}/${key}`,
    '--file',
    filePath,
    '--content-type',
    getContentType(filePath),
    '--cache-control',
    getCacheControl(filePath),
    '--remote',
    '--force',
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(base.command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `wrangler exited with code ${code}`));
      }
    });
  });
}

function runWrangler({ wrangler, args }) {
  const base = splitCommand(wrangler);

  return new Promise((resolve, reject) => {
    const child = spawn(base.command, [...base.args, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'inherit', 'pipe'],
    });

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `wrangler exited with code ${code}`));
      }
    });
  });
}

async function bulkUploadMp3({ wrangler, bucket, items, concurrency }) {
  if (items.length === 0) return;

  const tempDir = await fs.mkdtemp(path.join('/private/tmp', 'word-audio-r2-'));
  const manifestPath = path.join(tempDir, 'bulk-manifest.json');
  const entries = items.map((item) => ({ key: item.key, file: item.filePath }));
  await fs.writeFile(manifestPath, JSON.stringify(entries), 'utf8');

  await runWrangler({
    wrangler,
    args: [
      'r2',
      'bulk',
      'put',
      bucket,
      '--filename',
      manifestPath,
      '--content-type',
      'audio/mpeg',
      '--cache-control',
      'public, max-age=31536000, immutable',
      '--concurrency',
      String(concurrency),
      '--remote',
      '--force',
    ],
  });
}

async function runPool(items, concurrency, worker) {
  let cursor = 0;
  let completed = 0;
  const failures = [];

  async function next(workerId) {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      const item = items[currentIndex];
      try {
        await worker(item, currentIndex, workerId);
      } catch (error) {
        failures.push({ item, error });
      } finally {
        completed += 1;
        if (completed % 100 === 0 || completed === items.length) {
          console.log(`Uploaded ${completed}/${items.length}`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, (_, index) => next(index)));
  return failures;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.bucket) {
    throw new Error('Missing R2 bucket. Pass --bucket <name> or set R2_AUDIO_BUCKET.');
  }

  const sourceDir = path.resolve(args.sourceDir);
  const files = await collectFiles(sourceDir);
  const remainingFiles = files.slice(args.start);
  const selectedFiles = args.limit > 0 ? remainingFiles.slice(0, args.limit) : remainingFiles;
  const uploadItems = selectedFiles.map((filePath) => {
    const relative = path.relative(sourceDir, filePath).split(path.sep).join('/');
    return {
      filePath,
      key: `${args.prefix}/${relative}`,
    };
  });

  console.log(`Source: ${sourceDir}`);
  console.log(`Bucket: ${args.bucket}`);
  console.log(`Prefix: ${args.prefix}`);
  console.log(`Start: ${args.start}`);
  console.log(`Files: ${uploadItems.length}`);

  if (args.dryRun) {
    for (const item of uploadItems.slice(0, 20)) {
      console.log(`${item.filePath} -> r2://${args.bucket}/${item.key}`);
    }
    if (uploadItems.length > 20) {
      console.log(`... ${uploadItems.length - 20} more`);
    }
    return;
  }

  const startedAt = Date.now();
  const mp3Items = uploadItems.filter((item) => item.filePath.endsWith('.mp3'));
  const metadataItems = uploadItems.filter((item) => !item.filePath.endsWith('.mp3'));

  await bulkUploadMp3({
    wrangler: args.wrangler,
    bucket: args.bucket,
    items: mp3Items,
    concurrency: args.concurrency,
  });

  const failures = await runPool(metadataItems, args.concurrency, (item) =>
    uploadWithWrangler({
      wrangler: args.wrangler,
      bucket: args.bucket,
      key: item.key,
      filePath: item.filePath,
    }),
  );

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  if (failures.length > 0) {
    console.error(`Failed uploads: ${failures.length}`);
    for (const failure of failures.slice(0, 20)) {
      console.error(`${failure.item.key}: ${failure.error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Done in ${seconds}s.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
