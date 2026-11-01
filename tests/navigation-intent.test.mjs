import test from 'node:test'
import assert from 'node:assert/strict'
import { canPrepareNavigation, createNavigationIntent, actionPreparation } from '../src/utils/navigationIntent.js'

const flush = () => new Promise(resolve => setImmediate(resolve))
function harness(options = {}) {
  const timers = new Set(), calls = []
  const intent = createNavigationIntent({ prepare: async key => { calls.push(key) },
    schedule: callback => { timers.add(callback); return callback }, cancel: callback => timers.delete(callback), ...options })
  return { intent, calls, tick: async () => { const batch = [...timers]; timers.clear(); batch.forEach(callback => callback()); await flush() } }
}

test('navigation speculation respects offline, data saver and slow connections', () => {
  for (const state of [{ onLine: false }, { connection: { saveData: true } },
    ...['slow-2g', '2g', '3g'].map(effectiveType => ({ connection: { effectiveType } }))]) {
    assert.equal(canPrepareNavigation(state), false)
  }
  assert.equal(canPrepareNavigation({ connection: { effectiveType: '4g' } }), true)
  assert.equal(canPrepareNavigation({}), true)
})

test('passing a button, clicking, changing scope or starting critical work cancels queued intent', async () => {
  let allowed = true
  const { intent, calls, tick } = harness({ allowed: () => allowed })
  intent.enter('learn'); intent.leave(); await tick()
  intent.enter('home'); allowed = false; await tick()
  allowed = true; intent.enter('statistics'); intent.dispose(); await tick()
  intent.enter('reading:19'); await tick()
  assert.deepEqual(calls, [])
})

test('only the latest dwell starts; repeated focus and hover share a two-target budget', async () => {
  const { intent, calls, tick } = harness()
  intent.enter('learn'); intent.enter('reading:19'); await tick()
  intent.enter('reading:19'); await tick()
  intent.enter('home'); await tick()
  intent.enter('statistics'); await tick()
  assert.deepEqual(calls, ['reading:19', 'home'])
})

test('speculative groups never run concurrently and a failed preparation can retry', async () => {
  let resolve, count = 0
  const h = harness({ prepare: () => { count++; return new Promise(r => { resolve = r }) } })
  h.intent.enter('learn'); await h.tick(); h.intent.enter('home'); await h.tick()
  assert.equal(count, 1); resolve(); await flush()
  h.intent.enter('home'); await h.tick(); assert.equal(count, 2); resolve(); await flush()
  let attempts = 0
  const retry = harness({ prepare: () => { attempts++; if (attempts === 1) throw new Error('offline') } })
  retry.intent.enter('learn'); await retry.tick(); retry.intent.enter('learn'); await retry.tick()
  retry.intent.enter('home'); await retry.tick()
  assert.equal(attempts, 2)
})

test('reading intent selects one article; unknown actions do not request a study pool', () => {
  assert.deepEqual(actionPreparation('reading', 19), { 'data-prepare-reading': 19 })
  assert.deepEqual(actionPreparation('words'), { 'data-prepare-view': 'learn' })
  assert.equal(actionPreparation('unknown')['data-prepare-view'], undefined)
})
