import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createClassroomFixture } from './helpers/classroom-db.mjs';
import readings from '../src/data/readings.js';
import catalog from '../worker/data/assignment-vocabulary.json' with {type:'json'};
import { getWordCategories } from '../src/utils/wordCategories.js';
import { selectAssignmentWords, buildWordAssignment, gradeWordAssignment } from '../shared/wordAssignments.js';
import { createReadingAttempt, wrongReadingQuestions, collectReadingMistakes } from '../shared/readingAttempts.js';
import { readReadingAttempts, writeReadingAttempts } from '../src/utils/readingAttempts.js';
import { normalizeReadingQuestions } from '../shared/readingQuestions.js';

const setup=async()=>{
  const f=await createClassroomFixture();
  for(const [id,role] of [[1,'teacher'],[2,'student'],[3,'teacher'],[4,'student']])await f.addUser(id,role);
  const classroom=(await f.api(1,'/classes','POST',{name:'P1 测试班'})).body.classroom;
  await f.api(2,'/classes/join','POST',{inviteCode:classroom.inviteCode});
  return {...f,classroom};
};
const deadline=()=>new Date(Date.now()+86400000).toISOString();
const reading=readings.find(article=>article.id===19);
const answersFor=article=>Object.fromEntries(normalizeReadingQuestions(article.questions).map(q=>[q.id,q.answer]));
const publishWords=async f=>{
  const response=await f.api(1,`/classes/${f.classroom.id}/word-assignments`,'POST',{category:'daily',start:2,count:5,dueAt:deadline()});
  assert.equal(response.status,201,JSON.stringify(response.body));
  return response.body.assignment;
};

test('word ranges share the full library category membership and freeze deterministic question snapshots',async()=>{
  const words=JSON.parse(await readFile(new URL('../public/data/vocabulary.json',import.meta.url),'utf8'));
  assert.deepEqual(catalog,words.map(word=>({id:word.id,word:word.word,meaning:word.meaning,categories:getWordCategories(word)})));
  for(const category of ['all','daily','cet4','cet6','toefl','ielts']){
    const selected=selectAssignmentWords(catalog,{category,start:2,count:5});
    assert.equal(selected.length,5);
    assert(selected.every(word=>category==='all'||word.categories.includes(category)));
    const questions=buildWordAssignment(selected);
    assert.equal(gradeWordAssignment(questions,Object.fromEntries(questions.map(word=>[word.id,word.answer]))).questionsCorrect,5);
  }
  for(const scope of [{category:'invalid',start:1,count:5},{category:'daily',start:0,count:5},{category:'daily',start:1.5,count:5},{category:'daily',start:1,count:51},{category:'daily',start:99999,count:5}])assert.throws(()=>selectAssignmentWords(catalog,scope));
});

test('word assignment API enforces owner, membership, account headers, and validated ranges',async()=>{
 const f=await setup();try{
  const path=`/classes/${f.classroom.id}/word-assignments`,body={category:'daily',start:1,count:5,dueAt:deadline()};
  assert.equal((await f.api(null,path)).status,401);
  assert.equal((await f.api(2,path,'POST',body)).status,403);
  assert.equal((await f.api(3,path,'POST',body)).status,404);
  assert.equal((await f.api(1,path,'POST',{...body,start:99999})).status,400);
  assert.equal((await f.api(1,path,'POST',{...body,dueAt:'2000-01-01'})).status,400);
  assert.equal((await f.api(1,path,'POST',body,{'sec-fetch-site':'cross-site'})).status,403);
  assert.equal((await f.api(1,path,'POST',body,{'content-type':'text/plain'})).status,415);
  const task=await publishWords(f);
  const tasks=(await f.api(2,'/word-assignments')).body.assignments;
  assert.equal(tasks.length,1);assert.equal(tasks[0].words.length,5);assert.equal(tasks[0].words[0].answer,undefined);
  assert.equal((await f.api(4,'/word-assignments')).body.assignments.length,0);
  assert.equal((await f.api(2,'/word-assignments','GET',undefined,{'x-flashcards-user':'4'})).status,409);
  assert.equal((await f.api(3,`/word-assignments/${task.id}/submissions`)).status,404);
 }finally{f.sqlite.close();}
});

test('word drafts restore across requests, reject stale writes, and revoke access after removal',async()=>{
 const f=await setup();try{
  const task=await publishWords(f),path=`/word-assignments/${task.id}/session`;
  const word=(await f.api(2,'/word-assignments')).body.assignments[0].words[0];
  const now=new Date().toISOString();
  assert.equal((await f.api(2,path)).body.session,null);
  await f.api(2,path,'PUT',{answers:{[word.id]:'B',unknown:'D'},updatedAt:now});
  await f.api(2,path,'PUT',{answers:{[word.id]:'C'},updatedAt:'2000-01-01'});
  assert.deepEqual((await f.api(2,path)).body.session.answers,{[word.id]:'B'});
  assert.equal((await f.api(4,path)).status,404);
  assert.equal((await f.api(1,path)).status,403);
  assert.equal((await f.api(2,path,'PUT',{answers:{},updatedAt:'bad'})).status,400);
  await f.api(1,`/classes/${f.classroom.id}/students/2`,'DELETE');
  assert.equal((await f.api(2,path)).status,404);
 }finally{f.sqlite.close();}
});

test('word grades are server computed, immutable across retries, and include current pending/late students',async()=>{
 const f=await setup();try{
  await f.api(4,'/classes/join','POST',{inviteCode:f.classroom.inviteCode});
  const task=await publishWords(f),path=`/word-assignments/${task.id}/submit`;
  const frozen=JSON.parse(f.sqlite.prepare('SELECT words_json FROM word_assignments WHERE id=?').get(task.id).words_json);
  const answers=Object.fromEntries(frozen.map(word=>[word.id,word.answer]));
  assert.equal((await f.api(2,path,'POST',{answers:{}})).status,400);
  f.sqlite.prepare('UPDATE word_assignments SET due_at=? WHERE id=?').run('2000-01-01T00:00:00.000Z',task.id);
  answers[frozen[0].id]=frozen[0].answer==='A'?'B':'A';
  const submitted=await f.api(2,path,'POST',{answers,questionsCorrect:999});
  assert.equal(submitted.body.assignment.questionsCorrect,4);assert.equal(submitted.body.assignment.status,'submitted_late');
  const retry=await f.api(2,path,'POST',{answers:Object.fromEntries(frozen.map(word=>[word.id,word.answer]))});
  assert.equal(retry.body.assignment.questionsCorrect,4);assert.equal(retry.body.assignment.submittedAt,submitted.body.assignment.submittedAt);
  const detail=(await f.api(1,`/word-assignments/${task.id}/submissions`)).body;
  assert.equal(detail.students.length,2);assert.equal(detail.students.find(s=>s.id==='4').status,'overdue');
  const list=(await f.api(1,`/classes/${f.classroom.id}/word-assignments`)).body.assignments[0];
  assert.equal(list.studentCount,2);assert.equal(list.submittedCount,1);
  await f.api(2,`/classes/${f.classroom.id}/membership`,'DELETE');
  assert.equal((await f.api(2,path,'POST',{answers})).status,404);
  assert.equal((await f.api(1,`/word-assignments/${task.id}/submissions`)).body.students.length,1);
 }finally{f.sqlite.close();}
});

test('reading attempts keep immutable per-question snapshots and server scores isolated by account',async()=>{
 const f=await setup();const old=reading.questions[0].answer;try{
  const answers=answersFor(reading);answers[reading.questions[0].id]='A';
  const body={id:'attempt-one',articleId:reading.id,answers,completedAt:new Date().toISOString()};
  const first=await f.api(2,'/reading-attempts','POST',{...body,questionsCorrect:999});
  assert.equal(first.status,201,JSON.stringify(first.body));assert.equal(first.body.attempt.questionsCorrect,2);
  assert(first.body.attempt.article.questions[0].explanation);
  reading.questions[0].answer='A';
  const retry=await f.api(2,'/reading-attempts','POST',{...body,answers:answersFor(reading)});
  assert.deepEqual(retry.body.attempt,first.body.attempt);
  assert.equal((await f.api(4,'/reading-attempts')).body.attempts.length,0);
  assert.equal((await f.api(null,'/reading-attempts')).status,401);
  assert.equal((await f.api(2,'/reading-attempts','GET',undefined,{'x-flashcards-user':'4'})).status,409);
 }finally{reading.questions[0].answer=old;f.sqlite.close();}
});

test('wrong-only retry uses the saved original snapshot, persists its own result and leaves the original unchanged',async()=>{
 const f=await setup();try{
  const answers=answersFor(reading);answers[reading.questions[0].id]='A';
  const parent=(await f.api(2,'/reading-attempts','POST',{id:'parent',articleId:reading.id,answers,completedAt:new Date().toISOString()})).body.attempt;
  const retryAnswers={[reading.questions[0].id]:reading.questions[0].answer};
  const retry=(await f.api(2,'/reading-attempts','POST',{id:'retry',parentId:'parent',answers:retryAnswers,completedAt:new Date(Date.now()+1).toISOString()}));
  assert.equal(retry.status,201,JSON.stringify(retry.body));assert.equal(retry.body.attempt.article.questions.length,1);assert.equal(retry.body.attempt.questionsCorrect,1);
  const list=(await f.api(2,'/reading-attempts')).body.attempts;
  assert.equal(list.find(item=>item.id==='parent').questionsCorrect,2);
  assert.equal(collectReadingMistakes(list).length,0);
  assert.equal((await f.api(4,'/reading-attempts','POST',{id:'stolen-retry',parentId:'parent',answers:retryAnswers,completedAt:new Date().toISOString()})).status,409);
  const draft='/reading-sessions/retry%3Aparent';
  assert.equal((await f.api(2,draft,'PUT',{answers:retryAnswers,updatedAt:new Date().toISOString()})).status,200);
  assert.deepEqual((await f.api(2,draft)).body.session.answers,retryAnswers);
  assert.equal((await f.api(4,draft)).status,409);
  assert.equal(wrongReadingQuestions(parent).length,1);
 }finally{f.sqlite.close();}
});

test('reading attempts reject incomplete, invalid, future and cross-site writes',async()=>{
 const f=await setup();try{
  const body={id:'bad',articleId:reading.id,answers:answersFor(reading),completedAt:new Date().toISOString()};
  assert.equal((await f.api(2,'/reading-attempts','POST',{...body,answers:{}})).status,400);
  assert.equal((await f.api(2,'/reading-attempts','POST',{...body,articleId:99999})).status,400);
  assert.equal((await f.api(2,'/reading-attempts','POST',{...body,completedAt:'3000-01-01'})).status,400);
  assert.equal((await f.api(2,'/reading-attempts','POST',body,{'sec-fetch-site':'cross-site'})).status,403);
  assert.equal((await f.api(2,'/reading-attempts','POST',body,{'content-type':'text/plain'})).status,415);
 }finally{f.sqlite.close();}
});

test('reading history local cache restores per account and preserves old aggregate-only progress',()=>{
 const old=globalThis.localStorage;const values=new Map();
 globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 try{
  const attempt=createReadingAttempt({id:'local',article:reading,answers:answersFor(reading),completedAt:new Date().toISOString()});
  writeReadingAttempts('2',{attempts:[attempt],pending:['local']});
  assert.equal(readReadingAttempts('2').attempts[0].id,'local');
  assert.equal(readReadingAttempts('4').attempts.length,0);assert.equal(readReadingAttempts(null).attempts.length,0);
  assert.deepEqual(readReadingAttempts('2').pending,['local']);
 }finally{globalThis.localStorage=old;}
});

test('new foundation content and B1 questions have valid unique IDs, complete explanations and exactly one answer',()=>{
 assert.equal(new Set(readings.map(article=>article.id)).size,readings.length);
 for(const level of ['A1','A2','B1']){
  const articles=readings.filter(article=>article.level===level);assert(articles.length>=4);
  for(const article of articles){
   assert(article.translation && article.content.split(/\s+/).length>=65);
   const questions=normalizeReadingQuestions(article.questions);assert(questions.length>=3);
   assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
   for(const question of questions){assert(question.explanation);assert.equal(question.options.filter(o=>o.id===question.answer).length,1);assert.equal(new Set(question.options.map(o=>o.label)).size,4);}
  }
 }
});

test('offline personal attempts preserve their content revision when the source changes before sync',async()=>{
 const f=await setup();const old=reading.content;try{
  const snapshot=JSON.parse(JSON.stringify(reading));
  const answers=answersFor(snapshot);
  reading.content='Updated after the offline attempt';
  const result=await f.api(2,'/reading-attempts','POST',{id:'offline-version',articleId:reading.id,article:snapshot,answers,completedAt:new Date().toISOString()});
  assert.equal(result.status,201,JSON.stringify(result.body));assert.equal(result.body.attempt.article.content,old);
  assert.equal(result.body.attempt.questionsCorrect,3);
  const wrongId=await f.api(2,'/reading-attempts','POST',{id:'bad-snapshot',articleId:reading.id,article:{...snapshot,id:999},answers,completedAt:new Date().toISOString()});
  assert.equal(wrongId.status,400);
 }finally{reading.content=old;f.sqlite.close();}
});

test('assignment review ignores supplied snapshots and answers and retains the actual first server submission',async()=>{
 const f=await setup();try{
  const published=await f.api(1,`/classes/${f.classroom.id}/assignments`,'POST',{articleId:19,dueAt:deadline()});
  const assignmentId=published.body.assignment.id;
  const answers=answersFor(reading);answers[reading.questions[0].id]='A';
  const payload={id:'assignment-review',assignmentId,articleId:reading.id,article:{...reading,content:'forged'},answers:answersFor(reading),completedAt:new Date().toISOString()};
  assert.equal((await f.api(2,'/reading-attempts','POST',payload)).status,404);
  await f.api(2,`/assignments/${assignmentId}/submit`,'POST',{answers});
  const result=await f.api(2,'/reading-attempts','POST',payload);
  assert.equal(result.status,201,JSON.stringify(result.body));assert.equal(result.body.attempt.questionsCorrect,2);assert.equal(result.body.attempt.article.content,reading.content);
  assert.equal((await f.api(4,'/reading-attempts','POST',{...payload,id:'steal-assignment'})).status,404);
 }finally{f.sqlite.close();}
});

test('new-device history cannot evict older unsynced local attempts from the bounded cache',async()=>{
 const {boundReadingAttemptCache}=await import('../shared/readingAttempts.js');
 const old=createReadingAttempt({id:'unsynced-old',article:reading,answers:answersFor(reading),completedAt:'2026-01-01T00:00:00.000Z'});
 const newer=Array.from({length:100},(_,i)=>({...old,id:`cloud-${i}`,completedAt:new Date(Date.UTC(2026,9,1,0,i)).toISOString()}));
 const cache=boundReadingAttemptCache([old,...newer],['unsynced-old','unsynced-old']);
 assert.equal(cache.attempts.length,100);assert(cache.attempts.some(item=>item.id==='unsynced-old'));assert.deepEqual(cache.pending,['unsynced-old']);
});
