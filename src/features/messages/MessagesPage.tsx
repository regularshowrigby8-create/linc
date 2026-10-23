import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/States';
import { ReportModal } from '@/features/requests/ReportModal';
import { useActions, useStore } from '@/state/store';
import { formatDateTime } from '@/utils/dates';

export const MessagesPage = () => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const user = state.app.user;
  if (!user) return null;

  const threads = state.app.threads.filter((thread) => thread.participantIds.includes(user.id));
  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? threads[0];

  const handleSend = async () => {
    if (!activeThread) return;
    const result = await actions.sendMessage(activeThread.id, draft);
    if (result.ok) setDraft('');
  };

  return (
    <div className="lh-page lh-stack">
      <div className="lh-stack-sm">
        <h1 className="lh-h1">Messages</h1>
        <p className="lh-muted">
          Messaging opens only after a request is accepted. Contact details stay under each person’s
          own visibility setting.
        </p>
      </div>

      {threads.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="A conversation appears here once a request is accepted. Until then, keep the conversation on the request itself."
          actions={[{ label: 'See my requests', onClick: () => navigate('/app/requests') }]}
        />
      ) : (
        <div className="lh-messages">
          <aside className="lh-messages__list" aria-label="Conversations">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={`lh-messages__thread${activeThread?.id === thread.id ? ' lh-messages__thread--active' : ''}`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <span className="lh-stack-sm">
                  <strong>
                    {thread.participantIds.find((id) => id !== user.id) ?? 'Connection'}
                  </strong>
                  <span className="lh-caption">
                    {thread.messages[thread.messages.length - 1]?.body}
                  </span>
                  <span className="lh-caption">
                    Last message {formatDateTime(thread.lastMessageAt)}
                  </span>
                </span>
                <Badge tone="success">Accepted</Badge>
              </button>
            ))}
          </aside>

          {activeThread ? (
            <Card as="section" className="lh-messages__chat">
              <div className="lh-spread">
                <h2 className="lh-h3">
                  {activeThread.participantIds.find((id) => id !== user.id) ?? 'Connection'}
                </h2>
                <Badge tone="success">Accepted connection</Badge>
              </div>

              <ol className="lh-messages__bubbles">
                {activeThread.messages.map((message) => (
                  <li
                    key={message.id}
                    className={`lh-message${message.senderId === user.id ? ' lh-message--own' : ''}`}
                  >
                    <span className="lh-message__body">{message.body}</span>
                    <span className="lh-message__meta">{formatDateTime(message.sentAt)}</span>
                  </li>
                ))}
              </ol>

              <div className="lh-stack-sm">
                <label className="lh-field__label" htmlFor="message-body">
                  Message
                </label>
                <textarea
                  id="message-body"
                  className="lh-input lh-textarea"
                  rows={3}
                  value={draft}
                  maxLength={1000}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message"
                />
                <div className="lh-row lh-spread">
                  <Button
                    variant="ghost"
                    disabled
                    title="Attachments are not connected in this prototype"
                  >
                    Attachments are not connected in this prototype
                  </Button>
                  <div className="lh-row">
                    <Button variant="ghost" onClick={() => setReportOpen(true)}>
                      Report
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        void actions.blockTarget({
                          targetType: 'thread',
                          targetId: activeThread.id,
                        })
                      }
                    >
                      Block
                    </Button>
                    <Button
                      onClick={handleSend}
                      loading={actions.isPending(`message:${activeThread.id}`)}
                      disabled={actions.isPending(`message:${activeThread.id}`)}
                    >
                      Send message
                    </Button>
                  </div>
                </div>
              </div>

              <p className="lh-caption">
                <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/requests">
                  Back to requests
                </Link>
              </p>
            </Card>
          ) : null}
        </div>
      )}

      <ReportModal
        open={reportOpen}
        targetType="thread"
        targetId={activeThread?.id ?? ''}
        targetLabel="this conversation"
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};
