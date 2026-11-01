// Public app lifecycle only. No account data, storage migration or cache deletion.
export function createPwaUpdateClient({
  serviceWorker = globalThis.navigator?.serviceWorker,
  window = globalThis.window, document = globalThis.document,
  Channel = globalThis.MessageChannel, reload = () => window.location.reload(),
  online = () => globalThis.navigator?.onLine !== false,
  buildId = import.meta.env?.VITE_APP_BUILD_ID || 'app',
} = {}) {
  let snapshot = { available: false, dismissed: false, phase: 'idle', message: '', buildId, busy: true }
  let busy = true, requests = 0, started = false, registration, lease, leaseTimer, committed = false, pending, lastCheckedAt = 0
  const listeners = new Set()
  const publish = patch => { snapshot = { ...snapshot, ...patch }; listeners.forEach(listener => listener()) }
  const editing = () => Boolean(document?.activeElement?.matches('input, textarea, [contenteditable="true"]'))
  const safe = () => !busy && requests === 0 && !editing()
  const reflectBusy = () => {
    const value = busy || requests > 0
    if (snapshot.busy !== value) publish({ busy: value })
  }
  const release = token => {
    if (lease !== token || committed) return
    clearTimeout(leaseTimer); lease = undefined
    publish({ phase: 'idle' })
  }
  const onMessage = event => {
    const { type, token } = event.data || {}
    if (typeof token !== 'string') return
    if (type === 'EF_UPDATE_PROBE') {
      const ready = safe() && (!lease || lease === token)
      if (ready) {
        lease = token
        clearTimeout(leaseTimer)
        leaseTimer = setTimeout(() => release(token), 6000)
        publish({ phase: 'checking' })
      }
      event.ports?.[0]?.postMessage({ token, safe: ready })
    } else if (type === 'EF_UPDATE_CONFIRM') {
      event.ports?.[0]?.postMessage({ token, safe: lease === token && safe() })
    } else if (type === 'EF_UPDATE_RELEASE' && lease === token) { committed = false; release(token) }
    else if (type === 'EF_UPDATE_COMMIT') {
      const ready = lease === token && safe()
      if (ready) {
        committed = true
        clearTimeout(leaseTimer)
        publish({ phase: 'updating' })
      }
      event.ports?.[0]?.postMessage({ token, safe: ready })
    }
  }
  // Close the gap between a synchronous reservation and React's overlay render.
  const blockInput = event => {
    if (lease) { event.preventDefault(); event.stopImmediatePropagation() }
  }
  const waiting = () => {
    if (registration?.waiting) publish({ available: true, dismissed: false, message: '' })
  }
  const register = async () => {
    try {
      registration = await serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      lastCheckedAt = Date.now()
      waiting()
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && serviceWorker.controller) waiting()
        })
      })
    } catch { /* Offline/unsupported registration must never block studying. */ }
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
    setBusy(value) { busy = Boolean(value); reflectBusy() },
    beginRequest() {
      requests++; reflectBusy()
      let released = false
      return () => { if (!released) { released = true; requests--; reflectBusy() } }
    },
    dismiss() { publish({ dismissed: true }) },
    start() {
      if (started || !serviceWorker || !window || !document) return
      started = true
      serviceWorker.addEventListener('message', onMessage)
      serviceWorker.addEventListener('controllerchange', () => {
        // First installation and unexpected external activation never refresh a session.
        if (committed) { committed = false; reload() }
      })
      for (const type of ['click', 'keydown', 'submit']) document.addEventListener(type, blockInput, true)
      const check = () => {
        if (!registration || registration.waiting || !safe() || !online() || lease || pending || Date.now() - lastCheckedAt < 3600000) return
        lastCheckedAt = Date.now()
        void registration.update().catch(() => {})
      }
      window.addEventListener('focus', check)
      window.addEventListener('online', check)
      if (document.readyState === 'complete') void register()
      else window.addEventListener('load', () => { void register() }, { once: true })
    },
    apply() {
      if (pending) return pending
      if (!safe() || !online()) {
        publish({ message: '请先结束当前操作，并在联网后更新。' })
        return Promise.resolve(false)
      }
      const worker = registration?.waiting
      if (!worker) return Promise.resolve(false)
      const token = window.crypto.randomUUID()
      publish({ message: '', phase: 'checking' })
      pending = new Promise(resolve => {
        const channel = new Channel()
        let timer
        const finish = result => {
          clearTimeout(timer); channel.port1.close()
          if (!result.ok && !committed) {
            release(token)
            publish({ phase: 'idle', message: result.reason === 'busy'
              ? '请先结束其他页面的操作，或关闭不再使用的旧页面后重试。'
              : '暂时无法确认其他页面，请关闭本站其他页面后重试。' })
          }
          resolve(Boolean(result.ok))
        }
        channel.port1.onmessage = event => { if (event.data?.token === token) finish(event.data) }
        timer = setTimeout(() => finish({ ok: false }), 7000)
        try { worker.postMessage({ type: 'EF_REQUEST_UPDATE', token }, [channel.port2]) }
        catch { finish({ ok: false }) }
      }).finally(() => { pending = undefined })
      return pending
    },
  }
}

export const pwaUpdates = createPwaUpdateClient()
