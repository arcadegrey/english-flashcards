const CACHE_PREFIX = 'flashcards-vocabulary-'

// Keep static vocabulary separate from account data and learning progress.
export const createVocabularyLoader = ({
  version,
  fetchImpl = (...args) => fetch(...args),
  cacheStorage = globalThis.caches,
  timeoutMs = 20000,
  cacheReadTimeoutMs = 300,
} = {}) => {
  const memory = new Map()
  const pending = new Map()
  const cacheName = `${CACHE_PREFIX}${version}`
  let cachePromise

  const openCache = () => {
    cachePromise ??= Promise.resolve().then(() => cacheStorage?.open(cacheName)).catch(() => null)
    return cachePromise
  }

  const readCache = async (cacheKey, validate) => {
    let timer
    try {
      return await Promise.race([
        (async () => {
          try {
            const cache = await openCache()
            const cached = await cache?.match(cacheKey)
            if (cached) {
              const data = await cached.json()
              if (validate(data)) return data
              void cache.delete(cacheKey).catch(() => {})
            }
          } catch {
            // Private browsing, quota limits, or a damaged cache must not block learning.
          }
          return null
        })(),
        new Promise((resolve) => { timer = setTimeout(() => resolve(null), cacheReadTimeoutMs) }),
      ])
    } finally {
      clearTimeout(timer)
    }
  }

  const load = async (url, errorLabel, validate) => {
    const cacheKey = `${url}?v=${encodeURIComponent(version)}`
    const cached = await readCache(cacheKey, validate)
    if (cached) return cached

    const controller = new AbortController()
    let timer
    try {
      return await Promise.race([
        new Promise((_, reject) => {
          // Slow connections may need longer than 20 seconds for the full library.
          // Abort only when the server stops making progress for that long.
          controller.signal.addEventListener('abort', () => {
            reject(new Error(`${errorLabel}：请求超时，请检查网络后重试`))
          }, { once: true })
          timer = setTimeout(() => controller.abort(), timeoutMs)
        }),
        (async () => {
          const touch = () => {
            clearTimeout(timer)
            timer = setTimeout(() => controller.abort(), timeoutMs)
          }

          controller.signal.throwIfAborted()
          const response = await fetchImpl(cacheKey, { signal: controller.signal })
          controller.signal.throwIfAborted()
          if (!response.ok) throw new Error(`${errorLabel} (${response.status})`)
          touch()
          let data
          if (response.body?.getReader) {
            const reader = response.body.getReader()
            const cancel = () => { void reader.cancel().catch(() => {}) }
            controller.signal.addEventListener('abort', cancel, { once: true })
            const decoder = new TextDecoder()
            let text = ''
            try {
              while (true) {
                const { done, value } = await reader.read()
                controller.signal.throwIfAborted()
                if (done) break
                if (value.byteLength) touch()
                text += decoder.decode(value, { stream: true })
              }
              data = JSON.parse(text + decoder.decode())
            } finally {
              controller.signal.removeEventListener('abort', cancel)
              reader.releaseLock()
            }
          } else {
            data = await response.json()
          }
          controller.signal.throwIfAborted()
          if (!validate(data)) throw new Error(`${errorLabel}：词库格式无效`)

          // Do not hold the screen on disk writes or cache maintenance.
          void openCache().then(async (cache) => {
            if (!cache) return
            await cache.put(cacheKey, new Response(JSON.stringify(data), {
              headers: { 'content-type': 'application/json' },
            }))
            const names = await cacheStorage.keys()
            await Promise.all(names
              .filter((name) => name.startsWith(CACHE_PREFIX) && name !== cacheName)
              .map((name) => cacheStorage.delete(name)))
          }).catch(() => {})
          return data
        })(),
      ])
    } finally {
      clearTimeout(timer)
    }
  }

  const fetchJson = (url, errorLabel, validate = Array.isArray) => {
    if (memory.has(url)) return Promise.resolve(memory.get(url))
    if (pending.has(url)) return pending.get(url)

    const request = load(url, errorLabel, validate)
      .then((data) => {
        memory.set(url, data)
        return data
      })
      .finally(() => pending.delete(url))
    pending.set(url, request)
    return request
  }
  fetchJson.readCached = (url, validate = Array.isArray) => memory.has(url)
    ? Promise.resolve(memory.get(url))
    : readCache(`${url}?v=${encodeURIComponent(version)}`, validate)
  return fetchJson
}
