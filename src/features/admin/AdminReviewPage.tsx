import { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/States';
import { useActions, useStore } from '@/state/store';
import { formatDate, formatDateTime } from '@/utils/dates';
import { titleCase } from '@/utils/format';
import type { ReportStatus } from '@/data/types';

const STATUS_TONE: Record<
  ReportStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'information' | 'hive'
> = {
  submitted: 'information',
  triaged: 'information',
  assigned: 'warning',
  under_review: 'warning',
  resolved: 'success',
  dismissed: 'neutral',
};

export const AdminReviewPage = () => {
  const { state } = useStore();
  const actions = useActions();
  const [notice, setNotice] = useState<string | null>(null);

  const reports = state.app.reports;

  return (
    <div className="lh-page lh-stack">
      <div className="lh-notice lh-notice--warning" role="note">
        <strong className="lh-notice__title">Preview only</strong>
        <p className="lh-caption">
          This queue shows how reports would be reviewed. Nothing here reaches a real moderation
          team, and no identity documents are shown anywhere.
        </p>
      </div>

      <div className="lh-stack-sm">
        <h1 className="lh-h1">Report review</h1>
        <p className="lh-muted">
          Every report carries a written reason and an audit trail. Serious reports may pause
          activity for 24–48 hours while a case is reviewed.
        </p>
      </div>

      {notice ? (
        <p className="lh-notice lh-notice--info" role="status">
          {notice}
        </p>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState
          title="The report queue is empty"
          description="No reports are waiting for review."
        />
      ) : (
        <div className="lh-stack">
          {reports.map((report) => (
            <Card key={report.id} as="article" className="lh-stack">
              <div className="lh-spread">
                <div className="lh-stack-sm">
                  <h2 className="lh-h3">
                    {titleCase(report.reason)} · {report.targetType}
                  </h2>
                  <span className="lh-caption">
                    {report.id} · submitted {formatDate(report.createdAt)}
                  </span>
                </div>
                <Badge tone={STATUS_TONE[report.status]}>{titleCase(report.status)}</Badge>
              </div>

              <p className="lh-request__reason">{report.details}</p>

              <dl className="lh-listing__facts">
                <div>
                  <dt className="lh-label">Assigned role</dt>
                  <dd>{report.assignedRole ?? 'Unassigned'}</dd>
                </div>
                <div>
                  <dt className="lh-label">Target</dt>
                  <dd>{report.targetId}</dd>
                </div>
                <div>
                  <dt className="lh-label">Temporary suspension</dt>
                  <dd>
                    {report.temporarySuspension
                      ? `Until ${formatDate(report.temporarySuspension.until)} — ${report.temporarySuspension.reason}`
                      : 'None applied'}
                  </dd>
                </div>
              </dl>

              {report.auditEvents.length > 0 ? (
                <section className="lh-stack-sm">
                  <h3 className="lh-label">Audit events</h3>
                  <ul className="lh-stack-sm">
                    {report.auditEvents.map((event) => (
                      <li key={event.id} className="lh-caption">
                        {formatDateTime(event.at)} · {event.actor} · {event.action}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="lh-row">
                <Button
                  size="sm"
                  variant="secondary"
                  loading={actions.isPending(`assign:${report.id}`)}
                  onClick={async () => {
                    const result = await actions.setReportStatus(
                      report.id,
                      'assigned',
                      'Moderation reviewer',
                    );
                    if (result.ok)
                      setNotice(`Report ${report.id} assigned to a moderation reviewer.`);
                  }}
                >
                  Assign to reviewer
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={actions.isPending(`review:${report.id}`)}
                  onClick={async () => {
                    const result = await actions.setReportStatus(
                      report.id,
                      'under_review',
                      report.assignedRole ?? 'Moderation reviewer',
                    );
                    if (result.ok) setNotice(`Report ${report.id} moved to review.`);
                  }}
                >
                  Start review
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    const result = await actions.setReportStatus(
                      report.id,
                      'resolved',
                      report.assignedRole ?? 'Administrator',
                    );
                    if (result.ok) setNotice(`Report ${report.id} resolved.`);
                  }}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    const result = await actions.setReportStatus(
                      report.id,
                      'dismissed',
                      report.assignedRole ?? 'Administrator',
                    );
                    if (result.ok) setNotice(`Report ${report.id} dismissed.`);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
