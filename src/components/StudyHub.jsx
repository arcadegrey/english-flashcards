function StudyHub({
  onOpenWordStudy,
  onOpenReading,
  onOpenSuggestedReading,
  onOpenTodayReview,
  onOpenWrongWords,
  onOpenStatistics,
  onOpenExamPractice,
  onAuthOpen,
  onAuthSync,
  authUser = null,
  syncStatusText = '',
  accountNotice = null,
  readingCount = 0,
  wordCount = 0,
  reviewCount = 0,
  wrongCount = 0,
  todayWordsLearned = 0,
  todayWordsMastered = 0,
  suggestedReading = null,
}) {
  const newWordTarget = 15;
  const reviewTaskComplete = reviewCount === 0;
  const newWordProgress = Math.min(todayWordsLearned, newWordTarget);
  const newWordTaskComplete = newWordProgress >= newWordTarget;
  const completedTaskCount = Number(reviewTaskComplete) + Number(newWordTaskComplete);
  const planProgress = Math.round((completedTaskCount / 2) * 100);
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
        ? {
            title: '做一篇考试阅读',
            meta: `${suggestedReading.examType || '阅读'} · ${suggestedReading.level || 'B2'} · ${suggestedReading.estimatedMinutes || 4} 分钟`,
            actionLabel: '开始阅读',
            onClick: onOpenSuggestedReading || onOpenReading,
          }
        : {
            title: '做一组考试巩固',
            meta: '测验 · 填空 · 拼写',
            actionLabel: '开始练习',
            onClick: onOpenExamPractice,
          };

  const planTasks = [
    {
      id: 'review',
      label: '复习',
      title: reviewTaskComplete ? '到期词已清空' : `${reviewCount} 个词到期`,
      meta: reviewTaskComplete ? '保持节奏' : '优先完成',
      status: reviewTaskComplete ? '已完成' : '待复习',
      isComplete: reviewTaskComplete,
      onClick: onOpenTodayReview,
    },
    {
      id: 'words',
      label: '新词',
      title: `${newWordProgress} / ${newWordTarget} 个`,
      meta: `${wordCount} 词可学`,
      status: newWordTaskComplete ? '已达标' : '继续',
      isComplete: newWordTaskComplete,
      onClick: onOpenWordStudy,
    },
    {
      id: 'reading',
      label: '阅读',
      title: suggestedReading ? suggestedReading.title : '选择一篇文章',
      meta: suggestedReading
        ? `${suggestedReading.examType || '阅读'} · ${suggestedReading.level || 'B2'} · ${suggestedReading.estimatedMinutes || 4} 分钟`
        : `${readingCount} 篇可选`,
      status: '推荐',
      isComplete: false,
      onClick: onOpenSuggestedReading || onOpenReading,
    },
    {
      id: 'exam',
      label: '巩固',
      title: '10 题考试练习',
      meta: wrongCount > 0 ? `${wrongCount} 个错题可回收` : '测验 · 填空 · 拼写',
      status: '推荐',
      isComplete: false,
      onClick: onOpenExamPractice,
    },
  ];

  return (
    <div className="study-hub-page">
      <div className="study-hub-shell">
        <section className="study-hub-account-bar">
          <button type="button" className="study-hub-account-button" onClick={onAuthOpen}>
            <span aria-hidden="true">👤</span>
            <span>登录账号</span>
          </button>
          <button type="button" className="study-hub-account-button" onClick={onAuthSync}>
            <span aria-hidden="true">🔄</span>
            <span>同步账号</span>
          </button>
          <p className="study-hub-account-status">
            {authUser?.email ? `当前账号：${authUser.email}` : syncStatusText || '当前未登录'}
          </p>
          {accountNotice && (
            <p className={`study-hub-account-notice is-${accountNotice.type || 'info'}`}>
              {accountNotice.message}
            </p>
          )}
        </section>

        <section className="study-hub-plan-card" aria-label="今日学习计划">
          <div className="study-hub-plan-main">
            <div>
              <p className="study-hub-eyebrow">Today&apos;s Plan</p>
              <h1 className="study-hub-plan-title">今天先做这一步</h1>
              <p className="study-hub-plan-priority">{priorityTask.title}</p>
              <p className="study-hub-plan-meta">{priorityTask.meta}</p>
            </div>
            <div
              className="study-hub-plan-progress"
              style={{ '--plan-progress': `${planProgress}%` }}
              aria-label={`今日计划完成度 ${planProgress}%`}
            >
              <span>{planProgress}%</span>
              <small>核心进度</small>
            </div>
          </div>

          <div className="study-hub-plan-actions">
            <button type="button" className="study-hub-plan-primary" onClick={priorityTask.onClick}>
              {priorityTask.actionLabel}
            </button>
            <button type="button" className="study-hub-plan-secondary" onClick={onOpenStatistics}>
              查看统计
            </button>
          </div>

          <div className="study-hub-plan-grid">
            {planTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={`study-hub-plan-task ${task.isComplete ? 'is-complete' : ''}`}
                onClick={task.onClick}
              >
                <span className="study-hub-plan-task-label">{task.label}</span>
                <span className="study-hub-plan-task-title">{task.title}</span>
                <span className="study-hub-plan-task-meta">{task.meta}</span>
                <span className="study-hub-plan-task-status">{task.status}</span>
              </button>
            ))}
          </div>

          <p className="study-hub-plan-note">
            今日已学 {todayWordsLearned} 个词，已掌握 {todayWordsMastered} 个词。
          </p>
        </section>

        <section className="study-hub-card">
          <p className="study-hub-eyebrow">English Flashcards</p>
          <h2 className="study-hub-title">全部训练入口</h2>
          <p className="study-hub-subtitle">想自由切换时，可以从这里进入任意模块。</p>
          <div className="study-hub-actions">
            <button type="button" className="study-hub-action" onClick={onOpenWordStudy}>
              <span className="study-hub-action-icon" aria-hidden="true">
                🧠
              </span>
              <span className="study-hub-action-title">背单词</span>
              <span className="study-hub-action-meta">{wordCount} 词可学</span>
            </button>
            <button type="button" className="study-hub-action" onClick={onOpenReading}>
              <span className="study-hub-action-icon" aria-hidden="true">
                📚
              </span>
              <span className="study-hub-action-title">做阅读</span>
              <span className="study-hub-action-meta">{readingCount} 篇短文</span>
            </button>
            <button type="button" className="study-hub-action" onClick={onOpenTodayReview}>
              <span className="study-hub-action-icon" aria-hidden="true">
                🔁
              </span>
              <span className="study-hub-action-title">今日复习</span>
              <span className="study-hub-action-meta">{reviewCount} 个到期词</span>
            </button>
            <button type="button" className="study-hub-action" onClick={onOpenExamPractice}>
              <span className="study-hub-action-icon" aria-hidden="true">
                🧪
              </span>
              <span className="study-hub-action-title">考试巩固</span>
              <span className="study-hub-action-meta">测验 · 填空 · 拼写</span>
            </button>
            <button type="button" className="study-hub-action" onClick={onOpenStatistics}>
              <span className="study-hub-action-icon" aria-hidden="true">
                📊
              </span>
              <span className="study-hub-action-title">学习统计</span>
              <span className="study-hub-action-meta">查看学习闭环</span>
            </button>
            <button type="button" className="study-hub-action" onClick={onOpenWrongWords}>
              <span className="study-hub-action-icon" aria-hidden="true">
                🧯
              </span>
              <span className="study-hub-action-title">错题本</span>
              <span className="study-hub-action-meta">{wrongCount} 个待巩固词</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudyHub;
