// Append the authorized 50 units only after validating identity and the complete baseline.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {RETIRED_VOCABULARY} from '../shared/retiredVocabulary.js';
const root=new URL('../',import.meta.url),dir='data/vocabulary-expansion-50';
const read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const serialize=v=>JSON.stringify(v,null,2)+'\n',hash=v=>createHash('sha256').update(v).digest('hex');
const entries=await read(`${dir}/entries-2026-10-29.json`),source=await read('data/vocabulary-common-senses-repair/reviews-2026-10-29.json');
const words=await read('public/data/vocabulary.json'),core=await read('public/data/vocabulary/core.json');
const latestSingle=await read('data/vocabulary-single-example/reviews-2026-10-31.json');
if(hash(serialize(words))===latestSingle.afterSha256){console.log('Preserving the registered single example simplification.');process.exit(0);}
assert.equal(entries.length,50);assert.deepEqual(entries.map(w=>w.id),Array.from({length:50},(_,i)=>9027+i));
let previous;
try { previous=await read(`${dir}/register-2026-10-29.json`); } catch(error) { if(error.code!=='ENOENT')throw error; }
const ids=new Set(entries.map(w=>w.id)),retired=new Set(RETIRED_VOCABULARY.map(w=>w.id));
const base=words.filter(w=>!ids.has(w.id)),baseCore=core.filter(w=>!ids.has(w.id));
assert.equal(hash(serialize(base)),source.afterSha256,'Unknown existing content changes');
if(previous)assert.equal(hash(serialize(baseCore)),previous.coreBeforeSha256,'Unknown core membership changes');
const spellings=new Set([...base,...RETIRED_VOCABULARY].map(w=>w.word.toLowerCase()));
for(const w of entries){assert(!retired.has(w.id));assert(!spellings.has(w.word.toLowerCase()));assert(w.category==='daily'&&w.categories.length===1);assert(w.phonetic&&w.pos&&w.meaning&&w.example&&w.exampleCn);spellings.add(w.word.toLowerCase());}
for(const current of words.filter(w=>ids.has(w.id)))assert(isDeepStrictEqual(current,entries.find(w=>w.id===current.id)) || previous && isDeepStrictEqual(current,previous.entries.find(w=>w.id===current.id)),'Unregistered addition edit');
for(const current of core.filter(w=>ids.has(w.id)))assert(isDeepStrictEqual(current,entries.find(w=>w.id===current.id)) || previous && isDeepStrictEqual(current,previous.entries.find(w=>w.id===current.id)),'Unregistered core addition edit');
for(const w of baseCore)assert(isDeepStrictEqual(w,base.find(v=>v.id===w.id)));
const next=[...base,...entries],nextCore=[...baseCore,...entries];
const register={date:'2026-10-29',batch:'2026-10-29-expansion-50',baselineSha256:source.afterSha256,afterSha256:hash(serialize(next)),beforeCount:base.length,afterCount:next.length,coreBeforeSha256:hash(serialize(baseCore)),coreAfterSha256:hash(serialize(nextCore)),ids:entries.map(w=>w.id),entries,classification:'daily only: general expressions and vocabulary; no official exam membership asserted',sources:await read(`${dir}/sources-2026-10-29.json`)};
const manifests=[];
for(const scope of ['toefl','ielts']){
 const path=`public/data/vocabulary/${scope}/manifest.json`,data=await read(path);
 assert([base.length,next.length].includes(data.sourceTotal));
 assert([baseCore.length,nextCore.length].includes(data.core.count));
 manifests.push([path,serialize({...data,sourceTotal:next.length,core:{...data.core,count:nextCore.length}})]);
}
await writeFile(new URL(`${dir}/register-2026-10-29.json`,root),serialize(register));
await writeFile(new URL('public/data/vocabulary.json',root),serialize(next));
await writeFile(new URL('public/data/vocabulary/core.json',root),serialize(nextCore));
for(const[path,data]of manifests)await writeFile(new URL(path,root),data);
console.log(`Appended ${entries.length} units: ${base.length} -> ${next.length}; all existing records preserved.`);
