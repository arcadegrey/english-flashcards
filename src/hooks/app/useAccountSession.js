import { mergeProgress } from '../../utils/progressState.js'
import { mergeWordBookmarks } from '../../../shared/wordBookmarks.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import { storage, WORD_BOOKMARKS_STORAGE_KEY } from '../../utils/storage'
import {
  fetchCurrentUser, isCloudAuthConfigured, refreshSession, signInWithEmail, signOut, signUpWithEmail,
} from '../../utils/workerAuth'
import { useCloudProgressSync } from './useCloudProgressSync.js'

const AUTH_TRANSITION_MIN_MS = 900

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getSyncStatusText = ({ authLoading, hasUser, syncState, lastSyncedAt }) => {
  if (authLoading) return '初始化中'
  if (!hasUser) return '未登录'
  if (syncState === 'syncing') return '同步中'
  if (syncState === 'pending') return '待同步'
  if (syncState === 'error') return '同步失败'
  if (syncState === 'synced' && lastSyncedAt) return `已同步 ${lastSyncedAt}`
  return '已连接'
}

// Own account identity, guest/account transitions and account feedback.
export function useAccountSession(learning, navigationState) {
  const {
    localDataLoaded, latestProgressRef, setWordBookmarks, setPlanExamActivity, applyMergedProgress,
  } = learning
  const {
    setView, setActiveReadingAssignment, setActiveWordAssignment, setReadingRetry,
  } = navigationState

  const cloudEnabled = isCloudAuthConfigured()
  const [authLoading, setAuthLoading] = useState(cloudEnabled)
  const [authUser, setAuthUser] = useState(null)
  const [authSession, setAuthSession] = useState(null)
  const [authError, setAuthError] = useState('')
  const authBootstrappedRef = useRef(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const closeAuthModal = useCallback(() => setShowAuthModal(false), [])
  const [homeAccountNotice, setHomeAccountNotice] = useState(null)
  const [authTransition, setAuthTransition] = useState(null)
  const homeNoticeTimerRef = useRef(null)

  const sync = useCloudProgressSync({ cloudEnabled, authLoading, authSession, authUser }, learning)
  const {
    syncState, syncError, lastSyncedAt, setSyncState, setSyncError, setLastSyncedAt, cloudProgressVersionRef,
    cloudHydratedRef, lastSyncedProgressRef, progressDirtyRef, beginProgressSession, hydrateFromCloud,
    flushCloudProgress, handleManualSync,
  } = sync

  useEffect(() => {
    const accountChanged = (event) => {
      if (event.key !== 'flashcards_auth_session') return
      let nextUserId
      try { nextUserId = JSON.parse(event.newValue || 'null')?.user?.id } catch { return }
      if (String(nextUserId || '') !== String(authUser?.id || '')) window.location.reload()
    }
    window.addEventListener('storage', accountChanged)
    return () => window.removeEventListener('storage', accountChanged)
  }, [authUser?.id])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== WORD_BOOKMARKS_STORAGE_KEY || String(storage.getLearningOwner()) !== String(authUser?.id || 'guest')) return
      setWordBookmarks((current) => mergeWordBookmarks(current, storage.getWordBookmarks()))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [authUser?.id, setWordBookmarks])

  const ensureFreshSession = useCallback(async (session) => {
    if (!session?.access_token) return null

    const now = Math.floor(Date.now() / 1000)
    const expiresAt = Number(session.expires_at || 0)
    if (expiresAt && expiresAt - now > 60) {
      return session
    }

    const refreshed = await refreshSession()
    return refreshed.session
  }, [])

  useEffect(() => {
    if (!localDataLoaded || authBootstrappedRef.current) {
      return
    }

    authBootstrappedRef.current = true
    if (!cloudEnabled) {
      setAuthLoading(false)
      return
    }

    const bootstrap = async () => {
      setAuthLoading(true)
      setAuthError('')
      const savedSession = storage.getAuthSession()
      if (!savedSession) {
        setAuthLoading(false)
        setSyncState('idle')
        cloudProgressVersionRef.current = ''
        return
      }

      try {
        const activeSession = await ensureFreshSession(savedSession)
        if (!activeSession) {
          throw new Error('登录已过期，请重新登录。')
        }

        const user = await fetchCurrentUser()
        const verifiedSession = { ...activeSession, user }
        const localProgress = String(storage.getLearningOwner()) === String(user.id)
          ? latestProgressRef.current : storage.switchLearningAccount(user.id, latestProgressRef.current)
        applyMergedProgress(localProgress)
        latestProgressRef.current = localProgress
        storage.setAuthSession(verifiedSession)
        setAuthSession(verifiedSession)
        setAuthUser(user)
        await hydrateFromCloud({ session: verifiedSession, user, localProgress })
      } catch (error) {
        if (error.status !== 401 && savedSession.user?.id) {
          // Cached identity only scopes local drafts; server permissions still use the cookie.
          setAuthSession(savedSession)
          setAuthUser(savedSession.user)
          setSyncState('pending')
          setSyncError('云端暂不可用，本机学习记录已保留，请重试同步。')
        } else {
          try {
            const guestProgress = storage.switchLearningAccount(null, latestProgressRef.current)
            applyMergedProgress(guestProgress)
            latestProgressRef.current = guestProgress
            setPlanExamActivity(guestProgress.planExamActivity || {})
          } catch { /* Preserve the existing cache if browser storage is unavailable. */ }
          storage.clearAuthSession()
          setAuthSession(null)
          setAuthUser(null)
          setAuthError(error?.message || '恢复登录失败')
          setSyncState('error')
          setSyncError(error?.message || '恢复登录失败')
          cloudProgressVersionRef.current = ''
        }
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrap()
  }, [applyMergedProgress, cloudEnabled, cloudProgressVersionRef, ensureFreshSession, hydrateFromCloud, latestProgressRef, localDataLoaded, setPlanExamActivity, setSyncError, setSyncState])

  const handleAuthLogin = async ({ email, password, verificationCode }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const shouldShowTransition = Boolean(String(verificationCode || password || '').trim())
    let transitionStartedAt = 0

    if (shouldShowTransition) {
      transitionStartedAt = Date.now()
      setAuthTransition({
        mode: 'login',
        title: '正在登录',
        detail: '正在同步你的学习进度',
      })
    }

    try {
      const { session, user, pendingVerification, message } = await signInWithEmail({
        email,
        password,
        verificationCode,
      })
      if (!session || pendingVerification) {
        return {
          message: message || '登录验证码已发送，请输入验证码完成登录。',
          sessionReady: false,
        }
      }
      beginProgressSession()
      const guestProgress = storage.getLearningOwner() === 'guest' ? latestProgressRef.current : null
      const accountProgress = storage.switchLearningAccount(user.id, latestProgressRef.current)
      const localProgress = guestProgress ? mergeProgress(guestProgress, accountProgress) : accountProgress
      applyMergedProgress(localProgress)
      latestProgressRef.current = localProgress
      setPlanExamActivity(accountProgress.planExamActivity || {})
      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(user)
      await hydrateFromCloud({ session, user, localProgress })
      return { message: message || '登录成功，进度已同步。', sessionReady: true }
    } finally {
      if (shouldShowTransition) {
        const elapsed = Date.now() - transitionStartedAt
        if (elapsed < AUTH_TRANSITION_MIN_MS) {
          await wait(AUTH_TRANSITION_MIN_MS - elapsed)
        }
        setAuthTransition(null)
      }
    }
  }

  const handleAuthRegister = async ({ email, verificationCode, role, displayName }) => {
    if (!cloudEnabled) {
      throw new Error('云端账号服务未配置')
    }

    setAuthError('')
    const shouldShowTransition = Boolean(String(verificationCode || '').trim())
    let transitionStartedAt = 0

    if (shouldShowTransition) {
      transitionStartedAt = Date.now()
      setAuthTransition({
        mode: 'register',
        title: '正在创建账号',
        detail: '正在准备你的学习空间',
      })
    }

    try {
      const { session, user, emailConfirmationRequired, message } = await signUpWithEmail({
        email,
        verificationCode,
        role,
        displayName,
      })
      if (!session) {
        return {
          message:
            message ||
            (emailConfirmationRequired
              ? '验证码已发送，请输入验证码完成注册。'
              : '注册成功，请登录。'),
          sessionReady: false,
        }
      }

      const accountUser = user || session.user
      beginProgressSession()
      const guestProgress = storage.getLearningOwner() === 'guest' ? latestProgressRef.current : null
      const accountProgress = storage.switchLearningAccount(accountUser.id, latestProgressRef.current)
      const localProgress = guestProgress ? mergeProgress(guestProgress, accountProgress) : accountProgress
      applyMergedProgress(localProgress)
      latestProgressRef.current = localProgress
      setPlanExamActivity(accountProgress.planExamActivity || {})
      storage.setAuthSession(session)
      setAuthSession(session)
      setAuthUser(accountUser)
      await hydrateFromCloud({ session, user: accountUser, localProgress })
      return { message: message || '注册并登录成功，进度已同步。', sessionReady: true }
    } finally {
      if (shouldShowTransition) {
        const elapsed = Date.now() - transitionStartedAt
        if (elapsed < AUTH_TRANSITION_MIN_MS) {
          await wait(AUTH_TRANSITION_MIN_MS - elapsed)
        }
        setAuthTransition(null)
      }
    }
  }

  const handleAuthLogout = async ({ allDevices = false } = {}) => {
    if (authSession?.access_token && authUser?.id) {
      try {
        await flushCloudProgress()
      } catch {
        // Sign-out should still work if the final best-effort sync fails.
      }
    }

    if (authSession?.access_token) {
      // Do not report remote revocation as successful when the request failed.
      await signOut({ allDevices, expectedUserId: authUser?.id })
    }

    beginProgressSession()
    const guestProgress = storage.switchLearningAccount(null, latestProgressRef.current)
    applyMergedProgress(guestProgress)
    latestProgressRef.current = guestProgress
    setPlanExamActivity(guestProgress.planExamActivity || {})
    setActiveReadingAssignment(null)
    setActiveWordAssignment(null)
    setReadingRetry(null)
    setView('studyHub')
    storage.clearAuthSession()
    setAuthSession(null)
    setAuthUser(null)
    setAuthError('')
    setSyncState('idle')
    setSyncError('')
    setLastSyncedAt('')
    cloudProgressVersionRef.current = ''
    cloudHydratedRef.current = false
    lastSyncedProgressRef.current = ''
    progressDirtyRef.current = false
  }

  const showNotice = (message, type = 'info') => {
    if (!message) return
    setHomeAccountNotice({ message, type })
    if (homeNoticeTimerRef.current) {
      clearTimeout(homeNoticeTimerRef.current)
    }
    homeNoticeTimerRef.current = setTimeout(() => {
      setHomeAccountNotice(null)
    }, 3200)
  }

  const handleHomeSync = async () => {
    if (!cloudEnabled) {
      showNotice('未配置云端账号服务，暂时无法同步账号。', 'error')
      return { ok: false, message: '未配置云端账号服务，暂时无法同步账号。' }
    }

    if (authLoading) {
      showNotice('账号初始化中，请稍后再试。', 'info')
      return { ok: false, message: '账号初始化中，请稍后再试。' }
    }

    if (!authUser?.id) {
      setShowAuthModal(true)
      showNotice('请先登录账号，再执行同步。', 'error')
      return { ok: false, message: '请先登录账号，再执行同步。' }
    }

    try {
      const result = await handleManualSync()
      showNotice(result?.message || '同步完成。', 'success')
      return { ok: true, message: result?.message || '同步完成。' }
    } catch (error) {
      const message = error?.message || '同步失败，请稍后重试。'
      showNotice(message, 'error')
      return { ok: false, message }
    }
  }

  const handleModalLogin = async (payload) => {
    const result = await handleAuthLogin(payload)
    if (result?.sessionReady) {
      setShowAuthModal(false)
      showNotice(result?.message || '登录成功，进度已同步。', 'success')
    } else {
      showNotice(result?.message || '验证码已发送，请输入后完成登录。', 'info')
    }
    return result
  }

  const handleModalRegister = async (payload) => {
    const result = await handleAuthRegister(payload)
    if (result?.sessionReady) {
      setShowAuthModal(false)
      showNotice(result?.message || '注册并登录成功，进度已同步。', 'success')
    }
    return result
  }

  const handleModalLogout = async (options = {}) => {
    await handleAuthLogout(options)
    showNotice(options.allDevices ? '已退出全部设备。' : '已退出当前设备。', 'info')
  }

  const handleModalSyncNow = async () => {
    const result = await handleManualSync()
    showNotice(result?.message || '同步完成。', 'success')
    return result
  }

  const handleClassroomProfileUpdated = useCallback((user) => {
    setAuthUser((current) => JSON.stringify(current) === JSON.stringify(user) ? current : user)
    const session = storage.getAuthSession()
    if (session?.access_token && JSON.stringify(session.user) !== JSON.stringify(user)) {
      const updatedSession = { ...session, user }
      storage.setAuthSession(updatedSession)
      setAuthSession(updatedSession)
    }
  }, [])

  useEffect(() => () => {
    if (homeNoticeTimerRef.current) clearTimeout(homeNoticeTimerRef.current)
  }, [])

  return {
    cloudEnabled, authLoading, authUser, authError, syncState, syncError, lastSyncedAt, showAuthModal,
    setShowAuthModal, closeAuthModal, homeAccountNotice, authTransition, handleAuthLogin, handleAuthRegister,
    handleAuthLogout, handleManualSync, handleHomeSync, handleModalLogin, handleModalRegister,
    handleModalLogout, handleModalSyncNow, handleClassroomProfileUpdated, getSyncStatusText,
  }
}
