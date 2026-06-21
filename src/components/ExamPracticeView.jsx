import AppLayout from './layout/AppLayout';
import QuickMenu from './QuickMenu';

const EXAM_MODES = [
  {
    id: 'quiz',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h12" />
        <path d="M6 10h8" />
        <path d="M6 15h6" />
        <path d="M16 14l2 2 4-5" />
      </svg>
    ),
    title: '测验',
    meta: '选择正确释义',
    helper: '适合快速确认单词含义，训练即时反应。',
    tone: 'blue',
  },
  {
    id: 'fillblank',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16" />
        <path d="M4 12h6" />
        <path d="M14 12h6" />
        <path d="M4 18h16" />
        <path d="M11 12h2" />
      </svg>
    ),
    title: '填空',
    meta: '根据例句补全单词',
    helper: '把词义放回语境里，强化真实使用感。',
    tone: 'violet',
  },
  {
    id: 'spelling',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18V6" />
        <path d="M4 6h7" />
        <path d="M4 12h6" />
        <path d="M15 18l4-12" />
        <path d="M13.8 14h6.4" />
      </svg>
    ),
    title: '拼写',
    meta: '听发音拼写单词',
    helper: '连接发音与字形，适合考前查漏。',
    tone: 'cyan',
  },
  {
    id: 'matching',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7h.01" />
        <path d="M8 17h.01" />
        <path d="M16 7h.01" />
        <path d="M16 17h.01" />
        <path d="M8 7c4 0 4 10 8 10" />
        <path d="M16 7c-4 0-4 10-8 10" />
      </svg>
    ),
    title: '连线',
    meta: '单词和释义配对',
    helper: '用配对节奏做整组复盘，适合大范围扫盲。',
    tone: 'orange',
  },
];

const EXAM_SCOPES = [
  {
    id: 'learned',
    label: '已学习',
    title: '复盘已见过的词',
    helper: '优先巩固刚进入记忆曲线的词。',
    tone: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h5a3 3 0 0 1 3 3v11H9a4 4 0 0 0-4 2V7a2 2 0 0 1 2-2Z" />
        <path d="M17 5h-5a3 3 0 0 0-3 3v11h6a4 4 0 0 1 4 2V7a2 2 0 0 0-2-2Z" />
      </svg>
    ),
    getCount: ({ learnedCount }) => learnedCount,
  },
  {
    id: 'mastered',
    label: '已掌握',
    title: '稳定长期记忆',
    helper: '检查真正掌握的词是否还能快速答对。',
    tone: 'green',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m8.8 12 2.1 2.1 4.5-5" />
      </svg>
    ),
    getCount: ({ masteredCount }) => masteredCount,
  },
  {
    id: 'all',
    label: '全范围随机',
    title: '全词库抽测',
    helper: '从全部词库随机挑战，适合摸底。',
    tone: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5 14.7 9l6 .8-4.3 4.2 1 5.9L12 17.1 6.6 20l1-5.9-4.3-4.2 6-.8L12 3.5Z" />
      </svg>
    ),
    getCount: ({ totalCount }) => totalCount,
  },
];

function ExamPracticeView({
  onBack,
  onSelectMode,
  onSyncAccount,
  mode = 'learn',
  onOpenMode,
  onOpenReading,
  selectedScope = 'all',
  onSelectScope,
  learnedCount = 0,
  masteredCount = 0,
  totalCount = 0,
  isPreparing = false,
  navItems = [],
  topbarProps = {},
}) {
  const scopeCounts = { learnedCount, masteredCount, totalCount };
  const selectedScopeMeta = EXAM_SCOPES.find((item) => item.id === selectedScope) || EXAM_SCOPES[0];
  const selectedScopeCount = selectedScopeMeta.getCount(scopeCounts);
  const activeScopeIndex = Math.max(
    0,
    EXAM_SCOPES.findIndex((item) => item.id === selectedScope)
  );
  const focusModeOptions = (event) => {
    event.stopPropagation();
    document.querySelector('.exam-mode-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AppLayout
      active="test"
      navItems={navItems}
      title="测试"
      subtitle="选择范围和题型，开始一组真实巩固练习。"
      topbarProps={topbarProps}
    >
      <div className="exam-page ds-stack">
        <section className="exam-scope-card ds-card" aria-label="考试范围">
          <div className="exam-section-head">
            <div>
              <h3>选择测试范围</h3>
              <p>范围决定本次练习会从哪些单词里抽题。</p>
            </div>
            <div className="exam-section-tools">
              <span className="exam-section-pill">{selectedScopeMeta.label} · {selectedScopeCount} 词</span>
              <div className="exam-section-actions" aria-label="考试操作">
                <button type="button" className="exam-back-button" onClick={onBack}>
                  返回今日计划
                </button>
                <button type="button" className="exam-sync-button" onClick={onSyncAccount}>
                  同步进度
                </button>
                <QuickMenu mode={mode} onOpenMode={onOpenMode} onOpenReading={onOpenReading} />
              </div>
            </div>
          </div>

          <div className="exam-scope-grid">
            {EXAM_SCOPES.map((item, index) => {
              const count = item.getCount(scopeCounts);
              const isActive = selectedScope === item.id;
              return (
                <div
                  key={item.id}
                  className={`exam-scope-option-shell ${isActive ? 'is-active' : ''}`}
                  style={{ '--scope-index': index }}
                >
                  <button
                    type="button"
                    className={`exam-scope-option is-${item.tone} ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectScope?.(item.id)}
                  >
                    <span className="exam-scope-icon" aria-hidden="true">{item.icon}</span>
                    <span className="exam-scope-copy">
                      <span className="exam-scope-label">{item.label}</span>
                      <span>{item.title}</span>
                      <small>{item.helper}</small>
                    </span>
                    <strong>{count} 词</strong>
                    <span className="exam-scope-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m6 12 4 4 8-8" />
                      </svg>
                    </span>
                  </button>
                  {isActive && (
                    <button
                      type="button"
                      className="exam-scope-start"
                      onClick={focusModeOptions}
                    >
                      开始测试
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="exam-scope-track" aria-hidden="true">
            <span style={{ '--scope-progress': `${((activeScopeIndex + 1) / EXAM_SCOPES.length) * 100}%` }} />
          </div>
        </section>

        <section className="exam-mode-card ds-card" aria-label="考试模式">
          <div className="exam-section-head">
            <div>
              <h3>选择练习方式</h3>
              <p>每一种模式都会保留原来的答题逻辑和学习进度记录。</p>
            </div>
            {isPreparing && <span className="exam-empty-note">正在准备全范围词库</span>}
            {!isPreparing && selectedScopeCount === 0 && <span className="exam-empty-note">当前范围暂无单词</span>}
          </div>

          <div className="exam-mode-grid">
            {EXAM_MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`exam-mode-option is-${item.tone}`}
                onClick={() => onSelectMode?.(item.id, selectedScope)}
                disabled={isPreparing || selectedScopeCount === 0}
              >
                <span className="exam-mode-icon">{item.icon}</span>
                <span className="exam-mode-copy">
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                  <small>{item.helper}</small>
                </span>
                <span className="exam-mode-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default ExamPracticeView;
