const CACHE_PREFIX = 'flashcards-vocabulary-'

// Keep static vocabulary separate from account data and learning progress.
export const createVocabularyLoader = ({
  version,
  fetchImpl = (...args) => fetch(...args),
  cacheStorage = globalThis.caches,
  timeoutMs = 20000,
} = {}) => {
  const memory = new Map()
  const pending = new Map()
  const cacheName = `${CACHE_PREFIX}${version}`
  let cachePromise

  const openCache = () => {
    cachePromise ??= Promise.resolve().then(() => cacheStorage?.open(cacheName)).catch(() => null)
    return cachePromise
  }

  const load = async (url, errorLabel, validate) => {
    const cacheKey = `${url}?v=${encodeURIComponent(version)}`
    const controller = new AbortController()
    let timer
    try {
      return await Promise.race([
        (async () => {
          let cache
          try {
            cache = await openCache()
            const cached = await cache?.match(cacheKey)
            if (cached) {
              const data = await cached.json()
              if (validate(data)) return data
              await cache.delete(cacheKey)
            }
          } catch {
            // Private browsing, quota limits, or a damaged cache must not block learning.
          }

          controller.signal.throwIfAborted()
          const response = await fetchImpl(cacheKey, { signal: controller.signal })
          if (!response.ok) throw new Error(`${errorLabel} (${response.status})`)
          const data = await response.json()
          controller.signal.throwIfAborted()
          if (!validate(data)) throw new Error(`${errorLabel}：词库格式无效`)

          // Do not hold the screen on disk writes or cache maintenance.
          if (cache) {
            void cache.put(cacheKey, new Response(JSON.stringify(data), {
              headers: { 'content-type': 'application/json' },
            })).then(async () => {
              const names = await cacheStorage.keys()
              await Promise.all(names
                .filter((name) => name.startsWith(CACHE_PREFIX) && name !== cacheName)
                .map((name) => cacheStorage.delete(name)))
            }).catch(() => {})
          }
          return data
        })(),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            reject(new Error(`${errorLabel}：请求超时，请检查网络后重试`))
            controller.abort()
          }, timeoutMs)
        }),
      ])
    } finally {
      clearTimeout(timer)
    }
  }

  return (url, errorLabel, validate = Array.isArray) => {
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
}
