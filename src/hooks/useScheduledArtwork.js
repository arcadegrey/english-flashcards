import { useContext, useEffect, useRef, useState } from 'react'
import { HomeArtworkContext } from '../context/home-artwork-context.js'
import { resolveImageAsset } from '../utils/imageAssets.js'

export function useScheduledArtwork(src, { variant, critical = false } = {}) {
  const context = useContext(HomeArtworkContext)
  const target = useRef(null)
  const key = resolveImageAsset(src, variant)
  const immediate = !context || critical
  const [startedKey, setStartedKey] = useState(immediate ? key : null)
  // Keep an image once explicitly selected, including while it is still in flight.
  // This conditional prop adjustment also handles a later source change safely.
  if (immediate && startedKey !== key) setStartedKey(key)
  const allowed = immediate || startedKey === key
  const scheduler = context?.scheduler

  useEffect(() => {
    if (allowed || !scheduler || !key) return
    const node = target.current
    if (!node) return
    let cancelled = false
    let cancel = () => {}
    const enqueue = () => {
      if (cancelled) return
      cancel()
      cancel = scheduler.enqueue(key, () => { if (!cancelled) setStartedKey(key) })
    }
    if (typeof IntersectionObserver === 'undefined') {
      enqueue()
      return () => { cancelled = true; cancel() }
    }
    const observer = new IntersectionObserver(entries => {
      if (cancelled) return
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0) enqueue()
        else cancel()
      }
    }, { rootMargin: '0px', threshold: 0 })
    observer.observe(node)
    return () => { cancelled = true; observer.disconnect(); cancel() }
  }, [allowed, scheduler, key])
  return { target, allowed, paused: context?.paused || false }
}
