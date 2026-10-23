import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Logo } from '@/components/Logo';
import { useActions } from '@/state/store';
import { WORKSPACE_LABEL, WORKSPACE_PURPOSE } from '@/state/selectors';

const PURPOSE_OPTIONS: { id: string; label: string; workspaces: Workspace[] }[] = [
  { id: 'need-service', label: 'I need a service', workspaces: ['customer'] },
  { id: 'offer-service', label: 'I offer a service', workspaces: ['customer'] },
  { id: 'qualified', label: 'I have qualifications', workspaces: ['qualification'] },
  { id: 'collaborator', label: 'I need a collaborator', workspaces: ['collaboration'] },
  { id: 'need-supply', label: 'I need supplies', workspaces: ['supply'] },
  { id: 'supply-products', label: 'I supply products', workspaces: ['supply'] },
];

const WORKSPACE_ORDER: Workspace[] = ['customer', 'qualification', 'collaboration', 'supply'];

const NEXT_STEP: Record<Workspace, string> = {
  customer:
    'Workspace registration, then a verification review before the workspace is fully active.',
  qualification: 'Workspace registration, then a qualification and identity review.',
  collaboration: 'Workspace registration, then a business review for collaboration agreements.',
  supply: 'Workspace registration, then a supplier review.',
};

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
    <div className="lh-auth">
      <header className="lh-auth__header">
        <Logo />
      </header>

      <main className="lh-auth__main lh-auth__main--wide">
        <div className="lh-stack">
          <div className="lh-stack-sm">
            <h1 className="lh-h1">What do you want to use LinkHive for first?</h1>
            <p className="lh-muted">
              Choose one or more workspaces. Selecting a workspace never creates a verification
              automatically.
            </p>
          </div>

          <div className="lh-row">
            {PURPOSE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="lh-purposechip"
                onClick={() => applyPurpose(option.workspaces)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="lh-grid-cards">
            {WORKSPACE_ORDER.map((workspace) => {
              const isSelected = selected.includes(workspace);
              return (
                <Card key={workspace} as="article" className="lh-workspacecard">
                  <button
                    type="button"
                    className="lh-workspacecard__toggle"
                    data-testid={`workspace-toggle-${workspace}`}
                    aria-pressed={isSelected}
                    onClick={() => toggle(workspace)}
                  >
                    <span className="lh-h3">{WORKSPACE_LABEL[workspace]}</span>
                    <Badge tone={isSelected ? 'success' : 'neutral'}>
                      {isSelected ? 'Selected' : 'Not selected'}
                    </Badge>
                  </button>
                  <p className="lh-muted">{WORKSPACE_PURPOSE[workspace]}</p>
                  <p className="lh-caption">
                    <strong>Required next step:</strong> {NEXT_STEP[workspace]}
                  </p>
                </Card>
              );
            })}
          </div>

          {error ? (
            <p className="lh-field__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="lh-row lh-spread">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back
            </Button>
            <Button onClick={handleContinue} loading={busy} disabled={busy}>
              Continue to my workspace
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
