import AccountModal from './components/account/AccountModal.jsx'
import LoadingState from './components/ui/LoadingState'
import PageLoadBoundary from './components/PageLoadBoundary.jsx'
import { useStudyDay } from './hooks/useStudyDay.js'
import { WordBookmarksContext } from './context/word-bookmarks-context'
import { useState, useMemo, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './context/theme-context'
import ExamHistoryProvider from './context/ExamHistoryProvider'
import { getAccountRoleLabel } from './utils/classroom'
import { useLearningProgress } from './hooks/app/useLearningProgress.js'
import { useAccountSession } from './hooks/app/useAccountSession.js'
import { useVocabularyCatalog } from './hooks/app/useVocabularyCatalog.js'
import { useStudyOverview } from './hooks/app/useStudyOverview.js'
import { useAppNavigationState } from './hooks/app/useAppNavigationState.js'
import { useStudyNavigation } from './hooks/app/useStudyNavigation.js'
import AppPages from './components/app/AppPages.jsx'

const VoiceSettings = lazy(() => import('./components/VoiceSettings'))

function AppContent() {
  const studyDay = useStudyDay()
  const { isDark, toggleTheme } = useTheme()
  const navigationState = useAppNavigationState()
  const learning = useLearningProgress()
  const catalog = useVocabularyCatalog(learning, navigationState)
  const overview = useStudyOverview(learning, catalog, navigationState, { studyDay })
  const account = useAccountSession(learning, navigationState)
  const actions = useStudyNavigation(navigationState, learning, catalog, overview, account)
  const navigation = { ...navigationState, ...actions }
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)

  const renderAuthTransitionOverlay = () => {
    if (!account.authTransition) return null

    return <LoadingState variant="overlay" title={account.authTransition.title} detail={account.authTransition.detail}
      kicker={account.authTransition.mode === 'register' ? '欢迎加入' : '欢迎回来'} />
  }

  const appBackground = useMemo(() => {
    if (
      navigation.view === 'studyHub' ||
      navigation.view === 'home' ||
      navigation.view === 'toeflLevels' ||
      navigation.view === 'toeflLists' ||
      navigation.view === 'ieltsTopics' ||
      navigation.view === 'ieltsLists'
    ) {
      return isDark ? 'bg-[#0b1120]' : 'bg-[#f8fafc]'
    }

    if (
      navigation.view === 'learn' ||
      navigation.view === 'learnedWords' ||
      navigation.view === 'masteredWords' ||
      navigation.view === 'savedWords' ||
      navigation.view === 'todayReview' ||
      navigation.view === 'wrongWords' ||
      navigation.view === 'planSettings' ||
      navigation.view === 'readingSession' ||
      navigation.view === 'wordAssignment' ||
      navigation.view === 'statistics' ||
      navigation.view === 'examPractice'
    ) {
      return isDark ? 'bg-[#0b1120]' : 'bg-[#fbfbfd]'
    }

    return isDark
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100'
  }, [isDark, navigation.view])

  if (catalog.vocabularyLoading) {
    return <LoadingState variant="screen" title="正在加载词库" detail="首次打开会缓存到本机，之后会更快。" />
  }

  if (catalog.vocabularyError) {
    return (
      <div className={`min-h-screen ${appBackground} flex items-center justify-center px-4`}>
        <div className="w-full max-w-[380px] rounded-[16px] border border-[#fecaca] bg-[var(--app-surface)] p-6 text-center shadow-[var(--app-shadow)]">
          <p className="text-lg font-semibold text-[#991b1b]">词库加载失败</p>
          <p className="mt-2 text-sm text-[var(--app-muted)]">{catalog.vocabularyError}</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#374151]"
            onClick={() => catalog.setVocabularyReloadKey((key) => key + 1)}
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const selectionNavItems = [
    { id: 'plan', label: '今日计划', icon: 'plan', onClick: navigation.handleBackToStudyHub },
    { id: 'training', label: '训练中心', icon: 'training', onClick: navigation.handleBackToHome },
    { id: 'words', label: '单词', icon: 'words', onClick: navigation.handleOpenWordStudy },
    { id: 'reading', label: '阅读', icon: 'reading', onClick: navigation.handleOpenReadingList },
    { id: 'review', label: '复习', icon: 'review', onClick: navigation.handleOpenTodayReview },
    { id: 'test', label: '测试', icon: 'test', onClick: navigation.handleOpenExamPractice },
    { id: 'stats', label: '统计', icon: 'stats', onClick: navigation.handleOpenStatistics },
  ]

  const selectionTopbarProps = {
    onCalendar: navigation.handleOpenStatistics,
    onNotify: navigation.handleOpenWrongWords,
    notifyBadge: learning.wrongWords.length ? String(Math.min(learning.wrongWords.length, 9)) : undefined,
    onThemeToggle: toggleTheme,
    isDarkTheme: isDark,
    onVoiceSettings: () => setShowVoiceSettings(true),
    onUserClick: () => account.setShowAuthModal(true),
    userLabel: account.authUser?.email ? getAccountRoleLabel(account.authUser) : account.authLoading ? '同步中' : '未登录',
    sidebarProps: { studyHistory: learning.studyHistory },
  }

  const wordBookmarkContext = {
    entries: learning.wordBookmarks,
    ownerId: account.authUser?.id || 'guest',
    disabled: account.authLoading || Boolean(account.authTransition),
    toggle: (wordId, saved) => learning.toggleWordBookmark(account.authUser?.id, wordId, saved),
    onOpen: navigation.handleOpenSavedWords,
  }
  const shell = { selectionNavItems, selectionTopbarProps, isDark, toggleTheme, setShowVoiceSettings }

  return (
    <div className={`min-h-screen ${appBackground}`}>
      <WordBookmarksContext.Provider value={wordBookmarkContext}>
        <ExamHistoryProvider key={account.authUser?.id || 'guest'} ownerId={account.authUser?.id}>
          <PageLoadBoundary key={navigation.view}>
            <Suspense fallback={<LoadingState variant="screen" title="正在准备学习页面…" />}>
              <AppPages navigation={navigation} learning={learning} catalog={catalog} overview={overview} account={account} shell={shell} />
            </Suspense>
          </PageLoadBoundary>
        </ExamHistoryProvider>
      </WordBookmarksContext.Provider>
      {showVoiceSettings && <PageLoadBoundary><Suspense fallback={<LoadingState variant="overlay" title="正在准备语音设置…" />}><VoiceSettings onClose={() => setShowVoiceSettings(false)} /></Suspense></PageLoadBoundary>}
      <AccountModal
        open={account.showAuthModal}
        onClose={account.closeAuthModal}
        enabled={account.cloudEnabled}
        loading={account.authLoading}
        user={account.authUser}
        learnedCount={learning.learnedWords.length}
        masteredCount={learning.masteredWords.length}
        onOpenSavedWords={navigation.handleOpenSavedWords}
        syncStatusText={account.getSyncStatusText({ authLoading: account.authLoading, hasUser: Boolean(account.authUser?.id), syncState: account.syncState, lastSyncedAt: account.lastSyncedAt })}
        syncError={account.syncError || account.authError}
        onLogin={account.handleModalLogin}
        onRegister={account.handleModalRegister}
        onLogout={account.handleModalLogout}
        onSyncNow={account.handleModalSyncNow}
        onOpenClassroom={navigation.handleOpenClassroom}
      />
      {renderAuthTransitionOverlay()}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
