import type { ReactNode } from 'react';
import type { Workspace } from '@/data/types';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Badge';
import { EmptyState, ErrorState, Skeleton } from '@/components/States';
import { FilterIcon, SearchIcon } from '@/components/icons';

export interface AppliedFilter {
  id: string;
  label: string;
  onRemove: () => void;
}

interface WorkspaceShellProps {
  workspace: Workspace;
  accent: string;
  title: string;
  purpose: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  appliedFilters: AppliedFilter[];
  onClearFilters: () => void;
  primaryAction: { label: string; onClick: () => void };
  status?: 'ready' | 'loading' | 'error';
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActions?: { label: string; onClick: () => void }[];
  savedSection?: ReactNode;
  children: ReactNode;
}

/**
 * The shared workspace surface: one header, one query, one filter control,
 * one result stream and one primary action. Content never mixes workspaces.
 */
export const WorkspaceShell = ({
  workspace,
  accent,
  title,
  purpose,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onOpenFilters,
  activeFilterCount,
  appliedFilters,
  onClearFilters,
  primaryAction,
  status = 'ready',
  onRetry,
  isEmpty = false,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Try changing your search or filters.',
  emptyActions = [],
  savedSection,
  children,
}: WorkspaceShellProps) => (
  <section className="lh-workspace" data-workspace={workspace}>
    <header className="lh-workspace__header" style={{ borderLeftColor: accent }}>
      <div className="lh-stack-sm">
        <h1 className="lh-h1">{title}</h1>
        <p className="lh-muted">{purpose}</p>
      </div>
      <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>
    </header>

    <div className="lh-workspace__query">
      <div className="lh-search">
        <SearchIcon className="lh-search__icon" />
        <input
          type="search"
          className="lh-search__input"
          value={searchValue}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur();
            }
          }}
        />
      </div>
      <Button variant="secondary" onClick={onOpenFilters} aria-expanded={false}>
        <FilterIcon size={18} />
        Filters
        {activeFilterCount > 0 ? (
          <span className="lh-filter-count">{activeFilterCount}</span>
        ) : null}
      </Button>
    </div>

    {appliedFilters.length > 0 ? (
      <div className="lh-workspace__filters">
        {appliedFilters.map((filter) => (
          <Chip key={filter.id} onRemove={filter.onRemove} removeLabel={`Remove ${filter.label}`}>
            {filter.label}
          </Chip>
        ))}
        <button type="button" className="lh-linkbutton lh-linkbutton--sm" onClick={onClearFilters}>
          Clear all
        </button>
      </div>
    ) : null}

    {status === 'loading' ? <Skeleton lines={4} label="Loading results" /> : null}
    {status === 'error' ? (
      <ErrorState onRetry={onRetry} description="Results could not be loaded. Try again." />
    ) : null}
    {status === 'ready' && isEmpty ? (
      <EmptyState title={emptyTitle} description={emptyDescription} actions={emptyActions} />
    ) : null}
    {status === 'ready' && !isEmpty ? (
      <div className="lh-workspace__results">{children}</div>
    ) : null}

    {savedSection ? <div className="lh-workspace__saved">{savedSection}</div> : null}
  </section>
);
