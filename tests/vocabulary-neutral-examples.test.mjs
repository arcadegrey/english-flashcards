import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {beforeNeutralExampleReview} from '../shared/vocabularyHistory.js';
import {getCoreWordHints} from '../src/utils/wordHints.js';
import {correctedVocabularyAudioUrl} from '../shared/vocabularyAudio.js';
import {buildHiddenSentence} from '../src/utils/assessmentRounds.js';
import {createVocabularyDelivery} from '../src/data/vocabularyDelivery.js';
import {applyWordDetails} from '../src/data/vocabularySummary.js';
import {buildWordAssignment,gradeWordAssignment} from '../shared/wordAssignments.js';
const read=async path=>JSON.parse(await readFile(new URL(`../${path}`,import.meta.url),'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex'),serialize=value=>JSON.stringify(value,null,2)+'\n';
const register=await read('data/vocabulary-neutral-examples/reviews-2026-10-31.json');
const words=await read('public/data/vocabulary.json'),byId=new Map(words.map(word=>[word.id,word]));
const decisions=await read('data/vocabulary-neutral-examples/presentation-decisions-2026-10-31.json');
const rules=await read('data/vocabulary-neutral-examples/screening-rules-2026-10-31.json');
const exceptions=await read('data/vocabulary-neutral-examples/neutral-exceptions-2026-10-31.json');

test('the neutral-example batch changes only example fields on the exact reviewed IDs; every definition and learning identity is preserved',()=>{
 assert.equal(words.length,8749);assert.equal(register.reviews.length,413);
 assert.equal(hash(serialize(words)),register.afterSha256);
 assert.equal(hash(serialize(beforeNeutralExampleReview(words))),register.baselineSha256);
 for(const review of register.reviews){
  assert.deepEqual(byId.get(review.id),review.after);
  assert(review.changedFields.every(field=>['example','exampleCn','examples'].includes(field)));
  for(const field of new Set([...Object.keys(review.before),...Object.keys(review.after)]))if(!['example','exampleCn','examples'].includes(field))assert.deepEqual(review.after[field],review.before[field],`${review.word}: ${field}`);
  if(buildHiddenSentence(review.before.example,review.before.word))assert(buildHiddenSentence(review.after.example,review.after.word),`${review.word}: fill-blank availability regressed`);
 }
 const publicly=byId.get(6459);
 assert.equal(publicly.example,'She thanked the team publicly.');assert.equal(publicly.exampleCn,'她公开感谢了团队。');
});

test('intrinsically political vocabulary uses explicit language-learning sentences, preserving the word and its definition',()=>{
 for(const id of decisions.metalinguisticDefaultIds){
  const word=byId.get(id);assert(word,id);
  assert.match(word.example,/spelling|meaning|pronounce|looked up|check/i,word.word);
  assert(word.example.includes(`'${word.word}'`),word.word);
  assert.doesNotMatch(word.exampleCn,/共产党员|政党|政府|总统|选举|战争/,word.word);
 }
 assert.equal(byId.get(4804).word,'communist');assert.match(byId.get(4804).meaning,/共产/);
});

test('the complete active word and learning-hint example corpus has no unresolved political narrative candidates',()=>{
 const topic=new RegExp(rules.pattern,'iu'),learning=new RegExp(rules.learningContextPattern,'iu');
 const allowed=new Set(exceptions.map(example=>JSON.stringify([example.en,example.zh])));
 let checked=0;
 for(const word of words){
  const examples=[{en:word.example,zh:word.exampleCn},...(word.examples||[]),...getCoreWordHints(word).flatMap(hint=>hint.examples||[])];
  for(const example of examples){
   let en=example.en,zh=example.zh;checked++;
   if(learning.test(en))for(const match of en.matchAll(/'([a-z][a-z -]*)'/giu)){en=en.replaceAll(match[0],'');zh=zh.replaceAll(match[1],'');}
   if(topic.test(`${en} ${zh}`))assert(allowed.has(JSON.stringify([example.en,example.zh])),`${word.id} ${word.word}: ${example.en}`);
   assert.doesNotMatch(example.en,/She admitted publicly to being a communist|The Communist Party was founded/i);
   assert.doesNotMatch(example.zh,/她公开承认自己是一名共产党员/);
  }
 }
 assert(checked>25000);
 // Exceptions are sentence pairs, never whole-word or substring permission.
 assert(!allowed.has(JSON.stringify(['The president praised the communist party.','一名总统称赞某政党。'])));
});

test('all 256 reviewed hint groups expose their neutral text instead of their archived example snapshots',()=>{
 assert.equal(register.hintReviews.length,256);
 for(const review of register.hintReviews){
  const word=byId.get(review.id),hints=getCoreWordHints(word);
  const result=hints.find(hint=>hint.label===review.after.label&&hint.scope===review.after.scope&&hint.text===review.after.text);
  assert(result,`${review.word}: missing reviewed hint`);
  assert.deepEqual(result.examples,review.after.examples,review.word);
  assert(result.sources.every(source=>source.url),review.word);
 }
});

test('cold public summaries, complete copies and deferred examples agree on the neutral content without rewriting private inline snapshots',async()=>{
 const index=await read('src/data/vocabularyIndex.json');
 const delivery=createVocabularyDelivery({index,fetchJson:path=>read(`public${path}`)});
 const summaries=await delivery.loadCatalogIds(register.reviews.map(review=>review.id));
 assert.equal(summaries.length,413);
 for(const summary of summaries)assert.deepEqual(applyWordDetails(summary,await delivery.loadDetails(summary)),byId.get(summary.id));
 const previous=register.reviews.find(review=>review.id===6459).before;
 assert.strictEqual(await delivery.loadDetails(previous),previous);
 const priorWords=register.reviews.slice(0,8).map(review=>review.before);
 const old=buildWordAssignment(priorWords),snapshot=serialize(old),answers=Object.fromEntries(old.map(word=>[word.id,word.answer]));
 const score=gradeWordAssignment(old,answers);buildWordAssignment(priorWords.map(word=>byId.get(word.id)));
 assert.equal(serialize(old),snapshot);assert.deepEqual(gradeWordAssignment(JSON.parse(snapshot),answers),score);
});

test('every changed sentence has its exact four-voice recording; old text selects its historical audio and word pronunciation stays unchanged',async()=>{
 const manifest=await read('public/audio-updates/2026-10-31-neutral-examples/manifest.json');
 assert.equal(manifest.ready,true);assert.equal(manifest.expectedFiles,1652);assert.equal(manifest.files.length,1652);
 assert.equal(new Set(manifest.files.map(file=>file.path)).size,1652);
 for(const file of manifest.files){
  const word=byId.get(file.id);assert(word);assert.equal(file.field,'example');assert.equal(hash(file.text),file.textSha256);
  assert([word.example,...(word.examples||[]).map(example=>example.en)].includes(file.text),word.word);
  assert.equal(new URL(correctedVocabularyAudioUrl({...word,example:file.text},'example',file.voice)).pathname,file.path);
 }
 for(const review of register.reviews)for(const voice of manifest.voices){
  assert.equal(correctedVocabularyAudioUrl(review.after,'word',voice),correctedVocabularyAudioUrl(review.before,'word',voice));
  const changed=[review.after.example,...(review.after.examples||[]).map(example=>example.en)].filter(text=>![review.before.example,...(review.before.examples||[]).map(example=>example.en)].includes(text));
  for(const text of changed)assert(manifest.files.some(file=>file.id===review.id&&file.voice===voice&&file.text===text),review.word);
  const old=correctedVocabularyAudioUrl(review.before,'example',voice);
  if(review.before.example!==review.after.example)assert(!old?.includes(register.batch),review.word);
 }
});
