import AssetImage from './AssetImage.jsx'
import { useScheduledArtwork } from '../../hooks/useScheduledArtwork.js'

export default function ScheduledAssetImage({ src, variant, critical = false, ...props }) {
  const { target, allowed, paused } = useScheduledArtwork(src, { variant, critical })
  if (!allowed) return <img ref={target} decoding="async" {...props} />
  return <AssetImage ref={target} src={src} variant={variant} retryPaused={paused} {...props} />
}
