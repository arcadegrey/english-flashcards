import { HomeScreen, Statistics, PlanSettingsView } from './pageComponents'
import StudyHub from '../StudyHub'
import AppLayout from '../layout/AppLayout'
import { speak } from '../../utils/speech'

// Pure page assembly: return the original page element without another React wrapper.
export function renderDashboardPage({ navigation, learning, catalog, overview, account, shell }) {
  switch (navigation.view) {
    case 'studyHub':
      return (
        <StudyHub
          key={account.authUser?.id || 'guest'}
          rewardsReady={!account.authLoading && learning.localDataLoaded}
          planReady={overview.planDataReady}
          tomorrowPlan={overview.tomorrowPlan}
          onRetryPlan={navigation.handleRetryPlanPreparation}
          onOpenWordStudy={navigation.handleStartPlanLearning}
          onStartAssignment={navigation.handleStartReadingAssignment}
          onOpenTraining={navigation.handleBackToHome}
          onOpenWordCatalog={navigation.handleOpenWordStudy}
          onOpenReading={navigation.handleOpenReadingList}
          onOpenSuggestedReading={navigation.handleOpenSuggestedReading}
          onOpenTodayReview={navigation.handleOpenTodayReview}
          onOpenWrongWords={navigation.handleOpenWrongWords}
          onOpenStatistics={navigation.handleOpenStatistics}
          onOpenExamPractice={navigation.handleOpenExamPractice}
          onAuthOpen={() => account.setShowAuthModal(true)}
          onAuthSync={account.handleHomeSync}
          authUser={account.authUser}
          syncStatusText={account.getSyncStatusText({
            authLoading: account.authLoading,
            hasUser: Boolean(account.authUser?.id),
            syncState: account.syncState,
            lastSyncedAt: account.lastSyncedAt,
          })}
          accountNotice={account.homeAccountNotice}
          wordCount={overview.planWordCount}
          remainingWordCount={overview.remainingPlanWordCount}
          planCategoryName={overview.planCategoryName}
          isPreparingWords={overview.planPreparing}
          planError={overview.planPreparationError}
          readingCount={overview.readingLibrary.length}
          reviewCount={overview.todayReviewWordList.length}
          wrongCount={overview.wrongWordCount}
          todayWordsLearned={overview.planTodayWordsLearned}
          todayWordsMastered={overview.todayStudyStats.wordsMastered}
          todayReadingsCompleted={overview.todayStudyStats.readingsCompleted}
          todayExamQuestionsAnswered={overview.planTodayExamAnswered}
          todayExamQuestionsCorrect={overview.planTodayExamCorrect}
          suggestedReading={overview.suggestedReading}
          studyHistory={learning.studyHistory}
          newWordTarget={learning.dailyNewWordTarget}
          onAdjustPlan={navigation.handleOpenPlanSettings}
          isDarkTheme={shell.isDark}
          onThemeToggle={shell.toggleTheme}
          onVoiceSettings={() => shell.setShowVoiceSettings(true)}
        />
      )
    case 'planSettings':
      return (
        <PlanSettingsView
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
          dailyTarget={learning.dailyNewWordTarget}
          todayWordsLearned={overview.planTodayWordsLearned}
          wordCount={overview.planWordCount}
          selectedCategory={learning.studyPlanCategory}
          onSelectCategory={navigation.handleSelectPlanCategory}
          isPreparing={overview.planPreparing}
          preparationError={overview.planPreparationError}
          onSelectDailyTarget={learning.handleSelectDailyNewWordTarget}
          onBack={navigation.handleBackToStudyHub}
          onStartLearning={navigation.handleStartPlanLearning}
        />
      )
    case 'home':
      return (
        <HomeScreen
          onCategorySelect={navigation.handleCategorySelect}
          wordCounts={catalog.wordCounts}
          readingCount={overview.readingLibrary.length}
          readings={overview.readingLibrary}
          vocabularyData={catalog.allVocabulary}
          learnedWordIds={learning.learnedWords}
          masteredWordIds={learning.masteredWords}
          todayReviewWordIds={overview.todayReviewWordList.map((word) => word.id)}
          wrongWordIds={learning.wrongWords}
          onOpenLearnedWords={() => navigation.setView('learnedWords')}
          onOpenMasteredWords={() => navigation.setView('masteredWords')}
          onOpenTodayReview={navigation.handleOpenTodayReview}
          onOpenWrongWords={navigation.handleOpenWrongWords}
          onOpenStatistics={navigation.handleOpenStatistics}
          onOpenExamPractice={navigation.handleOpenExamPractice}
          onOpenToeflLevels={navigation.openToeflLevels}
          onOpenIeltsLists={navigation.openIeltsTopics}
          authEnabled={account.cloudEnabled}
          authLoading={account.authLoading}
          authUser={account.authUser}
          syncStatusText={account.getSyncStatusText({
            authLoading: account.authLoading,
            hasUser: Boolean(account.authUser?.id),
            syncState: account.syncState,
            lastSyncedAt: account.lastSyncedAt,
          })}
          syncError={account.syncError || account.authError}
          onHome={navigation.handleBackToStudyHub}
          onAuthOpen={() => account.setShowAuthModal(true)}
          onSyncAccount={account.handleHomeSync}
          onSpeakIntro={() => speak('English flashcards. Choose a vocabulary category to start.', { rate: 1 })}
          onOpenMode={navigation.handleOpenModeFromHome}
          onOpenReading={navigation.handleOpenReadingList}
          onOpenReadingSession={navigation.handleOpenReadingSession}
          onRetryReading={navigation.handleRetryReading}
          mode={navigation.mode}
          onAuthLogin={account.handleAuthLogin}
          onAuthRegister={account.handleAuthRegister}
          onAuthLogout={account.handleAuthLogout}
          onAuthSyncNow={account.handleManualSync}
          showAuthPanel={false}
          isDarkTheme={shell.isDark}
          onThemeToggle={shell.toggleTheme}
          onVoiceSettings={() => shell.setShowVoiceSettings(true)}
          panelRequest={navigation.homePanelRequest}
          studyHistory={learning.studyHistory}
          dailyTarget={learning.dailyNewWordTarget}
        />
      )
    case 'statistics':
      return (
        <AppLayout
          active="stats"
          navItems={shell.selectionNavItems}
          title="统计"
          subtitle="用真实学习记录追踪复习、错题和认识标记。"
          topbarProps={shell.selectionTopbarProps}
        >
          <Statistics
            learnedWords={learning.learnedWords}
            masteredWords={learning.masteredWords}
            totalWords={overview.statisticsWordCount}
            wrongWords={learning.wrongWords}
            studyHistory={learning.studyHistory}
            dueReviewCount={overview.todayReviewWordList.length}
            ready={!account.authLoading && learning.localDataLoaded}
            authUser={account.authUser}
            onAuthOpen={() => account.setShowAuthModal(true)}
          />
        </AppLayout>
      )
    default:
      return null
  }
}
