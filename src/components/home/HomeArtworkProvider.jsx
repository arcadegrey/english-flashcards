import { useLayoutEffect, useMemo, useState } from 'react'
import { HomeArtworkContext } from '../../context/home-artwork-context.js'
import { createDecorativeImageScheduler } from '../../utils/decorativeImageScheduler.js'

export default function HomeArtworkProvider({ paused, children }) {
  const [scheduler] = useState(() => createDecorativeImageScheduler())
  useLayoutEffect(() => {
    scheduler.connect()
    return () => scheduler.disconnect()
  }, [scheduler])
  useLayoutEffect(() => { scheduler.setPaused(paused) }, [scheduler, paused])
  const value = useMemo(() => ({ scheduler, paused }), [scheduler, paused])
  return <HomeArtworkContext.Provider value={value}>{children}</HomeArtworkContext.Provider>
}
