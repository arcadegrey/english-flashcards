import { IconButton } from '../ui/Buttons';
import { appShellIcons } from './icons';

export function MobileTopbar({
  title,
  onCalendar,
  onNotify,
  notifyBadge,
  onVoiceSettings,
  onUserClick,
}) {
  return (
    <header className="ds-mobile-topbar">
      <button type="button" className="ds-mobile-avatar-button" aria-label="账号" onClick={onUserClick}>
        <span className="ds-avatar" aria-hidden="true">Aa</span>
      </button>
      <h1>{title}</h1>
      <div className="ds-mobile-actions">
        {onCalendar && <IconButton label="日历" onClick={onCalendar}>{appShellIcons.calendar}</IconButton>}
        {onVoiceSettings && (
          <IconButton className="ds-voice-toggle" label="语音设置" onClick={onVoiceSettings}>
            {appShellIcons.voice}
          </IconButton>
        )}
        {onNotify && <IconButton label="通知" badge={notifyBadge} onClick={onNotify}>{appShellIcons.bell}</IconButton>}
      </div>
    </header>
  );
}

export function MobileBottomNav({ active, items = [], onUserClick }) {
  const primaryItems = [
    items.find((item) => item.id === 'plan'),
    items.find((item) => item.id === 'training'),
    items.find((item) => item.id === 'stats'),
    {
      id: 'profile',
      label: '我的',
      icon: 'profile',
      onClick: onUserClick,
    },
  ].filter(Boolean);

  return (
    <nav className="ds-mobile-bottom-nav" aria-label="底部导航">
      {primaryItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`ds-mobile-nav-item ${active === item.id ? 'is-active' : ''}`}
          onClick={item.onClick}
        >
          <span className="ds-mobile-nav-icon" aria-hidden="true">
            {appShellIcons[item.icon] || appShellIcons.plan}
          </span>
          <span className="ds-mobile-nav-label">
            {item.id === 'plan' ? '今日' : item.id === 'training' ? '训练' : item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
