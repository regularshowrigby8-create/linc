import { Link } from 'react-router-dom';
import { Avatar, Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/state/store';
import { WORKSPACE_LABEL } from '@/state/selectors';
import { titleCase } from '@/utils/format';

export const ProfilePage = () => {
  const { state } = useStore();
  const user = state.app.user;

  if (!user) return null;

  const completedConnections = state.app.requests.filter(
    (request) => request.state === 'completed',
  ).length;
  const acceptedConnections = state.app.requests.filter(
    (request) => request.state === 'accepted',
  ).length;

  return (
    <div className="lh-page lh-stack">
      <div className="lh-stack-sm">
        <h1 className="lh-h1">My profile</h1>
        <p className="lh-muted">
          Empty sections are omitted. Contact visibility is yours to control and applies to every
          workspace.
        </p>
      </div>

      <Card as="section" className="lh-stack">
        <div className="lh-drawer__identity">
          <Avatar initials={user.avatarInitials} name={user.name} size="lg" />
          <div className="lh-stack-sm">
            <h2 className="lh-h3">{user.businessName || user.name}</h2>
            {user.businessName ? <span className="lh-caption">{user.name}</span> : null}
            <span className="lh-caption">
              {user.accountType === 'business' ? 'Business account' : 'Personal account'}
            </span>
            <span className="lh-caption">{user.location}</span>
          </div>
        </div>

        <dl className="lh-listing__facts">
          <div>
            <dt className="lh-label">Contact visibility</dt>
            <dd>{titleCase(user.contactVisibility)}</dd>
          </div>
          <div>
            <dt className="lh-label">Registered workspaces</dt>
            <dd>
              {user.registeredWorkspaces.length === 0
                ? 'None yet'
                : user.registeredWorkspaces
                    .map((workspace) => WORKSPACE_LABEL[workspace])
                    .join(', ')}
            </dd>
          </div>
          <div>
            <dt className="lh-label">Accepted connections</dt>
            <dd>{acceptedConnections}</dd>
          </div>
          <div>
            <dt className="lh-label">Completed connections</dt>
            <dd>{completedConnections}</dd>
          </div>
          <div>
            <dt className="lh-label">Saved listings</dt>
            <dd>{state.app.savedListingIds.length}</dd>
          </div>
        </dl>
      </Card>

      <Card as="section" className="lh-stack">
        <h2 className="lh-h3">Verification status</h2>
        <ul className="lh-stack-sm">
          {user.registeredWorkspaces.map((workspace) => (
            <li key={workspace} className="lh-spread">
              <span>{WORKSPACE_LABEL[workspace]}</span>
              <Badge
                tone={
                  user.verificationByWorkspace[workspace] === 'verified'
                    ? 'success'
                    : user.verificationByWorkspace[workspace] === 'pending'
                      ? 'warning'
                      : 'neutral'
                }
              >
                {titleCase(user.verificationByWorkspace[workspace])}
              </Badge>
            </li>
          ))}
          {user.registeredWorkspaces.length === 0 ? (
            <li className="lh-caption">No workspaces registered yet.</li>
          ) : null}
        </ul>
        <p className="lh-caption">
          No real verification provider is connected. The demo flow shows how a review would work.
        </p>
        <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/verification/demo">
          See demo verification
        </Link>
      </Card>

      <Card as="section" className="lh-stack">
        <h2 className="lh-h3">Not available yet</h2>
        <div className="lh-settingrow">
          <div className="lh-stack-sm">
            <strong>Payments</strong>
            <span className="lh-caption">
              Payments are not available in this prototype. Agree the work and the price in writing
              before you commit.
            </span>
          </div>
          <Button variant="secondary" size="sm" disabled>
            Not available yet
          </Button>
        </div>
        <div className="lh-settingrow">
          <div className="lh-stack-sm">
            <strong>Wallet</strong>
            <span className="lh-caption">
              Wallet is planned for a later release. International settlement model is still under
              research.
            </span>
          </div>
          <Button variant="secondary" size="sm" disabled>
            Not available yet
          </Button>
        </div>
      </Card>
    </div>
  );
};
