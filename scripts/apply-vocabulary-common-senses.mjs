// Apply only the ten source-reviewed existing IDs. Validate every full copy before writing.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),dir='data/vocabulary-common-senses-repair';
const read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const serialize=v=>JSON.stringify(v,null,2)+'\n',hash=v=>createHash('sha256').update(v).digest('hex');
const words=await read('public/data/vocabulary.json');
const expansion = await read('data/vocabulary-expansion-50/register-2026-10-29.json');
if (hash(serialize(words)) === expansion.afterSha256) {
 console.log('Preserving the registered 50-unit expansion.');
 process.exit(0);
}
const previousBatch=await read('data/vocabulary-short-example-repair/reviews-2026-10-29.json');
const proposal=await read('data/vocabulary-coverage-2026-10-29/first-batch-proposal.json');
const patches=await read(`${dir}/patches-2026-10-29.json`);
assert.equal(patches.length,10);
assert.deepEqual(new Set(patches.map(p=>p.id)),new Set(proposal.existingReviews.map(r=>r.id)));
let previous;
try{previous=await read(`${dir}/reviews-2026-10-29.json`);}catch(e){if(e.code!=='ENOENT')throw e;}
const reviews=patches.map(({id,...patch})=>{
 assert(Object.keys(patch).every(k=>['pos','meaning','example','exampleCn'].includes(k)));
 const current=words.find(w=>w.id===id),before=previous?.reviews.find(r=>r.id===id)?.before||current,after={...before,...patch};
 assert(isDeepStrictEqual(current,before)||isDeepStrictEqual(current,after),`${id}: unregistered changes`);
 assert.deepEqual(before,proposal.existingReviews.find(r=>r.id===id).current);
 return{id,word:before.word,checkedAt:'2026-10-29',status:'resolved_local_text',
  changedFields:Object.keys(patch).filter(k=>before[k]!==after[k]),audioFields:['example'],before,after};
});
const byId=new Map(reviews.map(r=>[r.id,r]));
const baseline=words.map(w=>byId.get(w.id)?.before||w),next=words.map(w=>byId.get(w.id)?.after||w);
assert.equal(hash(serialize(baseline)),previousBatch.afterSha256,'Unrelated baseline edits');
const pending=[['public/data/vocabulary.json',serialize(next)]];
async function stage(path){const entries=await read(path);if(!Array.isArray(entries)||!entries.some(w=>byId.has(w.id)))return;
 const updated=entries.map(w=>{const r=byId.get(w.id);if(!r)return w;assert(isDeepStrictEqual(w,r.before)||isDeepStrictEqual(w,r.after),`${path}: stale ${w.id}`);return r.after;});
 pending.push([path,serialize(updated)]);
}
async function visit(path){for(const e of await readdir(new URL(path,root),{withFileTypes:true})){const child=`${path}/${e.name}`;if(e.isDirectory())await visit(child);else if(e.name.endsWith('.json')&&e.name!=='manifest.json')await stage(child);}}
await stage('public/data/vocabulary/core.json');await visit('public/data/vocabulary/toefl');await visit('public/data/vocabulary/ielts');
const register={date:'2026-10-29',batch:'2026-10-29-common-senses',scope:'Exactly ten existing coverage-review IDs; no additions, reclassification or personal-data migration.',baselineSha256:previousBatch.afterSha256,afterSha256:hash(serialize(next)),sources:await read(`${dir}/sources-2026-10-29.json`),reviews};
await writeFile(new URL(`${dir}/reviews-2026-10-29.json`,root),serialize(register));
for(const[path,bytes]of pending)await writeFile(new URL(path,root),bytes);
console.log(JSON.stringify({records:reviews.length,fullFiles:pending.map(([p])=>p),afterSha256:register.afterSha256},null,2));
