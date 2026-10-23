import { Button } from '@/components/Button';
import { Drawer } from '@/components/Overlay';
import { Select } from '@/components/Form';
import type { WorkspaceConfig } from '@/features/workspaces/workspaceConfig';
import type { FilterValues } from '@/features/workspaces/filters';

interface FilterDrawerProps {
  open: boolean;
  config: WorkspaceConfig;
  filters: FilterValues;
  sortKey: string;
  onSortChange: (value: string) => void;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
  onClose: () => void;
}

export const FilterDrawer = ({
  open,
  config,
  filters,
  sortKey,
  onSortChange,
  onChange,
  onReset,
  onClose,
}: FilterDrawerProps) => (
  <Drawer
    open={open}
    title="Filters"
    description={`Refine results in ${config.title.toLowerCase()}.`}
    onClose={onClose}
    footer={
      <div className="lh-row lh-spread">
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onClose}>Apply</Button>
      </div>
    }
  >
    <div className="lh-stack">
      <Select
        label="Sort by"
        value={sortKey}
        onChange={(event) => onSortChange(event.target.value)}
        options={config.sortOptions}
      />

      {config.filters.map((filter) => (
        <Select
          key={filter.id}
          label={filter.label}
          value={filters[filter.id] ?? ''}
          onChange={(event) => onChange(filter.id, event.target.value)}
          options={filter.options}
        />
      ))}
    </div>
  </Drawer>
);
