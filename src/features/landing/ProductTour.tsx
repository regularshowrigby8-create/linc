import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '@/data/types';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { BriefcaseIcon, SearchIcon, TruckIcon, UsersIcon, WrenchIcon } from '@/components/icons';
import { useStore } from '@/state/store';
import {
  WORKSPACE_ACCENT,
  WORKSPACE_HOME_ROUTE,
  WORKSPACE_LABEL,
  selectListingsForWorkspace,
} from '@/state/selectors';
import { formatCurrency, titleCase } from '@/utils/format';

const WORKSPACES: { id: Workspace; Icon: typeof WrenchIcon; blurb: string }[] = [
  {
    id: 'customer',
    Icon: WrenchIcon,
    blurb: 'Everyday services, with the price and the area written down.',
  },
  {
    id: 'qualification',
    Icon: BriefcaseIcon,
    blurb: 'People who hold a qualification, matched to work they are prepared for.',
  },
  {
    id: 'collaboration',
    Icon: UsersIcon,
    blurb: 'Joint work, group projects and shared capacity.',
  },
  {
    id: 'supply',
    Icon: TruckIcon,
    blurb: 'Suppliers and routes, with each cost shown on its own line.',
  },
];

/**
 * A working preview of the product. It shows the same listings the real
 * workspace shows, so a visitor can judge LinkHive before making an account.
 */
export const ProductTour = () => {
  const { state } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState<Workspace>('customer');

  const listings = selectListingsForWorkspace(state, active).slice(0, 3);
  const current = WORKSPACES.find((item) => item.id === active) ?? WORKSPACES[0];

  return (
    <div className="lh-tour" data-accent={WORKSPACE_ACCENT[active]}>
      <div className="lh-tour__tabs" role="tablist" aria-label="Workspaces in the preview">
        {WORKSPACES.map(({ id, Icon }) => {
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tour-tab-${id}`}
              aria-selected={selected}
              aria-controls={`tour-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              data-accent={WORKSPACE_ACCENT[id]}
              className={`lh-tour__tab${selected ? ' lh-tour__tab--active' : ''}`}
              onClick={() => setActive(id)}
            >
              <Icon size={18} />
              <span>{WORKSPACE_LABEL[id]}</span>
            </button>
          );
        })}
      </div>

      <div
        className="lh-tour__panel"
        role="tabpanel"
        id={`tour-panel-${active}`}
        aria-labelledby={`tour-tab-${active}`}
        key={active}
      >
        <div className="lh-tour__screen">
          <div className="lh-tour__screenbar">
            <span className="lh-tour__screentitle">{WORKSPACE_LABEL[active]}</span>
            <span className="lh-tour__screenfield">
              <SearchIcon size={14} />
              <span>Search this workspace</span>
            </span>
          </div>
          <ul className="lh-tour__results">
            {listings.map((listing) => {
              const price =
                listing.workspace === 'supply'
                  ? formatCurrency(listing.estimatedTotal)
                  : listing.quoteRequired
                    ? 'Quote required'
                    : listing.priceLabel;
              return (
                <li key={listing.id} className="lh-tour__result">
                  <span className="lh-tour__resulttitle">{listing.title}</span>
                  <span className="lh-tour__resultmeta">
                    {listing.location} · {titleCase(listing.reach)} · {price}
                  </span>
                  <span className="lh-tour__resultbadges">
                    {listing.verificationBadges.slice(0, 1).map((badge) => (
                      <Badge
                        key={badge.id}
                        tone={badge.state === 'verified' ? 'success' : 'warning'}
                        title={badge.detail}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </span>
                </li>
              );
            })}
            {listings.length === 0 ? (
              <li className="lh-tour__result lh-tour__result--empty">
                Nothing listed here yet. Register to add the first one.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="lh-tour__side">
          <h3 className="lh-h3">{current.blurb}</h3>
          <p className="lh-muted">
            This is the live list from the prototype, not a picture of one. Open the workspace to
            filter it, save a listing and send a request.
          </p>
          <Button onClick={() => navigate(WORKSPACE_HOME_ROUTE[active])}>
            Open {WORKSPACE_LABEL[active]}
          </Button>
        </div>
      </div>
    </div>
  );
};
