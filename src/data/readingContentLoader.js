// Only public canonical articles pass through this service. Assignment and
// attempt snapshots remain owned by their existing session/history paths.
export function createReadingContentLoader({ metadata, fetchJson, loadLegacyArticles }) {
  const entries = new Map(metadata.map(article => [String(article.id), article]))
  const requests = new Map()
  return id => {
    const key = String(id), entry = entries.get(key)
    if (!entry) return Promise.reject(new Error('未找到阅读文章，请返回列表重试。'))
    if (requests.has(key)) return requests.get(key)
    const validArticle = article => article && String(article.id) === key && article.title === entry.title
      && typeof article.content === 'string' && Boolean(article.content.trim())
      && (article.translation == null || typeof article.translation === 'string')
      && (article.questions == null || Array.isArray(article.questions))
      && (article.questions?.length || 0) === entry.questionCount
    const request = (async () => {
      try {
        const valid = value => value?.revision === entry.contentRevision && validArticle(value.article)
        const data = await fetchJson(entry.contentPath, '阅读文章加载失败', valid)
        if (!valid(data)) throw new Error('阅读文章数据不完整，请重试。')
        return data.article
      } catch (error) {
        // The original full source is a lazy code chunk, still precached by the
        // existing PWA policy. Unopened articles therefore remain available offline.
        if (!loadLegacyArticles) throw error
        try {
          const article = (await loadLegacyArticles()).find(item => String(item.id) === key)
          if (validArticle(article)) return article
        } catch { /* Preserve the actionable original request error. */ }
        throw error
      }
    })().catch(error => { requests.delete(key); throw error })
    requests.set(key, request)
    return request
  }
}
