import { NavLink } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Button } from '@/components/Button';
import { HiveMark } from '@/components/Logo';
import { HomeIcon, MessagesIcon, ProfileIcon, RequestsIcon } from '@/components/icons';
import { WORKSPACE_HOME_ROUTE, WORKSPACE_LABEL } from '@/state/selectors';

interface DesktopRailProps {
  workspace: Workspace;
  pendingRequestCount: number;
  onOpenSwitcher: () => void;
}

/**
 * Desktop navigation: the current workspace, a switch control, and four global
 * utilities. Workspace tiles are never shown side by side.
 */
export const DesktopRail = ({
  workspace,
  pendingRequestCount,
  onOpenSwitcher,
}: DesktopRailProps) => (
  <aside className="lh-rail" aria-label="Workspace navigation">
    <div className="lh-rail__brand">
      <HiveMark />
      <span className="lh-logo__word">LinkHive</span>
    </div>

    <div className="lh-rail__workspace">
      <span className="lh-label">Current workspace</span>
      <p className="lh-rail__workspace-name">{WORKSPACE_LABEL[workspace]}</p>
      <Button variant="secondary" size="sm" onClick={onOpenSwitcher} fullWidth>
        Switch workspace
      </Button>
    </div>

    <nav className="lh-rail__nav">
      <NavLink
        to={WORKSPACE_HOME_ROUTE[workspace]}
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/app/requests"
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <RequestsIcon />
        <span>Requests</span>
        {pendingRequestCount > 0 ? (
          <span className="lh-bottomnav__badge">{pendingRequestCount}</span>
        ) : null}
      </NavLink>
      <NavLink
        to="/app/messages"
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <MessagesIcon />
        <span>Messages</span>
      </NavLink>
      <NavLink
        to="/app/profile"
        className={({ isActive }) => `lh-rail__item${isActive ? ' lh-rail__item--active' : ''}`}
      >
        <ProfileIcon />
        <span>Profile</span>
      </NavLink>
    </nav>

    <p className="lh-rail__note">Prototype. Payments and currency are not available.</p>
  </aside>
);
