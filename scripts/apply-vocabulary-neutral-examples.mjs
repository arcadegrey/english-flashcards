// Rewrite only approved example fields. Word IDs, definitions and personal data never change.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';
import { getCoreWordHints } from '../src/utils/wordHints.js';
const root=new URL('../',import.meta.url),dir='data/vocabulary-neutral-examples';
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const serialize=value=>JSON.stringify(value,null,2)+'\n',hash=value=>createHash('sha256').update(value).digest('hex');
const words=await read('public/data/vocabulary.json');
const previous=await read(`${dir}/reviews-2026-10-31.json`).catch(error=>{if(error.code!=='ENOENT')throw error;return null;});
const decisions=await read(`${dir}/presentation-decisions-2026-10-31.json`);
const baselineRegister=await read('data/vocabulary-multi-sense-repair/reviews-2026-10-31.json');
const rows=async path=>(await readFile(new URL(path,root),'utf8')).split(/\r?\n/).filter(Boolean).map(line=>line.split('|'));
const defaults=new Map((await rows(`${dir}/defaults-2026-10-31.txt`)).map(parts=>{assert.equal(parts.length,4);const[id,word,en,zh]=parts;return[Number(id),{word,en,zh}];}));
const senseRows=await rows(`${dir}/senses-2026-10-31.txt`);
const senses=new Map();for(const[id,index,en,zh]of senseRows){const list=senses.get(Number(id))||[];list.push({index:Number(index),en,zh});senses.set(Number(id),list);}
const targets=new Set([...defaults.keys(),...senses.keys()]);
const previousById=new Map(previous?.reviews.map(review=>[review.id,review]));
const baseline=words.map(word=>previousById.get(word.id)?.before||word);
assert.equal(hash(serialize(baseline)),baselineRegister.afterSha256,'Unexpected edits before neutral examples');
const reviews=baseline.filter(word=>targets.has(word.id)).map(before=>{
 const after=structuredClone(before),replacement=defaults.get(before.id);
 if(replacement){assert.equal(replacement.word,before.word);after.example=replacement.en;after.exampleCn=replacement.zh;if(after.examples){after.examples[0].en=replacement.en;after.examples[0].zh=replacement.zh;}}
 for(const{index,en,zh}of senses.get(before.id)||[]){assert(after.examples?.[index]);after.examples[index]={...after.examples[index],en,zh};if(index===0){after.example=en;after.exampleCn=zh;}}
 const actual=words.find(word=>word.id===before.id),prior=previousById.get(before.id);
 assert(isDeepStrictEqual(actual,before)||isDeepStrictEqual(actual,after)||prior&&isDeepStrictEqual(actual,prior.after),`Unregistered ${before.id}`);
 return{id:before.id,word:before.word,checkedAt:'2026-10-31',changedFields:Object.keys(after).filter(key=>!isDeepStrictEqual(after[key],before[key])),
  audioFields:['example'],metalinguisticDefault:decisions.metalinguisticDefaultIds.includes(before.id),before,after};
});
assert.equal(reviews.length,targets.size);
const byId=new Map(reviews.map(review=>[review.id,review]));
const next=baseline.map(word=>byId.get(word.id)?.after||word);
const hintRows=await rows(`${dir}/hints-2026-10-31.txt`),hintPatches=new Map();
for(const[id,hintIndex,index,en,zh]of hintRows){const key=`${id}:${hintIndex}`;const list=hintPatches.get(key)||[];list.push({index:Number(index),en,zh});hintPatches.set(key,list);}
const hintMeta=await read(`${dir}/hint-metadata-2026-10-31.json`);
const metaIds=new Set(decisions.metalinguisticDefaultIds);
let captured;
try{captured=await read(`${dir}/hint-baseline-2026-10-31.json`);}catch(error){if(error.code!=='ENOENT')throw error;captured=Object.fromEntries(baseline.map(word=>[String(word.id),getCoreWordHints(word)]));}
const hintReviews=[];
for(const word of baseline){
 if(!captured[word.id])captured[word.id]=getCoreWordHints(word);
 for(const[index,before]of(captured[word.id]||[]).entries()){
  const key=`${word.id}:${index}`,patches=hintPatches.get(key),meta=metaIds.has(word.id)&&before.examples?.length;
  if(!patches&&!meta&&!hintMeta[key])continue;
  const after=structuredClone(before);
  if(meta)after.examples=before.examples.map((example,i)=>i%2?{en:`Please check the spelling of '${word.word}'.`,zh:`请检查 ${word.word} 的拼写。`}:{en:`The teacher explained the meaning of '${word.word}'.`,zh:`老师解释了 ${word.word} 的含义。`});
  for(const patch of patches||[]){assert(after.examples?.[patch.index],key);after.examples[patch.index]={en:patch.en,zh:patch.zh};}
  Object.assign(after,hintMeta[key]||{});
  if(!isDeepStrictEqual(before,after))hintReviews.push({id:word.id,word:word.word,hintIndex:index,before,after});
 }
}
for(const[key]of hintPatches)assert(hintReviews.some(review=>`${review.id}:${review.hintIndex}`===key),`Unused hint patch ${key}`);
// Store only the reviewed hint snapshots, not a second copy of the entire note library.
const selectedHints=Object.fromEntries([...new Set(hintReviews.map(review=>review.id))].map(id=>[String(id),captured[id]]));
const register={date:'2026-10-31',batch:'2026-10-31-neutral-examples',scope:'User-requested removal of political narratives from public vocabulary examples and learning-note examples; retain words and definitions, use explicit language-learning contexts for intrinsically political vocabulary.',
 baselineSha256:baselineRegister.afterSha256,afterSha256:hash(serialize(next)),reviews,hintReviews,
 counts:{wordRecords:reviews.length,defaultExamples:reviews.filter(review=>review.before.example!==review.after.example).length,senseExamples:senseRows.length,hintGroups:hintReviews.length,hintExamples:hintReviews.reduce((total,review)=>total+(review.after.examples||[]).filter((example,index)=>!isDeepStrictEqual(example,review.before.examples?.[index])).length,0)}};
const staged=[];
async function stage(path){const data=await read(path);if(!Array.isArray(data)||!data.some(word=>targets.has(word.id)))return;
 const after=data.map(word=>{const review=byId.get(word.id);if(!review)return word;assert(isDeepStrictEqual(word,review.before)||isDeepStrictEqual(word,review.after)||isDeepStrictEqual(word,previousById.get(word.id)?.after),`${path}: unknown ${word.id}`);return review.after;});staged.push([path,serialize(after)]);}
async function visit(path){for(const entry of await readdir(new URL(path,root),{withFileTypes:true})){if(entry.isDirectory())await visit(`${path}/${entry.name}`);else if(entry.name.endsWith('.json')&&entry.name!=='manifest.json')await stage(`${path}/${entry.name}`);}}
await stage('public/data/vocabulary/core.json');await visit('public/data/vocabulary/toefl');await visit('public/data/vocabulary/ielts');
await mkdir(new URL(`${dir}/`,root),{recursive:true});
await writeFile(new URL(`${dir}/hint-baseline-2026-10-31.json`,root),serialize(selectedHints));
await writeFile(new URL(`${dir}/reviews-2026-10-31.json`,root),serialize(register));
await writeFile(new URL('public/data/vocabulary.json',root),serialize(next));
for(const[path,bytes]of staged)await writeFile(new URL(path,root),bytes);
console.log(JSON.stringify({...register.counts,updatedFullFiles:staged.length},null,2));
