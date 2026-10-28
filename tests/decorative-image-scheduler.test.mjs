import test from 'node:test'
import assert from 'node:assert/strict'
import { createDecorativeImageScheduler } from '../src/utils/decorativeImageScheduler.js'

function harness() {
  const pending = new Map(), history = new Map(), calls = []
  let next = 0
  const scheduler = createDecorativeImageScheduler({
    requestIdle(callback) { pending.set(++next, callback); history.set(next, callback); return next },
    cancelIdle(handle) { pending.delete(handle) },
  })
  return { scheduler, pending, history, calls,
    add: (key, name = key) => scheduler.enqueue(key, () => calls.push(name)),
    flush() { const [handle, callback] = pending.entries().next().value; pending.delete(handle); callback() },
  }
}

test('visible decoration waits for the critical image, then dispatches one public URL per idle batch', () => {
  const h = harness()
  h.add('same-image', 'first'); h.add('same-image', 'second'); h.add('another-image')
  assert.equal(h.pending.size, 0)
  h.scheduler.holdPrimary('hero'); h.scheduler.settlePrimary('hero')
  assert.equal(h.pending.size, 1)
  h.flush(); assert.deepEqual(h.calls, ['first', 'second'])
  assert.equal(h.pending.size, 1)
  h.flush(); assert.deepEqual(h.calls, ['first', 'second', 'another-image'])
  assert.equal(h.pending.size, 0)
})

test('a previous critical image cannot release a newer selection', () => {
  const h = harness(); h.add('decoration')
  h.scheduler.holdPrimary('old'); h.scheduler.holdPrimary('new')
  h.scheduler.settlePrimary('old'); assert.equal(h.pending.size, 0)
  h.scheduler.settlePrimary('new'); h.flush(); assert.deepEqual(h.calls, ['decoration'])
})

test('learning pause cancels pending work and stale idle callbacks cannot run after resume', () => {
  const h = harness(); h.scheduler.holdPrimary(null); h.add('first')
  const stale = h.history.values().next().value
  h.scheduler.setPaused(true); assert.equal(h.pending.size, 0)
  stale(); assert.deepEqual(h.calls, [])
  h.scheduler.setPaused(false); stale(); assert.deepEqual(h.calls, [])
  assert.equal(h.pending.size, 1); h.flush(); assert.deepEqual(h.calls, ['first'])
})

test('leaving the viewport or unmounting a consumer cancels only its own image demand', () => {
  const h = harness(); h.scheduler.holdPrimary(null)
  const cancel = h.add('shared', 'cancelled'); h.add('shared', 'visible')
  cancel(); h.flush(); assert.deepEqual(h.calls, ['visible'])
  const cancelLast = h.add('unmounted'); cancelLast()
  assert.equal(h.pending.size, 0)
})

test('a newly selected primary image cancels queued low-priority dispatch', () => {
  const h = harness(); h.scheduler.holdPrimary(null); h.add('preview')
  const stale = h.history.values().next().value
  h.scheduler.holdPrimary('explicit-selection'); stale()
  assert.deepEqual(h.calls, []); assert.equal(h.pending.size, 0)
  h.scheduler.settlePrimary('explicit-selection'); h.flush()
  assert.deepEqual(h.calls, ['preview'])
})

test('owner cleanup prevents late work and supports StrictMode reconnect with a fresh queue', () => {
  const h = harness(); h.scheduler.holdPrimary(null); h.add('old-owner')
  const stale = h.history.values().next().value
  h.scheduler.disconnect(); h.add('disconnected'); stale()
  h.scheduler.connect(); h.add('new-owner'); h.flush()
  assert.deepEqual(h.calls, ['new-owner'])
})

test('a pause within a grouped batch retains remaining consumers until learning preparation ends', () => {
  const h = harness(); h.scheduler.holdPrimary(null)
  h.scheduler.enqueue('shared', () => { h.calls.push('first'); h.scheduler.setPaused(true) })
  h.add('shared', 'second'); h.flush()
  assert.deepEqual(h.calls, ['first']); assert.equal(h.pending.size, 0)
  h.scheduler.setPaused(false); h.flush(); assert.deepEqual(h.calls, ['first', 'second'])
})
