import AppLayout from './layout/AppLayout'
import { HeroCard } from './ui/Cards'
import { PlanStatusCards, StatsRow } from './modules/LearningModules'
import { calculateStudyStreak } from '../utils/learningMetrics'

function StudyHub({
  onOpenWordStudy,
  onOpenReading,
  onOpenSuggestedReading,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenStatistics,
  onOpenExamPractice,
  onAuthOpen,
  authUser = null,
  syncStatusText = '',
  accountNotice = null,
  readingCount = 0,
  wordCount = 0,
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
      onClick: onOpenWordStudy,
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
        userLabel: authUser?.email ? '学习者' : syncStatusText || '学习者',
        sidebarProps: { studyHistory },
      }}
    >
      <div className="ds-stack">
        <HeroCard
          soft
          label="每日进步一点点"
          title="今天先做这一步"
          subtitle={priorityTask.title}
          illustrationSrc="/images/ui-assets/training-hero-flashcards-blue-v1.png"
        />

        <PlanStatusCards
          reviewComplete={reviewTaskComplete}
          reviewCount={reviewCount}
          newWordProgress={newWordProgress}
          newWordTarget={newWordTarget}
          readingsCompleted={todayReadingsCompleted}
          examQuestionsAnswered={todayExamQuestionsAnswered}
          examQuestionsCorrect={todayExamQuestionsCorrect}
          wordCount={wordCount}
          onReview={onOpenTodayReview}
          onWords={onAdjustPlan || onOpenWordStudy}
          onReading={onOpenSuggestedReading || onOpenReading}
          onExam={onOpenExamPractice}
        />

        <StatsRow streak={streak} target={newWordTarget} remaining={wordCount} />

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
