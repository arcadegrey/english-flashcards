import { StudentReadingAssignments } from './classroom/ReadingAssignments'
import AppLayout from './layout/AppLayout'
import StudyCarousel from './home/StudyCarousel'
import HomeArtworkProvider from './home/HomeArtworkProvider.jsx'
import AccountProgressSummary from './home/AccountProgressSummary'
import { DashboardStats, DashboardTasks, DashboardQuickStart } from './home/StudyDashboardPanels'
import { buildStudyDeck, dashboardGreeting } from '../utils/studyDashboard.js'
import '../styles/study-dashboard.css'
import { calculateStudyStreak } from '../utils/learningMetrics'
import { getAccountRoleLabel } from '../utils/classroom'
import StudyMomentum from './StudyMomentum'
import { buildDailyPlan } from '../utils/dailyPlan.js'

function StudyHub({
  onOpenWordStudy,
  onOpenTraining,
  onOpenWordCatalog,
  onOpenReading,
  onOpenSuggestedReading,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenStatistics,
  onOpenExamPractice,
  onAuthOpen,
  onStartAssignment,
  authUser = null,
  rewardsReady = true,
  planReady = true,
  tomorrowPlan = null,
  onRetryPlan,
  syncStatusText = '',
  accountNotice = null,
  readingCount = 0,
  wordCount = 0,
  remainingWordCount = wordCount,
  planCategoryName = '全部单词',
  isPreparingWords = false,
  planError = '',
  reviewCount = 0,
  wrongCount = 0,
  todayWordsLearned = 0,
  todayWordsMastered = 0,
  todayReadingsCompleted = 0,
  todayExamQuestionsAnswered = 0,
  todayExamQuestionsCorrect = 0,
  suggestedReading = null,
  studyHistory = [],
  newWordTarget = 15,
  onAdjustPlan,
  isDarkTheme = false,
  onThemeToggle,
  onVoiceSettings,
}) {
  const plan = buildDailyPlan({ reviewCount, wordsStudied: todayWordsLearned, target: newWordTarget,
    remaining: remainingWordCount, wordCount, readingCount, readingsCompleted: todayReadingsCompleted,
    examAnswered: todayExamQuestionsAnswered, examCorrect: todayExamQuestionsCorrect, ready: planReady && rewardsReady && !isPreparingWords });
  const newWordProgress = plan.tasks.words.progress;
  const readingTaskComplete = plan.tasks.reading.complete;
  const examTaskComplete = plan.tasks.exam.complete;
  const streak = calculateStudyStreak(studyHistory);
  const allDailyTasksComplete = plan.complete;
  const cards = buildStudyDeck({ plan, categoryName: planCategoryName, remaining: remainingWordCount,
    wordCount, suggestedReading, planError });
  const actions = {
    words: onOpenWordStudy,
    review: onOpenTodayReview,
    reading: onOpenSuggestedReading || onOpenReading,
    exam: onOpenExamPractice,
    statistics: onOpenStatistics,
    training: onOpenTraining || onOpenWordStudy,
    settings: onAdjustPlan,
    retry: onRetryPlan || onOpenWordStudy,
  };
  const act = action => actions[action]?.();
  const catalog = onOpenWordCatalog || onOpenTraining || onOpenWordStudy;
  const tomorrowLabel = tomorrowPlan ? `${Number(tomorrowPlan.date.slice(5, 7))} 月 ${Number(tomorrowPlan.date.slice(8))} 日` : '';

  const navItems = [
    {
      id: 'plan',
      label: '今日计划',
      icon: 'plan',
      onClick: undefined,
    },
    {
      id: 'training',
      label: '训练中心',
      icon: 'training',
      onClick: onOpenTraining || onOpenWordStudy,
    },
    {
      id: 'words',
      label: '单词',
      icon: 'words',
      onClick: onOpenWordStudy,
    },
    {
      id: 'reading',
      label: '阅读',
      icon: 'reading',
      onClick: onOpenReading,
    },
    {
      id: 'review',
      label: '复习',
      icon: 'review',
      onClick: onOpenTodayReview,
    },
    {
      id: 'test',
      label: '测试',
      icon: 'test',
      onClick: onOpenExamPractice,
    },
    {
      id: 'stats',
      label: '统计',
      icon: 'stats',
      onClick: onOpenStatistics,
    },
  ];

  return (
    <AppLayout
      className="study-home-shell"
      active="plan"
      navItems={navItems}
      title={dashboardGreeting(authUser)}
      subtitle="坚持每天进步一点点，积累现在，收获未来"
      topbarProps={{
        mobileBrand: true,
        onCalendar: onOpenStatistics,
        onNotify: onOpenWrongWords,
        notifyBadge: wrongCount ? String(Math.min(wrongCount, 9)) : undefined,
        onThemeToggle,
        isDarkTheme,
        onVoiceSettings,
        onUserClick: onAuthOpen,
        userLabel: authUser?.email ? getAccountRoleLabel(authUser) : syncStatusText || '学习者',
        sidebarProps: { studyHistory },
      }}
    >
      <HomeArtworkProvider paused={!planReady || !rewardsReady || isPreparingWords}>
      <div className="ds-stack study-dashboard">
        <div className="study-mobile-greeting">
          <h1>{dashboardGreeting(authUser)}</h1>
        </div>
        <StudyCarousel cards={cards} initialId={plan.priority} onAction={act} />

        {authUser?.profileConfigured && authUser.role === 'student' && <StudentReadingAssignments userId={authUser.id} onStart={onStartAssignment} />}

        {planError && (
          <div className="exam-section-actions exam-preparation-feedback" role="alert">
            <span className="exam-empty-note">{planError}</span>
            <button type="button" className="exam-back-button" onClick={onRetryPlan || onOpenWordStudy}>重试</button>
          </div>
        )}

        <DashboardStats plan={plan} streak={streak} history={studyHistory} wordCount={wordCount} categoryName={planCategoryName}
          onAdjustPlan={onAdjustPlan} onStatistics={onOpenStatistics} onCatalog={catalog} />
        <div className="study-dashboard-workspace">
          <DashboardTasks cards={cards} priority={plan.priority} ready={plan.priority !== 'preparing'} plan={plan} onAction={act} onAdjustPlan={onAdjustPlan} />
          <DashboardQuickStart reviewCount={reviewCount} wrongCount={wrongCount} onReview={onOpenTodayReview} onCatalog={catalog}
            onWrongWords={onOpenWrongWords} onExam={onOpenExamPractice} />
        </div>
        <StudyMomentum ownerId={authUser?.id} history={studyHistory} wordsDone={plan.tasks.words.goal > 0 && plan.tasks.words.complete} readingDone={readingTaskComplete} examDone={examTaskComplete} allDone={allDailyTasksComplete} ready={rewardsReady && planReady && !isPreparingWords} onOpenDetails={onOpenStatistics} />

        {allDailyTasksComplete && (
          <section className="study-hub-completion-summary" aria-label="今日任务总结">
            <div className="study-hub-completion-overview"><div>
              <span>今日闭环完成</span>
              <h2>今天的计划完成了，明天继续。</h2>
              <p>
                {plan.tasks.words.goal > 0 ? `词汇目标 ${newWordProgress} / ${plan.tasks.words.goal} 个` : '当前词库已无剩余新词'}，完成 {todayReadingsCompleted} 篇阅读，
                巩固 {plan.tasks.exam.answered} 题{plan.tasks.exam.accuracy == null ? '。' : `，正确率 ${plan.tasks.exam.accuracy}%。`}
              </p>
            </div>
            <button type="button" onClick={onOpenStatistics}>查看学习趋势</button>
            </div>
            {tomorrowPlan && <section className="study-hub-tomorrow" aria-label="明日学习预告">
              <div><span>明日安排 · {tomorrowLabel}</span><h3>先复习，再继续积累</h3>
                <p>按当前安排，明日预计待复习 {tomorrowPlan.reviewCount} 个词（含尚未完成的复习）。
                  {tomorrowPlan.newWordTarget > 0 ? `${planCategoryName}计划学习 ${tomorrowPlan.newWordTarget} 个新词。` : '当前词库已无剩余新词，可以调整计划选择其他词库。'}
                  {tomorrowPlan.readingTarget > 0 ? '阅读 1 篇。' : ''}{tomorrowPlan.examTarget > 0 ? `巩固 ${tomorrowPlan.examTarget} 题。` : ''}
                </p><p className="study-hub-tomorrow-note">预告基于当前复习安排；明日任务以当天记录和计划为准。</p>
              </div>{onAdjustPlan && <button type="button" onClick={onAdjustPlan}>调整计划</button>}
            </section>}
          </section>
        )}

        <AccountProgressSummary authUser={authUser} onAuthOpen={onAuthOpen} syncStatusText={syncStatusText}
          accountNotice={accountNotice} todayWordsMastered={todayWordsMastered} todayReadingsCompleted={todayReadingsCompleted}
          readingCount={readingCount} todayExamQuestionsAnswered={todayExamQuestionsAnswered} wrongCount={wrongCount} />
      </div>
      </HomeArtworkProvider>
    </AppLayout>
  );
}

export default StudyHub;
