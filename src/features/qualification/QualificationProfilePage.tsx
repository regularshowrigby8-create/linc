import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/States';
import { RequestWizard } from '@/features/requests/RequestWizard';
import { ReportModal } from '@/features/requests/ReportModal';
import { useActions, useStore } from '@/state/store';
import { selectListingById, selectIsSaved } from '@/state/selectors';
import { formatRating, titleCase } from '@/utils/format';

export const QualificationProfilePage = () => {
  const { id = '' } = useParams();
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const listing = selectListingById(state, id);

  if (!listing || listing.workspace !== 'qualification') {
    return (
      <div className="lh-page">
        <EmptyState
          title="That profile is not available"
          description="The profile may have been removed or the link may be wrong."
          actions={[
            { label: 'Back to opportunities', onClick: () => navigate('/app/qualification') },
          ]}
        />
      </div>
    );
  }

  const saved = selectIsSaved(state, listing.id);

  return (
    <div className="lh-page lh-detail">
      <Card as="article" className="lh-detail__main">
        <div className="lh-stack">
          <div className="lh-spread">
            <h1 className="lh-h1">{listing.title}</h1>
            <Badge tone="information">{titleCase(listing.opportunityType)}</Badge>
          </div>

          <p className="lh-muted">
            {listing.ownerName} · {listing.location} · {titleCase(listing.reach)}
          </p>

          <div className="lh-row">
            {listing.verificationBadges.map((badge) => (
              <Badge
                key={badge.id}
                tone={badge.state === 'verified' ? 'success' : 'warning'}
                title={badge.detail}
              >
                {badge.label}
              </Badge>
            ))}
          </div>

          <p className="lh-listing__description">{listing.description}</p>

          <dl className="lh-listing__facts">
            <div>
              <dt className="lh-label">Qualification level</dt>
              <dd>{listing.qualificationLevel}</dd>
            </div>
            <div>
              <dt className="lh-label">Certificate status</dt>
              <dd>
                {listing.certificateStatus === 'verified'
                  ? 'Verified in the demo'
                  : listing.certificateStatus === 'pending'
                    ? 'Pending review'
                    : 'Not verified'}
              </dd>
            </div>
            <div>
              <dt className="lh-label">Field</dt>
              <dd>{listing.field}</dd>
            </div>
            <div>
              <dt className="lh-label">Remote or on-site</dt>
              <dd>{titleCase(listing.remoteOrOnSite)}</dd>
            </div>
            <div>
              <dt className="lh-label">Availability</dt>
              <dd>{listing.availability}</dd>
            </div>
            <div>
              <dt className="lh-label">Rating</dt>
              <dd>{formatRating(listing.rating, listing.reviewCount)}</dd>
            </div>
          </dl>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">Experience</h2>
            <p className="lh-muted">
              {listing.statedExperienceRequirement ??
                'The listing owner has not stated an experience requirement. Prior experience is never required unless stated here.'}
            </p>
          </section>

          <section className="lh-stack-sm">
            <h2 className="lh-h3">What a qualification means</h2>
            <p className="lh-muted">
              A qualification badge states exactly what was checked. It is not permission to
              practise a regulated profession, and the demo check is not a real verification.
            </p>
          </section>

          <div className="lh-row">
            <Button onClick={() => setWizardOpen(true)}>Send request</Button>
            <Button variant="secondary" onClick={() => void actions.toggleSave(listing.id)}>
              {saved ? 'Remove from saved' : 'Save profile'}
            </Button>
            <Button variant="ghost" onClick={() => setReportOpen(true)}>
              Report
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                void actions.blockTarget({ targetType: 'profile', targetId: listing.ownerId });
                navigate('/app/qualification');
              }}
            >
              Block
            </Button>
          </div>
        </div>
      </Card>

      <aside className="lh-detail__aside">
        <Card as="section" className="lh-stack-sm">
          <h2 className="lh-h3">About {listing.ownerName}</h2>
          <p className="lh-caption">{listing.location}</p>
          <Link className="lh-linkbutton lh-linkbutton--sm" to="/app/qualification">
            Back to all opportunities
          </Link>
        </Card>
      </aside>

      <RequestWizard open={wizardOpen} listing={listing} onClose={() => setWizardOpen(false)} />

      <ReportModal
        open={reportOpen}
        targetType="profile"
        targetId={listing.ownerId}
        targetLabel={listing.ownerName}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};
