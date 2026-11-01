import { useSyncExternalStore } from 'react'
import { pwaUpdates } from '../../utils/pwaUpdates.js'
import { BaseCard } from '../ui/Cards.jsx'
import { PrimaryButton, SecondaryButton } from '../ui/Buttons.jsx'

export default function PwaUpdateNotice() {
  const update = useSyncExternalStore(pwaUpdates.subscribe, pwaUpdates.getSnapshot)
  if (!update.available || update.dismissed || update.busy) return null
  return <BaseCard className="ds-update-notice" role="status" aria-label="应用更新">
    <div><strong>新版本已准备好</strong><p>{update.message || '更新会刷新页面，已保存的学习记录会保留。'}</p></div>
    <div className="ds-update-actions">
      <SecondaryButton onClick={() => pwaUpdates.dismiss()}>稍后</SecondaryButton>
      <PrimaryButton onClick={() => { void pwaUpdates.apply() }}>更新并刷新</PrimaryButton>
    </div>
  </BaseCard>
}
