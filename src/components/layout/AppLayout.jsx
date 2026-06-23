import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { MobileBottomNav, MobileTopbar } from './MobileAppChrome';

export { Sidebar, Topbar, MobileBottomNav, MobileTopbar };

export function Content({ children }) {
  return <main className="ds-content">{children}</main>;
}

function AppLayout({ active, navItems, title, subtitle, topbarProps = {}, sidebarProps = {}, className = '', children }) {
  const { sidebarProps: topbarSidebarProps = {}, ...safeTopbarProps } = topbarProps;

  return (
    <div className={`ds-app-layout ${className}`.trim()}>
      <Sidebar active={active} items={navItems} {...topbarSidebarProps} {...sidebarProps} />
      <div className="ds-main-shell">
        <Topbar title={title} subtitle={subtitle} {...safeTopbarProps} />
        <MobileTopbar title={title} {...safeTopbarProps} />
        <Content>{children}</Content>
      </div>
      <MobileBottomNav active={active} items={navItems} onUserClick={safeTopbarProps.onUserClick} />
    </div>
  );
}

export default AppLayout;
