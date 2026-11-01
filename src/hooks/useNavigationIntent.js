import { useEffect } from 'react'
import { createNavigationIntent } from '../utils/navigationIntent.js'
import { prepareNavigation } from '../utils/pageViewLoader.js'

export function useNavigationIntent(scope, blocked) {
  useEffect(() => {
    if (blocked) return undefined
    // At most two targets and one speculative request group at a time per view.
    // Account/view changes cancel queued intent; already-shared public imports finish.
    const intent = createNavigationIntent({ prepare: prepareNavigation })
    const target = event => event.target?.closest?.('[data-prepare-view], [data-prepare-reading]')
    const enter = event => {
      if (event.type === 'pointerover' && event.pointerType !== 'mouse') return
      const element = target(event)
      if (!element || element.disabled || element.contains(event.relatedTarget)) return
      intent.enter(element.dataset.prepareReading != null ? `reading:${element.dataset.prepareReading}` : element.dataset.prepareView)
    }
    const leave = event => { if (!target(event)?.contains(event.relatedTarget)) intent.leave() }
    document.addEventListener('pointerover', enter)
    document.addEventListener('focusin', enter)
    document.addEventListener('pointerout', leave)
    document.addEventListener('focusout', leave)
    document.addEventListener('pointerdown', intent.leave, true)
    return () => {
      intent.dispose()
      document.removeEventListener('pointerover', enter)
      document.removeEventListener('focusin', enter)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('focusout', leave)
      document.removeEventListener('pointerdown', intent.leave, true)
    }
  }, [scope, blocked])
}
