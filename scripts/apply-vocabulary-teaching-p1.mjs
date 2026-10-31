// Apply only the reviewed P1 IDs. Never migrate, delete or rewrite user progress.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const vocabularyPath = new URL('public/data/vocabulary.json', root);
const raw = await readFile(vocabularyPath, 'utf8'), vocabulary = JSON.parse(raw);
const latestNeutral = await read('data/vocabulary-neutral-examples/reviews-2026-10-31.json');
if (hash(serialize(vocabulary)) === latestNeutral.afterSha256) {
 console.log('Preserving the registered neutral-example repair.');
 process.exit(0);
}
const latestMulti = await read('data/vocabulary-multi-sense-repair/reviews-2026-10-31.json');
if (hash(serialize(vocabulary)) === latestMulti.afterSha256) {
 console.log('Preserving the registered multi-sense repair.');
 process.exit(0);
}
const latestSingle = await read('data/vocabulary-single-example/reviews-2026-10-31.json');
if (hash(serialize(vocabulary)) === latestSingle.afterSha256) {
 console.log('Preserving the registered single example simplification.');
 process.exit(0);
}
const expansion = await read('data/vocabulary-expansion-50/register-2026-10-29.json');
if (hash(serialize(vocabulary)) === expansion.afterSha256) {
 console.log('Preserving the registered 50-unit expansion.');
 process.exit(0);
}
const latestCommonSenses = await read('data/vocabulary-common-senses-repair/reviews-2026-10-29.json');
if (hash(serialize(vocabulary)) === latestCommonSenses.afterSha256) {
  console.log('Preserving the later registered common-sense repairs.');
  process.exit(0);
}
let laterShortExamples;
try { laterShortExamples = await read('data/vocabulary-short-example-repair/reviews-2026-10-29.json'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (laterShortExamples && hash(serialize(vocabulary)) === laterShortExamples.afterSha256) {
  console.log('Preserving the later registered short-example repairs.');
  process.exit(0);
}
let laterP2;
try { laterP2 = await read('data/vocabulary-p2-repair/reviews-2026-10-29.json'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (laterP2 && hash(raw) === laterP2.afterSha256) {
  console.log('P1 is already included in the registered P2 state; preserving all later repairs.');
  process.exit(0);
}
const audit = await read('docs/vocabulary-teaching-quality-audit-2026-10-29.json');
const patches = await read('data/vocabulary-p1-repair/patches-2026-10-29.json');
const issues = audit.issues.filter(issue => issue.priority === 'P1');
const targetIds = new Set(issues.map(issue => issue.id));
assert.equal(issues.length, 125);
assert.equal(targetIds.size, 124);
assert.deepEqual(new Set(patches.map(patch => patch.id)), targetIds);
assert.equal(patches.length, targetIds.size);
const byId = new Map(vocabulary.map(word => [word.id, word]));
let previousRegister;
try { previousRegister = await read('data/vocabulary-p1-repair/reviews-2026-10-29.json'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (previousRegister) assert.equal(previousRegister.baselineSha256, audit.inputSha256);
const allowed = new Set(['pos', 'meaning', 'phonetic', 'example', 'exampleCn']);
const additionalSources = [
  ['elderly', '年长者的形容词义和名词义均存在。'],
  ['Canadian', 'Canadian 可作形容词，也可作加拿大人这一名词。'],
  ['Hispanic', '形容词覆盖西语拉美血统／文化，尤其在美国语境；也指西班牙，并有名词用法。'],
  ['nonprofit', '非营利的形容词义及非营利组织的名词用法。'],
  ['national', '国家相关形容词义，以及某国国民的名词义。'],
  ['romantic', '浪漫相关形容词义及浪漫的人／浪漫主义者的名词义。'],
  ['metric', '公制相关形容词义及度量标准／指标的名词义。'],
  ['exclusive', '独有／专用的形容词义及独家新闻／专有权的名词义。'],
  ['offensive', '冒犯／攻击相关形容词义及进攻／攻势名词义。'],
  ['cunning', '狡猾／巧妙／特定语境可爱的形容词义，以及机巧／狡诈的名词义。'],
  ['militant', '好战／激进的形容词义及相应人物名词义。'],
  ['unconscious', '失去知觉／无意识等形容词义及心理学名词义。'],
].map(([word, fact]) => ({ title: `Merriam-Webster · ${word}`, url: `https://www.merriam-webster.com/dictionary/${word}`, checkedAt: '2026-10-29', fact }));
const reviews = patches.map(({ id, ...patch }) => {
  for (const key of Object.keys(patch)) assert(allowed.has(key), `${id}: forbidden field ${key}`);
  const before = issues.find(issue => issue.id === id).auditSnapshot || issues.find(issue => issue.id === id).current;
  const after = { ...before, ...patch };
  const current = byId.get(id);
  const previousAfter = previousRegister?.reviews.find(review => review.id === id)?.after;
  assert(isDeepStrictEqual(current, before) || isDeepStrictEqual(current, after)
    || previousAfter && isDeepStrictEqual(current, previousAfter), `${id}: unexpected edits; do not overwrite`);
  const changedFields = Object.keys(patch).filter(key => !isDeepStrictEqual(before[key], after[key]));
  assert(changedFields.length > 0);
  const linked = issues.filter(issue => issue.id === id);
  const closedP2 = audit.issues.filter(issue => issue.id === id && issue.priority === 'P2'
    && issue.kind === 'example_fragment' && before.example !== after.example);
  return { id, word: before.word, status: 'resolved_local_text', checkedAt: '2026-10-29',
    issueIds: linked.map(issue => issue.issueId), alsoResolvedIssueIds: closedP2.map(issue => issue.issueId),
    rationale: linked.map(issue => issue.finding),
    posPolicy: 'Labels cover the selected teaching use and existing explicitly defined senses. A corrected primary adjective tag does not assert that the spelling can never be a verb form or a specialist noun.',
    changedFields, audioFields: [...(changedFields.includes('example') ? ['example'] : []), ...(id === 8017 ? ['word'] : [])],
    before, after };
});
const corrections = new Map(reviews.map(review => [review.id, review.after]));
const next = vocabulary.map(word => corrections.get(word.id) || word);
const baseline = serialize(vocabulary.map(word => reviews.find(review => review.id === word.id)?.before || word));
assert.equal(hash(baseline), audit.inputSha256, 'Unrelated vocabulary changed since the captured audit');
const core = await read('public/data/vocabulary/core.json');
const coreIds = new Set(core.map(word => word.id));
assert([...targetIds].every(id => coreIds.has(id)), 'Unexpected external List target: update its complete shard explicitly');
const register = { date: '2026-10-29', scope: 'Exactly 125 P1 issues on 124 stable IDs, plus two directly related phrase issues and two Chinese-only alignment corrections within those IDs.',
  baselineSha256: hash(baseline), afterSha256: hash(serialize(next)), sourceAudit: 'docs/vocabulary-teaching-quality-audit-2026-10-29.json',
  sources: [...audit.sources, ...additionalSources], reviews };
await writeFile(new URL('data/vocabulary-p1-repair/reviews-2026-10-29.json', root), serialize(register));
await writeFile(vocabularyPath, serialize(next));
await writeFile(new URL('public/data/vocabulary/core.json', root), serialize(core.map(word => corrections.get(word.id) || word)));
console.log(JSON.stringify({ repairedRecords: reviews.length, closedP1Items: issues.length,
  linkedPhraseItems: reviews.flatMap(review => review.alsoResolvedIssueIds).length,
  changedExamples: reviews.filter(review => review.changedFields.includes('example')).length,
  changedWordReadings: reviews.filter(review => review.audioFields.includes('word')).length,
  expectedAudioFiles: reviews.reduce((count, review) => count + review.audioFields.length * 4, 0) }, null, 2));
