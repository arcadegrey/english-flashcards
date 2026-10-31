import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeShortExampleReview, beforeCommonSensesReview } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { applyWordDetails } from '../src/data/vocabularySummary.js';
import { CORE_SYNONYM_GROUPS } from '../src/data/coreWordNotes.js';
import { createSpeechService } from '../src/utils/speechEngine.js';
const read=async path=>JSON.parse(await readFile(new URL(`../${path}`,import.meta.url),'utf8'));
const serialize=value=>JSON.stringify(value,null,2)+'\n';
const hash=value=>createHash('sha256').update(value).digest('hex');
const words=beforeCommonSensesReview(await read('public/data/vocabulary.json')),byId=new Map(words.map(w=>[w.id,w]));
const register=await read('data/vocabulary-short-example-repair/reviews-2026-10-29.json');
const audit=await read('data/vocabulary-short-example-audit/examples-2026-10-29.json');
const p2=await read('data/vocabulary-p2-repair/reviews-2026-10-29.json');
const latestRegister=await read('data/vocabulary-single-example/reviews-2026-10-31.json');
const baseline=beforeShortExampleReview(words);

test('237 reviewed short candidates and the explicitly requested smoking example retain all IDs, order, IPA, categories and unrelated records',()=>{
 const expected=new Set([...audit.examples.filter(w=>w.id!==700).map(w=>w.id),7121]);
 assert.equal(audit.examples.length,238);assert.equal(register.reviews.length,238);
 assert.deepEqual(new Set(register.reviews.map(r=>r.id)),expected);
 assert.equal(words.length,8699);assert.equal(new Set(words.map(w=>w.id)).size,8699);
 assert.equal(register.baselineSha256,p2.afterSha256);assert.equal(hash(serialize(baseline)),p2.afterSha256);
 assert.equal(hash(serialize(words)),register.afterSha256);
 for(const r of register.reviews){
  assert.deepEqual(byId.get(r.id),r.after);
  for(const field of ['id','word','phonetic','category','categories','ieltsList','ieltsLists','toeflList','level'])assert.deepEqual(r.after[field],r.before[field],`${r.word}: ${field}`);
  assert(r.changedFields.every(field=>['pos','meaning','example','exampleCn'].includes(field)));
  assert.deepEqual(r.audioFields,['example']);
 }
 assert.deepEqual(register.exclusions.map(r=>r.id),[700]);
 assert.deepEqual(byId.get(700),register.exclusions[0].before);
 assert.equal(byId.get(700).example,'The two cars collided.');
 for(const id of [6224,5978,6035,8917,82,7837,740,779,5648])assert.deepEqual(byId.get(id),baseline.find(w=>w.id===id),'valid short examples must remain intact');
});

test('238 original bilingual replacements stay distinct, punctuated and compatible with real fill-blank practice',()=>{
 const hintSentences=new Set(Object.values(CORE_SYNONYM_GROUPS).flatMap(group=>(group.examples||[]).map(example=>example.en.trim().toLowerCase())));
 const previousSentences=new Set(baseline.map(w=>w.example.toLowerCase().trim()));
 assert.equal(new Set(register.reviews.map(r=>r.after.example.toLowerCase())).size,238);
 for(const {before,after}of register.reviews){
  assert.notEqual(after.example,before.example);assert.notEqual(after.exampleCn,before.exampleCn);
  assert(!previousSentences.has(after.example.toLowerCase().trim()),after.word);
  assert(!hintSentences.has(after.example.toLowerCase().trim()),`${after.word}: repeats a hint`);
  assert.match(after.example,/[.!?]$/);assert.match(after.exampleCn,/[。！？]$/);
  assert(buildHiddenSentence(after.example,after.word),`${after.word}: target missing from fill blank`);
 }
 assert.equal(byId.get(8667).example,'Several bills are still unpaid.');
 assert.equal(byId.get(7124).example,'Please be polite to our guests.');
 assert.equal(byId.get(6331).example,'Can we stay a little longer?');
 assert.equal(byId.get(7121).example,'Smoking is not allowed in this room.');
 assert.doesNotMatch(byId.get(7124).exampleCn,/社会/);
 assert.match(register.reviews.find(r=>r.id===6331).reason,/Rare longer noun is attested/);
});

test('new default senses have matching tags and checked glosses while established additional roles remain',()=>{
 const normalize=t=>({a:'adj',vt:'v',vi:'v'}[t]||t);
 for(const r of register.reviews.filter(r=>r.changedFields.includes('pos'))){
  const defined=[...r.after.meaning.replaceAll('\\n','\n').matchAll(/(?:^|[^a-z])(adj|adv|a|vt|vi|v|n|num|prep|pron|conj|interj)\./g)].map(m=>normalize(m[1]));
  const tags=r.after.pos.match(/adj|adv|interj|num|prep|pron|conj|\bn\b|\bv\b/g)||[];
  assert(defined.every(tag=>tags.includes(tag)),r.word);
  const old=r.before.pos.match(/adj|adv|interj|num|prep|pron|conj|\bn\b|\bv\b/g)||[];
  assert(old.every(tag=>tags.includes(tag)),`${r.word}: earlier role lost`);
 }
 assert.match(byId.get(5717).meaning,/according to.*按照/);assert.match(byId.get(5717).pos,/prep/);
 assert.match(byId.get(6875).meaning,/mid-/);assert.match(byId.get(6875).pos,/pref/);
 assert.match(byId.get(6946).meaning,/adj.*支持的/);assert.doesNotMatch(byId.get(8319).meaning,/破产者/);
 assert.match(byId.get(7187).meaning,/差地.*英式非正式/);assert.match(byId.get(7761).meaning,/令人满意.*旧宗教/);
 assert.match(byId.get(6854).meaning,/性感的/);assert.doesNotMatch(byId.get(6854).meaning,/色情/);
 assert.equal(byId.get(6331).pos,'adv.');
});

test('cold core catalog and deferred details deliver all 238 current records without stale examples',async()=>{
 const index=await read('src/data/vocabularyIndex.json'),requests=[];
 const delivery=createVocabularyDelivery({index,fetchJson:async path=>{requests.push(path);return read(`public${path}`);}});
 const summaries=await delivery.loadCatalogIds(register.reviews.map(r=>r.id));
 assert.equal(summaries.length,238);
 for(const summary of summaries){
  assert.equal(summary.meaning,byId.get(summary.id).meaning);
  assert.deepEqual(applyWordDetails(summary,await delivery.loadDetails(summary)),byId.get(summary.id));
 }
 assert(requests.some(path=>path.includes('/catalog/core-')));assert(requests.some(path=>path.includes('/details/')));
 const core=await read('public/data/vocabulary/core.json');
 for(const r of register.reviews)assert.deepEqual(core.find(w=>w.id===r.id),r.after);
});

test('old assignment snapshots keep their original meanings and scores; new assignments use the corrections',()=>{
 const previous=buildWordAssignment(register.reviews.map(r=>r.before));
 const answers=Object.fromEntries(previous.map(w=>[w.id,w.answer]));
 const saved=JSON.parse(JSON.stringify(previous)),scores=gradeWordAssignment(saved,answers);
 const current=buildWordAssignment(register.reviews.map(r=>r.after));
 assert.deepEqual(gradeWordAssignment(saved,answers),scores);
 for(const r of register.reviews){
  assert.equal(saved.find(w=>w.id===String(r.id)).meaning,r.before.meaning);
  assert.equal(current.find(w=>w.id===String(r.id)).meaning,r.after.meaning);
 }
});

test('the original 238 screening cues remain historical; one false positive is excluded and smoking is an explicit extra request',()=>{
 assert.equal(audit.inputSha256,p2.afterSha256);assert.equal(audit.currentSourceSha256,latestRegister.afterSha256);
 assert.deepEqual(audit.repairStatus,{batch:register.batch,repairedCandidates:237,reviewedExclusions:1,extraUserRequests:1,openCandidates:0});
 assert.equal(audit.totals.flagged,238);assert(!audit.examples.some(w=>w.id===7121));
 assert.equal(audit.additionalUserRequests[0].before.example,'Smoking stinks.');
 for(const row of audit.examples){
  const previous=baseline.find(w=>w.id===row.id);assert.equal(row.example,previous.example);
  assert.deepEqual(row.current,byId.get(row.id));
  assert.equal(row.resolution.status,row.id===700?'reviewed_exclusion':'resolved_local_text');
 }
 const oldById=new Map(baseline.map(w=>[w.id,w]));
 for(const id of [8667,7124,6331,7121])assert.notEqual(oldById.get(id).example,byId.get(id).example);
});

test('all 952 four-voice files select exact versioned text and preserve historical and word audio',async()=>{
 const manifest=await read('public/audio-updates/2026-10-29-short-examples/manifest.json');
 assert.equal(manifest.ready,true);assert.equal(manifest.expectedFiles,952);assert.equal(manifest.files.length,952);
 assert.equal(new Set(manifest.files.map(f=>f.path)).size,952);
 for(const r of register.reviews)for(const voice of manifest.voices){
  const file=manifest.files.find(f=>f.id===r.id&&f.voice===voice&&f.field==='example');assert(file);
  assert.equal(file.text,r.after.example);assert.equal(file.textSha256,hash(file.text));
  assert.equal(new URL(correctedVocabularyAudioUrl(r.after,'example',voice)).pathname,file.path);
  assert(!correctedVocabularyAudioUrl(r.before,'example',voice)?.includes(register.batch));
  assert.equal(correctedVocabularyAudioUrl(r.after,'word',voice),correctedVocabularyAudioUrl(r.before,'word',voice));
  let bytes;try{bytes=await readFile(new URL(`../public${file.path}`,import.meta.url));}catch(e){if(e.code==='ENOENT')continue;throw e;}
  assert.equal(bytes.length,file.bytes);assert.equal(hash(bytes),file.sha256);
 }
 assert(!manifest.files.some(f=>f.id===700));
 for(const file of manifest.files.filter(f=>f.id===6331))assert.match(file.phonemes,/ŋɡ/,'comparative longer example needs its /g/');
});

test('every new example uses the static file and falls back to its revised text on a static failure',async()=>{
 const manifest=await read('public/audio-updates/2026-10-29-short-examples/manifest.json');
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
