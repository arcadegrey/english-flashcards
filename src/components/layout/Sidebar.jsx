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
        <button type="button" className="ds-sidebar-collapse">
          <span aria-hidden="true">≪</span>
          <span>收起菜单</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
