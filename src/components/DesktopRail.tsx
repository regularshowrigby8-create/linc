import { NavLink } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Button } from '@/components/Button';
import { HiveMark } from '@/components/Logo';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  MessagesIcon,
  ProfileIcon,
  RequestsIcon,
} from '@/components/icons';
import { NAV_ACCENT, WORKSPACE_HOME_ROUTE, WORKSPACE_LABEL } from '@/state/selectors';

interface DesktopRailProps {
  workspace: Workspace;
  pendingRequestCount: number;
  onOpenSwitcher: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * Desktop navigation: the current workspace and a switch control at the top,
 * and the four global areas anchored to the bottom. Collapsing the rail keeps
 * only the icons, which gives the page more room without hiding the way out.
 */
export const DesktopRail = ({
  workspace,
  pendingRequestCount,
  onOpenSwitcher,
  collapsed,
  onToggleCollapsed,
}: DesktopRailProps) => (
  <aside
    className={`lh-rail${collapsed ? ' lh-rail--collapsed' : ''}`}
    aria-label="Workspace navigation"
  >
    <div className="lh-rail__top">
      <div className="lh-rail__brand">
        <HiveMark />
        {collapsed ? null : <span className="lh-logo__word">LinkHive</span>}
      </div>

      <div className="lh-rail__workspace">
        {collapsed ? null : <span className="lh-label">Current workspace</span>}
        <p className="lh-rail__workspace-name">{WORKSPACE_LABEL[workspace]}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSwitcher}
          fullWidth
          aria-label={`Switch workspace. Current workspace is ${WORKSPACE_LABEL[workspace]}`}
        >
          {collapsed ? 'Switch' : 'Switch workspace'}
        </Button>
      </div>
    </div>

    <nav className="lh-rail__nav">
      <NavLink
        to={WORKSPACE_HOME_ROUTE[workspace]}
        data-accent={NAV_ACCENT.home}
        title={collapsed ? 'Home' : undefined}
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <HomeIcon />
        <span className="lh-rail__label">Home</span>
      </NavLink>
      <NavLink
        to="/app/requests"
        data-accent={NAV_ACCENT.requests}
        title={collapsed ? 'Requests' : undefined}
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <RequestsIcon />
        <span className="lh-rail__label">Requests</span>
        {pendingRequestCount > 0 ? (
          <span className="lh-bottomnav__badge">{pendingRequestCount}</span>
        ) : null}
      </NavLink>
      <NavLink
        to="/app/messages"
        data-accent={NAV_ACCENT.messages}
        title={collapsed ? 'Messages' : undefined}
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <MessagesIcon />
        <span className="lh-rail__label">Messages</span>
      </NavLink>
      <NavLink
        to="/app/profile"
        data-accent={NAV_ACCENT.profile}
        title={collapsed ? 'Profile' : undefined}
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <ProfileIcon />
        <span className="lh-rail__label">Profile</span>
      </NavLink>
    </nav>

    <button
      type="button"
      className="lh-rail__collapse"
      onClick={onToggleCollapsed}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Expand the navigation rail' : 'Collapse the navigation rail'}
    >
      {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </button>
  </aside>
);
