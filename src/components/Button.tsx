import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    type="button"
    className={[
      'lh-btn',
      `lh-btn--${variant}`,
      `lh-btn--${size}`,
      fullWidth && 'lh-btn--full',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading ? <span className="lh-btn__spinner" aria-hidden="true" /> : null}
    <span>{children}</span>
  </button>
);

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons must expose an accessible name. */
  label: string;
  tooltip?: string;
  variant?: 'ghost' | 'secondary';
  children: ReactNode;
}

export const IconButton = ({
  label,
  tooltip,
  variant = 'ghost',
  disabled,
  className,
  children,
  ...rest
}: IconButtonProps) => (
  <button
    type="button"
    className={['lh-icon-btn', `lh-icon-btn--${variant}`, className].filter(Boolean).join(' ')}
    aria-label={label}
    title={tooltip ?? label}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);
