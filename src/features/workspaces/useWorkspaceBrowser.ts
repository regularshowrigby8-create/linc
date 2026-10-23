import { useMemo, useState } from 'react';
import type { Listing, Workspace } from '@/data/types';
import { useStore } from '@/state/store';
import { selectIsSaved, selectListingsForWorkspace } from '@/state/selectors';
import { WORKSPACE_CONFIGS, type WorkspaceConfig } from '@/features/workspaces/workspaceConfig';
import {
  applyWorkspaceFilters,
  countActiveFilters,
  type FilterValues,
} from '@/features/workspaces/filters';

export interface WorkspaceBrowser {
  config: WorkspaceConfig;
  search: string;
  setSearch: (value: string) => void;
  filters: FilterValues;
  setFilter: (id: string, value: string) => void;
  clearFilters: () => void;
  sortKey: string;
  setSortKey: (value: string) => void;
  activeFilterCount: number;
  appliedFilters: { id: string; label: string; onRemove: () => void }[];
  results: Listing[];
  savedResults: Listing[];
  isSaved: (id: string) => boolean;
  totalCount: number;
}

/** Shared search, filter and sort behaviour for every workspace surface. */
export const useWorkspaceBrowser = (workspace: Workspace): WorkspaceBrowser => {
  const { state } = useStore();
  const config = WORKSPACE_CONFIGS[workspace];
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterValues>({});
  const [sortKey, setSortKey] = useState(config.sortOptions[0].value);

  const workspaceListings = selectListingsForWorkspace(state, workspace);

  const results = useMemo(
    () => applyWorkspaceFilters(workspaceListings, search, filters, sortKey),
    [workspaceListings, search, filters, sortKey],
  );

  const savedResults = useMemo(
    () => workspaceListings.filter((listing) => selectIsSaved(state, listing.id)),
    [workspaceListings, state],
  );

  const appliedFilters = useMemo(
    () =>
      config.filters
        .filter((filter) => filters[filter.id])
        .map((filter) => ({
          id: filter.id,
          label: `${filter.label}: ${
            filter.options.find((option) => option.value === filters[filter.id])?.label ?? ''
          }`,
          onRemove: () => setFilters((current) => ({ ...current, [filter.id]: '' })),
        })),
    [config.filters, filters],
  );

  return {
    config,
    search,
    setSearch,
    filters,
    setFilter: (id, value) => setFilters((current) => ({ ...current, [id]: value })),
    clearFilters: () => setFilters({}),
    sortKey,
    setSortKey,
    activeFilterCount: countActiveFilters(filters),
    appliedFilters,
    results,
    savedResults,
    isSaved: (id: string) => selectIsSaved(state, id),
    totalCount: workspaceListings.length,
  };
};
