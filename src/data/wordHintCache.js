// Public teaching content only. This cache never contains account data.
export function createWordHintLoader({ manifest, fetchImpl = (...args) => fetch(...args), cacheStorage = globalThis.caches, timeoutMs = 12000, cacheTimeoutMs = 250, loadFallback, fallbackDelayMs = 1000 }) {
  const pending = new Map(), memory = new Map();
  const validBatch = data => data?.entries && !Array.isArray(data.entries) &&
    data.sources && !Array.isArray(data.sources) && typeof data.sources === 'object' &&
    Object.keys(data.entries).length > 0 && Object.values(data.entries).every(entry =>
      typeof entry?.word === 'string' && Array.isArray(entry.hints) && entry.hints.every(hint =>
        typeof hint?.label === 'string' && typeof hint.text === 'string' &&
        (!hint.sourceIds || Array.isArray(hint.sourceIds) && hint.sourceIds.every(id => data.sources[id]?.url)) &&
        (!hint.examples || Array.isArray(hint.examples) && hint.examples.every(example =>
          typeof example?.en === 'string' && typeof example.zh === 'string' && Array.isArray(example.parts)))
      ) && (!entry.guards || typeof entry.guards === 'object' && !Array.isArray(entry.guards)
        && Object.entries(entry.guards).every(([key, value]) => ['pos', 'meaning', 'phonetic', 'example', 'exampleCn'].includes(key) && typeof value === 'string')));
  let cacheRequest;
  const openCache = () => cacheRequest ??= Promise.resolve().then(() => cacheStorage?.open('flashcards-word-hints-v1')).catch(() => null);
  const boundedCache = async operation => {
    let timer;
    try {
      return await Promise.race([Promise.resolve().then(operation).catch(() => null),
        new Promise(resolve => { timer = setTimeout(() => resolve(null), cacheTimeoutMs); })]);
    } finally { clearTimeout(timer); }
  };
  async function loadBatch(path) {
    const cached = await boundedCache(async () => {
      const cache = await openCache();
      const response = await cache?.match(path);
      if (!response) return null;
      const data = await response.json();
      if (validBatch(data)) return { data, cached: true };
      void cache.delete(path).catch(() => {});
      return null;
    });
    if (cached) return cached;

    const controller = new AbortController();
    let timer, fallbackTimer, resetTimeout;
    try {
      const primary = async () => {
        const response = await fetchImpl(path, { signal: controller.signal });
        controller.signal.throwIfAborted();
        if (!response.ok) throw new Error('学习提示暂时无法加载');
        resetTimeout?.();
        let data;
        if (response.body?.getReader) {
          const reader = response.body.getReader(), decoder = new TextDecoder();
          const cancel = () => { void reader.cancel().catch(() => {}); };
          controller.signal.addEventListener('abort', cancel, { once: true });
          let text = '';
          try {
            while (true) {
              const { done, value } = await reader.read();
              controller.signal.throwIfAborted();
              if (done) break;
              if (value.byteLength) resetTimeout?.();
              text += decoder.decode(value, { stream: true });
            }
            data = JSON.parse(text + decoder.decode());
          } finally {
            controller.signal.removeEventListener('abort', cancel);
            reader.releaseLock();
          }
        } else data = await response.json();
        if (!validBatch(data)) throw new Error('学习提示格式无效');
        return data;
      };
      const delivery = !loadFallback ? primary() : new Promise((resolve, reject) => {
        let fallbackStarted = false, primaryError, fallbackFailed = false;
        const startFallback = () => {
          if (fallbackStarted) return;
          fallbackStarted = true;
          clearTimeout(fallbackTimer);
          Promise.resolve().then(() => loadFallback(path)).then(data => {
            if (!validBatch(data)) throw new Error('学习提示格式无效');
            resolve(data);
          }).catch(() => { fallbackFailed = true; if (primaryError) reject(primaryError); });
        };
        fallbackTimer = setTimeout(startFallback, fallbackDelayMs);
        primary().then(resolve).catch(error => {
          primaryError = error;
          if (fallbackFailed) reject(error);
          else startFallback();
        });
      });
      const data = await Promise.race([delivery,
        new Promise((_, reject) => {
          resetTimeout = () => {
            if (controller.signal.aborted) return;
            clearTimeout(timer);
            timer = setTimeout(() => reject(new Error('学习提示加载超时，请重试')), timeoutMs);
          };
          resetTimeout();
        }),
      ]);
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      controller.abort();
      const result = { data, cached: false };
      // CacheStorage can hang even after a successful download. Show the content
      // promptly and only report offline readiness once the write actually succeeds.
      await boundedCache(async () => {
        const cache = await openCache();
        if (!cache) return;
        await cache.put(path, new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } }));
        result.cached = true;
      });
      return result;
    } finally { clearTimeout(timer); clearTimeout(fallbackTimer); controller.abort(); }
  }
  return async word => {
    const path = manifest.batches[String(Math.floor(Number(word?.id) / manifest.batchSize))];
    if (!path) return null;
    if (!memory.has(path)) {
      if (!pending.has(path)) pending.set(path, loadBatch(path).then(result => { memory.set(path, result); return result; }).finally(() => pending.delete(path)));
      await pending.get(path);
    }
    const { data, cached } = memory.get(path);
    const entry = data.entries[word.id];
    // An old snapshot or custom word must not receive another text's notes.
    if (!entry || entry.word !== word.word || !Array.isArray(entry.hints)
      || Object.entries(entry.guards || {}).some(([key, value]) => word[key] != null && word[key] !== value)) return null;
    return { cached, hints: entry.hints.map(({ sourceIds, ...hint }) => ({ ...hint,
      ...(sourceIds ? { sources: sourceIds.map(id => data.sources[id]).filter(Boolean) } : {}),
    })) };
  };
}
