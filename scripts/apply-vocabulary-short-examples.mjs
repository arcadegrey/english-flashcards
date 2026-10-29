// Apply the reviewed short-example batch without changing IDs or personal data.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const serialize=value=>JSON.stringify(value,null,2)+'\n';
const hash=value=>createHash('sha256').update(value).digest('hex');
const vocabulary=await read('public/data/vocabulary.json');
const latestCommonSenses = await read('data/vocabulary-common-senses-repair/reviews-2026-10-29.json');
if (hash(serialize(vocabulary)) === latestCommonSenses.afterSha256) {
  console.log('Preserving the later registered common-sense repairs.');
  process.exit(0);
}
const audit=await read('data/vocabulary-short-example-audit/examples-2026-10-29.json');
const p2=await read('data/vocabulary-p2-repair/reviews-2026-10-29.json');
const patches=await read('data/vocabulary-short-example-repair/patches-2026-10-29.json');
assert.equal(audit.examples.length,238);assert.equal(audit.inputSha256,p2.afterSha256);
const targets=new Set([...audit.examples.filter(row=>row.id!==700).map(row=>row.id),7121]);
assert.equal(patches.length,238);assert.deepEqual(new Set(patches.map(p=>p.id)),targets);
let previous;
try{previous=await read('data/vocabulary-short-example-repair/reviews-2026-10-29.json');}
catch(error){if(error.code!=='ENOENT')throw error;}
if(previous)assert.equal(previous.baselineSha256,p2.afterSha256);
const byId=new Map(vocabulary.map(word=>[word.id,word]));
const allowed=new Set(['pos','meaning','example','exampleCn']);
const reviews=patches.map(({id,...patch})=>{
 for(const key of Object.keys(patch))assert(allowed.has(key),`${id}: forbidden ${key}`);
 const prior=previous?.reviews.find(r=>r.id===id),current=byId.get(id),before=prior?.before||current,after={...before,...patch};
 assert(isDeepStrictEqual(current,before)||isDeepStrictEqual(current,after)||prior&&isDeepStrictEqual(current,prior.after),`${id}: unregistered edit`);
 const index=audit.examples.findIndex(row=>row.id===id);
 if(index>=0){const row=audit.examples[index];assert.equal(before.example,row.example);assert.equal(before.exampleCn,row.exampleCn);}
 const changedFields=Object.keys(patch).filter(key=>!isDeepStrictEqual(before[key],after[key]));
 assert(changedFields.includes('example')&&changedFields.includes('exampleCn'));
 return{id,word:before.word,status:'resolved_local_text',checkedAt:'2026-10-29',
  issueIds:[index>=0?`SQ-${String(index+1).padStart(3,'0')}`:'USER-SMOKING'],
  reason:id===7121?'User requested a more ordinary example; original Smoking stinks. is grammatical.'
   :id===6331?'Rare longer noun is attested, but the original phrase does not teach the selected adverb sense; use a complete ordinary question.'
    :id===7124?'Replace the contextless polite society idiom and incorrect literal translation with the ordinary courteous adjective sense.'
     :'Replace the reviewed isolated phrase or context-dependent fragment with a complete short sentence for the selected sense.',
  editorialMethod:'Individually authored original bilingual example; not a scraped quotation or a length-only automatic extension. Existing additional senses retain their registered metadata unless explicitly corrected.',
  changedFields,audioFields:['example'],before,after};
});
const corrections=new Map(reviews.map(r=>[r.id,r]));
const baseline=vocabulary.map(word=>corrections.get(word.id)?.before||word);
assert.equal(hash(serialize(baseline)),p2.afterSha256,'Unrelated records changed since P2');
const next=vocabulary.map(word=>corrections.get(word.id)?.after||word);
assert.equal(byId.get(700).example,'The two cars collided.');
const excluded=audit.examples.find(row=>row.id===700);
assert(excluded);
const register={date:'2026-10-29',batch:'2026-10-29-short-examples',
 scope:'237 reviewed candidates plus the user-requested smoking example; one complete-sentence false positive is preserved. Stable 8699 IDs; no progress migration.',
 baselineSha256:p2.afterSha256,afterSha256:hash(serialize(next)),
 sources:await read('data/vocabulary-short-example-repair/sources-2026-10-29.json'),
 exclusions:[{id:700,word:'collide',issueId:`SQ-${String(audit.examples.indexOf(excluded)+1).padStart(3,'0')}`,
  status:'reviewed_exclusion',reason:'The two cars collided. is a complete subject–verb sentence. The heuristic misses the collided inflection; no text or audio change.',before:byId.get(700)}],reviews};
const pending=[];
async function stage(relative){
 const entries=await read(relative);
 if(!Array.isArray(entries)||!entries.some(w=>corrections.has(w.id)))return;
 const updated=entries.map(word=>{const correction=corrections.get(word.id);if(!correction)return word;
  const prior=previous?.reviews.find(r=>r.id===word.id);
  assert(isDeepStrictEqual(word,correction.before)||isDeepStrictEqual(word,correction.after)||prior&&isDeepStrictEqual(word,prior.after),`${relative}: unknown ${word.id}`);
  return correction.after;});
 pending.push([relative,serialize(updated)]);
}
async function visit(relative){for(const entry of await readdir(new URL(relative,root),{withFileTypes:true})){
 const child=`${relative}/${entry.name}`;
 if(entry.isDirectory())await visit(child);
 else if(entry.name.endsWith('.json')&&entry.name!=='manifest.json')await stage(child);
}}
await stage('public/data/vocabulary/core.json');await visit('public/data/vocabulary/toefl');await visit('public/data/vocabulary/ielts');
// Every copy and the baseline are validated before the first write.
await writeFile(new URL('data/vocabulary-short-example-repair/reviews-2026-10-29.json',root),serialize(register));
await writeFile(new URL('public/data/vocabulary.json',root),serialize(next));
for(const [relative,content]of pending)await writeFile(new URL(relative,root),content);
console.log(JSON.stringify({repairedRecords:reviews.length,reviewedCandidates:237,excluded:1,extraSmoking:1,expectedAudioFiles:reviews.length*4,updatedFullFiles:pending.map(([path])=>path)},null,2));
