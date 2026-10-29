// Apply the bounded remaining P2 register without changing identity or user data.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const hash = value => createHash('sha256').update(value).digest('hex');
const path = new URL('public/data/vocabulary.json', root);
const vocabulary = JSON.parse(await readFile(path, 'utf8'));
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
const audit = await read('docs/vocabulary-teaching-quality-audit-2026-10-29.json');
const p1 = await read('data/vocabulary-p1-repair/reviews-2026-10-29.json');
const patches = await read('data/vocabulary-p2-repair/patches-2026-10-29.json');
const p1Closed = new Set(p1.reviews.flatMap(review => review.alsoResolvedIssueIds));
const issues = audit.issues.filter(issue => issue.priority === 'P2' && !p1Closed.has(issue.issueId));
assert.equal(issues.length, 176);
const targetIds = new Set(issues.map(issue => issue.id));
assert.equal(targetIds.size, 174);
assert.equal(patches.length, 174);
assert.deepEqual(new Set(patches.map(patch => patch.id)), targetIds);
let previous;
try { previous = await read('data/vocabulary-p2-repair/reviews-2026-10-29.json'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (previous) assert.equal(previous.baselineSha256, p1.afterSha256);
const byId = new Map(vocabulary.map(word => [word.id, word]));
const allowed = new Set(['pos','meaning','example','exampleCn']);
const reviews = patches.map(({id,...patch}) => {
  for (const key of Object.keys(patch)) assert(allowed.has(key), `${id}: forbidden ${key}`);
  const prior = previous?.reviews.find(review => review.id === id);
  const before = prior?.before || byId.get(id), after = {...before,...patch}, current = byId.get(id);
  assert(isDeepStrictEqual(current,before) || isDeepStrictEqual(current,after)
    || prior && isDeepStrictEqual(current,prior.after), `${id}: unregistered edit, refusing overwrite`);
  const changedFields = Object.keys(patch).filter(key => !isDeepStrictEqual(before[key],after[key]));
  assert(changedFields.includes('example'), `${id}: reviewed English must change`);
  assert(before.word === after.word && before.phonetic === after.phonetic);
  const linked = issues.filter(issue => issue.id === id);
  return {id,word:before.word,status:'resolved_local_text',checkedAt:'2026-10-29',
    issueIds:linked.map(issue => issue.issueId),rationale:linked.map(issue => issue.finding),
    editorialMethod:'Original short complete sentence for the selected ordinary sense, reviewed with its Chinese translation; no length-only automatic rewrite.',
    changedFields,audioFields:['example'],before,after};
});
const corrections = new Map(reviews.map(review => [review.id,review]));
const baseline = vocabulary.map(word => corrections.get(word.id)?.before || word);
assert.equal(hash(serialize(baseline)),p1.afterSha256,'Unrelated records changed since P1');
const next = vocabulary.map(word => corrections.get(word.id)?.after || word);
const sources = [
  ['builder','https://dictionary.cambridge.org/us/dictionary/english/builder','建筑施工者及从事建筑业务的人或公司；新墙体维修例句使用该常用义。'],
  ['stereotype','https://www.merriam-webster.com/dictionary/stereotype','现代刻板印象及旧印刷铅版义；本次不以未核实的盲文译义作默认教学。'],
  ['braille','https://www.merriam-webster.com/dictionary/braille','点字系统及相应动词，与 stereotype 已核实的铅版／刻板印象义区分。'],
  ['science fiction','https://dictionary.cambridge.org/dictionary/english/science-fiction','科幻可覆盖书籍、电影、动画等，不局限于小说。'],
  ['don','https://www.merriam-webster.com/dictionary/don','动词穿上衣物；Don 作为称谓另属名词用法。'],
  ['romance','https://www.merriam-webster.com/dictionary/romance','恋情、爱情故事、传奇及相关动词；大写 Romance 的语言族用法另属一义。'],
  ['beneficiary','https://www.collinsdictionary.com/dictionary/english/beneficiary','受益者及 benefice 持有人相关名词／形容词；特定教会或历史语境不作默认例句。'],
  ['literal','https://www.merriam-webster.com/dictionary/literal','字面／逐字形容词义及文字差错名词义确实存在，未将旧名词义误删为不存在。'],
  ['advisory','https://www.merriam-webster.com/dictionary/advisory','咨询形容词及信息报告／预警名词。'],
  ['scary','https://www.merriam-webster.com/dictionary/scary','可指引起害怕，也可指胆小／感到害怕；默认电影例句需要使人害怕义。'],
  ['regulatory','https://dictionary.cambridge.org/us/dictionary/english/regulatory','控制、管理、监管活动或规则的形容词，不应只给被控制的释义。'],
  ['Olympic','https://www.merriam-webster.com/dictionary/Olympic','奥林匹克运动会相关义及对 Olympian 的古典义交叉引用；不把全部旧义宣布为错误。'],
  ['Norman','https://www.merriam-webster.com/dictionary/Norman','诺曼底相关人物／语言的名词及相应形容词。'],
  ['compelling','https://www.merriam-webster.com/dictionary/compelling','有力、吸引注意、有说服力的形容词义。'],
  ['stunning','https://www.merriam-webster.com/dictionary/stunning','令人震惊，或在美感／卓越方面极为出色。'],
  ['standing','https://www.merriam-webster.com/dictionary/standing','名词地位、声望、站立及持续等义。'],
  ['feminine','https://www.merriam-webster.com/dictionary/feminine','女性相关及语法阴性，未把女性化直接等同柔弱。'],
].map(([word,url,fact])=>({word,url,fact,checkedAt:'2026-10-29'}));
const register = {date:'2026-10-29',scope:'Exactly 176 remaining P2 items on 174 stable word IDs; no new word IDs or progress migration.',
  baselineSha256:p1.afterSha256,afterSha256:hash(serialize(next)),sources,reviews};
// Validate every copy before writing any file, so a stale shard cannot leave a partial update.
const changedFiles = [];
const pendingWrites = [];
async function updateFile(relative) {
  const entries = await read(relative);
  if (!Array.isArray(entries) || !entries.some(word=>corrections.has(word.id))) return;
  const updated = entries.map(word => {
    const correction = corrections.get(word.id); if (!correction) return word;
    const prior = previous?.reviews.find(review => review.id === word.id);
    assert(isDeepStrictEqual(word,correction.before) || isDeepStrictEqual(word,correction.after)
      || prior && isDeepStrictEqual(word,prior.after), `${relative}: stale or unknown ${word.id}`);
    return correction.after;
  });
  pendingWrites.push([relative, serialize(updated)]); changedFiles.push(relative);
}
await updateFile('public/data/vocabulary/core.json');
async function visit(relative) {
  for (const entry of await readdir(new URL(relative,root),{withFileTypes:true})) {
    const child=`${relative}/${entry.name}`;
    if (entry.isDirectory()) await visit(child);
    else if (entry.name.endsWith('.json') && entry.name!=='manifest.json') await updateFile(child);
  }
}
await visit('public/data/vocabulary/toefl'); await visit('public/data/vocabulary/ielts');
await writeFile(new URL('data/vocabulary-p2-repair/reviews-2026-10-29.json',root),serialize(register));
await writeFile(path,serialize(next));
for (const [relative, content] of pendingWrites) await writeFile(new URL(relative,root),content);
console.log(JSON.stringify({repairedRecords:reviews.length,resolvedP2Items:issues.length,changedEnglish:reviews.length,
  expectedAudioFiles:reviews.length*4,updatedFullFiles:changedFiles},null,2));
