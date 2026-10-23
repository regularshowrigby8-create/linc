import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Disclosure } from '@/components/Disclosure';
import { EmptyState } from '@/components/States';
import { RequestWizard } from '@/features/requests/RequestWizard';
import { ReportModal } from '@/features/requests/ReportModal';
import { useActions, useStore } from '@/state/store';
import { WORKSPACE_ACCENT, selectListingById, selectIsSaved } from '@/state/selectors';
import { formatRating, formatResponseTime, titleCase } from '@/utils/format';

export const CustomerListingDetailPage = () => {
  const { id = '' } = useParams();
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const listing = selectListingById(state, id);

  if (!listing || listing.workspace !== 'customer') {
    return (
      <div className="lh-page">
        <EmptyState
          title="That service is not available"
          description="The listing may have been removed or the link may be wrong."
          actions={[{ label: 'Back to services', onClick: () => navigate('/app/customer') }]}
        />
      </div>
    );
  }

  const saved = selectIsSaved(state, listing.id);
  const user = state.app.user;
  const visibility = user?.contactVisibility ?? 'private';

  return (
    <div className="lh-page lh-detail" data-accent={WORKSPACE_ACCENT.customer}>
      <Card as="article" className="lh-detail__main">
        <div className="lh-stack">
          <div className="lh-stack-sm">
            <h1 className="lh-h1">{listing.title}</h1>
            <p className="lh-listing__byline">
              <span>{listing.ownerName}</span>
              <span aria-hidden="true">·</span>
              <span>{listing.location}</span>
              <span aria-hidden="true">·</span>
              <span>{titleCase(listing.reach)}</span>
            </p>
          </div>

          <div className="lh-row lh-listing__badges">
            {listing.verificationBadges.map((badge) => (
              <Badge
                key={badge.id}
                tone={badge.state === 'verified' ? 'success' : 'warning'}
                title={badge.detail}
              >
                {badge.label}
              </Badge>
            ))}
            {listing.verificationBadges.length === 0 ? (
              <Badge tone="neutral" title="No evidence has been checked for this provider.">
                Not verified
              </Badge>
            ) : null}
          </div>

          <p className="lh-listing__description">{listing.description}</p>

          <p className="lh-listing__price">
            {listing.quoteRequired ? 'Quote required' : listing.priceLabel}
          </p>

          <div className="lh-row">
            <Button variant="accent" onClick={() => setWizardOpen(true)}>
              Send request
            </Button>
            <Button variant="secondary" onClick={() => void actions.toggleSave(listing.id)}>
              {saved ? 'Remove from saved' : 'Save listing'}
            </Button>
          </div>

          <Disclosure summary="What is included and how it works">
            <dl className="lh-listing__facts">
              <div>
                <dt className="lh-label">Service type</dt>
                <dd>{titleCase(listing.serviceType)}</dd>
              </div>
              <div>
                <dt className="lh-label">Availability</dt>
                <dd>{listing.availability}</dd>
              </div>
              <div>
                <dt className="lh-label">Response time</dt>
                <dd>{formatResponseTime(listing.responseTimeHours)}</dd>
              </div>
              <div>
                <dt className="lh-label">Rating</dt>
                <dd>{formatRating(listing.rating, listing.reviewCount)}</dd>
              </div>
            </dl>

            {listing.included.length > 0 ? (
              <section className="lh-stack-sm">
                <h2 className="lh-h3">Included</h2>
                <ul className="lh-list lh-muted">
                  {listing.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {listing.excluded.length > 0 ? (
              <section className="lh-stack-sm">
                <h2 className="lh-h3">Not included</h2>
                <ul className="lh-list lh-muted">
                  {listing.excluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="lh-stack-sm">
              <h2 className="lh-h3">Contact details</h2>
              <p className="lh-muted">
                {visibility === 'public'
                  ? 'This provider shares contact details publicly.'
                  : visibility === 'accepted_connections'
                    ? 'Contact details are shared after a request is accepted.'
                    : 'This provider keeps contact details private. Use a request instead.'}
              </p>
            </section>
          </Disclosure>

          <p className="lh-caption">
            Payments are not available in this prototype. Agree the work and price in writing before
            you commit.
          </p>
        </div>
      </Card>

      <aside className="lh-detail__aside">
        <Card as="section" className="lh-stack-sm">
          <h2 className="lh-h3">Something wrong?</h2>
          <p className="lh-caption">
            Report a listing and give a written reason. A moderation reviewer reads every report.
          </p>
          <div className="lh-row">
            <Button variant="secondary" size="sm" onClick={() => setReportOpen(true)}>
              Report listing
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void actions.blockTarget({ targetType: 'listing', targetId: listing.id });
                navigate('/app/customer');
              }}
            >
              Block provider
            </Button>
          </div>
          <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/customer">
            Back to all services
          </Link>
        </Card>
      </aside>

      <RequestWizard open={wizardOpen} listing={listing} onClose={() => setWizardOpen(false)} />

      <ReportModal
        open={reportOpen}
        targetType="listing"
        targetId={listing.id}
        targetLabel={listing.title}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};
