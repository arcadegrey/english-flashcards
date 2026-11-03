import { LearningView, ReadingSessionView, ExamPracticeView, CollectionPracticeView, CollectionAssessmentPage } from './pageComponents'
import { getStudyDateKey } from '../../../shared/studyDate.js'
import { getAccountRoleLabel } from '../../utils/classroom'
import { COLLECTION_PRACTICE_SOURCES } from '../../../shared/collectionPractice.js'

// Pure page assembly: return the original page element without another React wrapper.
export function renderLearningPage(features) {
  const { navigation, learning, overview, account, shell } = features
  switch (navigation.view) {
    case 'examPractice':
      return (
        <ExamPracticeView
          syncing={account.syncState === 'syncing'}
          onBack={navigation.handleBackToStudyHub}
          onHome={navigation.handleBackToStudyHub}
          onSelectMode={navigation.handleStartExamPractice}
          selectedScope={navigation.examScope}
          onSelectScope={navigation.handleSelectExamScope}
          learnedCount={overview.planLearnedCount}
          masteredCount={overview.planMasteredCount}
          totalCount={overview.planWordCount}
          categoryName={overview.planCategoryName}
          isPreparing={navigation.examPreparing || overview.planPreparing}
          preparationError={navigation.examPreparationError?.message}
          onRetryPreparation={() => {
            if (navigation.examPreparationError) navigation.handleStartExamPractice(navigation.examPreparationError.mode, navigation.examPreparationError.scope)
          }}
          onSyncAccount={account.handleHomeSync}
          mode={navigation.mode}
          onOpenMode={(nextMode) => navigation.handleStartExamPractice(nextMode, navigation.examScope)}
          onOpenReading={navigation.handleOpenReadingList}
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
        />
      )
    case 'readingSession':
      return (
        <ReadingSessionView
          key={`${account.authUser?.id || 'guest'}:${navigation.readingRetry?.id || navigation.activeReadingAssignment?.id || navigation.selectedReadingId}`}
          userId={account.authUser?.id}
          assignment={navigation.activeReadingAssignment}
          retryAttempt={navigation.readingRetry}
          onSubmitAssignment={navigation.handleSubmitReadingAssignment}
          article={navigation.selectedReading}
          loading={navigation.readingLoading}
          loadError={navigation.readingError}
          onRetryLoad={navigation.retryReadingLoad}
          mode={navigation.mode}
          onBack={navigation.handleBackToReadingList}
          onOpenMode={navigation.handleOpenModeFromReading}
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
          masteredWords={learning.masteredWords}
          wordLookup={navigation.readingWordLookup}
          onMarkAsLearned={learning.setWordAsLearned}
          onMarkAsMastered={learning.setWordAsMastered}
          onSyncAccount={account.handleHomeSync}
          onCompleteReading={learning.recordReadingCompletion}
          isCompletedToday={overview.todayStudyStats.readingArticleIds.includes(String(navigation.selectedReading?.id))}
          completedResult={learning.studyHistory.find((day) => day.date === getStudyDateKey())?.readingArticleResults?.find((result) => result.articleId === String(navigation.selectedReading?.id))}
        />
      )
    case 'collectionPractice':
      return <CollectionPracticeView practice={navigation.collectionPractice}
        navItems={shell.selectionNavItems} topbarProps={shell.selectionTopbarProps} />
    case 'collectionAssessment':
      return <CollectionAssessmentPage
        key={`${account.authUser?.id || 'guest'}:${navigation.collectionRoute?.source}:${navigation.collectionRoute?.key}:${navigation.mode}`}
        practice={navigation.collectionPractice} route={navigation.collectionRoute} mode={navigation.mode}
        customWords={learning.customWords} navItems={shell.selectionNavItems} topbarProps={shell.selectionTopbarProps}>
        {focused => renderWordLearningSession(features, focused)}
      </CollectionAssessmentPage>
    case 'learn':
      return renderWordLearningSession(features)

    default:
      return null
  }
}

function renderWordLearningSession({ navigation, learning, catalog, overview, account, shell }, focusedPractice) {
  return (
    <LearningView
    key={focusedPractice ? `${account.authUser?.id || 'guest'}:${focusedPractice.snapshot.source}:${focusedPractice.snapshot.key}:${navigation.mode}` : account.authUser?.id || 'guest'}
    mode={navigation.mode}
    setMode={focusedPractice ? navigation.collectionPractice.changeMode : navigation.setMode}
    allVocabulary={focusedPractice?.words || catalog.allVocabulary}
    currentWord={navigation.currentWord}
    nextWord={navigation.shuffledWords[navigation.currentIndex + 1]}
    filteredVocabulary={focusedPractice?.words || (navigation.mode === 'learn' ? navigation.shuffledWords : catalog.filteredVocabulary)}
    currentIndex={navigation.currentIndex}
    onMarkLearned={navigation.markAsLearned}
    onMarkMastered={navigation.markAsMastered}
    masteredWords={learning.masteredWords}
    examScope={focusedPractice ? 'all' : navigation.examScope}
    examCategory={focusedPractice ? 'all' : learning.studyPlanCategory}
    onAddMastered={learning.setWordAsMastered}
    onWrongAnswer={(id) => {
      learning.addWrongWord(id)
      learning.setWordAsLearned(id)
    }}
    onAssessmentAnswer={focusedPractice ? correct => learning.recordAssessmentAnswer(correct, 'all') : learning.recordAssessmentAnswer}
    categoryName={focusedPractice ? COLLECTION_PRACTICE_SOURCES[focusedPractice.snapshot.source] : catalog.currentCategoryName}
    dailyTarget={!focusedPractice && navigation.mode === 'learn' && navigation.assessmentBackTarget === 'studyHub' ? learning.dailyNewWordTarget : undefined}
    todayWordsStudied={overview.planTodayWordsLearned}
    learnedWords={learning.learnedWords}
    resetProgress={navigation.resetProgress}
    onBack={focusedPractice ? navigation.collectionPractice.backToPicker : navigation.handleLearningBack}
    onHome={navigation.handleBackToStudyHub}
    onSyncAccount={account.handleHomeSync}
    onOpenReading={navigation.handleOpenReadingList}
    onOpenStudyHub={navigation.handleBackToHome}
    onOpenWordStudy={navigation.handleOpenWordStudy}
    onOpenTodayReview={navigation.handleOpenTodayReview}
    onOpenExamPractice={navigation.handleOpenExamPractice}
    onOpenStatistics={navigation.handleOpenStatistics}
    onOpenWrongWords={navigation.handleOpenWrongWords}
    isDarkTheme={shell.isDark}
    onThemeToggle={shell.toggleTheme}
    onVoiceSettings={() => shell.setShowVoiceSettings(true)}
    onUserClick={() => account.setShowAuthModal(true)}
    userLabel={account.authUser?.email ? getAccountRoleLabel(account.authUser) : account.authLoading ? '同步中' : '未登录'}
    focusedPractice={focusedPractice}
    studyHistory={learning.studyHistory}
  />
  )
}
