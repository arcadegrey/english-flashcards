// Keep the complete core readiness gate even when the public JSON route stalls.
// The alternate code chunk contains the same generated summaries and is PWA cached.
export function createCoreVocabularyPreparation({
  loadPrimary, loadFallback, count, hasCoreWord,
  fallbackDelayMs = 2000, fallbackTimeoutMs = 15000,
}) {
  let request
  const complete = words => Array.isArray(words) && words.length === count
    && new Set(words.map(word => String(word?.id))).size === count
    && words.every(word => hasCoreWord(word?.id)
      && typeof word?.word === 'string' && typeof word?.meaning === 'string')

  return () => {
    if (request) return request
    request = new Promise((resolve, reject) => {
      let settled = false, fallbackStarted = false, fallbackFinished = false
      let failures = 0, primaryError, delayTimer, deadlineTimer
      const clearTimers = () => { clearTimeout(delayTimer); clearTimeout(deadlineTimer) }
      const accept = words => {
        if (settled) return
        if (!complete(words)) throw new Error('核心词库数据不完整，请重试。')
        settled = true
        clearTimers()
        resolve(words)
      }
      const fail = (primary, error) => {
        if (settled) return
        failures++
        if (primary) { primaryError = error; startFallback() }
        if (failures === 2) {
          settled = true
          clearTimers()
          reject(primaryError || error)
        }
      }
      const startFallback = () => {
        if (settled || fallbackStarted) return
        fallbackStarted = true
        clearTimeout(delayTimer)
        const finish = (words, error) => {
          if (fallbackFinished || settled) return
          fallbackFinished = true
          clearTimeout(deadlineTimer)
          if (error) { fail(false, error); return }
          try { accept(words) } catch (error) { fail(false, error) }
        }
        deadlineTimer = setTimeout(() => finish(null, new Error('核心词库后备加载超时，请重试。')), fallbackTimeoutMs)
        Promise.resolve().then(loadFallback).then(words => finish(words), error => finish(null, error))
      }
      delayTimer = setTimeout(startFallback, fallbackDelayMs)
      Promise.resolve().then(loadPrimary).then(accept).catch(error => fail(true, error))
    }).catch(error => { request = undefined; throw error })
    return request
  }
}
