import assert from 'node:assert/strict'
import test from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { progressColumnMigrations } from '../worker/progressSchema.js'
import { mergePreferences, normalizePreferences } from '../shared/planPreferences.js'
import { readReadingDraft, writeReadingDraft } from '../src/utils/readingDrafts.js'

test('fresh-device defaults cannot overwrite newer cloud settings during hydration',()=>{
 const cloud={dailyNewWordTarget:40,studyPlanCategory:'daily',updatedAt:'2026-10-21T10:00:00.000Z'}
 assert.deepEqual(mergePreferences(cloud,{dailyNewWordTarget:15,studyPlanCategory:'all'}),cloud)
 assert.deepEqual(mergePreferences(cloud,{}),cloud)
 assert.equal(mergePreferences(cloud,{dailyNewWordTarget:25,updatedAt:'2026-10-21T11:00:00.000Z'}).dailyNewWordTarget,25)
 assert.deepEqual(normalizePreferences({dailyNewWordTarget:999,studyPlanCategory:'admin',updatedAt:'invalid'}),{})
})

test('idempotent progress migrations preserve existing data and seed empty preferences',()=>{
 const db=new DatabaseSync(':memory:')
 try {
  db.exec(`CREATE TABLE user_progress (user_id INTEGER PRIMARY KEY, learned_words TEXT); INSERT INTO user_progress VALUES (1,'[7]');`)
  for(let i=0;i<2;i++) {
   const columns=new Set(db.prepare('PRAGMA table_info(user_progress)').all().map(column=>column.name))
   for(const migration of progressColumnMigrations) if(!columns.has(migration.name)) db.exec(migration.sql)
  }
  const row=db.prepare('SELECT * FROM user_progress').get()
  assert.equal(row.learned_words,'[7]')
  assert.equal(row.preferences,'{}')
  assert.equal(row.study_history,'[]')
 } finally { db.close() }
})

test('local reading drafts restore only for their own account and session',()=>{
 const previous=globalThis.localStorage
 const values=new Map()
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}
 try {
  const session={answers:{q1:'B'},updatedAt:'2026-10-21T10:00:00.000Z'}
  writeReadingDraft('2','assignment:one',session)
  assert.deepEqual(readReadingDraft('2','assignment:one'),session)
  assert.deepEqual(readReadingDraft('3','assignment:one').answers,{})
  assert.deepEqual(readReadingDraft('2','reading:one').answers,{})
  assert.deepEqual(readReadingDraft(null,'assignment:one').answers,{})
 } finally {if(previous===undefined) delete globalThis.localStorage;else globalThis.localStorage=previous}
})

test('switching signed-in accounts restores separate learning caches without mixing records',async()=>{
 const {storage}=await import('../src/utils/storage.js')
 const previous=globalThis.localStorage
 const values=new Map()
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}
 try {
  storage.setAuthSession({user:{id:'teacher'}})
  storage.setLearnedWords([11])
  storage.setDailyNewWordTarget(40)
  storage.setPlanPreferencesUpdatedAt('2026-10-21T10:00:00Z')
  assert.deepEqual(storage.switchLearningAccount('teacher').learnedWords,[11])
  const student=storage.switchLearningAccount('student')
  assert.deepEqual(student.learnedWords,[])
  assert.equal(student.preferences.dailyNewWordTarget,15)
  assert.equal(student.preferences.updatedAt,'')
  storage.setAuthSession({user:{id:'student'}})
  storage.setLearnedWords([22])
  storage.setStudyPlanCategory('ielts')
  assert.deepEqual(storage.switchLearningAccount('teacher').learnedWords,[11])
  assert.equal(storage.getDailyNewWordTarget(),40)
  storage.setAuthSession({user:{id:'teacher'}})
  const guest=storage.switchLearningAccount(null)
  assert.deepEqual(guest.learnedWords,[])
  assert.equal(guest.preferences.updatedAt,'')
  storage.clearAuthSession()
  assert.deepEqual(storage.switchLearningAccount('student').learnedWords,[22])
  assert.equal(storage.getStudyPlanCategory(),'ielts')
 } finally {if(previous===undefined) delete globalThis.localStorage;else globalThis.localStorage=previous}
})
