export default function WordStudyActions({
  showHint, onMarkUnknown, onToggleHint, onMarkKnown,
}) {
  return (
    <footer className="learn-refresh-bottombar">
      <div className="learn-refresh-bottombar-inner">
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-secondary"
          onClick={onMarkUnknown}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">?</span>
          <span>不认识</span>
        </button>
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-ghost"
          onClick={onToggleHint}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M8.5 14.5A6 6 0 1 1 15.5 14c-.9.7-1.5 1.7-1.5 3h-4c0-1.2-.5-2-1.5-2.5Z" />
            </svg>
          </span>
          <span>{showHint ? '收起提示' : '显示提示'}</span>
        </button>
        <button
          type="button"
          className="learn-refresh-action learn-refresh-action-primary"
          onClick={onMarkKnown}
        >
          <span className="learn-refresh-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m6 12 4 4 8-8" />
            </svg>
          </span>
          <span>认识了</span>
        </button>
      </div>
    </footer>
  );
}
