import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge } from '@/components/Badge';
import { AccentPicker } from '@/components/AccentPicker';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Disclosure } from '@/components/Disclosure';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import {
  AwardIcon,
  CheckCircleIcon,
  ClockIcon,
  PaletteIcon,
  RouteIcon,
  StarIcon,
  UsersIcon,
  WrenchIcon,
} from '@/components/icons';
import { useActions, useStore } from '@/state/store';
import { WORKSPACE_LABEL, selectAchievements, type Achievement } from '@/state/selectors';
import { titleCase } from '@/utils/format';

/** Each badge gets its own mark, so the grid reads as a set of different things. */
const ACHIEVEMENT_ICON: Record<string, typeof AwardIcon> = {
  'first-request': WrenchIcon,
  accepted: CheckCircleIcon,
  conversation: UsersIcon,
  shortlist: StarIcon,
  routes: RouteIcon,
  partner: AwardIcon,
  demo: ClockIcon,
};

const AchievementTile = ({ achievement }: { achievement: Achievement }) => {
  const Icon = ACHIEVEMENT_ICON[achievement.id] ?? AwardIcon;
  const earned = achievement.state === 'earned';
  return (
    <li
      className={`lh-achievement${earned ? ' lh-achievement--earned' : ''}`}
      data-testid={`achievement-${achievement.id}`}
      data-state={achievement.state}
    >
      <span className="lh-achievement__mark" aria-hidden="true">
        <Icon />
      </span>
      <span className="lh-achievement__label">{achievement.label}</span>
      <span className="lh-caption">{achievement.detail}</span>
      {earned ? null : (
        <span className="lh-achievement__progress" aria-hidden="true">
          <span style={{ width: `${Math.round(achievement.progress * 100)}%` }} />
        </span>
      )}
      <span className="lh-sr-only">{earned ? 'Earned' : 'Not earned yet'}</span>
    </li>
  );
};

export const ProfilePage = () => {
  const { state } = useStore();
  const actions = useActions();
  // Null means "showing the saved value". An empty string is a real draft.
  const [headlineDraft, setHeadlineDraft] = useState<string | null>(null);
  const user = state.app.user;
  const preferences = state.app.preferences;

  if (!user) return null;

  const achievements = selectAchievements(state);
  const earned = achievements.filter((item) => item.state === 'earned');
  const completedConnections = state.app.requests.filter(
    (request) => request.state === 'completed',
  ).length;
  const acceptedConnections = state.app.requests.filter(
    (request) => request.state === 'accepted',
  ).length;
  const memberName = user.businessName || user.name;

  return (
    <div className="lh-page lh-stack" data-accent={preferences.accent}>
      <div className="lh-stack-sm">
        <h1 className="lh-h1">My profile</h1>
        <p className="lh-muted">
          Your badges, your colours and your details. Everything here is yours to change.
        </p>
      </div>

      <Card as="section" className="lh-stack lh-profilehero">
        <div className="lh-drawer__identity">
          <Avatar
            initials={user.avatarInitials}
            name={memberName}
            size="lg"
            style={preferences.avatarStyle}
          />
          <div className="lh-stack-sm">
            <h2 className="lh-h3">{memberName}</h2>
            {user.businessName ? <span className="lh-caption">{user.name}</span> : null}
            <span className="lh-profilehero__headline">{preferences.headline}</span>
            <span className="lh-row lh-caption">
              <span>{user.accountType === 'business' ? 'Business' : 'Personal'} account</span>
              <span aria-hidden="true">·</span>
              <span>{user.location}</span>
            </span>
          </div>
        </div>

        <ul className="lh-profilehero__badges" aria-label="Badges you have earned">
          {earned.length === 0 ? (
            <li className="lh-caption">Your first badge is one request away.</li>
          ) : (
            earned.map((achievement) => (
              <li key={achievement.id} className="lh-profilehero__badge">
                <AwardIcon size={16} />
                {achievement.label}
              </li>
            ))
          )}
        </ul>
      </Card>

      <Card as="section" className="lh-stack">
        <div className="lh-spread">
          <h2 className="lh-h3">Badges</h2>
          <span className="lh-caption">
            {earned.length} of {achievements.length} earned
          </span>
        </div>
        <p className="lh-muted">
          Badges come from what you have actually done here. They unlock on their own.
        </p>
        <ul className="lh-achievements">
          {achievements.map((achievement) => (
            <AchievementTile key={achievement.id} achievement={achievement} />
          ))}
        </ul>
      </Card>

      <Card as="section" className="lh-stack">
        <h2 className="lh-h3">Make it yours</h2>
        <p className="lh-muted">Your colour, your mark and your line about what you do.</p>

        <div className="lh-stack-sm">
          <span className="lh-label">Your accent</span>
          <AccentPicker
            value={preferences.accent}
            onChange={(accent) => void actions.setAccent(accent)}
          />
        </div>

        <div className="lh-stack-sm">
          <span className="lh-label">Your mark</span>
          <div className="lh-row" role="group" aria-label="Your mark">
            {(['initials', 'blocks', 'rings'] as const).map((style) => (
              <button
                key={style}
                type="button"
                className={`lh-avatarchoice${preferences.avatarStyle === style ? ' lh-avatarchoice--active' : ''}`}
                aria-pressed={preferences.avatarStyle === style}
                onClick={() => void actions.setAvatarStyle(style)}
              >
                <Avatar initials={user.avatarInitials} name={memberName} size="md" style={style} />
                <span className="lh-caption">{titleCase(style)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lh-stack-sm">
          <label className="lh-field__label" htmlFor="profile-headline">
            Your line about what you do
          </label>
          <div className="lh-row">
            <input
              id="profile-headline"
              className="lh-input lh-input--grow"
              value={headlineDraft ?? preferences.headline}
              maxLength={60}
              onChange={(event) => setHeadlineDraft(event.target.value)}
              placeholder="Service provider"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void actions.setHeadline(headlineDraft ?? preferences.headline);
                setHeadlineDraft(null);
              }}
            >
              Save
            </Button>
          </div>
          <span className="lh-caption">Up to 60 characters.</span>
        </div>

        <div className="lh-stack-sm">
          <span className="lh-label">Colour mode</span>
          <ThemeSwitch
            value={preferences.theme}
            onChange={(theme) => void actions.setTheme(theme)}
            idPrefix="profile-theme"
          />
        </div>
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
        <h2 className="lh-h3">Your details</h2>
        <Disclosure summary="Account and activity" icon={<PaletteIcon size={16} />}>
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
        </Disclosure>
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
