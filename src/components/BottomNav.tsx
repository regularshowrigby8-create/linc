import { NavLink } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { HomeIcon, MessagesIcon, ProfileIcon, RequestsIcon } from '@/components/icons';
import { WORKSPACE_HOME_ROUTE, WORKSPACE_LABEL } from '@/state/selectors';

interface BottomNavProps {
  workspace: Workspace;
  pendingRequestCount: number;
}

/** Mobile bottom navigation: the active workspace home, requests, messages, profile. */
export const BottomNav = ({ workspace, pendingRequestCount }: BottomNavProps) => (
  <nav className="lh-bottomnav" aria-label="Primary">
    <NavLink
      to={WORKSPACE_HOME_ROUTE[workspace]}
      className={({ isActive }) =>
        `lh-bottomnav__item${isActive ? ' lh-bottomnav__item--active' : ''}`
      }
    >
      <HomeIcon />
      <span className="lh-bottomnav__label">Home</span>
      <span className="lh-sr-only">{WORKSPACE_LABEL[workspace]} home</span>
    </NavLink>

    <NavLink
      to="/app/requests"
      className={({ isActive }) =>
        `lh-bottomnav__item${isActive ? ' lh-bottomnav__item--active' : ''}`
      }
    >
      <RequestsIcon />
      <span className="lh-bottomnav__label">Requests</span>
      {pendingRequestCount > 0 ? (
        <span className="lh-bottomnav__badge">{pendingRequestCount}</span>
      ) : null}
      <span className="lh-sr-only">
        {pendingRequestCount} request{pendingRequestCount === 1 ? '' : 's'} waiting
      </span>
    </NavLink>

    <NavLink
      to="/app/messages"
      className={({ isActive }) =>
        `lh-bottomnav__item${isActive ? ' lh-bottomnav__item--active' : ''}`
      }
    >
      <MessagesIcon />
      <span className="lh-bottomnav__label">Messages</span>
    </NavLink>

    <NavLink
      to="/app/profile"
      className={({ isActive }) =>
        `lh-bottomnav__item${isActive ? ' lh-bottomnav__item--active' : ''}`
      }
    >
      <ProfileIcon />
      <span className="lh-bottomnav__label">Profile</span>
    </NavLink>
  </nav>
);
