import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'information' | 'hive';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Text that explains what the badge means. Status is never conveyed by colour alone. */
  title?: string;
}

export const Badge = ({ tone = 'neutral', children, title }: BadgeProps) => (
  <span className={`lh-badge lh-badge--${tone}`} title={title}>
    {children}
  </span>
);

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  tone?: BadgeTone;
}

export const Chip = ({
  children,
  onRemove,
  removeLabel = 'Remove filter',
  tone = 'neutral',
}: ChipProps) => (
  <span className={`lh-chip lh-chip--${tone}`}>
    <span>{children}</span>
    {onRemove ? (
      <button
        type="button"
        className="lh-chip__remove"
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
      >
        <span aria-hidden="true">×</span>
      </button>
    ) : null}
  </span>
);

interface AvatarProps {
  initials: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = ({ initials, name, size = 'md' }: AvatarProps) => (
  <span className={`lh-avatar lh-avatar--${size}`} aria-hidden="true" title={name}>
    {initials}
  </span>
);
