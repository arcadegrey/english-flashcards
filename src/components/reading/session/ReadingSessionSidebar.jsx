import QuickMenu from '../../QuickMenu';

export default function ReadingSessionSidebar({
  mode, onOpenMode, onBack, onSyncAccount, onNotice, readingStats, articleMinutes, questionCount,
  readingProgressPercent,
}) {
  return (
    <aside className="learn-refresh-study-aside reading-session-aside" aria-label="阅读状态">
      <div className="learn-refresh-side-tools">
        <button type="button" className="learn-refresh-side-tool" onClick={onSyncAccount}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6v5h-5" />
            <path d="M4 18v-5h5" />
            <path d="M6.2 9A7 7 0 0 1 18.5 7.5L20 11" />
            <path d="M17.8 15A7 7 0 0 1 5.5 16.5L4 13" />
          </svg>
          <span>同步进度</span>
        </button>
        <QuickMenu
          mode={mode}
          onOpenMode={onOpenMode}
          onOpenReading={onBack}
          onSlowSpeechChange={onNotice}
        />
      </div>

      <div className="learn-refresh-side-summary">
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-target" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="m15.5 8.5 3-3" />
            </svg>
          </span>
          <span>未标记认识词</span>
          <strong>{readingStats.unmasteredCount}</strong>
        </div>
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-flame" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 4h14v16H5z" />
              <path d="M8 8h8" />
              <path d="M8 12h7" />
            </svg>
          </span>
          <span>阅读时长</span>
          <strong>{articleMinutes} 分</strong>
        </div>
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-star" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 2.6 5.4 5.9.8-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8-4.2-4.1 5.9-.8L12 3Z" />
            </svg>
          </span>
          <span>阅读题</span>
          <strong>{questionCount}</strong>
        </div>
      </div>

      <div className="learn-refresh-side-card">
        <h2>阅读进度</h2>
        <div className="learn-refresh-ring-row">
          <div className="learn-refresh-ring" style={{ '--study-progress': `${readingProgressPercent}%` }}>
            <div>
              <strong>{readingProgressPercent}%</strong>
              <span>难词认识记录</span>
            </div>
          </div>
          <dl className="learn-refresh-ring-stats">
            <div>
              <dt><span className="is-blue" />标记认识</dt>
              <dd>{readingStats.masteredCount}</dd>
            </div>
            <div>
              <dt><span className="is-purple" />总词数</dt>
              <dd>{readingStats.totalTracked}</dd>
            </div>
            <div>
              <dt><span className="is-gray" />未标记认识</dt>
              <dd>{readingStats.unmasteredCount}</dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
  );
}
