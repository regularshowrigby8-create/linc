import type { ReactNode } from 'react';
import type { Listing } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button, IconButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Disclosure } from '@/components/Disclosure';
import {
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  PinIcon,
  StarIcon,
  StarOutlineIcon,
  TagIcon,
} from '@/components/icons';
import { formatCurrency, formatRating, formatResponseTime, titleCase } from '@/utils/format';

interface ListingCardProps {
  listing: Listing;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  onRequest: () => void;
}

const Fact = ({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) => (
  <div className="lh-fact">
    <span className="lh-fact__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="lh-fact__label">{label}</span>
    <span className="lh-fact__value">{value}</span>
  </div>
);

/**
 * Renders a single listing. It never reads or writes global state itself.
 *
 * Only what a person acts on sits on the surface: the title, the price, the
 * verification state and the two actions. Everything else lives behind the
 * details menu, and none of it is colour-coded because it is not a status.
 */
export const ListingCard = ({ listing, saved, onOpen, onSave, onRequest }: ListingCardProps) => {
  const price =
    listing.workspace === 'supply'
      ? formatCurrency(listing.estimatedTotal)
      : listing.quoteRequired
        ? 'Quote required'
        : listing.priceLabel;

  return (
    <Card as="article" className="lh-listing">
      <div className="lh-listing__top">
        <div className="lh-stack-sm">
          <h3 className="lh-h3 lh-listing__title">
            <button type="button" className="lh-linkbutton" onClick={onOpen}>
              {listing.title}
            </button>
          </h3>
          <p className="lh-listing__byline">
            <PinIcon size={14} />
            <span>{listing.ownerName}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.location}</span>
            <span aria-hidden="true">·</span>
            <span>{titleCase(listing.reach)}</span>
          </p>
        </div>
        <IconButton
          label={saved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
          onClick={onSave}
          aria-pressed={saved}
        >
          {saved ? <StarIcon size={18} /> : <StarOutlineIcon size={18} />}
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

      <p className="lh-listing__price">
        <TagIcon size={16} />
        <span>{price}</span>
      </p>

      <Disclosure summary="More details" icon={<InfoIcon size={16} />}>
        <div className="lh-facts">
          <Fact
            icon={<CalendarIcon size={16} />}
            label="Availability"
            value={listing.availability}
          />

          {listing.workspace === 'supply' ? (
            <>
              <Fact icon={<TagIcon size={16} />} label="Product" value={listing.product} />
              <Fact
                icon={<InfoIcon size={16} />}
                label="Quantity"
                value={`${listing.quantity} units · MOQ ${listing.moq}`}
              />
              <Fact
                icon={<PinIcon size={16} />}
                label="Supplier"
                value={`${listing.supplierLocation} · ${titleCase(listing.reach)}`}
              />
              <Fact
                icon={<CalendarIcon size={16} />}
                label="Delivery window"
                value={listing.deliveryWindow}
              />
              <Fact
                icon={<InfoIcon size={16} />}
                label="Quote confidence"
                value={titleCase(listing.confidence)}
              />
            </>
          ) : null}

          {listing.workspace === 'customer' ? (
            <>
              <Fact
                icon={<ClockIcon size={16} />}
                label="Response time"
                value={formatResponseTime(listing.responseTimeHours)}
              />
              <Fact
                icon={<StarIcon size={16} />}
                label="Rating"
                value={formatRating(listing.rating, listing.reviewCount)}
              />
            </>
          ) : null}

          {listing.workspace === 'qualification' ? (
            <>
              <Fact
                icon={<InfoIcon size={16} />}
                label="Qualification"
                value={`${listing.qualificationLevel} · ${
                  listing.certificateStatus === 'verified'
                    ? 'Verified in demo'
                    : listing.certificateStatus === 'pending'
                      ? 'Pending in demo'
                      : 'Not verified'
                }`}
              />
              <Fact icon={<TagIcon size={16} />} label="Field" value={listing.field} />
              <Fact
                icon={<BriefcaseGlyph />}
                label="Opportunity"
                value={`${titleCase(listing.opportunityType)} · ${titleCase(listing.remoteOrOnSite)}`}
              />
              {listing.statedExperienceRequirement ? (
                <Fact
                  icon={<InfoIcon size={16} />}
                  label="Stated by the listing owner"
                  value={listing.statedExperienceRequirement}
                />
              ) : null}
            </>
          ) : null}

          {listing.workspace === 'collaboration' ? (
            <>
              <Fact
                icon={<InfoIcon size={16} />}
                label="Participants needed"
                value={String(listing.participantsNeeded)}
              />
              <Fact
                icon={<CalendarIcon size={16} />}
                label="Agreement status"
                value={titleCase(listing.agreementState)}
              />
              <Fact
                icon={<ClockIcon size={16} />}
                label="Response time"
                value={formatResponseTime(listing.responseTimeHours)}
              />
            </>
          ) : null}
        </div>
      </Disclosure>

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
};

/** Small inline glyph for the opportunity type. */
const BriefcaseGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
  >
    <rect x="2.8" y="7.2" width="18.4" height="12" rx="2.2" />
    <path d="M8.8 7.2V5.4a1.8 1.8 0 0 1 1.8-1.8h2.8a1.8 1.8 0 0 1 1.8 1.8v1.8" />
  </svg>
);
