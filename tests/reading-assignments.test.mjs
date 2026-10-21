import assert from 'node:assert/strict'
import test from 'node:test'
import { createClassroomFixture } from './helpers/classroom-db.mjs'

const setup = async () => {
  const f = await createClassroomFixture()
  for (const [id, role] of [[1,'teacher'],[2,'student'],[3,'teacher'],[4,'student']]) await f.addUser(id,role)
  const created = await f.api(1,'/classes','POST',{name:'阅读测试班'})
  const classroom = created.body.classroom
  await f.api(2,'/classes/join','POST',{inviteCode:classroom.inviteCode})
  const published = await f.api(1,`/classes/${classroom.id}/assignments`,'POST',{
    articleId:13,dueAt:new Date(Date.now()+86400000).toISOString(),
  })
  assert.equal(published.status,201,JSON.stringify(published.body))
  return {...f,classroom,assignment:published.body.assignment}
}
const fullAnswers = (article, wrong = false) => Object.fromEntries(article.questions.map((question,index)=>
  [question.id,wrong && index===0 ? 'D' : question.answer]))

test('only the class owner can publish and read submissions; only enrolled students receive tasks', async()=>{
  const f=await setup()
  try {
    const path=`/classes/${f.classroom.id}/assignments`
    const body={articleId:13,dueAt:new Date(Date.now()+86400000).toISOString()}
    assert.equal((await f.api(null,path)).status,401)
    assert.equal((await f.api(2,path,'POST',body)).status,403)
    assert.equal((await f.api(3,path,'POST',body)).status,404)
    assert.equal((await f.api(1,path,'POST',{...body,articleId:1})).status,400)
    assert.equal((await f.api(1,path,'POST',{...body,dueAt:'invalid'})).status,400)
    assert.equal((await f.api(1,path,'POST',{...body,dueAt:'2000-01-01'})).status,400)
    const tasks=await f.api(2,'/assignments')
    assert.equal(tasks.body.assignments.length,1)
    assert.equal(tasks.body.assignments[0].status,'pending')
    assert.equal((await f.api(4,'/assignments')).body.assignments.length,0)
    assert.equal((await f.api(3,`/assignments/${f.assignment.id}/submissions`)).status,404)
    assert.equal((await f.api(2,`/assignments/${f.assignment.id}/submissions`)).status,403)
  } finally {f.sqlite.close()}
})

test('drafts survive fetch, reject stale device writes, and stay isolated by user and task',async()=>{
  const f=await setup()
  try {
    const path=`/reading-sessions/${encodeURIComponent(`assignment:${f.assignment.id}`)}`
    const task=(await f.api(2,'/assignments')).body.assignments[0]
    const q=task.article.questions[0].id
    const now=new Date().toISOString(),old=new Date(Date.now()-1000).toISOString()
    assert.equal((await f.api(2,path)).body.session,null)
    await f.api(2,path,'PUT',{answers:{[q]:'B',unknown:'Z'},updatedAt:now})
    await f.api(2,path,'PUT',{answers:{[q]:'A'},updatedAt:old})
    const restored=(await f.api(2,path)).body.session
    assert.deepEqual(restored.answers,{[q]:'B'})
    assert.equal(restored.updatedAt,now)
    assert.equal((await f.api(4,path)).status,404)
    assert.equal((await f.api(1,path)).status,403)
    const free='/reading-sessions/reading%3A13'
    await f.api(2,free,'PUT',{answers:{[q]:'C'},updatedAt:now})
    assert.equal((await f.api(4,free)).body.session,null)
    assert.equal((await f.api(2,path)).body.session.answers[q],'B')
    assert.equal((await f.api(2,free,'PUT',{answers:{},updatedAt:'invalid'})).status,400)
    await f.api(2,`/classes/${f.classroom.id}/membership`,'DELETE')
    assert.equal((await f.api(2,path)).status,404)
  } finally {f.sqlite.close()}
})

test('submissions grade the published snapshot on the server and preserve the first result across retries',async()=>{
  const f=await setup()
  try {
    const task=(await f.api(2,'/assignments')).body.assignments[0]
    const path=`/assignments/${task.id}/submit`
    assert.equal((await f.api(2,path,'POST',{answers:{}})).status,400)
    assert.equal((await f.api(4,path,'POST',{answers:fullAnswers(task.article)})).status,404)
    assert.equal((await f.api(1,path,'POST',{answers:fullAnswers(task.article)})).status,403)
    const result=await f.api(2,path,'POST',{answers:fullAnswers(task.article,true),questionsCorrect:999})
    assert.equal(result.status,200,JSON.stringify(result.body))
    assert.equal(result.body.assignment.questionsCorrect,4)
    assert.equal(result.body.assignment.questionsAnswered,5)
    const retry=await f.api(2,path,'POST',{answers:fullAnswers(task.article)})
    assert.equal(retry.body.assignment.questionsCorrect,4)
    assert.equal(retry.body.assignment.submittedAt,result.body.assignment.submittedAt)
    const roster=(await f.api(1,`/assignments/${task.id}/submissions`)).body
    assert.equal(roster.students.length,1)
    assert.equal(roster.students[0].questionsCorrect,4)
    const tasks=(await f.api(1,`/classes/${f.classroom.id}/assignments`)).body.assignments
    assert.equal(tasks[0].submittedCount,1)
    await f.api(1,`/classes/${f.classroom.id}/students/2`,'DELETE')
    assert.equal((await f.api(2,path,'POST',{answers:fullAnswers(task.article)})).status,404)
    assert.equal((await f.api(1,`/assignments/${task.id}/submissions`)).body.students.length,0)
  } finally {f.sqlite.close()}
})

test('late submissions are accepted and labeled without granting access after leaving a class',async()=>{
  const f=await setup()
  try {
    f.sqlite.prepare('UPDATE reading_assignments SET due_at=? WHERE id=?').run('2000-01-01T00:00:00.000Z',f.assignment.id)
    const task=(await f.api(2,'/assignments')).body.assignments[0]
    assert.equal(task.status,'overdue')
    const result=await f.api(2,`/assignments/${task.id}/submit`,'POST',{answers:fullAnswers(task.article)})
    assert.equal(result.body.assignment.status,'submitted_late')
    assert.equal((await f.api(1,`/assignments/${task.id}/submissions`)).body.students[0].status,'submitted_late')
  } finally {f.sqlite.close()}
})

test('new reading endpoints reject cross-site mutations and form submissions',async()=>{
  const f=await setup()
  try {
    const path=`/classes/${f.classroom.id}/assignments`
    const body={articleId:13,dueAt:new Date(Date.now()+86400000).toISOString()}
    assert.equal((await f.api(1,path,'POST',body,{'sec-fetch-site':'cross-site'})).status,403)
    assert.equal((await f.api(1,path,'POST',body,{'content-type':'text/plain'})).status,415)
  } finally {f.sqlite.close()}
})

test('progress round trips preserve versions and preferences including stale device and legacy saves',async()=>{
  const f=await setup()
  try {
    const preferences={dailyNewWordTarget:40,studyPlanCategory:'ielts',updatedAt:'2026-10-21T10:00:00.000Z'}
    const first=await f.api(2,'/progress','PUT',{progress:{learnedWords:[1],preferences}})
    assert.equal(first.status,200,JSON.stringify(first.body))
    const fetched=await f.api(2,'/progress')
    assert.equal(fetched.body.updatedAt,first.body.updatedAt)
    assert.deepEqual(fetched.body.progress.preferences,preferences)
    const exact=await f.api(2,'/progress','PUT',{baseUpdatedAt:fetched.body.updatedAt,progress:{learnedWords:[2],preferences}})
    assert.equal(exact.body.conflictResolved,false)
    assert.notEqual(exact.body.updatedAt,fetched.body.updatedAt)
    const stale=await f.api(2,'/progress','PUT',{baseUpdatedAt:'stale',progress:{learnedWords:[3],preferences:{dailyNewWordTarget:10,updatedAt:'2026-10-20T00:00:00Z'}}})
    assert.equal(stale.body.conflictResolved,true)
    assert.equal(stale.body.progress.preferences.dailyNewWordTarget,40)
    const legacy=await f.api(2,'/progress','PUT',{baseUpdatedAt:stale.body.updatedAt,progress:{learnedWords:[4]}})
    assert.deepEqual(legacy.body.progress.preferences,preferences)
    assert.equal((await f.api(4,'/progress')).body.progress.preferences?.dailyNewWordTarget,undefined)
  } finally {f.sqlite.close()}
})

test('requests from an obsolete account tab cannot read or write the new cookie owner progress',async()=>{
 const f=await setup()
 try {
  const r=await f.api(2,'/progress','PUT',{progress:{learnedWords:[999]}},{'x-flashcards-user':'1'})
  assert.equal(r.status,409)
  assert.equal((await f.api(2,'/progress','GET',undefined,{'x-flashcards-user':'1'})).status,409)
  assert.equal((await f.api(2,'/progress')).body.progress.learnedWords.length,0)
  assert.equal((await f.api(2,'/reading-sessions/reading%3A13','GET',undefined,{'x-flashcards-user':'1'})).status,409)
 } finally {f.sqlite.close()}
})

test('concurrent progress writers retain both updates through compare-and-swap retries',async()=>{
 const f=await setup()
 try {
  const initial=await f.api(2,'/progress','PUT',{progress:{learnedWords:[1]}})
  const results=await Promise.all([2,3].map(id=>f.api(2,'/progress','PUT',{
   baseUpdatedAt:initial.body.updatedAt,progress:{learnedWords:[1,id]},
  })))
  assert(results.every(result=>result.status===200),JSON.stringify(results))
  assert.deepEqual((await f.api(2,'/progress')).body.progress.learnedWords.map(Number).sort(),[1,2,3])
 } finally {f.sqlite.close()}
})

test('published articles and questions stay stable if the source library later changes',async()=>{
 const {default:readings}=await import('../src/data/readings.js')
 const f=await setup()
 const source=readings.find(article=>article.id===13)
 const oldTitle=source.title,oldAnswer=source.questions[0].answer
 try {
  const task=(await f.api(2,'/assignments')).body.assignments[0]
  source.title='Changed after publication'
  source.questions[0].answer='D'
  const reopened=(await f.api(2,'/assignments')).body.assignments[0]
  assert.equal(reopened.article.title,oldTitle)
  const submitted=await f.api(2,`/assignments/${task.id}/submit`,'POST',{answers:fullAnswers(task.article)})
  assert.equal(submitted.body.assignment.questionsCorrect,5)
 } finally {source.title=oldTitle;source.questions[0].answer=oldAnswer;f.sqlite.close()}
})
