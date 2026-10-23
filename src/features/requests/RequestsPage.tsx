import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestCard } from '@/components/RequestCard';
import { Tabs } from '@/components/Tabs';
import { EmptyState } from '@/components/States';
import { Modal } from '@/components/Overlay';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Form';
import { ReportModal } from '@/features/requests/ReportModal';
import { useActions, useStore } from '@/state/store';
import { selectListingById } from '@/state/selectors';
import type { RequestAction } from '@/state/requestTransitions';

const TABS = [
  { id: 'received', label: 'Received' },
  { id: 'sent', label: 'Sent' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'completed', label: 'Completed' },
  { id: 'closed', label: 'Expired' },
  { id: 'reported', label: 'Reported' },
  { id: 'blocked', label: 'Blocked' },
];

export const RequestsPage = () => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [tab, setTab] = useState('received');
  const [declineTarget, setDeclineTarget] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [reportTarget, setReportTarget] = useState<{ id: string; label: string } | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const user = state.app.user;
  if (!user) return null;

  const requests = state.app.requests;
  const received = requests.filter((request) => request.receiverId === user.id);
  const sent = requests.filter((request) => request.senderId === user.id);

  const byTab = (id: string) => {
    switch (id) {
      case 'received':
        return received.filter((request) => ['sent', 'viewed'].includes(request.state));
      case 'sent':
        return sent.filter((request) => ['sent', 'viewed', 'draft'].includes(request.state));
      case 'accepted':
        return [...sent, ...received].filter((request) => request.state === 'accepted');
      case 'completed':
        return [...sent, ...received].filter((request) => request.state === 'completed');
      case 'closed':
        return [...sent, ...received].filter((request) =>
          ['expired', 'declined', 'cancelled'].includes(request.state),
        );
      case 'reported':
        return [...sent, ...received].filter((request) => request.state === 'reported');
      case 'blocked':
        return [...sent, ...received].filter((request) => request.state === 'blocked');
      default:
        return [];
    }
  };

  const visible = byTab(tab);

  const handleAction = async (requestId: string, action: RequestAction) => {
    setBusyAction(action);
    try {
      if (action === 'accept') await actions.acceptRequest(requestId);
      if (action === 'decline') {
        setDeclineTarget(requestId);
        return;
      }
      if (action === 'ignore') await actions.ignoreRequest(requestId);
      if (action === 'cancel') await actions.cancelRequest(requestId);
      if (action === 'complete') await actions.completeRequest(requestId);
    } finally {
      setBusyAction(null);
    }
  };

  const counterpartyName = (request: (typeof requests)[number]): string => {
    const listing = selectListingById(state, request.listingId);
    if (listing) return listing.ownerName;
    return request.receiverId === user.id ? 'Provider' : 'Requester';
  };

  return (
    <div className="lh-page lh-stack">
      <div className="lh-stack-sm">
        <h1 className="lh-h1">Requests</h1>
        <p className="lh-muted">
          Every request carries a written reason. Accepting opens messaging. Ignored requests expire
          after seven days.
        </p>
      </div>

      <Tabs
        items={TABS.map((item) => ({
          ...item,
          count: byTab(item.id).length,
        }))}
        activeId={tab}
        onChange={setTab}
        ariaLabel="Request filters"
      >
        {visible.length === 0 ? (
          <EmptyState
            title="No requests here yet"
            description={
              tab === 'received'
                ? 'When someone sends you a request it appears here with its reason.'
                : 'Requests in this state will appear here.'
            }
            actions={[{ label: 'Find a service', onClick: () => navigate('/app/customer') }]}
          />
        ) : (
          <div className="lh-stack">
            {visible.map((request) => {
              const listing = selectListingById(state, request.listingId);
              const direction = request.senderId === user.id ? 'sent' : 'received';
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  direction={direction}
                  counterpartyName={counterpartyName(request)}
                  listingTitle={listing?.title}
                  busyAction={busyAction}
                  onAction={(action) => void handleAction(request.id, action)}
                  onOpenThread={() => navigate('/app/messages')}
                  onReport={() =>
                    setReportTarget({
                      id: request.id,
                      label: listing?.title ?? 'this request',
                    })
                  }
                  onBlock={() =>
                    void actions.blockTarget({
                      targetType: 'request',
                      targetId: request.id,
                    })
                  }
                />
              );
            })}
          </div>
        )}
      </Tabs>

      <Modal
        open={declineTarget !== null}
        title="Decline this request"
        description="The reason is optional, but it helps the other person understand."
        onClose={() => {
          setDeclineTarget(null);
          setDeclineReason('');
        }}
        footer={
          <div className="lh-row lh-spread">
            <Button
              variant="ghost"
              onClick={() => {
                setDeclineTarget(null);
                setDeclineReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!declineTarget) return;
                await actions.declineRequest(declineTarget, declineReason);
                setDeclineTarget(null);
                setDeclineReason('');
              }}
            >
              Decline request
            </Button>
          </div>
        }
      >
        <Textarea
          label="Reason for declining"
          rows={4}
          maxLength={500}
          value={declineReason}
          hint="Optional. For example: We are fully booked for your requested dates."
          onChange={(event) => setDeclineReason(event.target.value)}
        />
      </Modal>

      <ReportModal
        open={reportTarget !== null}
        targetType="request"
        targetId={reportTarget?.id ?? ''}
        targetLabel={reportTarget?.label ?? 'this request'}
        onClose={() => setReportTarget(null)}
      />
    </div>
  );
};
