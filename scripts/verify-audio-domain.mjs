// Public, read-only delivery check. No Cloudflare credentials or object writes.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { AUDIO_UPDATES_BASE_URL } from '../shared/vocabularyAudio.js';

const root = new URL('../', import.meta.url);
const origin = new URL(process.env.AUDIO_DELIVERY_ORIGIN || AUDIO_UPDATES_BASE_URL).origin;
const voices = ['af_bella', 'am_michael', 'bf_emma', 'bm_george'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const samples = new Map(), manifests = [], files = [];
const fetchPublic = (path, options = {}) => fetch(new URL(path, origin), {
  ...options, headers: { Origin: 'https://www.englishflashcards.cn', ...options.headers },
  signal: AbortSignal.timeout(20000),
});
const inspect = async (path, expectedHash, expectedBytes) => {
  const started = Date.now();
  const response = await fetchPublic(path);
  assert.equal(response.status, 200, `${path}: status`);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(hash(bytes), expectedHash, `${path}: SHA-256`);
  assert.equal(bytes.length, expectedBytes, `${path}: bytes`);
  assert.equal(response.headers.get('access-control-allow-origin'), '*', `${path}: public GET CORS`);
  return { path, sha256: expectedHash, bytes: bytes.length, contentType: response.headers.get('content-type'),
    cacheControl: response.headers.get('cache-control'), cacheStatus: response.headers.get('cf-cache-status'),
    etag: response.headers.get('etag'), ray: response.headers.get('cf-ray'), elapsedMs: Date.now() - started };
};

const batchRoot = new URL('public/audio-updates/', root);
for (const entry of await readdir(batchRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const path = `/audio-updates/${entry.name}/manifest.json`;
  const bytes = await readFile(new URL(`public${path}`, root));
  const manifest = JSON.parse(bytes);
  manifests.push({ path, sha256: hash(bytes), bytes: bytes.length });
  for (const field of ['word', 'example']) for (const voice of voices) {
    const sample = manifest.files.find(file => file.path.includes(`/${field}/${voice}/`));
    if (sample) samples.set(sample.path, { path: sample.path, sha256: sample.sha256, bytes: sample.bytes });
  }
}
for (const type of ['words', 'examples']) for (const voice of voices) {
  const path = `/audio/${type}/${voice}/1124.mp3`;
  const bytes = await readFile(new URL(`public${path}`, root));
  samples.set(path, { path, sha256: hash(bytes), bytes: bytes.length });
}

const queue = [...manifests, ...samples.values()];
console.log(`Checking ${origin}: ${manifests.length} manifests and ${samples.size} MP3 samples across all voices/batches.`);
let cursor = 0;
const failures = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < queue.length) {
    const entry = queue[cursor++];
    try {
      const result = await inspect(entry.path, entry.sha256, entry.bytes);
      if (entry.path.endsWith('.mp3')) {
        assert.match(result.contentType || '', /^audio\/mpeg/);
        assert.match(result.cacheControl || '', /max-age=31536000/);
        assert.match(result.cacheControl || '', /immutable/);
      } else {
        assert.match(result.contentType || '', /^application\/json/);
        const ttl = Number(result.cacheControl?.match(/max-age=(\d+)/)?.[1]);
        assert(Number.isFinite(ttl) && ttl <= 300, `${entry.path}: manifest must remain short lived`);
      }
      files.push(result);
    } catch (error) { failures.push({ path: entry.path, error: error.message }); }
  }
}));

const protocolChecks = [];
if (failures.length === 0) {
  for (const path of [queue.find(entry => entry.path.startsWith('/audio/') && entry.path.endsWith('.mp3')).path,
    queue.find(entry => entry.path.startsWith('/audio-updates/') && entry.path.endsWith('.mp3')).path]) {
    const entry = files.find(file => file.path === path);
    const warm = await inspect(path, entry.sha256, entry.bytes);
    assert.equal(warm.cacheStatus, 'HIT', `${path}: repeated public GET should hit the edge cache`);
    const range = await fetchPublic(path, { headers: { Range: 'bytes=0-127' } });
    assert.equal(range.status, 206, `${path}: byte range`);
    assert.match(range.headers.get('content-range') || '', /^bytes 0-127\/\d+$/);
    const rangeBytes = Buffer.from(await range.arrayBuffer());
    const original = await readFile(new URL(`public${path}`, root));
    assert.deepEqual(rangeBytes, original.subarray(0, 128));
    const conditional = await fetchPublic(path, { headers: { 'If-None-Match': entry.etag } });
    assert.equal(conditional.status, 304, `${path}: conditional GET`);
    protocolChecks.push({ path, repeatedGet: warm.cacheStatus, rangeStatus: range.status,
      conditionalStatus: conditional.status });
  }
}
const report = { origin, checkedAt: new Date().toISOString(), totalManifests: manifests.length,
  sampledRecordings: samples.size, files, failures, protocolChecks };
await mkdir(new URL('output/', root), { recursive: true });
await writeFile(new URL('output/audio-domain-verification.json', root), JSON.stringify(report, null, 2) + '\n');
assert.equal(failures.length, 0, JSON.stringify(failures.slice(0, 5)));
console.log(`PASS: ${files.length} files match canonical hashes; edge HIT, CORS, byte ranges and conditional requests verified.`);
