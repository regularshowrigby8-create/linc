import { useState } from 'react';
import type { Listing } from '@/data/types';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Overlay';
import { Textarea } from '@/components/Form';
import { useActions } from '@/state/store';
import { validateReason } from '@/utils/validation';

interface RequestWizardProps {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
}

interface Draft {
  reason: string;
  desiredOutcome: string;
  timing: string;
  locationBoundaries: string;
  budgetNote: string;
}

const EMPTY_DRAFT: Draft = {
  reason: '',
  desiredOutcome: '',
  timing: '',
  locationBoundaries: '',
  budgetNote: '',
};

const STEPS = [
  { id: 'reason', label: 'Reason and goal' },
  { id: 'outcome', label: 'Desired outcome' },
  { id: 'timing', label: 'Timing' },
  { id: 'location', label: 'Location or boundaries' },
  { id: 'budget', label: 'Budget or quote preference' },
  { id: 'review', label: 'Review' },
] as const;

/**
 * Owns the step index and the draft only.
 * Submission is delegated to the store action.
 */
export const RequestWizard = ({ open, listing, onClose }: RequestWizardProps) => {
  const actions = useActions();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [sentRequestId, setSentRequestId] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const busy = actions.isPending(`request:${listing?.id ?? ''}`);
  const step = STEPS[stepIndex];

  const resetAndClose = () => {
    setStepIndex(0);
    setDraft(EMPTY_DRAFT);
    setError(null);
    setFailure(null);
    setSentRequestId(null);
    onClose();
  };

  const update = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  };

  const handleNext = () => {
    if (step.id === 'reason') {
      const validation = validateReason(draft.reason);
      if (!validation.ok) {
        setError(validation.error ?? 'Enter a reason.');
        return;
      }
    }
    setError(null);
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleSubmit = async () => {
    if (!listing) return;
    const validation = validateReason(draft.reason);
    if (!validation.ok) {
      setError(validation.error ?? 'Enter a reason.');
      setStepIndex(0);
      return;
    }
    setFailure(null);
    const result = await actions.sendRequest({
      listing,
      reason: draft.reason,
      desiredOutcome: draft.desiredOutcome,
      timing: draft.timing,
      locationBoundaries: draft.locationBoundaries,
      budgetNote: draft.budgetNote,
    });
    if (result.ok) {
      setSentRequestId(result.data.id);
    } else {
      setFailure(result.error);
    }
  };

  return (
    <Modal
      open={open}
      title={sentRequestId ? 'Request sent' : `Send request${listing ? `: ${listing.title}` : ''}`}
      description={
        sentRequestId
          ? undefined
          : 'Step 1 is required. The remaining steps are optional and can be skipped.'
      }
      onClose={resetAndClose}
      footer={
        sentRequestId ? (
          <Button onClick={resetAndClose}>Done</Button>
        ) : (
          <div className="lh-row lh-spread">
            <Button variant="ghost" onClick={resetAndClose}>
              Cancel
            </Button>
            <div className="lh-row">
              {stepIndex > 0 ? (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              ) : null}
              {step.id === 'review' ? (
                <Button onClick={handleSubmit} loading={busy} disabled={busy}>
                  Send request
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </div>
        )
      }
    >
      {sentRequestId ? (
        <div className="lh-stack">
          <p className="lh-status-text">
            <strong>Request {sentRequestId}</strong> is now <strong>Sent</strong>. The provider can
            accept, decline or ignore it. Ignored requests expire after seven days.
          </p>
          <p className="lh-caption">
            Messaging opens once the provider accepts. Nothing is paid or transferred in this
            prototype.
          </p>
        </div>
      ) : (
        <div className="lh-stack">
          <p className="lh-caption">
            Step {stepIndex + 1} of {STEPS.length}: {step.label}
          </p>

          {step.id === 'reason' ? (
            <Textarea
              label="Why are you contacting them?"
              required
              rows={5}
              maxLength={500}
              value={draft.reason}
              error={error ?? undefined}
              hint="Between 10 and 500 characters. For example: I need three quotes for a local event."
              onChange={(event) => update('reason', event.target.value)}
            />
          ) : null}

          {step.id === 'outcome' ? (
            <Textarea
              label="What outcome are you looking for?"
              rows={4}
              maxLength={500}
              value={draft.desiredOutcome}
              hint="For example: a confirmed date and price for a two-bedroom deep clean."
              onChange={(event) => update('desiredOutcome', event.target.value)}
            />
          ) : null}

          {step.id === 'timing' ? (
            <Textarea
              label="When do you need this?"
              rows={3}
              maxLength={300}
              value={draft.timing}
              hint="For example: any Saturday in the next month."
              onChange={(event) => update('timing', event.target.value)}
            />
          ) : null}

          {step.id === 'location' ? (
            <Textarea
              label="Where, and what are the boundaries?"
              rows={3}
              maxLength={300}
              value={draft.locationBoundaries}
              hint="For example: Woodstock, Cape Town. Remote is also acceptable."
              onChange={(event) => update('locationBoundaries', event.target.value)}
            />
          ) : null}

          {step.id === 'budget' ? (
            <Textarea
              label="Budget or quote preference"
              rows={3}
              maxLength={300}
              value={draft.budgetNote}
              hint="For example: around R500, or a written quote before booking."
              onChange={(event) => update('budgetNote', event.target.value)}
            />
          ) : null}

          {step.id === 'review' ? (
            <div className="lh-stack">
              <h3 className="lh-h3">Review your request</h3>
              <dl className="lh-listing__facts">
                <div>
                  <dt className="lh-label">Reason</dt>
                  <dd>{draft.reason}</dd>
                </div>
                <div>
                  <dt className="lh-label">Desired outcome</dt>
                  <dd>{draft.desiredOutcome || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="lh-label">Timing</dt>
                  <dd>{draft.timing || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="lh-label">Location or boundaries</dt>
                  <dd>{draft.locationBoundaries || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="lh-label">Budget or quote preference</dt>
                  <dd>{draft.budgetNote || 'Not provided'}</dd>
                </div>
              </dl>
              {failure ? (
                <p className="lh-field__error" role="alert">
                  {failure}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
};
