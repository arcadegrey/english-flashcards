import { useCallback, useEffect, useState } from 'react'
import { loadReadingArticle } from '../data/readingDelivery.js'

export function useReadingArticle(source) {
  const id = source?.id
  const key = source?.contentDeferred ? source.contentPath : ''
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)
  useEffect(() => {
    if (!key) return undefined
    let cancelled = false
    loadReadingArticle(id).then(article => {
      if (!cancelled) setResult({ key, attempt, article })
    }).catch(error => {
      if (!cancelled) setResult({ key, attempt, error: error?.message || '阅读文章加载失败，请重试。' })
    })
    return () => { cancelled = true }
  }, [id, key, attempt])
  const current = result?.key === key && result.attempt === attempt ? result : null
  const retry = useCallback(() => setAttempt(value => value + 1), [])
  // Render guards prevent an old article flash before effect cleanup. Snapshots
  // bypass all lookups, including old IDs and reduced wrong-question sets.
  return {
    article: !key ? source : current?.article ? { ...source, ...current.article,
      contentDeferred: false, estimatedMinutes: source.estimatedMinutes } : source,
    loading: Boolean(key && !current), error: key ? current?.error || '' : '', retry,
  }
}
