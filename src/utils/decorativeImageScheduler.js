// One idle batch per public image URL. Viewport hooks enqueue/cancel consumers;
// a critical image and learning preparation can hold all not-yet-started work.
export function createDecorativeImageScheduler({
  requestIdle = callback => globalThis.requestIdleCallback
    ? globalThis.requestIdleCallback(callback, { timeout: 1200 }) : setTimeout(callback, 32),
  cancelIdle = handle => globalThis.cancelIdleCallback ? globalThis.cancelIdleCallback(handle) : clearTimeout(handle),
} = {}) {
  const jobs = new Map()
  let connected = true, paused = false, primary = 'initial', handle = null, generation = 0
  const blocked = () => !connected || paused || primary !== null
  const cancelPending = () => {
    generation++
    if (handle !== null) cancelIdle(handle)
    handle = null
  }
  const pump = () => {
    if (blocked() || handle !== null || jobs.size === 0) return
    const epoch = generation
    handle = requestIdle(() => {
      if (epoch !== generation) return
      handle = null
      if (blocked() || jobs.size === 0) return
      const [key, callbacks] = jobs.entries().next().value
      for (const callback of [...callbacks]) {
        if (blocked()) break
        if (!callbacks.delete(callback)) continue
        callback()
      }
      if (callbacks.size === 0) jobs.delete(key)
      pump()
    })
  }
  return {
    enqueue(key, callback) {
      if (!connected) return () => {}
      if (!jobs.has(key)) jobs.set(key, new Set())
      const callbacks = jobs.get(key)
      callbacks.add(callback)
      pump()
      return () => {
        callbacks.delete(callback)
        if (callbacks.size === 0 && jobs.get(key) === callbacks) jobs.delete(key)
        if (jobs.size === 0) cancelPending()
      }
    },
    holdPrimary(token) { primary = token; cancelPending(); pump() },
    settlePrimary(token) { if (primary === token) { primary = null; pump() } },
    setPaused(value) { paused = value; if (paused) cancelPending(); else pump() },
    connect() { connected = true; pump() },
    disconnect() { connected = false; cancelPending(); jobs.clear() },
  }
}
