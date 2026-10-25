import { calculateStudyStreak, getWeekStudyDays } from '../../utils/learningMetrics.js';
import { appShellIcons } from './icons';

function Sidebar({ active = 'plan', items = [], studyHistory = [] }) {
  const streak = calculateStudyStreak(studyHistory);
  const weekDays = getWeekStudyDays(studyHistory);

  return (
    <aside className="ds-sidebar">
      <div className="ds-brand">
        <div className="ds-brand-mark">Aa</div>
        <p className="ds-brand-name">English<br />Flashcards</p>
      </div>

      <nav className="ds-sidebar-nav" aria-label="主导航">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ds-sidebar-item ${active === item.id ? 'is-active' : ''}`}
            onClick={item.onClick}
          >
            <span className="ds-sidebar-icon">{appShellIcons[item.icon] || appShellIcons.plan}</span>
            <span className="ds-sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="ds-sidebar-foot">
        <div className="ds-streak-card" aria-label={`连续学习 ${streak} 天`}>
          <span className="ds-streak-head">
            <span className="ds-streak-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c4 0 7-2.8 7-6.9 0-2.7-1.4-4.9-4.1-6.7.1 1.8-.5 3.1-1.7 4-1-3.2-2.9-5.7-5.7-7.4.4 3-.1 5.1-1.7 6.9A6.4 6.4 0 0 0 5 15.1C5 19.2 8 22 12 22Z" />
              </svg>
            </span>
            <span>
              <span className="ds-streak-label">连续学习</span>
              <strong>{streak > 0 ? `${streak} 天` : '今天开始'}</strong>
            </span>
          </span>
          <span className="ds-streak-week" aria-hidden="true">
            {weekDays.map((day) => (
              <span
                key={day.date}
                className={`${day.isDone ? 'is-done' : ''} ${day.isToday ? 'is-today' : ''}`.trim()}
              >
                <i />
                <small>{day.label}</small>
              </span>
            ))}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
