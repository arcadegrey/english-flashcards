import LoadingState from './ui/LoadingState';
import { useRef } from 'react';
import { BaseCard, ModuleCard } from './ui/Cards';
import { SecondaryButton } from './ui/Buttons';
import '../styles/test-workspace.css';
import AppLayout from './layout/AppLayout';
import QuickMenu from './QuickMenu';
import ExamHistoryPanel from './assessment/ExamHistoryPanel';

const EXAM_MODES = [
  {
    id: 'quiz',
    iconSrc: '/images/ui-assets/exam-mode-quiz-blue-v1.png',
    title: '测验',
    meta: '选择正确释义',
    helper: '看单词，选择对应的中文释义。',
    tone: 'blue',
  },
  {
    id: 'fillblank',
    iconSrc: '/images/ui-assets/exam-mode-fillblank-violet-v1.png',
    title: '填空',
    meta: '根据例句补全单词',
    helper: '结合例句，找出缺少的单词。',
    tone: 'violet',
  },
  {
    id: 'spelling',
    iconSrc: '/images/ui-assets/exam-mode-spelling-cyan-v1.png',
    title: '拼写',
    meta: '听发音拼写单词',
    helper: '播放发音，输入你听到的单词。',
    tone: 'cyan',
  },
  {
    id: 'matching',
    iconSrc: '/images/ui-assets/exam-mode-matching-orange-v1.png',
    title: '连线',
    meta: '单词和释义配对',
    helper: '将一组单词与释义逐一配对。',
    tone: 'orange',
  },
  {
    id: 'dictation',
    iconSrc: '/images/ui-assets/exam-mode-spelling-cyan-v1.png',
    title: '句子听写',
    meta: '精听例句 · 写下整句',
    helper: '重播、慢速听音，答后逐词核对。',
    tone: 'blue',
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
    label: '标记认识',
    title: '检查认识标记',
    helper: '这些词来自自评或练习记录，用测试检查是否仍能答对。',
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
  syncing = false,
  mode = 'learn',
  onOpenMode,
  onOpenReading,
  selectedScope = 'all',
  onSelectScope,
  learnedCount = 0,
  masteredCount = 0,
  totalCount = 0,
  categoryName = '全部单词',
  isPreparing = false,
  preparationError = '',
  onRetryPreparation,
  navItems = [],
  topbarProps = {},
}) {
  const scopeCounts = { learnedCount, masteredCount, totalCount };
  const scopes = EXAM_SCOPES.map((scope) => scope.id === 'all' && categoryName !== '全部单词'
    ? { ...scope, label: `${categoryName}随机`, title: '当前词库抽测', helper: `仅从${categoryName}随机抽题。` }
    : scope);
  const selectedScopeMeta = scopes.find((item) => item.id === selectedScope) || scopes[0];
  const selectedScopeCount = selectedScopeMeta.getCount(scopeCounts);
  const modePanelRef = useRef(null);
  const modeHeadingRef = useRef(null);
  const focusModeOptions = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    modePanelRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    modeHeadingRef.current?.focus({ preventScroll: true });
  };

  return (
    <AppLayout
      active="test"
      navItems={navItems}
      title="测试"
      subtitle={`${categoryName} · 选择范围和题型，开始一组巩固练习。`}
      topbarProps={topbarProps}
    >
      <div className="exam-page ds-stack test-center">
        <BaseCard className="test-scope-panel" aria-label="考试范围">
          <header className="test-panel-heading">
            <div><span className="test-eyebrow">当前计划 · {categoryName}</span><h2>选择测试范围</h2></div>
            <div className="test-content-actions" aria-label="考试操作">
              <SecondaryButton onClick={onBack}>返回今日计划</SecondaryButton>
              <SecondaryButton loading={syncing} onClick={onSyncAccount}>{syncing ? '同步中…' : '同步进度'}</SecondaryButton>
              <QuickMenu mode={mode} onOpenMode={onOpenMode} onOpenReading={onOpenReading} />
            </div>
          </header>
          <div className="test-scope-options" role="group" aria-label="测试范围">
            {scopes.map(item => <button key={item.id} type="button"
              className={`test-scope-choice ${selectedScope === item.id ? 'is-selected' : ''}`}
              aria-pressed={selectedScope === item.id} onClick={() => onSelectScope?.(item.id)}>
              <span className="test-scope-symbol" aria-hidden="true">{item.icon}</span>
              <span className="test-scope-name">{item.label}</span>
              <strong>{item.getCount(scopeCounts).toLocaleString('zh-CN')}<small>词</small></strong>
              <span className="test-scope-selected" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" /></svg></span>
            </button>)}
          </div>
          <div className="test-scope-footer">
            <p>{selectedScopeMeta.helper}<span>当前可选 {selectedScopeCount.toLocaleString('zh-CN')} 词。</span></p>
            <SecondaryButton onClick={focusModeOptions}>选择题型<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg></SecondaryButton>
          </div>
        </BaseCard>

        <BaseCard ref={modePanelRef} className="test-mode-panel" aria-label="考试模式">
          <header className="test-panel-heading">
            <div><h2 ref={modeHeadingRef} tabIndex={-1}>选择练习方式</h2><p>每组最多 20 次答题，可以提前结束并保存。</p></div>
            <span className="test-scope-summary">{selectedScopeMeta.label} · {selectedScopeCount.toLocaleString('zh-CN')} 词</span>
          </header>
          {isPreparing && <LoadingState variant="inline" className="test-preparation" title={`正在准备${categoryName === '全部单词' ? '全范围词库' : categoryName}`} />}
          {preparationError && <div className="test-preparation is-error" role="alert"><span>{preparationError}</span><SecondaryButton onClick={onRetryPreparation}>重试</SecondaryButton></div>}
          {!isPreparing && !preparationError && selectedScopeCount === 0 && <p className="test-preparation" role="status">当前范围暂无单词，可以切换范围后继续。</p>}
          <div className="test-mode-grid">
            {EXAM_MODES.map(item => <ModuleCard key={item.id} variant={item.tone}
              title={item.title} meta={<><span className="test-mode-meta">{item.meta}</span><span className="test-mode-helper">{item.helper}</span></>}
              iconSrc={item.iconSrc} disabled={isPreparing || selectedScopeCount === 0}
              onClick={() => onSelectMode?.(item.id, selectedScope)} />)}
          </div>
        </BaseCard>
        <ExamHistoryPanel />
      </div>
    </AppLayout>
  );
}

export default ExamPracticeView;
