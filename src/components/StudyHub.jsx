function StudyHub({ onOpenWordStudy, onOpenReading, readingCount = 0, wordCount = 0 }) {
  return (
    <div className="study-hub-page">
      <div className="study-hub-shell">
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
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudyHub;
