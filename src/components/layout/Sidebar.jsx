import { appShellIcons } from './icons';

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

const toDateKey = (date) => date.toISOString().split('T')[0];

const getActiveDates = (studyHistory) =>
  new Set(
    (Array.isArray(studyHistory) ? studyHistory : [])
      .filter((item) => Number(item?.wordsLearned || 0) + Number(item?.wordsMastered || 0) > 0)
      .map((item) => item.date)
      .filter(Boolean)
  );

const calculateStreak = (activeDates) => {
  const today = new Date();
  const todayKey = toDateKey(today);
  const cursor = new Date(today);
  let streak = 0;

  while (true) {
    const dateKey = toDateKey(cursor);
    if (activeDates.has(dateKey)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (dateKey === todayKey) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
};

const getCurrentWeek = (activeDates) => {
  const today = new Date();
  const day = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  return WEEK_DAYS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label,
      dateKey: toDateKey(date),
      isDone: activeDates.has(toDateKey(date)),
      isToday: toDateKey(date) === toDateKey(today),
    };
  });
};

function Sidebar({ active = 'plan', items = [], studyHistory = [] }) {
  const activeDates = getActiveDates(studyHistory);
  const streak = calculateStreak(activeDates);
  const weekDays = getCurrentWeek(activeDates);

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
                key={day.dateKey}
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
