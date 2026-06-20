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
  },
];

const EXAM_SCOPES = [
  {
    id: 'learned',
    label: '已学习',
    title: '复盘已见过的词',
    helper: '优先巩固刚进入记忆曲线的词。',
    getCount: ({ learnedCount }) => learnedCount,
  },
  {
    id: 'mastered',
    label: '已掌握',
    title: '稳定长期记忆',
    helper: '检查真正掌握的词是否还能快速答对。',
    getCount: ({ masteredCount }) => masteredCount,
  },
  {
    id: 'all',
    label: '全范围随机',
    title: '全词库抽测',
    helper: '从全部词库随机挑战，适合摸底。',
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
  selectedScope = 'learned',
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
  const readyModeCount = EXAM_MODES.length;
  const activeScopeIndex = Math.max(
    0,
    EXAM_SCOPES.findIndex((item) => item.id === selectedScope)
  );

  return (
    <AppLayout
      active="test"
      navItems={navItems}
      title="测试"
      subtitle="选择范围和题型，开始一组真实巩固练习。"
      topbarProps={topbarProps}
    >
      <div className="exam-page ds-stack">
        <section className="exam-overview-card ds-card" aria-label="考试巩固概览">
          <div>
            <h2>考试巩固</h2>
            <p>选择本次抽题范围和练习方式，题目会继续使用真实词库与学习记录。</p>
          </div>
          <dl className="exam-overview-stats" aria-label="当前测试状态">
            <div>
              <dt>当前范围</dt>
              <dd>{selectedScopeMeta.label}</dd>
            </div>
            <div>
              <dt>可测试</dt>
              <dd>{selectedScopeCount} 词</dd>
            </div>
            <div>
              <dt>题型</dt>
              <dd>{readyModeCount} 种</dd>
            </div>
          </dl>
          <div className="exam-overview-actions">
            <button type="button" className="exam-back-button" onClick={onBack}>
              返回今日计划
            </button>
            <button type="button" className="exam-sync-button" onClick={onSyncAccount}>
              同步进度
            </button>
            <QuickMenu mode={mode} onOpenMode={onOpenMode} onOpenReading={onOpenReading} />
          </div>
        </section>

        <section className="exam-scope-card ds-card" aria-label="考试范围">
          <div className="exam-section-head">
            <div>
              <h3>选择测试范围</h3>
              <p>范围决定本次练习会从哪些单词里抽题。</p>
            </div>
            <span className="exam-section-pill">{selectedScopeMeta.label} · {selectedScopeCount} 词</span>
          </div>

          <div className="exam-scope-grid">
            {EXAM_SCOPES.map((item, index) => {
              const count = item.getCount(scopeCounts);
              const isActive = selectedScope === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`exam-scope-option ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectScope?.(item.id)}
                  style={{ '--scope-index': index }}
                >
                  <span className="exam-scope-marker" aria-hidden="true" />
                  <span className="exam-scope-label">{item.label}</span>
                  <strong>{count} 词</strong>
                  <span>{item.title}</span>
                  <small>{item.helper}</small>
                </button>
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
                className="exam-mode-option"
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
