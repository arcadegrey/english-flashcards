import {
  normalizeProgressState, mergeProgress, areProgressStatesEqual, serializeProgressState, rebaseProgress,
} from '../../utils/progressState.js'
import { createProgressSyncQueue } from '../../utils/progressSync.js'
import { mergeWordBookmarks } from '../../../shared/wordBookmarks.js'
import { mergeLegacyPlanExamActivity } from '../../../shared/studyHistory.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import { storage } from '../../utils/storage'
import { loadCloudProgress, upsertCloudProgress } from '../../utils/workerAuth'

const isBrowserOnline = () => typeof navigator === 'undefined' || navigator.onLine !== false

// Own the upload queue, progress versions, response rebasing and reconnect lifecycle.
export function useCloudProgressSync(session, learning) {
  const {
    cloudEnabled, authLoading, authSession, authUser,
  } = session
  const {
    learningResetRef, latestProgressRef, currentProgress, applyMergedProgress,
  } = learning

  const [syncState, setSyncState] = useState('idle')
  const [syncError, setSyncError] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState('')
  const cloudHydratedRef = useRef(false)
  const cloudSyncTimerRef = useRef(null)
  const [progressSyncQueue] = useState(createProgressSyncQueue)
  const cloudProgressVersionRef = useRef('')
  const lastSyncedProgressRef = useRef('')
  const progressDirtyRef = useRef(false)

  const pushProgressToCloud = useCallback(async (session, user, progress, options = {}) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return ''

    if (!isBrowserOnline()) {
      progressDirtyRef.current = true
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      if (options.requireOnline) {
        throw new Error('当前网络不可用，恢复后将自动同步。')
      }
      return ''
    }

    const requestedVersion = cloudProgressVersionRef.current
    return progressSyncQueue.enqueue(async (isCurrent) => {
      if (String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
      const resetAtStart = learningResetRef.current
      const progressToSync = normalizeProgressState(latestProgressRef.current || progress || {})
      if (String(storage.getLearningOwner()) === String(user.id)) {
        progressToSync.studyHistory = mergeLegacyPlanExamActivity(progressToSync.studyHistory, storage.getPlanExamActivity())
      }

      setSyncState('syncing')
      setSyncError('')

      let syncResult
      try {
        syncResult = await upsertCloudProgress({
          progress: progressToSync,
          expectedUserId: user.id,
          baseUpdatedAt:
            typeof options.baseUpdatedAt === 'string' && requestedVersion === cloudProgressVersionRef.current
              ? options.baseUpdatedAt
              : cloudProgressVersionRef.current,
        })
      } catch (error) {
        if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
        progressDirtyRef.current = true
        setSyncState('error')
        setSyncError(error?.message || '同步失败，请重试')
        throw error
      }
      if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return ''
      const syncedAtIso = syncResult?.updatedAt || new Date().toISOString()
      cloudProgressVersionRef.current = syncedAtIso

      const syncedProgress = normalizeProgressState(syncResult?.progress || progressToSync)
      const rebased = rebaseProgress(progressToSync, latestProgressRef.current || progressToSync, syncedProgress,
        { resetLearning: learningResetRef.current !== resetAtStart })
      if (!areProgressStatesEqual(latestProgressRef.current, rebased)) {
        applyMergedProgress(rebased)
      }

      const syncedAtText = new Date(syncedAtIso).toLocaleString('zh-CN', {
        hour12: false,
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })

      const syncedSnapshot = serializeProgressState(syncedProgress)
      const latestSnapshot = serializeProgressState(latestProgressRef.current || progressToSync)
      lastSyncedProgressRef.current = syncedSnapshot

      if (latestSnapshot === syncedSnapshot) {
        progressDirtyRef.current = false
        setSyncState('synced')
        setSyncError('')
      } else {
        progressDirtyRef.current = true
        setSyncState('pending')
        setSyncError('')
      }

      setLastSyncedAt(syncedAtText)
      return syncedAtText
    })
  }, [applyMergedProgress, cloudEnabled, latestProgressRef, learningResetRef, progressSyncQueue])

  const hydrateFromCloud = useCallback(async ({ session, user, localProgress }) => {
    if (!cloudEnabled || !session?.access_token || !user?.id) return

    const hydrated = await progressSyncQueue.enqueue(async (isCurrent) => {
      if (String(storage.getAuthSession()?.user?.id) !== String(user.id)) return null
      const localAtStart = normalizeProgressState(latestProgressRef.current || localProgress || {})
      const resetAtStart = learningResetRef.current
      const { progress: cloudProgress, updatedAt } = await loadCloudProgress(user.id)
      if (!isCurrent() || String(storage.getAuthSession()?.user?.id) !== String(user.id)) return null

      const merged = rebaseProgress(localAtStart, latestProgressRef.current || localAtStart, mergeProgress(localAtStart, cloudProgress),
        { resetLearning: learningResetRef.current !== resetAtStart })
      if (String(storage.getLearningOwner()) === String(user.id)) {
        merged.studyHistory = mergeLegacyPlanExamActivity(merged.studyHistory, storage.getPlanExamActivity())
      }
      merged.preferences.wordBookmarks = mergeWordBookmarks(merged.preferences.wordBookmarks, storage.getWordBookmarks())

      applyMergedProgress(merged)
      cloudProgressVersionRef.current = updatedAt
      cloudHydratedRef.current = true
      return isCurrent
    })
    if (hydrated?.()) await pushProgressToCloud(session, user, latestProgressRef.current)

  }, [cloudEnabled, progressSyncQueue, pushProgressToCloud, latestProgressRef, learningResetRef, applyMergedProgress])

  const flushCloudProgress = useCallback(() => {
    if (!cloudEnabled || authLoading || !cloudHydratedRef.current) {
      return Promise.resolve('')
    }

    if (!authSession?.access_token || !authUser?.id) {
      return Promise.resolve('')
    }

    const progress = latestProgressRef.current || currentProgress
    const progressSnapshot = serializeProgressState(progress)
    if (!progressDirtyRef.current && progressSnapshot === lastSyncedProgressRef.current) {
      return Promise.resolve('')
    }

    if (!isBrowserOnline()) {
      progressDirtyRef.current = true
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      return Promise.resolve('')
    }

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current)
      cloudSyncTimerRef.current = null
    }

    return pushProgressToCloud(authSession, authUser, progress).catch((error) => {
      progressDirtyRef.current = true
      setSyncState('error')
      setSyncError(error?.message || '自动同步失败')
      throw error
    })
  }, [authLoading, authSession, authUser, cloudEnabled, currentProgress, latestProgressRef, pushProgressToCloud])

  useEffect(() => {
    if (!cloudEnabled || authLoading || !cloudHydratedRef.current) {
      return
    }

    if (!authSession?.access_token || !authUser?.id) {
      return
    }

    const progressSnapshot = serializeProgressState(currentProgress)
    if (!progressDirtyRef.current && progressSnapshot === lastSyncedProgressRef.current) {
      return
    }

    progressDirtyRef.current = true

    if (!isBrowserOnline()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Mirror the external network/queue state for this snapshot.
      setSyncState('pending')
      setSyncError('网络恢复后将自动同步')
      return
    }

    setSyncState((previousState) => (previousState === 'syncing' ? previousState : 'pending'))
    setSyncError('')

    if (cloudSyncTimerRef.current) {
      clearTimeout(cloudSyncTimerRef.current)
    }

    cloudSyncTimerRef.current = setTimeout(() => {
      flushCloudProgress().catch(() => {
        // Error state is set inside flushCloudProgress.
      })
    }, 1200)

    return () => {
      if (cloudSyncTimerRef.current) {
        clearTimeout(cloudSyncTimerRef.current)
      }
    }
  }, [
    authLoading,
    authSession,
    authUser,
    cloudEnabled,
    currentProgress,
    flushCloudProgress,
  ])

  useEffect(() => {
    if (!cloudEnabled) return undefined

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushCloudProgress().catch(() => {})
      }
    }

    const handlePageHide = () => {
      flushCloudProgress().catch(() => {})
    }

    const handleOnline = () => {
      if (progressDirtyRef.current) {
        setSyncState('pending')
        setSyncError('')
      }
      const operation = !cloudHydratedRef.current && authSession?.access_token && authUser?.id
        ? hydrateFromCloud({ session: authSession, user: authUser }) : flushCloudProgress()
      operation.catch((error) => { setSyncState('error'); setSyncError(error.message || '同步失败，请重试') })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('online', handleOnline)
    }
  }, [authSession, authUser, cloudEnabled, flushCloudProgress, hydrateFromCloud])

  const beginProgressSession = () => {
    progressSyncQueue.invalidate()
    cloudHydratedRef.current = false
    cloudProgressVersionRef.current = ''
    lastSyncedProgressRef.current = ''
    progressDirtyRef.current = false
  }

  const handleManualSync = async () => {
    if (!authSession?.access_token || !authUser?.id) {
      throw new Error('请先登录账号')
    }

    if (!cloudHydratedRef.current) {
      try { await hydrateFromCloud({ session: authSession, user: authUser }) }
      catch (error) { setSyncState('error'); setSyncError(error.message || '同步失败，请重试'); throw error }
      return { message: '云端进度已恢复并同步。' }
    }

    const syncedAtText = await pushProgressToCloud(
      authSession,
      authUser,
      latestProgressRef.current || currentProgress,
      { requireOnline: true }
    )
    return { message: syncedAtText ? `同步完成（${syncedAtText}）` : '同步完成。' }
  }

  useEffect(() => () => {
    if (cloudSyncTimerRef.current) clearTimeout(cloudSyncTimerRef.current)
  }, [])

  return {
    syncState, syncError, lastSyncedAt, setSyncState, setSyncError, setLastSyncedAt, cloudProgressVersionRef,
    cloudHydratedRef, lastSyncedProgressRef, progressDirtyRef, beginProgressSession, hydrateFromCloud,
    flushCloudProgress, handleManualSync,
  }
}
