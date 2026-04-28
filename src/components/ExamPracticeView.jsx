const EXAM_MODES = [
  {
    id: 'quiz',
    icon: '✏️',
    title: '测验',
    meta: '选择正确释义',
  },
  {
    id: 'fillblank',
    icon: '🧩',
    title: '填空',
    meta: '根据例句补全单词',
  },
  {
    id: 'spelling',
    icon: '🔤',
    title: '拼写',
    meta: '听发音拼写单词',
  },
  {
    id: 'matching',
    icon: '🔗',
    title: '连线',
    meta: '单词和释义配对',
  },
];

const EXAM_SCOPES = [
  {
    id: 'learned',
    label: '已学习',
    getCount: ({ learnedCount }) => learnedCount,
  },
  {
    id: 'mastered',
    label: '已掌握',
    getCount: ({ masteredCount }) => masteredCount,
  },
  {
    id: 'all',
    label: '全范围随机',
    getCount: ({ totalCount }) => totalCount,
  },
];

function SyncIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
      <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
    </svg>
  );
}

function ExamPracticeView({
  onBack,
  onHome,
  onSelectMode,
  onSyncAccount,
  selectedScope = 'learned',
  onSelectScope,
  learnedCount = 0,
  masteredCount = 0,
  totalCount = 0,
}) {
  const scopeCounts = { learnedCount, masteredCount, totalCount };
  const selectedScopeMeta = EXAM_SCOPES.find((item) => item.id === selectedScope) || EXAM_SCOPES[0];
  const selectedScopeCount = selectedScopeMeta.getCount(scopeCounts);

  return (
    <div className="learn-refresh-page">
      <header className="learn-refresh-topbar">
        <div className="learn-refresh-topbar-inner">
          <div className="learn-refresh-left-actions">
            <button type="button" className="learn-refresh-back" onClick={onBack} aria-label="返回学习方式选择">
              <span aria-hidden="true">←</span>
              <span>返回</span>
            </button>
            <button type="button" className="learn-refresh-home-btn" onClick={onHome} aria-label="回到首页">
              <span aria-hidden="true">🏠</span>
            </button>
          </div>

          <div className="learn-refresh-progress">
            <p className="learn-refresh-progress-main">{EXAM_MODES.length} 种</p>
            <p className="learn-refresh-progress-sub">考试巩固</p>
          </div>

          <div className="learn-refresh-top-actions">
            <button
              type="button"
              className="learn-refresh-icon-btn"
              onClick={onSyncAccount}
              aria-label="同步账号"
            >
              <SyncIcon />
            </button>
            <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
            <span className="learn-refresh-topbar-spacer" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="learn-refresh-main">
        <section className="learn-refresh-card learn-refresh-card-enter reading-list-card">
          <header className="reading-list-header">
            <h1 className="reading-list-title">考试巩固</h1>
            <p className="reading-list-subtitle">
              选择一种练习方式，把已学单词变成更稳定的长期记忆。
            </p>
          </header>

          <section className="exam-scope-section" aria-label="考试范围">
            <div className="exam-scope-tabs" role="group" aria-label="选择考试范围">
              {EXAM_SCOPES.map((item) => {
                const count = item.getCount(scopeCounts);
                const isActive = selectedScope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`exam-scope-tab ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectScope?.(item.id)}
                  >
                    <span>{item.label}</span>
                    <span className="exam-scope-count">{count} 词</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="reading-category-section" aria-label="考试模式">
            <div className="reading-category-head">
              <p className="reading-category-sub">
                当前范围：{selectedScopeMeta.label} · {selectedScopeCount} 词
              </p>
            </div>

            <div className="reading-category-grid exam-practice-grid">
              {EXAM_MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="reading-category-card"
                  onClick={() => onSelectMode?.(item.id, selectedScope)}
                  disabled={selectedScopeCount === 0}
                >
                  <span className="reading-category-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="reading-category-name">{item.title}</span>
                  <span className="reading-category-count">{item.meta}</span>
                </button>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default ExamPracticeView;
