import { useNavigate } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { InlineNotice } from '@/components/States';
import { useStore } from '@/state/store';
import { selectVerificationStateFor } from '@/state/selectors';

/**
 * Workspaces are usable straight away in the prototype, but the verification
 * state is always shown so nothing is implied about real checks.
 */
export const WorkspaceVerificationNotice = ({ workspace }: { workspace: Workspace }) => {
  const { state } = useStore();
  const navigate = useNavigate();
  const verification = selectVerificationStateFor(state, workspace);
  const demoVerified = state.app.verificationDemo.demoVerified;
  const registered = state.app.user?.registeredWorkspaces.includes(workspace) ?? false;

  if (!registered) {
    return (
      <InlineNotice
        tone="warning"
        title="This workspace is not registered"
        action={{ label: 'Register to unlock', onClick: () => navigate('/onboarding/workspaces') }}
      >
        <p className="lh-caption">
          You can look around, but registering adds this workspace to your account. Registering
          never creates a verification.
        </p>
      </InlineNotice>
    );
  }

  if (verification === 'verified' && demoVerified) {
    return (
      <InlineNotice tone="info" title="Verified in the demo only">
        <p className="lh-caption">
          The demo verification flow completed. This is not a real identity or business check.
        </p>
      </InlineNotice>
    );
  }

  if (verification === 'verified') {
    return (
      <InlineNotice tone="info" title="Verification pending for this workspace">
        <p className="lh-caption">
          A real verification provider is not connected. See the demo flow to see how the review
          stages would work.
        </p>
      </InlineNotice>
    );
  }

  return (
    <InlineNotice
      tone="warning"
      title="This workspace is registered but not yet verified"
      action={{ label: 'See demo verification', onClick: () => navigate('/app/verification/demo') }}
    >
      <p className="lh-caption">
        You can explore the workspace now. A real verification provider is not connected, so no
        listing in this workspace is treated as genuinely verified.
      </p>
    </InlineNotice>
  );
};
