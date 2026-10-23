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
  /**
   * Abstract treatments only. Portraits are never shown, so a member can
   * change the look without anyone being represented.
   */
  style?: 'initials' | 'blocks' | 'rings';
}

export const Avatar = ({ initials, name, size = 'md', style = 'initials' }: AvatarProps) => (
  <span
    className={`lh-avatar lh-avatar--${size} lh-avatar--${style}`}
    aria-hidden="true"
    title={name}
  >
    {style === 'initials' ? initials : null}
    {style === 'blocks' ? (
      <span className="lh-avatar__blocks">
        <span />
        <span />
        <span />
        <span />
      </span>
    ) : null}
    {style === 'rings' ? (
      <span className="lh-avatar__rings">
        <span />
        <span />
        <span />
      </span>
    ) : null}
  </span>
);
