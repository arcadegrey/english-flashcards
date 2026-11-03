import { LoadingAnimation } from '../../ui/LoadingState';

export default function ReadingSessionActions({
  article, onBack, showTranslation, onToggleTranslation, onSpeakArticle, canSpeak, activeSentenceId,
  onCompleteReading, assignment, retryAttempt, submissionBusy, draftLoading, completionSummary,
  hasReadingQuestions, allQuestionsAnswered,
}) {
  return (
    <footer className="learn-refresh-bottombar reading-session-actions">
      <div className="learn-refresh-bottombar-inner">
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-secondary"
          onClick={onBack}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </span>
          <span>返回列表</span>
        </button>
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-ghost"
          onClick={() => onToggleTranslation()}
          disabled={!article.translation}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h9a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z" />
              <path d="M8 9h5" />
              <path d="M8 13h4" />
            </svg>
          </span>
          <span>{article.translation ? (showTranslation ? '收起翻译' : '显示翻译') : '暂无翻译'}</span>
        </button>
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-ghost"
          onClick={onSpeakArticle}
          disabled={!canSpeak}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" />
              <path d="M19.5 6a8 8 0 0 1 0 12" />
            </svg>
          </span>
          <span>{activeSentenceId ? '停止朗读' : '朗读首句'}</span>
        </button>
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-primary"
          onClick={onCompleteReading}
          disabled={assignment ? Boolean(assignment.submittedAt) || submissionBusy || draftLoading : Boolean(completionSummary) || (hasReadingQuestions && !allQuestionsAnswered)}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5 10 17l9-10" />
            </svg>
          </span>
          <span>{submissionBusy && <LoadingAnimation compact />} {assignment ? assignment.submittedAt ? '作业已提交' : submissionBusy ? '提交中…' : '提交阅读作业' : completionSummary ? '练习已保存' : retryAttempt ? '保存错题练习' : hasReadingQuestions ? '保存本次练习' : '完成阅读'}</span>
        </button>
      </div>
    </footer>
  );
}
