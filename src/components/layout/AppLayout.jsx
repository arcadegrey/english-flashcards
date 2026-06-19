import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { MobileBottomNav, MobileTopbar } from './MobileAppChrome';

export { Sidebar, Topbar, MobileBottomNav, MobileTopbar };

export function Content({ children }) {
  return <main className="ds-content">{children}</main>;
}

function AppLayout({ active, navItems, title, subtitle, topbarProps = {}, className = '', children }) {
  return (
    <div className={`ds-app-layout ${className}`.trim()}>
      <Sidebar active={active} items={navItems} />
      <div className="ds-main-shell">
        <Topbar title={title} subtitle={subtitle} {...topbarProps} />
        <MobileTopbar title={title} {...topbarProps} />
        <Content>{children}</Content>
      </div>
      <MobileBottomNav active={active} items={navItems} onUserClick={topbarProps.onUserClick} />
    </div>
  );
}

export default AppLayout;
