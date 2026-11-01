import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { randomUUID } from 'node:crypto'
import { createPwaUpdateClient } from '../src/utils/pwaUpdates.js'

const turn = () => new Promise(resolve => setImmediate(resolve))
function emitter(extra = {}) {
  const listeners = new Map()
  return { ...extra, addEventListener(type, listener) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(listener) },
    emit(type, event = {}) { for (const listener of listeners.get(type) || []) listener(event) } }
}
function client() {
  let reloads = 0, requests = 0, editing = false, updates = 0
  const document = emitter({ readyState: 'complete', activeElement: { matches: () => editing } })
  const registration = emitter({ update: async () => { updates++ }, waiting: { postMessage(message, ports) {
    requests++; ports[0].postMessage({ token: message.token, ok: false, reason: 'busy' })
  } } })
  const sw = emitter({ controller: {}, register: async () => registration })
  const window = emitter({ crypto: { randomUUID } })
  const controller = createPwaUpdateClient({ serviceWorker: sw, document, window,
    reload: () => reloads++, online: () => true })
  controller.start()
  return { controller, sw, document, registration, window, updates: () => updates, editing: value => { editing = value },
    reloads: () => reloads, requests: () => requests }
}
function message(sw, type, token = 'test') {
  let reply
  sw.emit('message', { data: { type, token }, ports: [{ postMessage: value => { reply = value } }] })
  return reply
}

test('registration never reloads first install or forces an update while busy/editing', async () => {
  const h = client(); await turn()
  h.sw.emit('controllerchange'); assert.equal(h.reloads(), 0)
  assert.equal(h.controller.getSnapshot().available, true)
  assert.equal(await h.controller.apply(), false); assert.equal(h.requests(), 0)
  h.controller.setBusy(false); h.editing(true)
  assert.equal(await h.controller.apply(), false); assert.equal(h.requests(), 0)
})

test('reservation blocks input synchronously; new activity fails confirmation; release unlocks', async () => {
  const h = client(); await turn()
  assert.equal(message(h.sw, 'EF_UPDATE_PROBE').safe, false)
  h.controller.setBusy(false)
  assert.equal(message(h.sw, 'EF_UPDATE_PROBE').safe, true)
  let stopped = false
  h.document.emit('click', { preventDefault() {}, stopImmediatePropagation() { stopped = true } })
  assert.equal(stopped, true)
  h.controller.setBusy(true); assert.equal(message(h.sw, 'EF_UPDATE_CONFIRM').safe, false)
  assert.equal(message(h.sw, 'EF_UPDATE_COMMIT').safe, false)
  message(h.sw, 'EF_UPDATE_RELEASE'); assert.equal(h.controller.getSnapshot().phase, 'idle')
})

test('only acknowledged commit reloads; failed activation releases committed reservations', async () => {
  const h = client(); await turn(); h.controller.setBusy(false)
  message(h.sw, 'EF_UPDATE_COMMIT', 'unknown'); h.sw.emit('controllerchange'); assert.equal(h.reloads(), 0)
  message(h.sw, 'EF_UPDATE_PROBE'); message(h.sw, 'EF_UPDATE_COMMIT'); message(h.sw, 'EF_UPDATE_RELEASE')
  h.sw.emit('controllerchange'); assert.equal(h.reloads(), 0)
  message(h.sw, 'EF_UPDATE_PROBE'); message(h.sw, 'EF_UPDATE_COMMIT'); h.sw.emit('controllerchange')
  assert.equal(h.reloads(), 1)
  h.sw.emit('controllerchange'); assert.equal(h.reloads(), 1)
})

test('duplicate update clicks share one request; blocked tabs allow actionable retry', async () => {
  const h = client(); await turn(); h.controller.setBusy(false)
  const a = h.controller.apply(), b = h.controller.apply()
  assert.strictEqual(a, b); assert.equal(await a, false); assert.equal(h.requests(), 1)
  assert.equal(h.controller.getSnapshot().phase, 'idle')
  assert.match(h.controller.getSnapshot().message, /其他页面/)
  h.controller.dismiss(); assert.equal(h.controller.getSnapshot().dismissed, true)
})

test('concurrent API operations block reservation until every request releases, including duplicate cleanup', async () => {
  const h = client(); await turn(); h.controller.setBusy(false)
  const a = h.controller.beginRequest(), b = h.controller.beginRequest()
  assert.equal(message(h.sw, 'EF_UPDATE_PROBE').safe, false)
  a(); a(); assert.equal(h.controller.getSnapshot().busy, true)
  b(); assert.equal(h.controller.getSnapshot().busy, false)
  assert.equal(message(h.sw, 'EF_UPDATE_PROBE').safe, true)
  message(h.sw, 'EF_UPDATE_RELEASE')
})

test('focus/reconnect update checks are hourly and skip active work or an already-waiting update', async t => {
  let now = 1000
  t.mock.method(Date, 'now', () => now)
  const h = client(); await turn()
  now += 3600001
  h.window.emit('focus'); assert.equal(h.updates(), 0)
  h.controller.setBusy(false)
  h.window.emit('focus'); assert.equal(h.updates(), 0)
  h.registration.waiting = null
  h.window.emit('focus'); assert.equal(h.updates(), 1)
  h.window.emit('online'); assert.equal(h.updates(), 1)
})

const guardSource = await readFile(new URL('../public/pwa-update-guard.js', import.meta.url), 'utf8')
async function worker({ busy = false, silent = false, changed = false, failActivation = false, legacySkip = false } = {}) {
  let listener, skipped = 0, enumerations = 0, reply, task, stopped = false
  const messages = []
  const client = { id: 'tab', postMessage(data, ports) {
    messages.push(data.type)
    if (ports?.[0] && !silent) ports[0].postMessage({ token: data.token, safe: !busy })
  } }
  vm.runInNewContext(guardSource, { MessageChannel, setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 250)), clearTimeout,
    self: { clients: { matchAll: async () => { enumerations++; return changed && enumerations > 1 ? [client, { id: 'new' }] : [client] } },
      addEventListener: (_, fn) => { listener = fn }, skipWaiting: async () => { skipped++; if (failActivation) throw new Error('activation failed') } } })
  listener({ data: { type: legacySkip ? 'SKIP_WAITING' : 'EF_REQUEST_UPDATE', token: 'request' }, source: { id: 'tab' },
    stopImmediatePropagation() { stopped = true },
    ports: [{ postMessage: value => { reply = value }, close() {} }], waitUntil: promise => { task = promise } })
  await task
  return { reply, skipped, messages, stopped }
}

test('waiting SW reserves and confirms all pages before committing activation', async () => {
  const r = await worker()
  assert.equal(r.reply.ok, true); assert.equal(r.skipped, 1)
  assert.deepEqual(r.messages, ['EF_UPDATE_PROBE', 'EF_UPDATE_CONFIRM', 'EF_UPDATE_COMMIT'])
})

test('busy, unresponsive legacy or newly opened pages block activation and release reservations', async () => {
  for (const options of [{ busy: true }, { silent: true }, { changed: true }]) {
    const r = await worker(options)
    assert.equal(r.reply.ok, false); assert.equal(r.skipped, 0)
    assert.equal(r.messages.at(-1), 'EF_UPDATE_RELEASE')
  }
})

test('activation failure releases committed pages without deleting data', async () => {
  const r = await worker({ failActivation: true })
  assert.equal(r.reply.ok, false); assert.equal(r.messages.at(-1), 'EF_UPDATE_RELEASE')
})

test('legacy SKIP_WAITING cannot reach the generated immediate-activation listener', async () => {
  const r = await worker({ legacySkip: true })
  assert.equal(r.skipped, 0); assert.equal(r.stopped, true)
})
