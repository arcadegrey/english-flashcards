import { appShellIcons } from './icons';

function Sidebar({ active = 'plan', items = [] }) {
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
        <button type="button" className="ds-streak-card" aria-label="连续学习 12 天">
          <span className="ds-streak-head">
            <span className="ds-streak-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c4 0 7-2.8 7-6.9 0-2.7-1.4-4.9-4.1-6.7.1 1.8-.5 3.1-1.7 4-1-3.2-2.9-5.7-5.7-7.4.4 3-.1 5.1-1.7 6.9A6.4 6.4 0 0 0 5 15.1C5 19.2 8 22 12 22Z" />
              </svg>
            </span>
            <span>
              <span className="ds-streak-label">连续学习</span>
              <strong>12 天</strong>
            </span>
            <span className="ds-streak-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </span>
          </span>
          <span className="ds-streak-week" aria-hidden="true">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
              <span key={day} className={index < 5 ? 'is-done' : ''}>
                <i />
                <small>{day}</small>
              </span>
            ))}
          </span>
        </button>
        <button type="button" className="ds-sidebar-collapse">
          <span aria-hidden="true">≪</span>
          <span>收起菜单</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
