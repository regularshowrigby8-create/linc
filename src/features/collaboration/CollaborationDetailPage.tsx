import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { AgreementState } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/States';
import { ProgressStepper, type StepperStep } from '@/components/ProgressStepper';
import { ReportModal } from '@/features/requests/ReportModal';
import { useActions, useStore } from '@/state/store';
import { selectListingById } from '@/state/selectors';
import { formatDate, formatDateTime } from '@/utils/dates';
import { titleCase } from '@/utils/format';

const STEP_ORDER: AgreementState[] = [
  'draft',
  'invitation_sent',
  'pending_acceptance',
  'discussion',
  'terms_proposed',
  'terms_accepted',
  'scheduled',
  'in_progress',
  'completed',
];

const STEP_LABELS: { id: string; label: string }[] = [
  { id: 'scope', label: 'Scope' },
  { id: 'responsibilities', label: 'Responsibilities' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'terms', label: 'Terms' },
  { id: 'members', label: 'Members' },
];

export const CollaborationDetailPage = () => {
  const { id = '' } = useParams();
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [inviteName, setInviteName] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const listing = selectListingById(state, id);
  const collaboration = state.app.collaborations.find(
    (item) => item.id === id || (listing && item.title === listing.title),
  );

  if (!collaboration) {
    return (
      <div className="lh-page">
        <EmptyState
          title="That collaboration is not available"
          description="The collaboration may have been closed or the link may be wrong."
          actions={[
            { label: 'Back to collaborations', onClick: () => navigate('/app/collaboration') },
          ]}
        />
      </div>
    );
  }

  const currentStepIndex = STEP_ORDER.indexOf(collaboration.agreementState);
  const steps: StepperStep[] = STEP_LABELS.map((step, index) => {
    const stepState: StepperStep['state'] =
      index < 3
        ? currentStepIndex >= 3
          ? 'complete'
          : index === 3
            ? 'current'
            : 'upcoming'
        : index === 3
          ? collaboration.agreementState === 'terms_proposed'
            ? 'current'
            : collaboration.agreementState === 'terms_accepted'
              ? 'complete'
              : 'upcoming'
          : collaboration.agreementState === 'completed'
            ? 'complete'
            : 'current';
    return { id: step.id, label: step.label, state: stepState };
  });

  const pendingMembers = collaboration.members.filter(
    (member) => member.state === 'invited' || member.state === 'pending',
  );
  const confirmations = collaboration.completionConfirmations.filter((c) => c.confirmedAt).length;
  const incomplete = collaboration.agreementState === 'in_progress';

  const handleAcceptTerms = async () => {
    if (!agreed) {
      setAgreeError('Confirm that you have reviewed the scope and responsibilities.');
      return;
    }
    setAgreeError(null);
    await actions.acceptTerms(collaboration.id);
  };

  const handleInvite = async () => {
    const result = await actions.inviteCollaborator(collaboration.id, inviteName);
    if (result.ok) {
      setInviteName('');
      setInviteError(null);
    } else {
      setInviteError(result.error);
    }
  };

  return (
    <div className="lh-page lh-detail">
      <Card as="article" className="lh-detail__main">
        <div className="lh-stack">
          <div className="lh-spread">
            <h1 className="lh-h1">{collaboration.title}</h1>
            <Badge tone="hive">{titleCase(collaboration.agreementState)}</Badge>
          </div>

          <p className="lh-muted">{titleCase(collaboration.category)}</p>

          <ProgressStepper steps={steps} ariaLabel="Agreement progress" />

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Agreement</h2>
            <dl className="lh-listing__facts">
              {collaboration.agreementFields.map((field) => (
                <div key={field.key}>
                  <dt className="lh-label">
                    {field.label}
                    {field.required ? ' *' : ''}
                  </dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {collaboration.agreementState === 'terms_proposed' ? (
            <section className="lh-stack-sm">
              <h2 className="lh-h3">Accept the terms</h2>
              <label className="lh-checkbox">
                <input
                  type="checkbox"
                  className="lh-checkbox__input"
                  checked={agreed}
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setAgreeError(null);
                  }}
                />
                <span className="lh-checkbox__label">
                  I have reviewed the scope and responsibilities.
                </span>
              </label>
              {agreeError ? (
                <p className="lh-field__error" role="alert">
                  {agreeError}
                </p>
              ) : null}
              <div className="lh-row">
                <Button onClick={handleAcceptTerms}>Accept terms</Button>
                <Button variant="secondary" onClick={() => setAgreed(false)}>
                  Go back and edit
                </Button>
              </div>
            </section>
          ) : null}

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Members</h2>
            <ul className="lh-stack-sm">
              {collaboration.members.map((member) => (
                <li key={member.userId} className="lh-memberrow">
                  <div className="lh-stack-sm">
                    <strong>{member.name}</strong>
                    <span className="lh-caption">
                      {titleCase(member.role)} · {titleCase(member.state)}
                    </span>
                  </div>
                  {member.state === 'invited' || member.state === 'pending' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={actions.isPending(`approve:${member.userId}`)}
                      onClick={() => void actions.approveMember(collaboration.id, member.userId)}
                    >
                      Approve member
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Invite someone</h2>
            <label className="lh-field__label" htmlFor="invite-name">
              Name of the business or provider
            </label>
            <div className="lh-row">
              <input
                id="invite-name"
                className="lh-input"
                value={inviteName}
                onChange={(event) => {
                  setInviteName(event.target.value);
                  setInviteError(null);
                }}
                placeholder="For example: Botha Design Studio"
              />
              <Button
                onClick={handleInvite}
                loading={actions.isPending(`invite:${collaboration.id}`)}
              >
                Send invitation
              </Button>
            </div>
            {inviteError ? (
              <p className="lh-field__error" role="alert">
                {inviteError}
              </p>
            ) : null}
            <p className="lh-caption">
              {pendingMembers.length} invitation{pendingMembers.length === 1 ? '' : 's'} waiting for
              approval.
            </p>
          </section>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Schedule</h2>
            <p className="lh-muted">
              Starts {formatDateTime(collaboration.schedule.startsAt)} for{' '}
              {collaboration.schedule.durationHours} hours at {collaboration.schedule.location}.
              {collaboration.schedule.remote ? ' Remote session.' : ''}
            </p>
          </section>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Completion</h2>
            <p className="lh-muted">
              {confirmations} of {collaboration.completionConfirmations.length} parties have
              confirmed completion.
            </p>
            {incomplete ? (
              <p className="lh-caption">
                This collaboration is incomplete. If the scheduled end passed more than 24 hours ago
                without both confirmations, it stays incomplete rather than being marked complete.
              </p>
            ) : null}
            {collaboration.agreementState === 'completed' ? (
              <p className="lh-caption">
                Completed {formatDate(collaboration.createdAt)}. Ratings can now be published.
              </p>
            ) : null}
          </section>

          <div className="lh-row">
            <Button variant="ghost" onClick={() => setReportOpen(true)}>
              Report
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                void actions.blockTarget({ targetType: 'listing', targetId: collaboration.id });
                navigate('/app/collaboration');
              }}
            >
              Block
            </Button>
          </div>

          <p className="lh-caption">
            Payments are not available in this prototype. No platform payment is part of this
            agreement.
          </p>
        </div>
      </Card>

      <aside className="lh-detail__aside">
        <Card as="section" className="lh-stack-sm">
          <h2 className="lh-h3">About this collaboration</h2>
          <p className="lh-caption">Created {formatDate(collaboration.createdAt)}</p>
          <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/collaboration">
            Back to all collaborations
          </Link>
        </Card>
      </aside>

      <ReportModal
        open={reportOpen}
        targetType="listing"
        targetId={collaboration.id}
        targetLabel={collaboration.title}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};
