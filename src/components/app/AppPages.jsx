import { TOEFL_UNKNOWN_LEVEL } from '../../utils/vocabularyCatalog.js'
import { getStudyDateKey } from '../../../shared/studyDate.js'
import { lazy } from 'react'
import StudyHub from '../StudyHub'
import AppLayout from '../layout/AppLayout'
import { getAccountRoleLabel } from '../../utils/classroom'
import { speak } from '../../utils/speech'

const WordAssignmentSession = lazy(() => import('../classroom/WordAssignmentSession'))
const HomeScreen = lazy(() => import('../HomeScreen'))
const LearningView = lazy(() => import('../LearningView'))
const Statistics = lazy(() => import('../Statistics'))
const WordCollectionView = lazy(() => import('../WordCollectionView'))
const ToeflSelectionView = lazy(() => import('../ToeflSelectionView'))
const ReadingSessionView = lazy(() => import('../ReadingSessionView'))
const ExamPracticeView = lazy(() => import('../ExamPracticeView'))
const PlanSettingsView = lazy(() => import('../PlanSettingsView'))
const ClassroomView = lazy(() => import('../ClassroomView'))

// Route-to-screen wiring only; state and async operations stay in the feature hooks.
export default function AppPages({ navigation, learning, catalog, overview, account, shell }) {
    switch (navigation.view) {
      case 'classroom':
        return (
          <ClassroomView
            key={account.authUser?.id || 'guest'}
            user={account.authUser}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            onAuthOpen={() => account.setShowAuthModal(true)}
            onProfileUpdated={account.handleClassroomProfileUpdated}
            onSync={account.handleManualSync}
            initialVocabulary={catalog.vocabulary}
            onStartAssignment={navigation.handleStartReadingAssignment}
          />
        )
      case 'studyHub':
        return (
          <StudyHub
            key={account.authUser?.id || 'guest'}
            rewardsReady={!account.authLoading && learning.localDataLoaded}
            planReady={overview.planDataReady}
            tomorrowPlan={overview.tomorrowPlan}
            onRetryPlan={() => overview.setPlanPreparationAttempt(value => value + 1)}
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
            wrongCount={overview.wrongWordList.length}
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
      case 'wordAssignment':
        return navigation.activeWordAssignment ? <WordAssignmentSession key={`${account.authUser?.id}:${navigation.activeWordAssignment.id}`} assignment={navigation.activeWordAssignment} userId={account.authUser?.id} navItems={shell.selectionNavItems} topbarProps={shell.selectionTopbarProps} onBack={() => { navigation.setActiveWordAssignment(null); navigation.setView(navigation.assignmentReturnView) }} /> : <AppLayout title="班级作业" navItems={shell.selectionNavItems} topbarProps={shell.selectionTopbarProps}><div className="classroom-panel"><p>请从任务列表重新进入作业。</p><button type="button" className="exam-back-button" onClick={() => navigation.setView('studyHub')}>返回今日计划</button></div></AppLayout>
      case 'readingSession':
        return (
          <ReadingSessionView
            key={`${account.authUser?.id || 'guest'}:${navigation.readingRetry?.id || navigation.activeReadingAssignment?.id || navigation.selectedReadingId}`}
            userId={account.authUser?.id}
            assignment={navigation.activeReadingAssignment}
            retryAttempt={navigation.readingRetry}
            onSubmitAssignment={navigation.handleSubmitReadingAssignment}
            article={navigation.selectedReading}
            mode={navigation.mode}
            onBack={navigation.handleBackToReadingList}
            onOpenMode={navigation.handleOpenModeFromReading}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            masteredWords={learning.masteredWords}
            wordLookup={overview.vocabularyLookup}
            onMarkAsLearned={learning.setWordAsLearned}
            onMarkAsMastered={learning.setWordAsMastered}
            onSyncAccount={account.handleHomeSync}
            onCompleteReading={learning.recordReadingCompletion}
            isCompletedToday={overview.todayStudyStats.readingArticleIds.includes(String(navigation.selectedReading?.id))}
            completedResult={learning.studyHistory.find((day) => day.date === getStudyDateKey())?.readingArticleResults?.find((result) => result.articleId === String(navigation.selectedReading?.id))}
          />
        )
      case 'toeflLevels':
        return (
          <ToeflSelectionView
            syncing={account.syncState === 'syncing'}
            mode="level"
            title="托福词汇分级"
            subtitle="先选择 Level，再进入对应 List；也可以直接学习全部托福词汇。"
            items={catalog.toeflGrouping.levels}
            totalCount={catalog.toeflGrouping.total}
            onBack={navigation.handleBackToHome}
            onSelect={navigation.handleToeflLevelSelect}
            onSelectAll={navigation.handleStartAllToefl}
            onSyncAccount={account.handleHomeSync}
            onSpeakIntro={() => speak('TOEFL vocabulary. Choose a level, then choose a list to start.', { rate: 1 })}
            selectAllLabel="学习全部托福词汇"
            vocabularyLabel="托福词汇"
            listLabel="托福 List"
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            selectionKind="toefl-level"
          />
        )
      case 'toeflLists': {
        const levelLabel =
          navigation.selectedToeflLevel === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${navigation.selectedToeflLevel}`
        const totalForLevel = catalog.toeflListsForSelectedLevel.reduce((sum, item) => sum + item.count, 0)

        return (
          <ToeflSelectionView
            syncing={account.syncState === 'syncing'}
            mode="list"
            title={levelLabel}
            subtitle="选择 List 开始学习，或者直接学习当前 Level 全部词汇。"
            items={catalog.toeflListsForSelectedLevel}
            totalCount={totalForLevel}
            onBack={() => navigation.setView('toeflLevels')}
            onSelect={navigation.handleToeflListSelect}
            onSelectAll={navigation.handleStartCurrentLevel}
            onSyncAccount={account.handleHomeSync}
            onSpeakIntro={() => speak(`${levelLabel}. Choose a list to start, or study all words in this level.`, { rate: 1 })}
            selectAllLabel={`学习${levelLabel}全部词汇`}
            vocabularyLabel="托福词汇"
            listLabel="托福 List"
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            selectionKind="toefl-list"
          />
        )
      }
      case 'ieltsTopics':
        return (
          <ToeflSelectionView
            syncing={account.syncState === 'syncing'}
            mode="level"
            title="雅思词汇主题"
            subtitle="先选择主题，再进入对应 List；也可以直接学习全部雅思词汇。"
            items={catalog.ieltsGrouping.topics}
            totalCount={catalog.ieltsGrouping.total}
            onBack={navigation.handleBackToHome}
            onSelect={navigation.handleIeltsTopicSelect}
            onSelectAll={navigation.handleStartAllIelts}
            onSyncAccount={account.handleHomeSync}
            onSpeakIntro={() => speak('IELTS vocabulary. Choose a topic, then choose a list to start.', { rate: 1 })}
            selectAllLabel="学习全部雅思词汇"
            vocabularyLabel="雅思词汇"
            listLabel="雅思主题"
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            selectionKind="ielts-topic"
          />
        )
      case 'ieltsLists': {
        const topicLabel =
          catalog.ieltsGrouping.topics.find((item) => item.key === navigation.selectedIeltsTopic)?.label || '未分主题'
        const totalForTopic = catalog.ieltsListsForSelectedTopic.reduce((sum, item) => sum + item.count, 0)

        return (
          <ToeflSelectionView
            syncing={account.syncState === 'syncing'}
            mode="list"
            title={topicLabel}
            subtitle="选择 List 开始学习，或者直接学习当前主题全部词汇。"
            items={catalog.ieltsListsForSelectedTopic}
            totalCount={totalForTopic}
            onBack={() => navigation.setView('ieltsTopics')}
            onSelect={navigation.handleIeltsListSelect}
            onSelectAll={navigation.handleStartCurrentIeltsTopic}
            onSyncAccount={account.handleHomeSync}
            onSpeakIntro={() => speak(`${topicLabel}. Choose a list to start, or study all words in this topic.`, { rate: 1 })}
            selectAllLabel={`学习${topicLabel}全部词汇`}
            vocabularyLabel="雅思词汇"
            listLabel="雅思 List"
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            selectionKind="ielts-list"
          />
        )
      }
      case 'learn':
        return (
          <LearningView
            key={account.authUser?.id || 'guest'}
            mode={navigation.mode}
            setMode={navigation.setMode}
            allVocabulary={catalog.allVocabulary}
            vocabularyLoading={catalog.listLoads > 0}
            currentWord={navigation.currentWord}
            nextWord={navigation.shuffledWords[navigation.currentIndex + 1]}
            filteredVocabulary={catalog.filteredVocabulary}
            currentIndex={navigation.currentIndex}
            onMarkLearned={navigation.markAsLearned}
            onMarkMastered={navigation.markAsMastered}
            masteredWords={learning.masteredWords}
            examScope={navigation.examScope}
            examCategory={learning.studyPlanCategory}
            onAddMastered={learning.setWordAsMastered}
            onWrongAnswer={(id) => {
              learning.addWrongWord(id)
              learning.setWordAsLearned(id)
            }}
            onAssessmentAnswer={learning.recordAssessmentAnswer}
            categoryName={catalog.currentCategoryName}
            dailyTarget={navigation.mode === 'learn' && navigation.assessmentBackTarget === 'studyHub' ? learning.dailyNewWordTarget : undefined}
            todayWordsStudied={overview.planTodayWordsLearned}
            learnedWords={learning.learnedWords}
            resetProgress={navigation.resetProgress}
            onBack={navigation.handleLearningBack}
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
            studyHistory={learning.studyHistory}
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
      case 'savedWords':
        return <WordCollectionView
          title="我的收藏"
          subtitle={account.authUser?.id ? '收藏独立于学习状态，随账号同步。取消收藏不会删除学习记录。' : '访客收藏仅保存在当前设备，登录后可随学习进度合并到账号。'}
          words={overview.savedWordList}
          loading={catalog.savedWordsLoading}
          emptyTitle={catalog.savedWordsLoading ? '正在准备收藏' : catalog.savedWordsError ? '收藏词汇暂不可用' : '还没有收藏'}
          emptyHint={catalog.savedWordsLoading ? '正在加载收藏词汇…' : catalog.savedWordsError || '还没有收藏，点击单词卡右上角的星标即可保存。'}
          statusMessage={catalog.savedWordsLoading ? '正在加载完整词库…' : catalog.savedWordsError || (overview.unavailableSavedCount ? `${overview.unavailableSavedCount} 个收藏词暂时无法匹配，收藏记录已保留。` : '')}
          onRetry={catalog.savedWordsError || (overview.unavailableSavedCount && !catalog.fullVocabularyLoadedRef.current) ? navigation.handleOpenSavedWords : undefined}
          onBack={navigation.handleBackToHome}
          onHome={navigation.handleBackToStudyHub}
          onOpenMode={navigation.handleOpenModeFromCollection}
          onSyncAccount={account.handleHomeSync}
          onOpenReading={navigation.handleOpenReadingList}
          onMarkAsUnknown={learning.setWordAsLearned}
          onMarkAsMastered={learning.setWordAsMastered}
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
          active="words"
          progressLabel="收藏词汇"
        />
      case 'todayReview':
        return (
          <WordCollectionView
            title="今日复习"
            subtitle="这些是今天需要回顾的已学习或已标记认识的单词"
            words={overview.todayReviewWordList}
            mode={navigation.mode}
            emptyHint="今天没有到期复习词，保持得很好。"
            onBack={navigation.handleBackToHome}
            onOpenMode={navigation.handleOpenModeFromCollection}
            onMarkAsUnknown={learning.setWordAsLearned}
            onMarkAsMastered={learning.setWordAsMastered}
            progressLabel="今日复习"
            onHome={navigation.handleBackToStudyHub}
            onSyncAccount={account.handleHomeSync}
            onOpenReading={navigation.handleOpenReadingList}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="review"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      case 'wrongWords':
        return (
          <WordCollectionView
            title="错题本"
            subtitle="这里会展示你在测验、填空、拼写中答错过的单词"
            words={overview.wrongWordList}
            mode={navigation.mode}
            emptyHint="错题本暂时是空的，答错的词会自动出现在这里。"
            onBack={navigation.handleBackToHome}
            onOpenMode={navigation.handleOpenModeFromCollection}
            onMarkAsUnknown={learning.setWordAsLearned}
            onMarkAsMastered={learning.setWordAsMastered}
            progressLabel="待巩固"
            onHome={navigation.handleBackToStudyHub}
            onSyncAccount={account.handleHomeSync}
            onOpenReading={navigation.handleOpenReadingList}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="review"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      case 'learnedWords':
        return (
          <WordCollectionView
            title="已学习单词"
            subtitle="这里会展示你标记为“已学习”的所有单词"
            words={overview.learnedWordList}
            mode={navigation.mode}
            emptyHint="你还没有已学习单词，先进入学习模式标记一些吧。"
            onBack={navigation.handleBackToHome}
            onOpenMode={navigation.handleOpenModeFromCollection}
            onMarkAsUnknown={learning.setWordAsLearned}
            onMarkAsMastered={navigation.markLearnedWordAsMastered}
            masteredActionLabel="认识了"
            onHome={navigation.handleBackToStudyHub}
            onSyncAccount={account.handleHomeSync}
            onOpenReading={navigation.handleOpenReadingList}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            emptyArtSrc="/images/ui-assets/category-all-words-blue-v1.png"
          />
        )
      case 'masteredWords':
        return (
          <WordCollectionView
            title="认识标记"
            subtitle="来自自评或练习结果的认识标记，不代表已验证长期记忆；仍按计划复习。"
            words={overview.masteredWordList}
            mode={navigation.mode}
            emptyHint="还没有认识标记，可在学习或练习中记录。"
            onBack={navigation.handleBackToHome}
            onOpenMode={navigation.handleOpenModeFromCollection}
            onMarkAsUnknown={navigation.markMasteredWordAsLearned}
            onMarkAsMastered={learning.setWordAsMastered}
            onHome={navigation.handleBackToStudyHub}
            onSyncAccount={account.handleHomeSync}
            onOpenReading={navigation.handleOpenReadingList}
            navItems={shell.selectionNavItems}
            topbarProps={shell.selectionTopbarProps}
            active="words"
            emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
          />
        )
      default:
        return null
    }
}
