import { useLayoutEffect, useSyncExternalStore } from 'react'
import { pwaUpdates } from '../utils/pwaUpdates.js'

export function usePwaUpdateSafety(busy) {
  useLayoutEffect(() => {
    pwaUpdates.setBusy(busy)
    return () => pwaUpdates.setBusy(true)
  }, [busy])
  return useSyncExternalStore(pwaUpdates.subscribe, pwaUpdates.getSnapshot)
}
