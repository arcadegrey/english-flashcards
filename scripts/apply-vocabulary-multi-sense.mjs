// Apply the bounded source-reviewed multi-sense batch, validating every full copy first.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url), dir = 'data/vocabulary-multi-sense-repair';
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const hash = value => createHash('sha256').update(value).digest('hex');
const source = await read(`${dir}/source-register-2026-10-31.json`);
const metadata = await read(`${dir}/metadata-2026-10-31.json`);
const sources = await read(`${dir}/sources-2026-10-31.json`);
const words = await read('public/data/vocabulary.json');
const latestNeutral=await read('data/vocabulary-neutral-examples/reviews-2026-10-31.json');
if(hash(serialize(words))===latestNeutral.afterSha256){console.log('Preserving the registered neutral-example repair.');process.exit(0);}
let previous;
try { previous = await read(`${dir}/reviews-2026-10-31.json`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const expected = new Set([...source.entries, ...source.gaps].map(row => row.id));
const authored = new Map();
let current;
for (const line of (await readFile(new URL(`${dir}/examples-2026-10-31.txt`, root), 'utf8')).split(/\r?\n/)) {
  if (!line.trim()) continue;
  if (line.startsWith('@')) {
    const match = line.match(/^@(\d+) ([a-z]+)$/); assert(match, `Invalid heading: ${line}`);
    const id = Number(match[1]); assert(!authored.has(id), `Duplicate ${id}`);
    current = { id, word: match[2], examples: [], note: '' }; authored.set(id, current);
  } else if (line.startsWith('# ')) { assert(current); current.note = line.slice(2); }
  else {
    assert(current); const parts = line.split('|'); assert.equal(parts.length, 3, line);
    const [sense, en, zh] = parts; assert(sense && en && zh); current.examples.push({ sense, en, zh });
  }
}
assert.deepEqual(new Set(authored.keys()), expected); assert.equal(expected.size, 133);
const old = new Map(previous?.reviews.map(review => [review.id, review.before]));
const tagsFor = text => [...String(text).matchAll(/(?:^|[^a-z])(modal v|adj|adv|aux|vt|vi|v|n|a|prep|pron|num|interj|conj)\./g)]
  .map(match => ({ a: 'adj', vt: 'v', vi: 'v', aux: 'modal v' }[match[1]] || match[1]));
const reviews = words.filter(word => expected.has(word.id)).map(word => {
  const before = old.get(word.id) || word, item = authored.get(word.id), changes = metadata[word.id] || {};
  assert.equal(item.word, before.word); assert(item.examples.length >= 2 && item.examples.length <= 6); assert(item.note);
  assert.equal(new Set(item.examples.map(example => example.en)).size, item.examples.length);
  assert(sources.some(source => source.word === word.word));
  const tags = [...new Set([...item.examples.flatMap(example => tagsFor(example.sense)), ...tagsFor(changes.meaning || before.meaning), ...tagsFor(before.pos)])];
  const after = { ...before, pos: tags.map(tag => `${tag}.`).join(' / '),
    ...(changes.meaning ? { meaning: changes.meaning } : changes.meaningAppend ? { meaning: `${before.meaning}\n${changes.meaningAppend}` } : {}),
    ...(changes.phonetic ? { phonetic: changes.phonetic } : {}),
    example: item.examples[0].en, exampleCn: item.examples[0].zh, examples: item.examples };
  const prior = previous?.reviews.find(review => review.id === word.id);
  assert(isDeepStrictEqual(word, before) || isDeepStrictEqual(word, after) || prior && isDeepStrictEqual(word, prior.after), `Unregistered ${word.id}`);
  return { id: word.id, word: word.word, checkedAt: '2026-10-31',
    changedFields: Object.keys(after).filter(key => !isDeepStrictEqual(after[key], before[key])),
    audioFields: changes.replaceWordAudio ? ['word', 'example'] : ['example'],
    sourceIds: [`cambridge-${word.word}`], note: item.note, before, after };
});
const corrections = new Map(reviews.map(review => [review.id, review]));
const baseline = words.map(word => corrections.get(word.id)?.before || word);
assert.equal(hash(serialize(baseline)), source.inputSha256, 'Unrelated edits since the supplied audit');
const next = words.map(word => corrections.get(word.id)?.after || word);
const staged = [];
async function stage(path) {
  const data = await read(path); if (!Array.isArray(data) || !data.some(word => corrections.has(word.id))) return;
  const after = data.map(word => {
    const correction = corrections.get(word.id); if (!correction) return word;
    const prior = previous?.reviews.find(review => review.id === word.id);
    assert(isDeepStrictEqual(word, correction.before) || isDeepStrictEqual(word, correction.after)
      || prior && isDeepStrictEqual(word, prior.after), `${path}: unknown snapshot ${word.id}`);
    return correction.after;
  });
  staged.push([path, serialize(after)]);
}
async function visit(path) {
  for (const entry of await readdir(new URL(path, root), { withFileTypes: true })) {
    if (entry.isDirectory()) await visit(`${path}/${entry.name}`);
    else if (entry.name.endsWith('.json') && entry.name !== 'manifest.json') await stage(`${path}/${entry.name}`);
  }
}
await stage('public/data/vocabulary/core.json'); await visit('public/data/vocabulary/toefl'); await visit('public/data/vocabulary/ielts');
const register = { date: '2026-10-31', batch: '2026-10-31-multi-sense',
  scope: 'Exactly 133 stable IDs from the supplied 118-entry audit and 16 gap candidates; mine overlaps. Common-sense examples and bounded metadata corrections, no account/progress migration.',
  editorialMethod: 'Single-model editorial review against fetched primary dictionary definitions. Original bilingual sentences; not scraped quotations, automatic suffix extension or independent human certification.',
  baselineSha256: source.inputSha256, afterSha256: hash(serialize(next)),
  counts: { words: reviews.length, examples: reviews.reduce((sum, review) => sum + review.after.examples.length, 0),
    wordAudioReplacements: reviews.filter(review => review.audioFields.includes('word')).length }, sources, reviews };
await writeFile(new URL(`${dir}/reviews-2026-10-31.json`, root), serialize(register));
await writeFile(new URL('public/data/vocabulary.json', root), serialize(next));
for (const [path, bytes] of staged) await writeFile(new URL(path, root), bytes);
console.log(JSON.stringify({ ...register.counts, expectedAudioFiles: (register.counts.examples + register.counts.wordAudioReplacements) * 4, updatedFullFiles: staged.map(([path]) => path) }, null, 2));
