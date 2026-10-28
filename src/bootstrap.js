import { loadCoreVocabularyCatalog } from './data/vocabularyStartup.js'
import { applyInitialTheme } from './utils/initialTheme.js'

applyInitialTheme()
// Start the same cache-first request while React/App code downloads. App still
// owns readiness, errors and explicit retry; an early failure is never unhandled.
void loadCoreVocabularyCatalog().catch(() => {})

void import('./main.jsx').catch(() => {
  // Match the existing page-load error and refresh action before React is available.
  const panel = document.createElement('section')
  panel.className = 'learn-refresh-card'
  panel.setAttribute('role', 'alert')
  const title = document.createElement('h2')
  title.textContent = '页面暂时无法加载'
  const detail = document.createElement('p')
  detail.textContent = '请检查网络后刷新重试。已保存的学习记录会保留。'
  const retry = document.createElement('button')
  retry.type = 'button'
  retry.className = 'ds-button ds-button-secondary'
  retry.textContent = '刷新重试'
  retry.addEventListener('click', () => window.location.reload())
  panel.append(title, detail, retry)
  document.getElementById('root').replaceChildren(panel)
  retry.focus()
})
