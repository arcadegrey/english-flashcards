import { IconButton } from '../ui/Buttons'

const icons = {
  plan: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 10v9h11v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h.01" />
      <path d="M16 4h.01" />
      <path d="M8 20h.01" />
      <path d="M16 20h.01" />
      <path d="M4 8h16" />
      <path d="M4 16h16" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
    </svg>
  ),
  words: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8h5" />
      <path d="M15 5a4 4 0 0 1 4 4v1a4 4 0 0 1 0 8h-5" />
      <path d="M9 9h6" />
      <path d="M9 15h6" />
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z" />
      <path d="M8 6h8" />
      <path d="M8 10h7" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.2 9A7 7 0 0 1 18.5 7.5L20 12" />
      <path d="M17.8 15A7 7 0 0 1 5.5 16.5L4 12" />
    </svg>
  ),
  test: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17L14 8V2" />
      <path d="M8 2h8" />
      <path d="M7.5 15h9" />
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 20V10" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2v4" />
      <path d="M17 2v4" />
      <path d="M4 9h16" />
      <path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.2 9A7 7 0 0 1 18.5 7.5L20 12" />
      <path d="M17.8 15A7 7 0 0 1 5.5 16.5L4 12" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="m21 21-4.3-4.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
}

export function Sidebar({ active = 'plan', items = [] }) {
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
            <span className="ds-sidebar-icon">{icons[item.icon] || icons.plan}</span>
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
  )
}

export function Topbar({
  title,
  subtitle,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onCalendar,
  onNotify,
  onSync,
  onUserClick,
  userLabel = '学习者',
}) {
  return (
    <header className="ds-topbar">
      <div className="ds-topbar-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {onSearchChange && (
        <div className="ds-topbar-search">
          <div className="ds-search-wrap">
            <span className="ds-search-icon">{icons.search}</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
            <span className="ds-search-key">⌘K</span>
          </div>
        </div>
      )}

      <div className="ds-topbar-actions">
        {onCalendar && <IconButton label="日历" onClick={onCalendar}>{icons.calendar}</IconButton>}
        {onSync && <IconButton label="同步账号" onClick={onSync}>{icons.sync}</IconButton>}
        {onNotify && <IconButton label="通知" onClick={onNotify}>{icons.bell}</IconButton>}
        <button type="button" className="ds-user-chip" onClick={onUserClick}>
          <span className="ds-avatar" aria-hidden="true">👨‍🎓</span>
          <span>{userLabel}</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  )
}

export function Content({ children }) {
  return <main className="ds-content">{children}</main>
}

function AppLayout({ active, navItems, title, subtitle, topbarProps = {}, children }) {
  return (
    <div className="ds-app-layout">
      <Sidebar active={active} items={navItems} />
      <div className="ds-main-shell">
        <Topbar title={title} subtitle={subtitle} {...topbarProps} />
        <Content>{children}</Content>
      </div>
    </div>
  )
}

export default AppLayout
