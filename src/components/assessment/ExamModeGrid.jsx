import { ModuleCard } from '../ui/Cards';
import { SecondaryButton } from '../ui/Buttons';
import { EXAM_MODES } from './examModeOptions.js';

export default function ExamModeGrid({ disabled, onSelectMode, drafts, modeErrors = {}, onStartFresh }) {
  return <div className="test-mode-grid">
    {EXAM_MODES.map(item => {
      const draft = drafts?.[item.id];
      const invalid = modeErrors[item.id];
      const card = <ModuleCard key={item.id} variant={item.tone} data-prepare-view="assessment"
        title={item.title} meta={<><span className="test-mode-meta">{draft
          ? `继续草稿 · ${draft.collectionSnapshot.wordIds.length} 词 · 已答 ${draft.answers.length} 次` : item.meta}</span>
          <span className="test-mode-helper">{draft ? '继续上次选定的词表；原答题记录保留。' : invalid || item.helper}</span></>}
        iconSrc={item.iconSrc} disabled={disabled || !draft && Boolean(invalid)}
        onClick={() => onSelectMode?.(item.id)} />;
      return draft ? <div key={item.id} className="collection-practice-mode">
        {card}<SecondaryButton disabled={disabled || Boolean(invalid)} onClick={() => onStartFresh?.(item.id)}>
          按当前列表重新开始（替换草稿）
        </SecondaryButton>
      </div> : card;
    })}
  </div>;
}
