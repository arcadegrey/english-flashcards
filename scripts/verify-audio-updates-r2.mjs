// Read every published MP3 and compare it with the committed manifest.
// No credentials are needed: this verifies the same public URLs used by clients.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { AUDIO_UPDATES_BASE_URL } from '../shared/vocabularyAudio.js';

const root = new URL('../', import.meta.url);
const baseUrl = (process.env.VITE_AUDIO_UPDATES_BASE_URL || AUDIO_UPDATES_BASE_URL).replace(/\/+$/, '');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reportUrl = new URL('output/audio-updates-r2-verification.json', root);
await mkdir(new URL('output/', root), { recursive: true });
const entries = [], manifests = [];
const batches = (await readdir(new URL('public/audio-updates/', root), { withFileTypes: true }))
  .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
for (const batch of batches) {
  const bytes = await readFile(new URL(`public/audio-updates/${batch}/manifest.json`, root));
  const manifest = JSON.parse(bytes);
  manifests.push({ batch, files: manifest.files.length, sha256: hash(bytes) });
  entries.push(...manifest.files);
}
// The public release manifests must also be the same versions as the repo.
for (const manifest of manifests) {
  const response = await fetch(`${baseUrl}/${manifest.batch}/manifest.json`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())), manifest.sha256, `Remote manifest: ${manifest.batch}`);
}
assert(entries.length > 0);
assert.equal(new Set(entries.map(entry => entry.path)).size, entries.length);
let previous;
try { previous = JSON.parse(await readFile(reportUrl, 'utf8')); } catch { /* First verification. */ }
const expected = new Map(entries.map(entry => [entry.path, entry]));
const verified = new Map((previous?.baseUrl === baseUrl ? previous.files : [])
  ?.filter(entry => expected.get(entry.path)?.sha256 === entry.sha256).map(entry => [entry.path, entry]) || []);
let cursor = 0, checked = 0;
const failures = [];
const snapshot = () => ({ baseUrl, manifests, checkedAt: new Date().toISOString(),
  expectedFiles: entries.length, verifiedFiles: verified.size, failures, files: [...verified.values()] });
// Serialize report writes; checkpoints survive an interrupted read-only run.
let writes = Promise.resolve();
const checkpoint = () => { writes = writes.then(() => writeFile(reportUrl, JSON.stringify(snapshot(), null, 2) + '\n')); return writes; };
async function worker() {
  while (cursor < entries.length) {
    const entry = entries[cursor++];
    const prior = verified.get(entry.path);
    if (prior?.sha256 === entry.sha256 && prior.bytes === entry.bytes) { checked++; continue; }
    const url = `${baseUrl}/${entry.path.split('/').slice(2).join('/')}`;
    try {
      let lastError;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { Origin: 'https://example.com' } });
          assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
          assert.match(response.headers.get('content-type') || '', /^audio\/mpeg/);
          const bytes = Buffer.from(await response.arrayBuffer());
          assert.equal(bytes.length, entry.bytes, `${url}: size`);
          assert.equal(hash(bytes), entry.sha256, `${url}: SHA-256`);
          verified.set(entry.path, { path: entry.path, url, bytes: bytes.length, sha256: entry.sha256,
            contentType: response.headers.get('content-type'), cacheControl: response.headers.get('cache-control'),
            cors: response.headers.get('access-control-allow-origin'), checkedAt: new Date().toISOString() });
          lastError = null; break;
        } catch (error) { lastError = error; }
      }
      if (lastError) throw lastError;
    } catch (error) { failures.push({ path: entry.path, message: error.message }); }
    checked++;
    if (checked % 100 === 0) { console.log(`Verified ${verified.size}/${entries.length}`, Date.now()); await checkpoint(); }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
await checkpoint();
assert.equal(failures.length, 0, JSON.stringify(failures.slice(0, 3)));
assert.equal(verified.size, entries.length);
for (const entry of entries) assert.equal(verified.get(entry.path)?.sha256, entry.sha256);
console.log(`PASS: ${verified.size} public R2 MP3s match their file hashes and sizes.`);
