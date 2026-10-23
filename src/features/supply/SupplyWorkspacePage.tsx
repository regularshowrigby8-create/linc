import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Listing } from '@/data/types';
import { ListingCard } from '@/components/ListingCard';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { QuoteCard } from '@/components/QuoteCard';
import { Drawer } from '@/components/Overlay';
import { Button } from '@/components/Button';
import { CreateListingModal } from '@/features/listings/CreateListingModal';
import { RequestWizard } from '@/features/requests/RequestWizard';
import { FilterDrawer } from '@/features/workspaces/FilterDrawer';
import { WorkspaceVerificationNotice } from '@/features/workspaces/WorkspaceVerificationNotice';
import { useWorkspaceBrowser } from '@/features/workspaces/useWorkspaceBrowser';
import { useActions, useStore } from '@/state/store';
import { formatCurrency } from '@/utils/format';

export const SupplyWorkspacePage = () => {
  const browser = useWorkspaceBrowser('supply');
  const actions = useActions();
  const { state } = useStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState('products');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [requestListing, setRequestListing] = useState<Listing | null>(null);
  const [detailListing, setDetailListing] = useState<Listing | null>(null);

  const { config } = browser;
  const quotes = state.app.quotes;
  const supplyDetail = detailListing && detailListing.workspace === 'supply' ? detailListing : null;

  return (
    <>
      <WorkspaceShell
        workspace="supply"
        title={config.title}
        purpose={config.purpose}
        searchValue={browser.search}
        searchPlaceholder={config.searchPlaceholder}
        onSearchChange={browser.setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={browser.activeFilterCount}
        appliedFilters={browser.appliedFilters}
        onClearFilters={browser.clearFilters}
        primaryAction={{ label: config.primaryActionLabel, onClick: () => setCreateOpen(true) }}
        isEmpty={browser.results.length === 0 && quotes.length === 0}
        emptyTitle={config.emptyTitle}
        emptyDescription={config.emptyDescription}
        emptyActions={[
          { label: 'Clear filters', onClick: browser.clearFilters },
          { label: 'Create sourcing request', onClick: () => setCreateOpen(true) },
        ]}
        savedSection={
          browser.savedResults.length > 0 ? (
            <Card as="section" className="lh-saved">
              <h2 className="lh-h3">Saved suppliers</h2>
              <ul className="lh-stack-sm">
                {browser.savedResults.map((listing) => (
                  <li key={listing.id} className="lh-spread">
                    <span>{listing.title}</span>
                    <button
                      type="button"
                      className="lh-linkbutton lh-linkbutton--sm"
                      onClick={() => void actions.toggleSave(listing.id)}
                    >
                      Remove from saved
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null
        }
      >
        <WorkspaceVerificationNotice workspace="supply" />

        <Tabs
          items={[
            { id: 'products', label: 'Products', count: browser.results.length },
            { id: 'quotes', label: 'Quotes', count: quotes.length },
          ]}
          activeId={tab}
          onChange={setTab}
          ariaLabel="Supply views"
        >
          {tab === 'products' ? (
            <div className="lh-grid-cards">
              {browser.results.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved={browser.isSaved(listing.id)}
                  onOpen={() => setDetailListing(listing)}
                  onSave={() => void actions.toggleSave(listing.id)}
                  onRequest={() => setRequestListing(listing)}
                />
              ))}
            </div>
          ) : (
            <div className="lh-grid-cards">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  selected={quote.state === 'selected'}
                  busy={actions.isPending(`select-quote:${quote.id}`)}
                  onSelect={() => void actions.selectQuote(quote.id)}
                  onRequestAlternative={() => void actions.requestAlternative(quote.id)}
                />
              ))}
              {quotes.length === 0 ? (
                <p className="lh-muted">No quotes yet. Create a sourcing request to receive one.</p>
              ) : null}
            </div>
          )}
        </Tabs>
      </WorkspaceShell>

      <FilterDrawer
        open={filtersOpen}
        config={config}
        filters={browser.filters}
        sortKey={browser.sortKey}
        onSortChange={browser.setSortKey}
        onChange={browser.setFilter}
        onReset={browser.clearFilters}
        onClose={() => setFiltersOpen(false)}
      />

      <CreateListingModal
        open={createOpen}
        workspace="supply"
        onClose={() => setCreateOpen(false)}
      />

      <RequestWizard
        open={requestListing !== null}
        listing={requestListing}
        onClose={() => setRequestListing(null)}
      />

      <Drawer
        open={supplyDetail !== null}
        title={supplyDetail?.product ?? 'Product'}
        description={
          supplyDetail
            ? `${supplyDetail.supplierLocation} · ${supplyDetail.deliveryWindow}`
            : undefined
        }
        onClose={() => setDetailListing(null)}
      >
        {supplyDetail ? (
          <div className="lh-stack">
            <p className="lh-muted">{supplyDetail.description}</p>
            <dl className="lh-listing__facts">
              <div>
                <dt className="lh-label">Quantity and minimum order</dt>
                <dd>
                  {supplyDetail.quantity} units · minimum {supplyDetail.moq}
                </dd>
              </div>
              <div>
                <dt className="lh-label">Product price</dt>
                <dd>{supplyDetail.priceLabel}</dd>
              </div>
              <div>
                <dt className="lh-label">Estimated route total</dt>
                <dd>{formatCurrency(supplyDetail.estimatedTotal)}</dd>
              </div>
              <div>
                <dt className="lh-label">Quote confidence</dt>
                <dd>{supplyDetail.confidence}</dd>
              </div>
              <div>
                <dt className="lh-label">Responsibility note</dt>
                <dd>
                  The supplier is responsible for the product. Shipping, customs and local delivery
                  are confirmed separately in each quote.
                </dd>
              </div>
            </dl>
            <p className="lh-caption">Delivery cost is estimated until a route is confirmed.</p>
            <Button variant="secondary" onClick={() => navigate('/app/supply/quotes/quote-1')}>
              Compare quotes
            </Button>
            <Button
              variant="ghost"
              disabled
              title="Payments are not available in this prototype"
              onClick={() => undefined}
            >
              Payments are not available in this prototype
            </Button>
          </div>
        ) : null}
      </Drawer>
    </>
  );
};
