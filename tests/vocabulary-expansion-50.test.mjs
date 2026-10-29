import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {beforeExpansion50Review} from '../shared/vocabularyHistory.js';
import {RETIRED_VOCABULARY,activeProgressIds} from '../shared/retiredVocabulary.js';
import {getCoreWordHints,getHintExampleParts} from '../src/utils/wordHints.js';
import {createVocabularyDelivery} from '../src/data/vocabularyDelivery.js';
import {applyWordDetails} from '../src/data/vocabularySummary.js';
import {buildHiddenSentence} from '../src/utils/assessmentRounds.js';
import {buildWordAssignment,gradeWordAssignment,selectAssignmentWords} from '../shared/wordAssignments.js';
import {correctedVocabularyAudioUrl} from '../shared/vocabularyAudio.js';
import {createSpeechService} from '../src/utils/speechEngine.js';
import {getPlanWordStats} from '../src/utils/studyPlan.js';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex'),serialize=v=>JSON.stringify(v,null,2)+'\n';
const words=await read('public/data/vocabulary.json'),entries=await read('data/vocabulary-expansion-50/entries-2026-10-29.json');
const register=await read('data/vocabulary-expansion-50/register-2026-10-29.json'),base=beforeExpansion50Review(words);
const proposal=await read('data/vocabulary-coverage-2026-10-29/first-batch-proposal.json');

test('exactly the authorized fifty candidates receive unused monotonic IDs without modifying one earlier record',()=>{
 assert.equal(words.length,8749);assert.equal(base.length,8699);assert.equal(new Set(words.map(w=>w.id)).size,8749);
 assert.equal(hash(serialize(base)),register.baselineSha256);assert.equal(hash(serialize(words)),register.afterSha256);
 assert.deepEqual(words.slice(0,base.length),base);assert.deepEqual(words.slice(-50),entries);
 assert.deepEqual(entries.map(w=>w.id),Array.from({length:50},(_,i)=>9027+i));
 assert.deepEqual(entries.map(w=>w.word.toLowerCase()),proposal.newCandidates.map(p=>p.candidate));
 const previous=new Set([...base,...RETIRED_VOCABULARY].map(w=>w.id));
 for(const w of entries){assert(!previous.has(w.id));assert.equal(w.category,'daily');assert.deepEqual(w.categories,['daily']);assert(!base.some(p=>p.word.toLowerCase()===w.word.toLowerCase()));}
});

test('each new unit has a checked source, a UK editorial IPA reading, complete unique bilingual sentences and two original teaching examples',()=>{
 const allOldExamples=new Set(base.map(w=>w.example.toLowerCase()));
 const allNewExamples=[];
 for(const w of entries){const source=register.sources.find(s=>s.word===w.word);assert(source?.url.startsWith('https://'));assert.equal(source.checkedAt,'2026-10-29');assert(source.proposalRefs.length);assert(source.pronunciationMethod.includes('Editor-transcribed'));
  assert(w.pos&&w.meaning&&w.phonetic);assert.doesNotMatch(w.meaning,/参考译文|暂无|这个例句/);
  assert.match(w.example,/[.!?]$/);assert.match(w.exampleCn,/[。！？]$/);assert(!allOldExamples.has(w.example.toLowerCase()));
  assert(buildHiddenSentence(w.example,w.word),w.word);
  const hints=getCoreWordHints(w);assert.equal(hints.length,1,w.word);assert.equal(hints[0].examples.length,2);assert(hints[0].sources.every(s=>s.url));
  allNewExamples.push(w.example);
  for(const e of hints[0].examples){assert.match(e.en,/[.!?]$/);assert.match(e.zh,/[。！？]$/);assert.notEqual(e.en,w.example);assert(getHintExampleParts(e,[w.word.toLowerCase()]).some(p=>p.highlighted),`${w.word}: ${e.en}`);allNewExamples.push(e.en);}
 }
 assert.equal(new Set(allNewExamples).size,150);
 const byWord=new Map(entries.map(w=>[w.word,w]));assert.match(getCoreWordHints(byWord.get('get lost'))[0].text,/不礼貌/);assert.match(getCoreWordHints(byWord.get('discriminate'))[0].text,/between.*against/);
});

test('core startup, cold ID loads, full study and deferred details all include the fifty additions with complete totals',async()=>{
 const index=await read('src/data/vocabularyIndex.json'),startup=await read('src/data/vocabularyStartup.json'),categories=await read('src/data/vocabularyCategoryIndex.json');
 for(const scope of ['toefl','ielts']){const m=await read(`public/data/vocabulary/${scope}/manifest.json`);assert.equal(m.sourceTotal,8749);assert.equal(m.core.count,3545);}
 assert.equal(index.total,8749);assert.equal(startup.total,8749);assert.equal(index.counts.daily,2097);assert.equal(categories.daily.count,2097);
 const requests=[],delivery=createVocabularyDelivery({index,fetchJson:async p=>{requests.push(p);return read('public'+p);}});
 const summaries=await delivery.loadCatalogIds(entries.map(w=>w.id));assert.equal(summaries.length,50);
 for(const w of summaries)assert.deepEqual(applyWordDetails(w,await delivery.loadDetails(w)),entries.find(e=>e.id===w.id));
 assert(requests.some(p=>p.includes('/catalog/core-')));assert(!requests.some(p=>p.includes('/ielts/')||p.includes('/toefl/')));
 const full=await delivery.loadFullCatalog();assert.equal(full.length,8749);
 const core=await read('public/data/vocabulary/core.json');assert.equal(core.length,3545);assert.equal(hash(serialize(core)),register.coreAfterSha256);
});

test('existing personal IDs remain associated with the same words; additions start as remaining new vocabulary',()=>{
 const saved={learned:[4416,6508,9026],mastered:[4416],wrong:[6508],progress:{4416:{stage:2,lastReviewed:'2026-10-28'}}},copy=serialize(saved);
 assert.deepEqual(activeProgressIds(saved.learned),saved.learned);
 for(const id of saved.learned)assert.deepEqual(words.find(w=>w.id===id),base.find(w=>w.id===id));
 assert.equal(getPlanWordStats(entries,{},[],[]).remaining,50);
 assert.equal(serialize(saved),copy);
});

test('new teacher assignments can select all new IDs, while old published snapshots retain original answers and scores',async()=>{
 const catalog=await read('worker/data/assignment-vocabulary.json');assert.equal(catalog.length,8749);
 const selected=selectAssignmentWords(catalog,{category:'daily',wordIds:entries.map(w=>w.id)});assert.equal(selected.length,50);
 const current=buildWordAssignment(selected);assert.equal(current.length,50);
 const old=buildWordAssignment(base.slice(0,10)),serialized=serialize(old),answers=Object.fromEntries(old.map(w=>[w.id,w.answer]));
 const scores=gradeWordAssignment(old,answers);assert.equal(scores.questionsCorrect,10);assert.deepEqual(gradeWordAssignment(JSON.parse(serialized),answers),scores);assert.equal(serialize(old),serialized);
 for(const w of entries)assert.equal(catalog.find(p=>p.id===w.id).meaning,w.meaning);
});

test('four-voice word/example matrix uses immutable exact-text URLs; older or edited snapshots cannot claim the new recordings',async()=>{
 const manifest=await read('public/audio-updates/2026-10-29-expansion-50/manifest.json');assert(manifest.ready);assert.equal(manifest.expectedFiles,400);assert.equal(manifest.files.length,400);assert.equal(new Set(manifest.files.map(f=>f.path)).size,400);
 for(const w of entries)for(const voice of manifest.voices)for(const field of ['word','example']){
  const f=manifest.files.find(f=>f.id===w.id&&f.voice===voice&&f.field===field);assert(f);assert.equal(f.text,w[field]);assert.equal(f.textSha256,hash(w[field]));assert.equal(new URL(correctedVocabularyAudioUrl(w,field,voice)).pathname,f.path);
  assert.equal(correctedVocabularyAudioUrl({...w,[field]:w[field]+' changed'},field,voice),null);
  const bytes=await readFile(new URL('../public'+f.path,import.meta.url)).catch(e=>{if(e.code==='ENOENT')return null;throw e;});if(bytes){assert.equal(bytes.length,f.bytes);assert.equal(hash(bytes),f.sha256);}
 }
});

test('new word and example speech falls back to the exact current text when static audio fails',async()=>{
 const manifest=await read('public/audio-updates/2026-10-29-expansion-50/manifest.json');
 for(const f of manifest.files){const played=[],spoken=[];
  const service=createSpeechService({correctedAudioUrl:correctedVocabularyAudioUrl,storage:{getTtsProvider:()=> 'kokoro',getSpeechRate:()=>1,getKokoroSpeed:()=>1,getKokoroVoice:()=>f.voice,getSelectedVoice:()=>''},runtime:{Audio:class{pause(){}play(){played.push(this.src);return Promise.reject(Error('offline'));}},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{name:'English',lang:'en-US'}],cancel(){},speak(u){spoken.push(u.text);queueMicrotask(()=>{u.onstart?.();u.onend?.();});}},fetch(){assert.fail('No live TTS');}}});
  const w=entries.find(w=>w.id===f.id);await service[f.field==='word'?'speakWord':'speakExample'](w);assert.deepEqual(played.map(u=>new URL(u).pathname),[f.path]);assert.deepEqual(spoken,[f.text]);
 }
});
