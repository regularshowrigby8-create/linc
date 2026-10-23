import type { ReactNode } from 'react';
import { CheckCircleIcon } from '@/components/icons';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'information' | 'hive';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Text that explains what the badge means. Status is never conveyed by colour alone. */
  title?: string;
  /** Replaces the status mark with something else. */
  icon?: ReactNode;
}

/**
 * A quiet label.
 *
 * The mark carries the status and the text carries the meaning, so the label
 * itself stays in plain ink on a hairline border. A tag is not a button, so
 * it does not wear a colour of its own. Colour belongs on the things a
 * person can act on.
 */
const BadgeMark = ({ tone }: { tone: BadgeTone }) => {
  if (tone === 'success') return <CheckCircleIcon size={13} />;
  if (tone === 'neutral' || tone === 'warning') return <span className="lh-badge__ring" />;
  return <span className="lh-badge__dot" />;
};

export const Badge = ({ tone = 'neutral', children, title, icon }: BadgeProps) => (
  <span className={`lh-badge lh-badge--${tone}`} title={title}>
    <span className="lh-badge__mark" aria-hidden="true">
      {icon ?? <BadgeMark tone={tone} />}
    </span>
    <span className="lh-badge__text">{children}</span>
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
