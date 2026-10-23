import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Avatar, Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Overlay';
import { useActions, useStore } from '@/state/store';
import {
  WORKSPACE_HOME_ROUTE,
  WORKSPACE_LABEL,
  WORKSPACE_PURPOSE,
  selectRegisteredWorkspaces,
  selectUnregisteredWorkspaces,
} from '@/state/selectors';

type Panel = 'menu' | 'account' | 'language' | 'help' | 'add_workspace';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DetailRow = ({ label, onOpen }: { label: string; onOpen: () => void }) => (
  <button type="button" className="lh-drawer__row" onClick={onOpen}>
    <span>{label}</span>
    <span className="lh-drawer__row-note">Not available yet</span>
  </button>
);

export const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();
  const [panel, setPanel] = useState<Panel>('menu');
  const [detail, setDetail] = useState<{ title: string; message: string } | null>(null);
  const [language, setLanguage] = useState('English');

  const user = state.app.user;
  const registered = selectRegisteredWorkspaces(state);
  const unregistered = selectUnregisteredWorkspaces(state);

  const closeAll = () => {
    setPanel('menu');
    setDetail(null);
    onClose();
  };

  const goTo = (path: string) => {
    closeAll();
    navigate(path);
  };

  const switchTo = async (workspace: Workspace) => {
    const result = await actions.switchWorkspace(workspace);
    if (result.ok) {
      closeAll();
      navigate(WORKSPACE_HOME_ROUTE[workspace]);
    }
  };

  const panelTitle =
    panel === 'account'
      ? 'Account settings'
      : panel === 'language'
        ? 'Language'
        : panel === 'help'
          ? 'Help and safety'
          : panel === 'add_workspace'
            ? 'Add workspace'
            : 'Your account';

  return (
    <Drawer open={open} title={panelTitle} onClose={onClose}>
      {detail ? (
        <div className="lh-stack">
          <div className="lh-stack-sm">
            <h3 className="lh-h3">{detail.title}</h3>
            <p className="lh-muted">{detail.message}</p>
          </div>
          <Button variant="secondary" onClick={() => setDetail(null)}>
            Back
          </Button>
        </div>
      ) : panel === 'menu' ? (
        <div className="lh-stack">
          {user ? (
            <div className="lh-drawer__identity">
              <Avatar initials={user.avatarInitials} name={user.name} size="lg" />
              <div className="lh-stack-sm">
                <strong>{user.businessName || user.name}</strong>
                <span className="lh-caption">
                  {user.businessName ? `${user.name} · Business account` : 'Personal account'}
                </span>
                <span className="lh-caption">{user.location}</span>
              </div>
            </div>
          ) : null}

          <nav className="lh-drawer__list" aria-label="Account menu">
            <button type="button" className="lh-drawer__row" onClick={() => goTo('/app/profile')}>
              <span>My profile</span>
            </button>
            <button type="button" className="lh-drawer__row" onClick={() => setPanel('account')}>
              <span>Account settings</span>
            </button>
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() => goTo('/app/settings/notifications')}
            >
              <span>Notification settings</span>
            </button>
            <button type="button" className="lh-drawer__row" onClick={() => setPanel('language')}>
              <span>Language</span>
              <span className="lh-drawer__row-note">{language}</span>
            </button>
            <button type="button" className="lh-drawer__row" onClick={() => setPanel('help')}>
              <span>Help and safety</span>
            </button>
          </nav>

          <div className="lh-stack-sm">
            <span className="lh-label">Your workspaces</span>
            <nav className="lh-drawer__list" aria-label="Registered workspaces">
              {registered.map((workspace) => (
                <button
                  key={workspace}
                  type="button"
                  className="lh-drawer__row"
                  onClick={() => void switchTo(workspace)}
                >
                  <span>{WORKSPACE_LABEL[workspace]}</span>
                  <Badge tone="success">Active</Badge>
                </button>
              ))}
              {registered.length === 0 ? (
                <p className="lh-caption">No workspaces registered yet.</p>
              ) : null}
              <button
                type="button"
                className="lh-drawer__row"
                onClick={() => setPanel('add_workspace')}
                data-testid="add-workspace"
              >
                <span>Add workspace</span>
              </button>
            </nav>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={async () => {
              await actions.signOut();
              closeAll();
              navigate('/');
            }}
          >
            Sign out
          </Button>
        </div>
      ) : panel === 'account' ? (
        <div className="lh-stack">
          <nav className="lh-drawer__list" aria-label="Account settings options">
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Personal details',
                  message: 'Your personal details are on your profile page.',
                })
              }
            >
              <span>Personal details</span>
            </button>
            {user?.accountType === 'business' ? (
              <button
                type="button"
                className="lh-drawer__row"
                onClick={() =>
                  setDetail({
                    title: 'Business details',
                    message: 'Your business details are on your profile page.',
                  })
                }
              >
                <span>Business details</span>
              </button>
            ) : null}
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Location',
                  message: `Your location is ${user?.location ?? 'not set'}.`,
                })
              }
            >
              <span>Location</span>
              <span className="lh-drawer__row-note">{user?.location}</span>
            </button>
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Contact visibility',
                  message: `Contact details are visible to ${user?.contactVisibility.replace(/_/g, ' ')}.`,
                })
              }
            >
              <span>Contact visibility</span>
              <span className="lh-drawer__row-note">
                {user?.contactVisibility.replace(/_/g, ' ')}
              </span>
            </button>
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Password',
                  message: 'Password changes are not connected yet.',
                })
              }
            >
              <span>Password</span>
            </button>
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Sessions',
                  message: 'Session management is not available yet.',
                })
              }
            >
              <span>Sessions</span>
            </button>
            <button
              type="button"
              className="lh-drawer__row"
              onClick={() =>
                setDetail({
                  title: 'Delete or deactivate account',
                  message: 'Account deletion is not available yet.',
                })
              }
            >
              <span>Delete or deactivate account</span>
            </button>
          </nav>

          <div className="lh-stack-sm">
            <span className="lh-label">Money</span>
            <div className="lh-notice lh-notice--info" role="note">
              <p className="lh-caption">
                Payments, wallet, currency and payouts are not available in this prototype.
                International settlement model is still under research.
              </p>
            </div>
            <button type="button" className="lh-drawer__row lh-drawer__row--disabled" disabled>
              <span>Payments</span>
              <span className="lh-drawer__row-note">Not available in this prototype</span>
            </button>
            <button type="button" className="lh-drawer__row lh-drawer__row--disabled" disabled>
              <span>Wallet</span>
              <span className="lh-drawer__row-note">Not available in this prototype</span>
            </button>
            <button type="button" className="lh-drawer__row lh-drawer__row--disabled" disabled>
              <span>Currency</span>
              <span className="lh-drawer__row-note">Not available in this prototype</span>
            </button>
            <button type="button" className="lh-drawer__row lh-drawer__row--disabled" disabled>
              <span>Payouts</span>
              <span className="lh-drawer__row-note">Not available in this prototype</span>
            </button>
          </div>

          <Button variant="secondary" onClick={() => setPanel('menu')}>
            Back
          </Button>
        </div>
      ) : panel === 'language' ? (
        <div className="lh-stack">
          <p className="lh-muted">
            English is the only language available right now. Others are planned for a later
            release.
          </p>
          <div className="lh-drawer__list">
            {['English', 'Afrikaans', 'isiZulu', 'Sesotho'].map((option) => (
              <button
                key={option}
                type="button"
                className="lh-drawer__row"
                onClick={() => {
                  setLanguage(option);
                  setPanel('menu');
                }}
              >
                <span>{option}</span>
                {option === 'English' ? <Badge tone="success">Current</Badge> : null}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => setPanel('menu')}>
            Back
          </Button>
        </div>
      ) : panel === 'help' ? (
        <div className="lh-stack">
          <nav className="lh-drawer__list" aria-label="Help and safety options">
            <DetailRow
              label="Safety tips"
              onOpen={() =>
                setDetail({
                  title: 'Safety tips',
                  message: 'Safety guidance is not available yet.',
                })
              }
            />
            <DetailRow
              label="Report a problem"
              onOpen={() =>
                setDetail({
                  title: 'Report a problem',
                  message:
                    'Use the Report action on a listing, profile, request or chat. A written reason is required so reports can be reviewed fairly.',
                })
              }
            />
            <DetailRow
              label="Report a user or listing"
              onOpen={() =>
                setDetail({
                  title: 'Report a user or listing',
                  message:
                    'Open the listing or profile and choose Report, then give a written reason.',
                })
              }
            />
            <DetailRow
              label="Blocked users"
              onOpen={() =>
                setDetail({
                  title: 'Blocked users',
                  message:
                    'Blocking is recorded on your account. A blocked-users list is not available yet.',
                })
              }
            />
            <DetailRow
              label="Community rules"
              onOpen={() =>
                setDetail({
                  title: 'Community rules',
                  message: 'Community rules are not available yet.',
                })
              }
            />
            <DetailRow
              label="Terms"
              onOpen={() =>
                setDetail({
                  title: 'Terms',
                  message: 'Terms are not available yet.',
                })
              }
            />
            <DetailRow
              label="Privacy"
              onOpen={() =>
                setDetail({
                  title: 'Privacy',
                  message: 'Privacy information is not available yet.',
                })
              }
            />
          </nav>
          <Button variant="secondary" onClick={() => setPanel('menu')}>
            Back
          </Button>
        </div>
      ) : (
        <div className="lh-stack">
          <p className="lh-muted">
            Unregistered workspaces stay hidden until you register for them. Registering never
            creates a verification automatically.
          </p>
          {unregistered.map((workspace) => (
            <div key={workspace} className="lh-drawer__workspace">
              <div className="lh-stack-sm">
                <strong>{WORKSPACE_LABEL[workspace]}</strong>
                <span className="lh-caption">{WORKSPACE_PURPOSE[workspace]}</span>
                <span className="lh-caption">
                  Required next step: workspace registration, then a verification review.
                </span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => goTo('/onboarding/workspaces')}>
                Register to unlock
              </Button>
            </div>
          ))}
          {unregistered.length === 0 ? (
            <p className="lh-caption">You have registered for every available workspace.</p>
          ) : null}
          <Button variant="secondary" onClick={() => setPanel('menu')}>
            Back
          </Button>
        </div>
      )}
    </Drawer>
  );
};
