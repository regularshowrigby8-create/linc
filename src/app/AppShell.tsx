import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Overlay';
import { BottomNav } from '@/components/BottomNav';
import { DesktopRail } from '@/components/DesktopRail';
import { BellIcon, MenuIcon, SearchIcon } from '@/components/icons';
import { ProfileDrawer } from '@/features/profile/ProfileDrawer';
import { useActions, useStore } from '@/state/store';
import {
  WORKSPACE_HOME_ROUTE,
  WORKSPACE_LABEL,
  selectActiveWorkspace,
  selectPendingRequestCount,
  selectRegisteredWorkspaces,
} from '@/state/selectors';

export const AppShell = () => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const user = state.app.user;
  const workspace = selectActiveWorkspace(state);
  const registered = selectRegisteredWorkspaces(state);
  const pendingRequestCount = user ? selectPendingRequestCount(state, user.id) : 0;

  const switchTo = async (target: (typeof registered)[number]) => {
    const result = await actions.switchWorkspace(target);
    if (result.ok) {
      setSwitcherOpen(false);
      navigate(WORKSPACE_HOME_ROUTE[target]);
    }
  };

  return (
    <div className="lh-app">
      <a className="lh-skip-link" href="#main">
        Skip to main content
      </a>

      <header className="lh-topbar">
        <div className="lh-topbar__left">
          <IconMenu onClick={() => setDrawerOpen(true)} label="Open menu" />
          <span className="lh-topbar__workspace">{WORKSPACE_LABEL[workspace]}</span>
        </div>
        <div className="lh-topbar__right">
          <Link
            className="lh-topbar__icon"
            to={WORKSPACE_HOME_ROUTE[workspace]}
            aria-label="Search in this workspace"
          >
            <SearchIcon />
          </Link>
          <Link
            className="lh-topbar__icon"
            to="/app/requests"
            aria-label="Notifications and requests"
          >
            <BellIcon />
            {pendingRequestCount > 0 ? (
              <span className="lh-topbar__badge">{pendingRequestCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className="lh-topbar__avatar"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open your account menu"
          >
            <Avatar
              initials={user?.avatarInitials ?? 'LH'}
              name={user?.name ?? 'Account'}
              size="sm"
            />
          </button>
        </div>
      </header>

      <div className="lh-app__body">
        <DesktopRail
          workspace={workspace}
          pendingRequestCount={pendingRequestCount}
          onOpenSwitcher={() => setSwitcherOpen(true)}
        />
        <main className="lh-app__main lh-skip-to-content" id="main">
          <Outlet />
        </main>
      </div>

      <BottomNav workspace={workspace} pendingRequestCount={pendingRequestCount} />

      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Drawer
        open={switcherOpen}
        title="Switch workspace"
        description="Only workspaces you registered for are listed here."
        onClose={() => setSwitcherOpen(false)}
      >
        <div className="lh-drawer__list">
          {registered.map((item) => (
            <button
              key={item}
              type="button"
              className="lh-drawer__row"
              onClick={() => void switchTo(item)}
              aria-current={item === workspace ? 'true' : undefined}
            >
              <span>{WORKSPACE_LABEL[item]}</span>
              {item === workspace ? <span className="lh-drawer__row-note">Current</span> : null}
            </button>
          ))}
          {registered.length === 0 ? (
            <p className="lh-caption">You have not registered for a workspace yet.</p>
          ) : null}
        </div>
        <Button variant="secondary" onClick={() => navigate('/onboarding/workspaces')}>
          Register for another workspace
        </Button>
      </Drawer>
    </div>
  );
};

const IconMenu = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button type="button" className="lh-topbar__icon" onClick={onClick} aria-label={label}>
    <MenuIcon />
  </button>
);
