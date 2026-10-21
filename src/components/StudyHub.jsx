import { StudentReadingAssignments } from './classroom/ReadingAssignments'
import AppLayout from './layout/AppLayout'
import { HeroCard } from './ui/Cards'
import { PlanStatusCards, StatsRow } from './modules/LearningModules'
import { calculateStudyStreak } from '../utils/learningMetrics'
import { getAccountRoleLabel } from '../utils/classroom'

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
  const reviewTaskComplete = reviewCount === 0;
  const newWordProgress = Math.min(todayWordsLearned, newWordTarget);
  const readingTaskComplete = todayReadingsCompleted > 0;
  const examTaskComplete = todayExamQuestionsAnswered >= 5;
  const streak = calculateStudyStreak(studyHistory);
  const allDailyTasksComplete = reviewTaskComplete && newWordProgress >= newWordTarget && readingTaskComplete && examTaskComplete;
  const isSignedIn = Boolean(authUser?.email);
  const priorityTask = reviewCount > 0
    ? {
        title: '先清掉到期复习',
        meta: `${reviewCount} 个词会影响记忆曲线`,
        actionLabel: '开始复习',
        onClick: onOpenTodayReview,
      }
    : newWordProgress < newWordTarget
      ? {
          title: '补上今日新词',
          meta: `已学 ${newWordProgress} / ${newWordTarget} 个`,
          actionLabel: '去背单词',
          onClick: onOpenWordStudy,
        }
      : suggestedReading
        && !readingTaskComplete
        ? {
            title: '做一篇考试阅读',
            meta: `${suggestedReading.examType || '阅读'} · ${suggestedReading.level || 'B2'} · ${suggestedReading.estimatedMinutes || 4} 分钟`,
            actionLabel: '开始阅读',
            onClick: onOpenSuggestedReading || onOpenReading,
          }
        : examTaskComplete
          ? {
              title: '今天的学习闭环完成',
              meta: '新词、阅读和巩固都已推进',
              actionLabel: '查看统计',
              onClick: onOpenStatistics,
            }
          : {
            title: '做一组考试巩固',
            meta: '测验 · 填空 · 拼写',
            actionLabel: '开始练习',
            onClick: onOpenExamPractice,
          };

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
              <p>
                {isSignedIn
                  ? `${authUser.email} · ${syncStatusText || '学习记录已连接账号'}`
                  : '登录后可同步背词记录、阅读进度和错题统计'}
              </p>
              <div className="study-hub-hero-buttons" aria-label="今日计划操作">
                <button type="button" className="study-hub-hero-button is-primary" onClick={priorityTask.onClick} disabled={priorityTask.onClick === onOpenWordStudy && isPreparingWords}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5Z" />
                    <path d="M5 5.5v16" />
                    <path d="M9 7h7" />
                  </svg>
                  <span>{priorityTask.onClick === onOpenWordStudy && isPreparingWords ? '正在准备词库' : '开始学习'}</span>
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
            <button type="button" className="exam-back-button" onClick={onOpenWordStudy}>重试</button>
          </div>
        )}

        <PlanStatusCards
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

        {allDailyTasksComplete && (
          <section className="study-hub-completion-summary" aria-label="今日任务总结">
            <div>
              <span>今日闭环完成</span>
              <h2>新词、阅读和考试巩固都已经推进。</h2>
              <p>
                今天新增 {todayWordsLearned} 个词，完成 {todayReadingsCompleted} 篇阅读，
                巩固 {todayExamQuestionsAnswered} 题，正确率 {todayExamQuestionsAnswered > 0 ? Math.round((todayExamQuestionsCorrect / todayExamQuestionsAnswered) * 100) : 0}%。
              </p>
            </div>
            <button type="button" onClick={onOpenStatistics}>查看学习趋势</button>
          </section>
        )}

        <section className="study-hub-account-summary" aria-live="polite">
          <span>{authUser?.email ? `当前账号：${authUser.email}` : syncStatusText || '当前未登录'}</span>
          {accountNotice && (
            <span className={`is-${accountNotice.type || 'info'}`}>{accountNotice.message}</span>
          )}
          <span>今日已掌握 {todayWordsMastered} 个词 · 阅读 {todayReadingsCompleted}/{readingCount} 篇 · 巩固 {todayExamQuestionsAnswered} 题 · 错题 {wrongCount} 个</span>
        </section>
      </div>
    </AppLayout>
  );
}

export default StudyHub;
