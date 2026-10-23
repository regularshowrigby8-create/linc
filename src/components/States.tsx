import type { ReactNode } from 'react';
import { Button } from '@/components/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
}

export const EmptyState = ({ title, description, actions = [] }: EmptyStateProps) => (
  <div className="lh-state lh-state--empty">
    <h3 className="lh-h3">{title}</h3>
    <p className="lh-muted">{description}</p>
    {actions.length > 0 ? (
      <div className="lh-row">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? 'secondary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    ) : null}
  </div>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'This section could not be loaded. Try again.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) => (
  <div className="lh-state lh-state--error" role="alert">
    <h3 className="lh-h3">{title}</h3>
    <p className="lh-muted">{description}</p>
    {onRetry ? (
      <Button variant="secondary" onClick={onRetry}>
        {retryLabel}
      </Button>
    ) : null}
  </div>
);

interface SkeletonProps {
  lines?: number;
  label?: string;
}

export const Skeleton = ({ lines = 3, label = 'Loading' }: SkeletonProps) => (
  <div className="lh-skeleton" role="status" aria-live="polite">
    <span className="lh-sr-only">{label}</span>
    {Array.from({ length: lines }).map((_, index) => (
      <span className="lh-skeleton__line" key={index} aria-hidden="true" />
    ))}
  </div>
);

interface InlineNoticeProps {
  tone: 'info' | 'warning' | 'danger';
  title: string;
  children?: ReactNode;
  action?: { label: string; onClick: () => void };
}

export const InlineNotice = ({ tone, title, children, action }: InlineNoticeProps) => (
  <div className={`lh-notice lh-notice--${tone}`} role="note">
    <div className="lh-stack-sm">
      <strong className="lh-notice__title">{title}</strong>
      {children ? <div className="lh-notice__body">{children}</div> : null}
    </div>
    {action ? (
      <Button variant="secondary" size="sm" onClick={action.onClick}>
        {action.label}
      </Button>
    ) : null}
  </div>
);
