import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { beforeTeachingP2Review, beforeShortExampleReview } from '../shared/vocabularyHistory.js';
import { correctedVocabularyAudioUrl } from '../shared/vocabularyAudio.js';
import { TEACHING_P2_VOCABULARY_AUDIO } from '../shared/teachingP2VocabularyAudio.js';
import { buildHiddenSentence } from '../src/utils/assessmentRounds.js';
import { buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { createVocabularyDelivery } from '../src/data/vocabularyDelivery.js';
import { applyWordDetails } from '../src/data/vocabularySummary.js';
import { createSpeechService } from '../src/utils/speechEngine.js';

const read = async path => JSON.parse(await readFile(new URL(`../${path}`,import.meta.url),'utf8'));
const currentVocabulary = await read('public/data/vocabulary.json');
const vocabulary = beforeShortExampleReview(currentVocabulary);
const register = await read('data/vocabulary-p2-repair/reviews-2026-10-29.json');
const patches = await read('data/vocabulary-p2-repair/patches-2026-10-29.json');
const p1 = await read('data/vocabulary-p1-repair/reviews-2026-10-29.json');
const audit = await read('docs/vocabulary-teaching-quality-audit-2026-10-29.json');
const byId = new Map(vocabulary.map(word=>[word.id,word]));
const hash = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value,null,2)+'\n';

test('the exact remaining 176 P2 items on 174 IDs retain identity, order, IPA, categories and unrelated records',()=>{
  const closedByP1 = new Set(p1.reviews.flatMap(review=>review.alsoResolvedIssueIds));
  const targets = audit.issues.filter(issue=>issue.priority==='P2'&&!closedByP1.has(issue.issueId));
  assert.equal(targets.length,176);assert.equal(register.reviews.length,174);
  assert.deepEqual(new Set(register.reviews.map(review=>review.id)),new Set(targets.map(issue=>issue.id)));
  assert.deepEqual(new Set(register.reviews.flatMap(review=>review.issueIds)),new Set(targets.map(issue=>issue.issueId)));
  assert.equal(vocabulary.length,8699);assert.equal(new Set(vocabulary.map(word=>word.id)).size,8699);
  assert.equal(hash(serialize(beforeTeachingP2Review(vocabulary))),p1.afterSha256);
  assert.equal(register.baselineSha256,p1.afterSha256);assert.equal(hash(serialize(vocabulary)),register.afterSha256);
  for(const review of register.reviews){
    assert.deepEqual(byId.get(review.id),review.after);
    for(const key of ['id','word','phonetic','category','categories','level','list','ieltsList','ieltsLists'])assert.deepEqual(review.after[key],review.before[key],`${review.id}: ${key}`);
    assert(review.changedFields.every(field=>['pos','meaning','example','exampleCn'].includes(field)));
    assert.deepEqual(review.audioFields,['example']);
  }
});

test('all approved examples and translations change together and remain usable in fill-blank practice',()=>{
  assert.equal(new Set(register.reviews.map(review=>review.after.example.toLowerCase())).size,174);
  for(const {id,before,after} of register.reviews){
    const patch=patches.find(patch=>patch.id===id);
    assert.equal(after.example,patch.example);assert.equal(after.exampleCn,patch.exampleCn);
    assert.notEqual(after.example,before.example);assert.notEqual(after.exampleCn,before.exampleCn);
    assert(/[.!?]$/.test(after.example));assert.match(after.exampleCn,/[\u4e00-\u9fff]/);
    assert(buildHiddenSentence(after.example,after.word),`${after.word}: missing target or unsupported phrase form`);
  }
  assert.equal(byId.get(6602).example,'He visited a doctor for gastric pain.');
  assert.equal(byId.get(5943).example,'The train leaves at nine.');
  assert.equal(byId.get(6158).example,'The kid is playing in the garden.');
  assert.equal(byId.get(7035).example,'He paused to don his coat.');
  assert.equal(byId.get(8387).example,'That stereotype about older people is unfair.');
  assert.equal(byId.get(8663).example,'Please explain the literal meaning of this word.');
});

test('teaching tags and checked senses align without discarding verified secondary meanings',()=>{
  const normalize=tag=>({a:'adj',vt:'v',vi:'v',int:'interj'}[tag]||tag);
  for(const {after} of register.reviews){
    const defined=[...after.meaning.replaceAll('\\n','\n').matchAll(/(?:^|[^a-z])(adj|adv|a|vt|vi|v|n|num|prep|pron|conj|interj)\./g)].map(match=>normalize(match[1]));
    const tags=after.pos.match(/adj|adv|interj|num|prep|pron|conj|\bn\b|\bv\b/g)||[];
    for(const tag of defined)assert(tags.includes(tag),`${after.word}: ${tag}`);
  }
  assert.match(byId.get(4129).meaning,/电影/);
  assert.match(byId.get(8387).meaning,/刻板印象.*铅版/);assert.doesNotMatch(byId.get(8387).meaning,/盲文/);
  assert.match(byId.get(8663).meaning,/字面.*文字差错.*字面量/);
  assert.match(byId.get(8488).meaning,/受益人.*教会.*受俸/);
  assert.match(byId.get(6750).meaning,/吓人的.*容易受惊/);
  assert.match(byId.get(6833).meaning,/咨询.*预警/);
  assert.match(byId.get(6382).meaning,/奥林匹克运动会/);
  assert.match(byId.get(6742).meaning,/监管的/);
  assert.match(byId.get(6611).pos,/adv\./);
  for(const review of p1.reviews.filter(review=>register.reviews.some(p2=>p2.id===review.id))){
    const earlierRoles=review.after.pos.match(/adj|adv|interj|num|prep|pron|conj|\bn\b|\bv\b/g)||[];
    const nowRoles=byId.get(review.id).pos.match(/adj|adv|interj|num|prep|pron|conj|\bn\b|\bv\b/g)||[];
    for(const role of earlierRoles)assert(nowRoles.includes(role),`${review.word}: P1 role lost`);
  }
});

test('cold core and IELTS List 19 summaries hydrate the revised complete example through real delivery indexes',async()=>{
  const index=await read('src/data/vocabularyIndex.json'),requests=[];
  const fetchJson=async path=>{requests.push(path);return read(`public${path}`);};
  const delivery=createVocabularyDelivery({fetchJson,index});
  const summaries=await delivery.loadCatalogIds([4129,6602]);
  for(const id of [4129,6602]){
    const summary=summaries.find(word=>word.id===id);
    assert.equal(summary.meaning,byId.get(id).meaning);
    const details=await delivery.loadDetails(summary);
    assert.deepEqual(applyWordDetails(summary,details),byId.get(id));
  }
  assert(requests.some(path=>path.includes('ielts-list-19')));
  const list=await read('public/data/vocabulary/ielts/list-19.json');
  assert.deepEqual(list.find(word=>word.id===4129),byId.get(4129));
});

test('historical word-assignment snapshots keep their labels and scores while new assignments use current meanings',()=>{
  const old=buildWordAssignment(register.reviews.map(review=>review.before));
  const answers=Object.fromEntries(old.map(word=>[word.id,word.answer]));
  assert.deepEqual(gradeWordAssignment(JSON.parse(JSON.stringify(old)),answers),gradeWordAssignment(old,answers));
  const next=buildWordAssignment(register.reviews.map(review=>review.after));
  for(const review of register.reviews){
    assert.equal(old.find(word=>word.id===String(review.id)).meaning,review.before.meaning);
    assert.equal(next.find(word=>word.id===String(review.id)).meaning,review.after.meaning);
  }
});

test('P1 and P2 issue resolutions are complete while original screening evidence remains a historical snapshot',()=>{
  assert.equal(audit.summary.locallyResolvedItems,303);assert.equal(audit.summary.openP1Items,0);assert.equal(audit.summary.openP2Items,0);
  assert.equal(audit.currentSourceSha256,hash(serialize(currentVocabulary)));
  for(const review of register.reviews)for(const issueId of review.issueIds){
    const issue=audit.issues.find(issue=>issue.issueId===issueId);
    assert.equal(issue.resolution.batch,'2026-10-29-p2');assert.equal(issue.resolution.status,'resolved_local_text');
    assert.deepEqual(issue.current,currentVocabulary.find(word=>word.id===review.id));assert(issue.auditSnapshot);
  }
  assert.equal(audit.summary.screeningHitRecords,1900,'historical candidates are not silently re-certified');
});

test('696 four-voice examples have exact text/version guards and available local hashes; old examples and word recordings stay separate',async()=>{
  const manifest=await read('public/audio-updates/2026-10-29-p2/manifest.json');
  assert.equal(manifest.ready,true);assert.equal(manifest.expectedFiles,696);assert.equal(manifest.files.length,696);
  assert.equal(new Set(manifest.files.map(file=>file.path)).size,696);
  assert.equal(Object.keys(TEACHING_P2_VOCABULARY_AUDIO).length,174);
  for(const file of manifest.files){
    assert.equal(file.field,'example');assert.equal(file.text,byId.get(file.id).example);assert.equal(file.textSha256,hash(file.text));
    assert.equal(new URL(correctedVocabularyAudioUrl(byId.get(file.id),'example',file.voice)).pathname,file.path);
    assert(file.bytes>1000&&file.seconds>0.1&&file.seconds<15);
    let bytes;try{bytes=await readFile(new URL(`../public${file.path}`,import.meta.url));}
    catch(error){if(error.code==='ENOENT')continue;throw error;}
    assert.equal(bytes.length,file.bytes);assert.equal(hash(bytes),file.sha256);
  }
  for(const {before,after} of register.reviews)for(const voice of manifest.voices){
    assert(!correctedVocabularyAudioUrl(before,'example',voice)?.includes('2026-10-29-p2'));
    assert.equal(correctedVocabularyAudioUrl(before,'word',voice),correctedVocabularyAudioUrl(after,'word',voice));
  }
});

test('the speech service selects every new example and falls back to the revised text when the static file fails',async()=>{
  const manifest=await read('public/audio-updates/2026-10-29-p2/manifest.json');
  for(const file of manifest.files)for(const fails of [false,true]){
    const played=[],spoken=[];
    const service=createSpeechService({correctedAudioUrl:correctedVocabularyAudioUrl,
      storage:{getTtsProvider:()=> 'kokoro',getSpeechRate:()=>1,getKokoroSpeed:()=>1,getKokoroVoice:()=>file.voice,getSelectedVoice:()=>''},
      runtime:{Audio:class{pause(){}play(){played.push(this.src);if(fails)return Promise.reject(new Error('unavailable'));queueMicrotask(()=>this.onended?.());return Promise.resolve();}},
        SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},
        speechSynthesis:{getVoices:()=>[{name:'English',lang:'en-US'}],cancel(){},speak(utterance){spoken.push(utterance.text);queueMicrotask(()=>{utterance.onstart?.();utterance.onend?.();});}},
        fetch(){assert.fail('must not use live TTS');}}});
    await service.speakExample(byId.get(file.id));
    assert.deepEqual(played.map(url=>new URL(url).pathname),[file.path]);assert.deepEqual(spoken,fails?[file.text]:[]);
  }
});
