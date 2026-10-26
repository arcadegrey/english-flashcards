import { StudentReadingAssignments } from './classroom/ReadingAssignments'
import AppLayout from './layout/AppLayout'
import { HeroCard } from './ui/Cards'
import { PlanStatusCards, StatsRow } from './modules/LearningModules'
import { calculateStudyStreak } from '../utils/learningMetrics'
import { getAccountRoleLabel } from '../utils/classroom'
import StudyMomentum from './StudyMomentum'
import { buildDailyPlan } from '../utils/dailyPlan.js'

function StudyHub({
  onOpenWordStudy,
  onOpenTraining,
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
    examAnswered: todayExamQuestionsAnswered, examCorrect: todayExamQuestionsCorrect, ready: planReady && rewardsReady });
  const reviewTaskComplete = plan.tasks.review.complete;
  const newWordProgress = plan.tasks.words.progress;
  const readingTaskComplete = plan.tasks.reading.complete;
  const examTaskComplete = plan.tasks.exam.complete;
  const streak = calculateStudyStreak(studyHistory);
  const allDailyTasksComplete = plan.complete;
  const isSignedIn = Boolean(authUser?.email);
  const priorities = {
    review: {
      title: '先清掉到期复习',
      meta: `${reviewCount} 个词会影响记忆曲线`,
      actionLabel: '开始复习',
      onClick: onOpenTodayReview,
    },
    words: {
      title: '补上今日新词',
      meta: `词汇进度 ${newWordProgress} / ${plan.tasks.words.goal} 个`,
      actionLabel: '去背单词',
      onClick: onOpenWordStudy,
    },
    reading: {
      title: '做一篇考试阅读',
      meta: suggestedReading ? `${suggestedReading.examType || '阅读'} · ${suggestedReading.level || 'B2'} · ${suggestedReading.estimatedMinutes || 4} 分钟` : '选择一篇阅读，完成今天的阅读任务',
      actionLabel: '开始阅读',
      onClick: onOpenSuggestedReading || onOpenReading,
    },
    complete: {
      title: '今天的学习闭环完成',
      meta: '今天可用的学习任务已经完成',
      actionLabel: '查看统计',
      onClick: onOpenStatistics,
    },
    exam: {
      title: '做一组考试巩固',
      meta: `${plan.tasks.exam.answered} / ${plan.tasks.exam.goal} 题 · 测验、填空、拼写或配对`,
      actionLabel: '开始练习',
      onClick: onOpenExamPractice,
    },
    preparing: { title: planError ? '计划暂未准备好' : '正在准备今日计划', meta: '加载完成后显示当前学习进度', actionLabel: planError ? '重试' : '正在准备', onClick: planError ? onRetryPlan : undefined },
    empty: { title: '从训练中心开始今天的学习', meta: '当前没有可安排的词汇或阅读内容', actionLabel: '去训练中心', onClick: onOpenTraining || onOpenWordStudy },
  };
  const priorityTask = priorities[plan.priority];
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
      active="plan"
      navItems={navItems}
      title="今日计划"
      subtitle="坚持每天进步一点点，积累现在，收获未来"
      topbarProps={{
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
      <div className="ds-stack">
        <HeroCard
          soft
          label={`每日进步一点点 · ${planCategoryName}`}
          title="今天先做这一步"
          subtitle={priorityTask.title}
          meta={
            <div className="study-hub-hero-actions">
              <p>{priorityTask.meta}</p>
              <p>
                {isSignedIn
                  ? `${authUser.email} · ${syncStatusText || '学习记录已连接账号'}`
                  : '登录后可同步背词记录、阅读进度和错题统计'}
              </p>
              <div className="study-hub-hero-buttons" aria-label="今日计划操作">
                <button type="button" className="study-hub-hero-button is-primary" onClick={priorityTask.onClick} disabled={!priorityTask.onClick || (priorityTask.onClick === onOpenWordStudy && isPreparingWords)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5Z" />
                    <path d="M5 5.5v16" />
                    <path d="M9 7h7" />
                  </svg>
                  <span>{priorityTask.onClick === onOpenWordStudy && isPreparingWords ? '正在准备词库' : priorityTask.actionLabel}</span>
                </button>
                <button type="button" className="study-hub-hero-button is-secondary" onClick={onAuthOpen}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                  <span>{isSignedIn ? '查看账号' : '登录保存进度'}</span>
                </button>
              </div>
            </div>
          }
          illustrationSrc="/images/ui-assets/training-hero-flashcards-blue-v1.png"
        />

        {authUser?.profileConfigured && authUser.role === 'student' && <StudentReadingAssignments userId={authUser.id} onStart={onStartAssignment} />}

        {planError && (
          <div className="exam-section-actions exam-preparation-feedback" role="alert">
            <span className="exam-empty-note">{planError}</span>
            <button type="button" className="exam-back-button" onClick={onRetryPlan || onOpenWordStudy}>重试</button>
          </div>
        )}

        <PlanStatusCards
          plan={plan}
          reviewComplete={reviewTaskComplete}
          reviewCount={reviewCount}
          newWordProgress={newWordProgress}
          newWordTarget={newWordTarget}
          readingsCompleted={todayReadingsCompleted}
          examQuestionsAnswered={todayExamQuestionsAnswered}
          examQuestionsCorrect={todayExamQuestionsCorrect}
          wordCount={wordCount}
          categoryName={planCategoryName}
          isPreparingWords={isPreparingWords}
          onReview={onOpenTodayReview}
          onWords={onOpenWordStudy}
          onAdjustPlan={onAdjustPlan}
          onReading={onOpenSuggestedReading || onOpenReading}
          onExam={onOpenExamPractice}
        />

        <StatsRow streak={streak} target={newWordTarget} remaining={remainingWordCount} />
        <StudyMomentum ownerId={authUser?.id} history={studyHistory} wordsDone={plan.tasks.words.goal > 0 && plan.tasks.words.complete} readingDone={readingTaskComplete} examDone={examTaskComplete} allDone={allDailyTasksComplete} ready={rewardsReady && planReady} />

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

        <section className="study-hub-account-summary" aria-live="polite">
          <span>{authUser?.email ? `当前账号：${authUser.email}` : syncStatusText || '当前未登录'}</span>
          {accountNotice && (
            <span className={`is-${accountNotice.type || 'info'}`}>{accountNotice.message}</span>
          )}
          <span>今日标记认识 {todayWordsMastered} 个词 · 阅读 {todayReadingsCompleted}/{readingCount} 篇 · 巩固 {todayExamQuestionsAnswered} 题 · 错题 {wrongCount} 个</span>
        </section>
      </div>
    </AppLayout>
  );
}

export default StudyHub;
