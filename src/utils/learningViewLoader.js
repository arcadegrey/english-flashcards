// Navigation preparation and React.lazy share one request, including Vite's CSS dependencies.
// Importing this module alone does not fetch or mount the learning page.
export function createLearningViewLoader(importView) {
  let pending
  return () => {
    if (!pending) {
      pending = Promise.resolve().then(importView).catch(error => {
        pending = undefined
        throw new Error('学习页面加载失败，请重试', { cause: error })
      })
    }
    return pending
  }
}

const failedStyles = new Set()

function retryStylesheet(href) {
  return new Promise((resolve, reject) => {
    const oldLink = [...document.querySelectorAll('link[rel="stylesheet"]')].find(link => link.href === href)
    const link = oldLink ? oldLink.cloneNode() : document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => {
      failedStyles.delete(href)
      resolve()
    }
    link.onerror = () => reject(new Error(`Unable to preload CSS for ${href}`))
    if (oldLink) oldLink.replaceWith(link)
    else document.head.appendChild(link)
  })
}

export const loadLearningView = createLearningViewLoader(async () => {
  // Vite remembers preload URLs even after a CSS failure. Restore failed links
  // explicitly before retrying the import, so retry cannot enter an unstyled page.
  const recordFailure = event => {
    if (event.target?.tagName === 'LINK' && event.target.rel === 'stylesheet') failedStyles.add(event.target.href)
  }
  window.addEventListener('error', recordFailure, true)
  try {
    await Promise.all([...failedStyles].map(retryStylesheet))
    return await import('../components/LearningView.jsx')
  } finally {
    window.removeEventListener('error', recordFailure, true)
  }
})
