import type { Listing } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button, IconButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatCurrency, formatRating, formatResponseTime, titleCase } from '@/utils/format';

interface ListingCardProps {
  listing: Listing;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  onRequest: () => void;
}

/** Renders a single listing. It never reads or writes global state itself. */
export const ListingCard = ({ listing, saved, onOpen, onSave, onRequest }: ListingCardProps) => (
  <Card as="article" className="lh-listing">
    <div className="lh-listing__top">
      <div className="lh-stack-sm">
        <h3 className="lh-h3 lh-listing__title">
          <button type="button" className="lh-linkbutton" onClick={onOpen}>
            {listing.title}
          </button>
        </h3>
        <p className="lh-caption">
          {listing.ownerName} · {listing.location} · {titleCase(listing.reach)}
        </p>
      </div>
      <IconButton
        label={saved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
        onClick={onSave}
        aria-pressed={saved}
      >
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      </IconButton>
    </div>

    <p className="lh-listing__description">{listing.description}</p>

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
        <Badge tone="neutral" title="No verification evidence has been checked for this listing.">
          Not verified
        </Badge>
      ) : null}
      {listing.status === 'pending_review' ? (
        <Badge
          tone="warning"
          title="This listing is being reviewed before it can be offered widely."
        >
          Pending review
        </Badge>
      ) : null}
    </div>

    <dl className="lh-listing__facts">
      {listing.workspace === 'supply' ? (
        <>
          <div>
            <dt className="lh-label">Product</dt>
            <dd>{listing.product}</dd>
          </div>
          <div>
            <dt className="lh-label">Quantity / MOQ</dt>
            <dd>
              {listing.quantity} units · MOQ {listing.moq}
            </dd>
          </div>
          <div>
            <dt className="lh-label">Supplier</dt>
            <dd>
              {listing.supplierLocation} · {titleCase(listing.reach)}
            </dd>
          </div>
          <div>
            <dt className="lh-label">Estimated route total</dt>
            <dd>{formatCurrency(listing.estimatedTotal)}</dd>
          </div>
          <div>
            <dt className="lh-label">Delivery window</dt>
            <dd>{listing.deliveryWindow}</dd>
          </div>
          <div>
            <dt className="lh-label">Quote confidence</dt>
            <dd>{titleCase(listing.confidence)}</dd>
          </div>
        </>
      ) : null}

      {listing.workspace === 'customer' ? (
        <>
          <div>
            <dt className="lh-label">Price</dt>
            <dd>{listing.quoteRequired ? 'Quote required' : listing.priceLabel}</dd>
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
        </>
      ) : null}

      {listing.workspace === 'qualification' ? (
        <>
          <div>
            <dt className="lh-label">Qualification</dt>
            <dd>
              {listing.qualificationLevel} ·{' '}
              {listing.certificateStatus === 'verified'
                ? 'Verified in demo'
                : listing.certificateStatus === 'pending'
                  ? 'Pending in demo'
                  : 'Not verified'}
            </dd>
          </div>
          <div>
            <dt className="lh-label">Field</dt>
            <dd>{listing.field}</dd>
          </div>
          <div>
            <dt className="lh-label">Opportunity</dt>
            <dd>
              {titleCase(listing.opportunityType)} · {titleCase(listing.remoteOrOnSite)}
            </dd>
          </div>
          <div>
            <dt className="lh-label">Availability</dt>
            <dd>{listing.availability}</dd>
          </div>
          {listing.statedExperienceRequirement ? (
            <div>
              <dt className="lh-label">Stated by the listing owner</dt>
              <dd>{listing.statedExperienceRequirement}</dd>
            </div>
          ) : null}
        </>
      ) : null}

      {listing.workspace === 'collaboration' ? (
        <>
          <div>
            <dt className="lh-label">Participants needed</dt>
            <dd>{listing.participantsNeeded}</dd>
          </div>
          <div>
            <dt className="lh-label">Agreement status</dt>
            <dd>{titleCase(listing.agreementState)}</dd>
          </div>
          <div>
            <dt className="lh-label">Availability</dt>
            <dd>{listing.availability}</dd>
          </div>
          <div>
            <dt className="lh-label">Response time</dt>
            <dd>{formatResponseTime(listing.responseTimeHours)}</dd>
          </div>
        </>
      ) : null}
    </dl>

    <div className="lh-listing__actions">
      <Button variant="secondary" size="sm" onClick={onOpen}>
        View details
      </Button>
      <Button size="sm" onClick={onRequest}>
        Send request
      </Button>
    </div>
  </Card>
);
