function StudyHub({
  onOpenWordStudy,
  onOpenReading,
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
}) {
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

        <section className="study-hub-card">
          <p className="study-hub-eyebrow">English Flashcards</p>
          <h1 className="study-hub-title">选择学习方式</h1>
          <p className="study-hub-subtitle">先决定今天的训练类型，再进入对应学习界面。</p>
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
