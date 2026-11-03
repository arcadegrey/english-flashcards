import LoadingState from '../ui/LoadingState';
import WordCard from '../WordCard';
import { appShellIcons } from '../layout/icons';
import WordStudyActions from './WordStudyActions';

export default function WordStudyWorkspace({
  onBack, onVoiceSettings, progressCurrent, totalCount, hasDailyGoal, studyGoalCurrent, studyGoalTarget,
  studyGoalPercent, vocabularyLoading, currentWord, currentIndex, nextWord, showHint, onMarkUnknown,
  onToggleHint, onMarkKnown,
}) {
  return (
    <section className="learn-refresh-study-workspace" aria-label="单词学习">
      <header className="learn-refresh-mobile-study-header">
        <button type="button" className="learn-refresh-mobile-back" onClick={onBack} aria-label="返回">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1>背单词</h1>
        {typeof onVoiceSettings === 'function' && (
          <button
            type="button"
            className="learn-refresh-mobile-voice"
            onClick={onVoiceSettings}
            aria-label="语音设置"
          >
            {appShellIcons.voice}
          </button>
        )}
        <div className="learn-refresh-mobile-progress-pill" aria-label={`当前进度 ${progressCurrent}/${totalCount}`}>
          <strong>{progressCurrent}</strong>
          <span>/ {totalCount}</span>
        </div>
      </header>

      <div className="learn-refresh-goal-strip">
        <span className="learn-refresh-goal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
            <path d="m15.5 8.5 3-3" />
            <path d="M17 5.5h3v3" />
          </svg>
        </span>
        <span className="learn-refresh-goal-label">今日目标</span>
        <strong>{hasDailyGoal ? `${studyGoalCurrent}/${studyGoalTarget}` : studyGoalTarget}</strong>
        <div className="learn-refresh-goal-track" aria-hidden="true">
          <span style={{ width: `${studyGoalPercent}%` }} />
        </div>
        <span className="learn-refresh-goal-percent">{studyGoalPercent}%</span>
      </div>

      {vocabularyLoading && currentWord && <LoadingState variant="inline" title="正在加载所选词库…" />}
      {vocabularyLoading && !currentWord ? <LoadingState title="正在加载所选词库…" /> : <WordCard
        key={`${currentWord?.id || 'learn-empty'}-${currentIndex}`}
        word={currentWord}
        nextWord={nextWord}
        showHint={showHint}
      />}

      <WordStudyActions showHint={showHint} onMarkUnknown={onMarkUnknown}
        onToggleHint={onToggleHint} onMarkKnown={onMarkKnown} />
    </section>
  );
}
