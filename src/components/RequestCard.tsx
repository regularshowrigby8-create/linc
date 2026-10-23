import type { ConnectionRequest } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatRelative } from '@/utils/dates';
import {
  REQUEST_STATE_LABEL,
  REQUEST_STATE_TONE,
  resolveRequestActions,
  type RequestAction,
} from '@/state/requestTransitions';

interface RequestCardProps {
  request: ConnectionRequest;
  direction: 'sent' | 'received';
  counterpartyName: string;
  listingTitle?: string;
  busyAction?: string | null;
  onAction: (action: RequestAction) => void;
  onOpenThread?: () => void;
  onReport: () => void;
  onBlock: () => void;
}

const ACTION_LABEL: Record<RequestAction, string> = {
  accept: 'Accept request',
  decline: 'Decline request',
  ignore: 'Ignore request',
  cancel: 'Cancel request',
  complete: 'Complete connection',
};

/**
 * Renders a request and only the actions allowed by the current state.
 * The action list comes from the shared transition map, never from local guesses.
 */
export const RequestCard = ({
  request,
  direction,
  counterpartyName,
  listingTitle,
  busyAction,
  onAction,
  onOpenThread,
  onReport,
  onBlock,
}: RequestCardProps) => {
  const actions = resolveRequestActions(request.state, direction);

  return (
    <Card as="article" className="lh-request">
      <div className="lh-spread">
        <div className="lh-stack-sm">
          <h3 className="lh-h3 lh-request__title">{listingTitle ?? 'Connection request'}</h3>
          <p className="lh-caption">
            {direction === 'sent' ? 'To' : 'From'} {counterpartyName} ·{' '}
            {formatRelative(request.createdAt)}
          </p>
        </div>
        <Badge tone={REQUEST_STATE_TONE[request.state]}>{REQUEST_STATE_LABEL[request.state]}</Badge>
      </div>

      <p className="lh-request__reason">{request.reason}</p>

      {request.desiredOutcome ? (
        <p className="lh-caption">
          <strong>Desired outcome:</strong> {request.desiredOutcome}
        </p>
      ) : null}
      {request.timing ? (
        <p className="lh-caption">
          <strong>Timing:</strong> {request.timing}
        </p>
      ) : null}
      {request.locationBoundaries ? (
        <p className="lh-caption">
          <strong>Location or boundaries:</strong> {request.locationBoundaries}
        </p>
      ) : null}
      {request.budgetNote ? (
        <p className="lh-caption">
          <strong>Budget or quote preference:</strong> {request.budgetNote}
        </p>
      ) : null}

      <div className="lh-request__actions">
        {actions.map((action) => (
          <Button
            key={action}
            size="sm"
            variant={action === 'accept' || action === 'complete' ? 'primary' : 'secondary'}
            loading={busyAction === action}
            disabled={busyAction !== null && busyAction !== action}
            onClick={() => onAction(action)}
          >
            {ACTION_LABEL[action]}
          </Button>
        ))}

        {request.state === 'accepted' && onOpenThread ? (
          <Button size="sm" variant="secondary" onClick={onOpenThread}>
            Open messages
          </Button>
        ) : null}
      </div>

      <div className="lh-request__secondary">
        <Button size="sm" variant="ghost" onClick={onReport}>
          Report
        </Button>
        <Button size="sm" variant="ghost" onClick={onBlock}>
          Block
        </Button>
      </div>
    </Card>
  );
};
