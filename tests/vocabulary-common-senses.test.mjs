import {createSpeechService} from '../src/utils/speechEngine.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {beforeCommonSensesReview} from '../shared/vocabularyHistory.js';
import {correctedVocabularyAudioUrl} from '../shared/vocabularyAudio.js';
import {getCoreWordHints,getHintExampleParts} from '../src/utils/wordHints.js';
import {buildHiddenSentence} from '../src/utils/assessmentRounds.js';
import {buildWordAssignment,gradeWordAssignment} from '../shared/wordAssignments.js';
import {createVocabularyDelivery} from '../src/data/vocabularyDelivery.js';
import {applyWordDetails} from '../src/data/vocabularySummary.js';
const root=new URL('../',import.meta.url),read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex'),serialize=v=>JSON.stringify(v,null,2)+'\n';
const register=await read('data/vocabulary-common-senses-repair/reviews-2026-10-29.json');
const words=await read('public/data/vocabulary.json'),byId=new Map(words.map(w=>[w.id,w]));
const proposal=await read('data/vocabulary-coverage-2026-10-29/first-batch-proposal.json');
const oldHints=await read('data/vocabulary-common-senses-repair/previous-hints.json');
const hints=await read('data/vocabulary-common-senses-repair/hints-2026-10-29.json');
const manifest=await read('public/audio-updates/2026-10-29-common-senses/manifest.json');

test('only the ten authorized existing IDs change; complete historical reconstruction protects all other data',()=>{
 assert.deepEqual(new Set(register.reviews.map(r=>r.id)),new Set(proposal.existingReviews.map(r=>r.id)));
 assert.equal(register.reviews.length,10);assert.equal(words.length,8699);assert.equal(new Set(words.map(w=>w.id)).size,8699);
 assert.equal(hash(serialize(words)),register.afterSha256);
 assert.equal(hash(serialize(beforeCommonSensesReview(words))),register.baselineSha256);
 for(const r of register.reviews){assert.deepEqual(byId.get(r.id),r.after);
  for(const key of new Set([...Object.keys(r.before),...Object.keys(r.after)]))if(!['pos','meaning','example','exampleCn'].includes(key))assert.deepEqual(r.before[key],r.after[key],`${r.id}: ${key}`);
  assert.deepEqual(r.before,proposal.existingReviews.find(p=>p.id===r.id).current);
 }
});

test('common senses and every gloss POS are aligned, with genuine noun and adverb uses retained',()=>{
 for(const id of [4002,4058,4326,4378,4384]){assert.match(byId.get(id).pos,/v\./);assert.match(byId.get(id).pos,/n\./);}
 assert.match(byId.get(4416).pos,/modal v\./);assert.match(byId.get(4416).meaning,/金属罐/);
 for(const id of [5451,5721])assert.match(byId.get(id).pos,/v\./);
 for(const id of [5596,5709])assert.match(byId.get(id).pos,/adj\./);
 assert.match(byId.get(5709).pos,/adv\./);assert.match(byId.get(5709).meaning,/轻装/);
 for(const {after}of register.reviews){const tags=after.pos.split(' / ');for(const line of after.meaning.split('\n')){const pos=line.match(/^(modal v|adj|adv|prep|v|n)\./)?.[0];assert(pos&&tags.includes(pos),`${after.word}: ${line}`);}assert(!after.meaning.includes('\\n'));}
});

test('all ten bilingual examples are complete reviewed sentences and work in fill-blank practice',()=>{
 const prior=new Set(beforeCommonSensesReview(words).map(w=>w.example.toLowerCase()));
 assert.equal(new Set(register.reviews.map(r=>r.after.example)).size,10);
 for(const {before,after}of register.reviews){assert.notEqual(after.example,before.example);assert.notEqual(after.exampleCn,before.exampleCn);
  assert(!prior.has(after.example.toLowerCase()));assert.match(after.example,/[.!?]$/);assert.match(after.exampleCn,/[。！？]$/);assert(buildHiddenSentence(after.example,after.word));
  assert(!getCoreWordHints(after).some(h=>h.examples?.some(e=>e.en===after.example)));
 }
});

test('new hints supplement existing comparisons and word families, with exact record guards for old snapshots',()=>{
 for(const {before,after}of register.reviews){const current=getCoreWordHints(after);
  assert.deepEqual(current.at(-1),hints[after.id].hint);assert.deepEqual(JSON.parse(JSON.stringify(current.slice(0,-1))),oldHints[after.id]);assert.deepEqual(JSON.parse(JSON.stringify(getCoreWordHints(before))),oldHints[after.id]);
  assert(!getCoreWordHints({...after,id:`custom-${after.id}`}).some(h=>h.sources?.some(s=>s.id.startsWith('common-senses-'))));
  for(const e of current.at(-1).examples){assert.match(e.en,/[.!?]$/);assert.match(e.zh,/[。！？]$/);assert(getHintExampleParts(e,[after.word]).some(p=>p.highlighted));}
 }
});

test('every complete core/IELTS copy agrees; shared List membership and counts remain intact',async()=>{
 const copies=[await read('public/data/vocabulary/core.json')];
 for(const name of await readdir(new URL('public/data/vocabulary/ielts/',root)))if(name.startsWith('list-'))copies.push(await read(`public/data/vocabulary/ielts/${name}`));
 for(const entries of copies)for(const w of entries)if(hints[w.id])assert.deepEqual(w,byId.get(w.id));
 for(const list of ['24','39'])assert.deepEqual((await read(`public/data/vocabulary/ielts/list-${list}.json`)).find(w=>w.id===4326),byId.get(4326));
});

test('cold mixed core/IELTS catalog loading and deferred details return all ten corrected entries',async()=>{
 const requests=[],index=await read('src/data/vocabularyIndex.json');
 const delivery=createVocabularyDelivery({index,fetchJson:async p=>{requests.push(p);return read(`public${p}`);}});
 const summaries=await delivery.loadCatalogIds(register.reviews.map(r=>r.id));assert.equal(summaries.length,10);
 for(const w of summaries)assert.deepEqual(applyWordDetails(w,await delivery.loadDetails(w)),byId.get(w.id));
 assert(requests.some(p=>p.includes('/catalog/core-')));assert(requests.some(p=>p.includes('/catalog/ielts-')));assert(requests.some(p=>p.includes('/details/')));
});

test('existing assignment snapshots retain their exact meanings and scores; new assignments use updated meanings',async()=>{
 const saved=buildWordAssignment(register.reviews.map(r=>r.before)),snapshot=serialize(saved),answers=Object.fromEntries(saved.map(w=>[w.id,w.answer]));
 const scores=gradeWordAssignment(saved,answers),current=buildWordAssignment(register.reviews.map(r=>r.after));
 assert.deepEqual(gradeWordAssignment(JSON.parse(snapshot),answers),scores);assert.equal(serialize(saved),snapshot);
 const catalog=await read('worker/data/assignment-vocabulary.json');
 for(const r of register.reviews){assert.equal(current.find(w=>w.id===String(r.id)).meaning,r.after.meaning);assert.equal(saved.find(w=>w.id===String(r.id)).meaning,r.before.meaning);assert.equal(catalog.find(w=>w.id===r.id)?.meaning,r.after.meaning);}
});

test('all forty exact-text versioned audio mappings preserve old examples and unchanged word recordings',async()=>{
 assert(manifest.ready);assert.equal(manifest.expectedFiles,40);assert.equal(manifest.files.length,40);assert.equal(new Set(manifest.files.map(f=>f.path)).size,40);
 for(const {before,after}of register.reviews)for(const voice of manifest.voices){
  const file=manifest.files.find(f=>f.id===after.id&&f.voice===voice&&f.field==='example');assert(file);assert.equal(file.text,after.example);assert.equal(file.textSha256,hash(after.example));
  assert.equal(new URL(correctedVocabularyAudioUrl(after,'example',voice)).pathname,file.path);assert(!correctedVocabularyAudioUrl(before,'example',voice)?.includes(register.batch));
  assert.equal(correctedVocabularyAudioUrl(after,'word',voice),correctedVocabularyAudioUrl(before,'word',voice));
  let bytes;try{bytes=await readFile(new URL(`public${file.path}`,root));}catch(e){if(e.code==='ENOENT')continue;throw e;}assert.equal(hash(bytes),file.sha256);assert.equal(bytes.length,file.bytes);
 }
});

test('every new example uses the static file and falls back to its revised text on a static failure',async()=>{

 for(const file of manifest.files)for(const fails of [false,true]){
  const played=[],spoken=[];
  const service=createSpeechService({correctedAudioUrl:correctedVocabularyAudioUrl,
   storage:{getTtsProvider:()=> 'kokoro',getSpeechRate:()=>1,getKokoroSpeed:()=>1,getKokoroVoice:()=>file.voice,getSelectedVoice:()=>''},
   runtime:{Audio:class{pause(){}play(){played.push(this.src);if(fails)return Promise.reject(new Error('unavailable'));queueMicrotask(()=>this.onended?.());return Promise.resolve();}},
    SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},
    speechSynthesis:{getVoices:()=>[{name:'English',lang:'en-US'}],cancel(){},speak(u){spoken.push(u.text);queueMicrotask(()=>{u.onstart?.();u.onend?.();});}},
    fetch(){assert.fail('must not request live TTS');}}});
  await service.speakExample(byId.get(file.id));
  assert.deepEqual(played.map(url=>new URL(url).pathname),[file.path]);assert.deepEqual(spoken,fails?[file.text]:[]);
 }
});
