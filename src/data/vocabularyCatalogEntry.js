// Both early core preparation and the complete delivery service retain the same
// cache-first validation, including old complete records at their legacy URL.
export async function loadVocabularyCatalogEntry(fetchJson, legacyPath, entry, hasWord) {
  const validate = words => Array.isArray(words) && words.length === entry.count
    && new Set(words.map(word => word?.id)).size === words.length
    && words.every(word => hasWord(word?.id) && typeof word?.word === 'string' && typeof word?.meaning === 'string')
  const cached = await fetchJson.readCached?.(legacyPath, validate)
  return cached || fetchJson(entry.path, '词库目录加载失败', validate)
}
