import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Button } from '@/components/Button';
import { CheckIcon } from '@/components/icons';
import { FunnelShell } from '@/features/onboarding/FunnelShell';
import { useActions } from '@/state/store';
import { WORKSPACE_LABEL, WORKSPACE_ORDER, WORKSPACE_PURPOSE } from '@/state/selectors';

const PURPOSE_OPTIONS: { id: string; label: string; workspaces: Workspace[] }[] = [
  { id: 'need-service', label: 'I need a service', workspaces: ['customer'] },
  { id: 'offer-service', label: 'I offer a service', workspaces: ['customer'] },
  { id: 'qualified', label: 'I have qualifications', workspaces: ['qualification'] },
  { id: 'collaborator', label: 'I need a collaborator', workspaces: ['collaboration'] },
  { id: 'need-supply', label: 'I need supplies', workspaces: ['supply'] },
  { id: 'supply-products', label: 'I supply products', workspaces: ['supply'] },
];

const NEXT_STEP: Record<Workspace, string> = {
  customer:
    'Workspace registration, then a verification review before the workspace is fully active.',
  qualification: 'Workspace registration, then a qualification and identity review.',
  collaboration: 'Workspace registration, then a business review for collaboration agreements.',
  supply: 'Workspace registration, then a supplier review.',
};

/**
 * Choosing which workspaces to open.
 *
 * The account is one identity, and a workspace is one door into it. Picking
 * a workspace never starts a verification on its own, and the page says so
 * before the reader picks anything.
 */
export const WorkspaceSelectionPage = () => {
  const actions = useActions();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const busy = actions.isPending('workspaces');

  const toggle = (workspace: Workspace) => {
    setSelected((current) =>
      current.includes(workspace)
        ? current.filter((item) => item !== workspace)
        : [...current, workspace],
    );
    setError(null);
  };

  const applyPurpose = (workspaces: Workspace[]) => {
    setSelected((current) => Array.from(new Set([...current, ...workspaces])));
    setError(null);
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      setError('Select at least one workspace to continue.');
      return;
    }
    const result = await actions.selectWorkspaces(selected);
    if (result.ok) {
      navigate('/app');
    }
  };

  return (
    <FunnelShell step={2} steps={['You', 'Your account', 'Your name']}>
      <div className="lh-funnel__intro">
        <p className="lh-mkt__eyebrow">Workspaces</p>
        <h1 className="lh-mkt__display">What do you want to use LinkHive for first?</h1>
        <p className="lh-mkt__body">
          Each workspace is separate, and you only see what is relevant to the work you are doing.
          Selecting a workspace never creates a verification automatically.
        </p>
      </div>

      <div className="lh-funnel__cards lh-funnel__purposes">
        {PURPOSE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className="lh-funnel__purpose"
            onClick={() => applyPurpose(option.workspaces)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="lh-funnel__choices">
        {WORKSPACE_ORDER.map((workspace) => {
          const isSelected = selected.includes(workspace);
          return (
            <section
              key={workspace}
              className={`lh-funnel__choice${isSelected ? ' lh-funnel__choice--chosen' : ''}`}
              aria-labelledby={`workspace-${workspace}`}
            >
              <div className="lh-funnel__sidehead">
                <h2 className="lh-funnel__choicetitle" id={`workspace-${workspace}`}>
                  {WORKSPACE_LABEL[workspace]}
                </h2>
                <p className="lh-funnel__choicebody">{WORKSPACE_PURPOSE[workspace]}</p>
              </div>
              <p className="lh-mkt__fineprint">
                <strong>What happens next:</strong> {NEXT_STEP[workspace]}
              </p>
              <button
                type="button"
                className="lh-funnel__sidepick"
                data-testid={`workspace-toggle-${workspace}`}
                aria-pressed={isSelected}
                onClick={() => toggle(workspace)}
              >
                <span className="lh-funnel__picklabel">
                  {isSelected ? 'Selected' : 'Not selected'}
                </span>
                <span className="lh-funnel__choosemark" aria-hidden="true">
                  <CheckIcon size={15} />
                </span>
              </button>
            </section>
          );
        })}
      </div>

      {error ? (
        <p className="lh-field__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="lh-funnel__actions">
        <Button variant="ghost" onClick={() => navigate('/')}>
          Back
        </Button>
        <Button variant="accent" onClick={handleContinue} loading={busy} disabled={busy}>
          Continue to my workspace
        </Button>
      </div>
    </FunnelShell>
  );
};
