import type { ReactNode } from 'react';
import type { AccentName } from '@/data/types';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  /** Each tab can carry its own accent, so the reader knows what changed. */
  accent?: AccentName;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  children?: ReactNode;
}

export const Tabs = ({ items, activeId, onChange, ariaLabel, children }: TabsProps) => (
  <div className="lh-tabs">
    <div className="lh-tabs__list" role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={active}
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={active ? 0 : -1}
            data-accent={item.accent}
            className={`lh-tabs__tab${active ? ' lh-tabs__tab--active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            {item.accent ? <span className="lh-tabs__dot" aria-hidden="true" /> : null}
            {item.label}
            {typeof item.count === 'number' ? (
              <span className="lh-tabs__count">{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
    {children ? (
      <div
        className="lh-tabs__panel"
        role="tabpanel"
        id={`tabpanel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
      >
        {children}
      </div>
    ) : null}
  </div>
);
