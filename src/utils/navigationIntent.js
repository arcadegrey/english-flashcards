// Speculation only prepares public resources; it never navigates or adopts data.
export function canPrepareNavigation(navigator = globalThis.navigator) {
  const connection = navigator?.connection
  return navigator?.onLine !== false && !connection?.saveData
    && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType)
}

export function createNavigationIntent({ prepare, allowed = canPrepareNavigation,
  schedule = callback => setTimeout(callback, 140), cancel = clearTimeout, budget = 2 }) {
  let timer, target, running = false, disposed = false, attempts = 0
  const started = new Set()
  const leave = () => { if (timer !== undefined) cancel(timer); timer = undefined; target = undefined }
  return {
    leave,
    enter(key) {
      leave()
      if (disposed || running || !key || started.has(key) || attempts >= budget || !allowed()) return
      target = key
      timer = schedule(() => {
        timer = undefined
        if (disposed || running || target !== key || !allowed()) return
        attempts++; started.add(key); running = true
        Promise.resolve().then(() => prepare(key)).catch(() => started.delete(key)).finally(() => { running = false })
      })
    },
    dispose() { disposed = true; leave() },
  }
}

const actionViews = { words: 'learn', review: 'collection', exam: 'examPractice', statistics: 'statistics',
  training: 'home', settings: 'planSettings' }
export function actionPreparation(action, readingId) {
  if (action === 'reading' && readingId != null) return { 'data-prepare-reading': readingId }
  return { 'data-prepare-view': actionViews[action] }
}

export const navigationPreparationViews = { training: 'home', words: 'learn', reading: 'home',
  review: 'collection', test: 'examPractice', stats: 'statistics' }
