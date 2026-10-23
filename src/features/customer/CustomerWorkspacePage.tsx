import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingCard } from '@/components/ListingCard';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card } from '@/components/Card';
import { CreateListingModal } from '@/features/listings/CreateListingModal';
import { RequestWizard } from '@/features/requests/RequestWizard';
import { FilterDrawer } from '@/features/workspaces/FilterDrawer';
import { WorkspaceVerificationNotice } from '@/features/workspaces/WorkspaceVerificationNotice';
import { useWorkspaceBrowser } from '@/features/workspaces/useWorkspaceBrowser';
import { useActions } from '@/state/store';
import type { Listing } from '@/data/types';

export const CustomerWorkspacePage = () => {
  const browser = useWorkspaceBrowser('customer');
  const actions = useActions();
  const navigate = useNavigate();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [requestListing, setRequestListing] = useState<Listing | null>(null);

  const { config } = browser;

  return (
    <>
      <WorkspaceShell
        workspace="customer"
        accent={config.accent}
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
        isEmpty={browser.results.length === 0}
        emptyTitle={config.emptyTitle}
        emptyDescription={config.emptyDescription}
        emptyActions={[
          { label: 'Clear filters', onClick: browser.clearFilters },
          { label: 'Create a service listing', onClick: () => setCreateOpen(true) },
        ]}
        savedSection={
          browser.savedResults.length > 0 ? (
            <Card as="section" className="lh-saved">
              <h2 className="lh-h3">Saved services</h2>
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
        <WorkspaceVerificationNotice workspace="customer" />

        {browser.results.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            saved={browser.isSaved(listing.id)}
            onOpen={() => navigate(`/app/customer/listings/${listing.id}`)}
            onSave={() => void actions.toggleSave(listing.id)}
            onRequest={() => setRequestListing(listing)}
          />
        ))}
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
        workspace="customer"
        onClose={() => setCreateOpen(false)}
      />

      <RequestWizard
        open={requestListing !== null}
        listing={requestListing}
        onClose={() => setRequestListing(null)}
      />
    </>
  );
};
