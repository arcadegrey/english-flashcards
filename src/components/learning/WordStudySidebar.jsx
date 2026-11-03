import QuickMenu from '../QuickMenu';

export default function WordStudySidebar({
  mode, onOpenMode, onOpenReading, onNotice, onSyncAccount, streak, studyGoalTarget, remainingCount,
  studyGoalPercent, learnedTotal, masteredTotal, weekDays,
}) {
  return (
    <aside className="learn-refresh-study-aside" aria-label="学习状态">
      <div className="learn-refresh-side-tools">
        <button type="button" className="learn-refresh-side-tool" onClick={onSyncAccount}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6v5h-5" />
            <path d="M4 18v-5h5" />
            <path d="M6.2 9A7 7 0 0118.5 7.5L20 11" />
            <path d="M17.8 15A7 7 0 015.5 16.5L4 13" />
          </svg>
          <span>同步进度</span>
        </button>
        <QuickMenu
          mode={mode}
          onOpenMode={onOpenMode}
          onOpenReading={onOpenReading}
          onSlowSpeechChange={onNotice}
        />
      </div>

      <div className="learn-refresh-side-summary">
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-flame" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 22c4 0 7-2.8 7-6.9 0-2.7-1.4-4.9-4.1-6.7.1 1.8-.5 3.1-1.7 4-1-3.2-2.9-5.7-5.7-7.4.4 3-.1 5.1-1.7 6.9A6.4 6.4 0 0 0 5 15.1C5 19.2 8 22 12 22Z" />
            </svg>
          </span>
          <span>连续打卡</span>
          <strong>{streak > 0 ? `${streak} 天` : '今天开始'}</strong>
        </div>
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-target" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="m15.5 8.5 3-3" />
            </svg>
          </span>
          <span>今日目标</span>
          <strong>{studyGoalTarget} 词</strong>
        </div>
        <div className="learn-refresh-side-row">
          <span className="learn-refresh-side-icon is-star" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 2.6 5.4 5.9.8-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8-4.2-4.1 5.9-.8L12 3Z" />
            </svg>
          </span>
          <span>剩余词汇</span>
          <strong>{remainingCount} 词</strong>
        </div>
      </div>

      <div className="learn-refresh-side-card">
        <h2>学习进度</h2>
        <div className="learn-refresh-ring-row">
          <div className="learn-refresh-ring" style={{ '--study-progress': `${studyGoalPercent}%` }}>
            <div>
              <strong>{studyGoalPercent}%</strong>
              <span>今日进度</span>
            </div>
          </div>
          <dl className="learn-refresh-ring-stats">
            <div>
              <dt><span className="is-blue" />已学单词</dt>
              <dd>{learnedTotal}</dd>
            </div>
            <div>
              <dt><span className="is-purple" />今日目标</dt>
              <dd>{studyGoalTarget}</dd>
            </div>
            <div>
              <dt><span className="is-gray" />标记认识</dt>
              <dd>{masteredTotal}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="learn-refresh-side-card learn-refresh-week-card">
        <h2>坚持每天进步一点点</h2>
        <p>积累现在，收获未来</p>
        <div className="learn-refresh-week-row" aria-label="本周打卡">
          {weekDays.map((day) => (
            <span
              key={day.date}
              className={[day.isDone ? 'is-done' : '', day.isToday ? 'is-today' : ''].filter(Boolean).join(' ')}
            >
              <small>{day.label}</small>
              <b aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m6 12 4 4 8-8" />
                </svg>
              </b>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
