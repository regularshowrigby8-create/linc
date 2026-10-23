import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressStepper, type StepperStep } from '@/components/ProgressStepper';
import { useActions, useStore } from '@/state/store';
import { formatDateTime } from '@/utils/dates';

const DEMO_LABEL = 'DEMO — no real documents are collected';

type DemoResult = 'passed' | 'manual_review' | 'mismatch' | 'rejected';

const RESULT_COPY: Record<DemoResult, { title: string; body: string; cta?: string }> = {
  passed: {
    title: 'Demo checks passed. This is not real verification.',
    body: 'The sample passed the demo checks. Nothing about this account is genuinely verified.',
  },
  manual_review: {
    title: 'The demo needs a human reviewer.',
    body: 'The sample did not need an automatic decision, so it waits for a reviewer in the demo.',
    cta: 'Request manual review',
  },
  mismatch: {
    title: 'The name did not match in this demo.',
    body: 'The sample names did not match, so it goes to manual review instead of failing outright.',
    cta: 'Request manual review',
  },
  rejected: {
    title: 'The demo document could not be accepted.',
    body: 'The sample failed the demo checks and was not accepted.',
    cta: 'Return to profile',
  },
};

export const DemoVerificationPage = () => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [devResult, setDevResult] = useState<DemoResult>('manual_review');

  const demo = state.app.verificationDemo;

  const steps: StepperStep[] = [
    { id: 'explain', label: 'Explain', state: demo.step === 'explain' ? 'current' : 'complete' },
    {
      id: 'document',
      label: 'Document sample',
      state:
        demo.step === 'explain' ? 'upcoming' : demo.step === 'document' ? 'current' : 'complete',
    },
    {
      id: 'selfie',
      label: 'Selfie sample',
      state:
        demo.step === 'document' ? 'upcoming' : demo.step === 'selfie' ? 'current' : 'complete',
    },
    {
      id: 'result',
      label: 'Result',
      state: demo.step === 'result' || demo.step === 'manual_review' ? 'current' : 'upcoming',
    },
    {
      id: 'manual_review',
      label: 'Manual review',
      state:
        demo.step === 'manual_review'
          ? 'current'
          : demo.step === 'complete'
            ? 'complete'
            : 'upcoming',
    },
  ];

  const result = demo.result as DemoResult | null;

  return (
    <div className="lh-page lh-stack">
      <p className="lh-demo-label">{DEMO_LABEL}</p>

      <div className="lh-stack-sm">
        <h1 className="lh-h1">Demo verification</h1>
        <p className="lh-muted">
          This visual demo never opens a camera, never asks for a file, and never contacts a
          verification provider. It only shows how a review would be structured.
        </p>
      </div>

      <ProgressStepper steps={steps} ariaLabel="Demo verification steps" />

      <Card as="section" className="lh-stack">
        {demo.step === 'explain' ? (
          <div className="lh-stack">
            <h2 className="lh-h3">Verification protects the marketplace.</h2>
            <p className="lh-muted">
              A real product would use an approved verification provider to check identity, business
              registration or a qualification. Until that exists, nothing here is a real check.
            </p>
            <div className="lh-row">
              <Button onClick={() => void actions.runVerificationDemoStep('document')}>
                View demo flow
              </Button>
              <Button variant="secondary" onClick={() => navigate('/app/profile')}>
                Not now
              </Button>
            </div>
          </div>
        ) : null}

        {demo.step === 'document' ? (
          <div className="lh-stack">
            <h2 className="lh-h3">Choose a fake document sample</h2>
            <div className="lh-row">
              {(['id_front', 'id_back'] as const).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className={`lh-doctile${demo.sampleId === sample ? ' lh-doctile--selected' : ''}`}
                  aria-pressed={demo.sampleId === sample}
                  onClick={() => void actions.selectDemoSample(sample)}
                >
                  <span className="lh-doctile__label">
                    DEMO ID {sample === 'id_front' ? 'FRONT' : 'BACK'}
                  </span>
                  <span className="lh-doctile__shape" aria-hidden="true" />
                </button>
              ))}
            </div>
            <ul className="lh-list lh-muted">
              <li>Image quality — demo result: passed</li>
              <li>Text extraction — demo result: sample read</li>
              <li>Security checks — demo result: no issues found</li>
            </ul>
            <div className="lh-row">
              <Button
                onClick={() => void actions.runVerificationDemoStep('selfie')}
                disabled={demo.sampleId === null}
              >
                Continue to selfie sample
              </Button>
              <Button
                variant="secondary"
                onClick={() => void actions.runVerificationDemoStep('result')}
              >
                Skip to result
              </Button>
            </div>
          </div>
        ) : null}

        {demo.step === 'selfie' ? (
          <div className="lh-stack">
            <h2 className="lh-h3">Selfie and liveness sample</h2>
            <div className="lh-selfie" aria-hidden="true">
              <span className="lh-selfie__shape" />
              <span className="lh-selfie__label">DEMO SELFIE</span>
            </div>
            <ul className="lh-list lh-muted">
              <li>Liveness — demo result: face detected</li>
              <li>Face match — demo result: sample matched</li>
            </ul>
            <p className="lh-caption">
              No camera permission is requested and no image is captured.
            </p>
            <Button onClick={() => void actions.runVerificationDemoStep('result')}>
              Continue to result
            </Button>
          </div>
        ) : null}

        {demo.step === 'result' && result ? (
          <div className="lh-stack">
            <h2 className="lh-h3">{RESULT_COPY[result].title}</h2>
            <p className="lh-muted">{RESULT_COPY[result].body}</p>
            <div className="lh-row">
              {result === 'manual_review' || result === 'mismatch' ? (
                <Button onClick={() => void actions.requestManualReview()}>
                  Request manual review
                </Button>
              ) : null}
              {result === 'rejected' ? (
                <Button onClick={() => navigate('/app/profile')}>Return to profile</Button>
              ) : null}
              {result === 'passed' ? (
                <Button onClick={() => navigate('/app/profile')}>Return to profile</Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {demo.step === 'manual_review' ? (
          <div className="lh-stack">
            <h2 className="lh-h3">Pending review</h2>
            <dl className="lh-listing__facts">
              <div>
                <dt className="lh-label">Status</dt>
                <dd>
                  <Badge tone="warning">Pending review</Badge>
                </dd>
              </div>
              <div>
                <dt className="lh-label">Expected response window</dt>
                <dd>24–48 hours in this demo</dd>
              </div>
              <div>
                <dt className="lh-label">Assigned role</dt>
                <dd>Verification reviewer</dd>
              </div>
            </dl>
            {demo.auditEvents.length > 0 ? (
              <section className="lh-stack-sm">
                <h3 className="lh-h3">Audit event</h3>
                <ul className="lh-stack-sm">
                  {demo.auditEvents.map((event) => (
                    <li key={event.id} className="lh-caption">
                      {formatDateTime(event.at)} · {event.actor} · {event.action}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="lh-row">
              <Button onClick={() => navigate('/app/profile')}>Return to profile</Button>
            </div>
          </div>
        ) : null}
      </Card>

      {/* The result selector is a development tool. The guard is here, at the
          call site, so the whole branch is removed from a production build. */}
      {import.meta.env.DEV ? (
        <Card as="section" className="lh-stack lh-demo-dev">
          <h2 className="lh-h3">Development result selector</h2>
          <p className="lh-caption">
            Visible for demo purposes only. In the user-facing flow the default result is manual
            review.
          </p>
          <div className="lh-row">
            {(['passed', 'manual_review', 'mismatch', 'rejected'] as const).map((option) => (
              <Button
                key={option}
                size="sm"
                variant={devResult === option ? 'primary' : 'secondary'}
                onClick={() => {
                  setDevResult(option);
                  void actions.setDemoResult(option);
                }}
              >
                {option.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </Card>
      ) : null}

      <Button variant="ghost" onClick={() => navigate('/app/profile')}>
        Leave the demo
      </Button>
    </div>
  );
};
