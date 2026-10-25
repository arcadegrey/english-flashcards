// Public teaching content only. This cache never contains account data.
export function createWordHintLoader({ manifest, fetchImpl = (...args) => fetch(...args), cacheStorage = globalThis.caches, timeoutMs = 20000 }) {
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
  async function loadBatch(path) {
    const controller = new AbortController();
    let timer;
    try {
      return await Promise.race([
        (async () => {
          let cache;
          try {
            cache = await cacheStorage?.open('flashcards-word-hints-v1');
            const response = await cache?.match(path);
            if (response) {
              const data = await response.json();
              if (validBatch(data)) return { data, cached: true };
              await cache.delete(path);
            }
          } catch { /* Cache denial never blocks online learning. */ }
          controller.signal.throwIfAborted();
          const response = await fetchImpl(path, { signal: controller.signal });
          if (!response.ok) throw new Error('学习提示暂时无法加载');
          const data = await response.json();
          if (!validBatch(data)) throw new Error('学习提示格式无效');
          controller.signal.throwIfAborted();
          let cached = false;
          if (cache) {
            try {
              await cache.put(path, new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } }));
              cached = true;
            } catch { /* Show loaded, not offline-ready, when quota is exhausted. */ }
          }
          return { data, cached };
        })(),
        new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('学习提示加载超时，请重试')); }, timeoutMs); }),
      ]);
    } finally { clearTimeout(timer); }
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
