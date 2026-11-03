import AppLayout from '../layout/AppLayout';
import { BaseCard } from '../ui/Cards';
import { SecondaryButton } from '../ui/Buttons';
import LoadingState from '../ui/LoadingState';
import ExamModeGrid from './ExamModeGrid';
import ExamHistoryPanel from './ExamHistoryPanel';
import { EXAM_MODE_LABELS } from '../../../shared/examAttempts.js';
import { COLLECTION_PRACTICE_SOURCES } from '../../../shared/collectionPractice.js';
import { collectionModeError, readCollectionDrafts } from '../../utils/collectionPractice.js';
import '../../styles/test-workspace.css';

export default function CollectionPracticeView({ practice, navItems, topbarProps }) {
  const selection = practice.selection;
  const label = COLLECTION_PRACTICE_SOURCES[selection?.source] || '定向练习';
  const drafts = selection ? readCollectionDrafts(practice.owner, selection.source) : {};
  const modeErrors = Object.fromEntries(Object.keys(EXAM_MODE_LABELS).map(mode =>
    [mode, collectionModeError(mode, selection?.words || [])]));
  const busy = practice.preparation?.loading;
  return <AppLayout active="test" title="定向巩固" subtitle={`${label} · 固定词表，选择练习方式。`}
    navItems={navItems} topbarProps={topbarProps}>
    <div className="exam-page ds-stack test-center">
      <BaseCard className="test-scope-panel" aria-label="定向练习词表">
        <header className="test-panel-heading">
          <div><span className="test-eyebrow">{label}</span><h2>练习当前列表</h2>
            <p>{selection ? `当前选定 ${selection.snapshot?.wordIds.length || 0} 词，练习中固定出题范围。` : '请从错题本、收藏或今日复习重新选择词表。'}</p></div>
          <SecondaryButton onClick={practice.backToCollection}>返回集合</SecondaryButton>
        </header>
        <p className="classroom-helper">每组最多 20 次答题，可以提前结束。草稿在本机按账号、集合和题型分别保存，完成成绩可随账号同步。</p>
        {practice.notice && <p className="classroom-notice" role="status">{practice.notice}</p>}
        {Object.values(drafts).some(Boolean) && <p className="classroom-helper">有未完成练习时，点击题型继续上次词表；重新开始会替换该题型的草稿。</p>}
      </BaseCard>
      <BaseCard className="test-mode-panel" aria-label="定向练习模式">
        <header className="test-panel-heading"><div><h2>选择练习方式</h2><p>题目和备选词均来自选定列表。</p></div></header>
        {busy && <LoadingState variant="inline" title="正在准备定向词表…" />}
        {practice.preparation?.error && <div className="test-preparation is-error" role="alert">
          <span>{practice.preparation.error}</span><SecondaryButton onClick={practice.retry}>重试</SecondaryButton>
        </div>}
        <ExamModeGrid disabled={busy || !selection} drafts={drafts} modeErrors={modeErrors}
          onSelectMode={mode => practice.startMode(mode)} onStartFresh={mode => practice.startMode(mode, { fresh: true })} />
      </BaseCard>
      {selection && <ExamHistoryPanel source={selection.source} />}
    </div>
  </AppLayout>;
}
