import { IconButton } from '../ui/Buttons';
import { appShellIcons } from './icons';

function Topbar({
  title,
  subtitle,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onCalendar,
  onNotify,
  notifyBadge,
  onThemeToggle,
  isDarkTheme = false,
  onSync,
  onUserClick,
  userLabel = '学习者',
  extraActions,
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
            <span className="ds-search-icon">{appShellIcons.search}</span>
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
        {onCalendar && <IconButton label="日历" onClick={onCalendar}>{appShellIcons.calendar}</IconButton>}
        {onThemeToggle && (
          <IconButton
            className="ds-theme-toggle"
            label={isDarkTheme ? '切换浅色模式' : '切换深色模式'}
            onClick={onThemeToggle}
          >
            {isDarkTheme ? appShellIcons.sun : appShellIcons.moon}
          </IconButton>
        )}
        {onSync && <IconButton label="同步账号" onClick={onSync}>{appShellIcons.sync}</IconButton>}
        {onNotify && <IconButton label="通知" badge={notifyBadge} onClick={onNotify}>{appShellIcons.bell}</IconButton>}
        {extraActions}
        <button type="button" className="ds-user-chip" onClick={onUserClick}>
          <span className="ds-avatar" aria-hidden="true">Aa</span>
          <span>{userLabel}</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
