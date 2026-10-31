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
      ));
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
    let timer, fallbackTimer;
    try {
      const primary = async () => {
        const response = await fetchImpl(path, { signal: controller.signal });
        if (!response.ok) throw new Error('学习提示暂时无法加载');
        const data = await response.json();
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
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('学习提示加载超时，请重试')), timeoutMs); }),
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
    if (!entry || entry.word !== word.word || !Array.isArray(entry.hints)) return null;
    return { cached, hints: entry.hints.map(({ sourceIds, ...hint }) => ({ ...hint,
      ...(sourceIds ? { sources: sourceIds.map(id => data.sources[id]).filter(Boolean) } : {}),
    })) };
  };
}
