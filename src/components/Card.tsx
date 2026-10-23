import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /** Left-edge workspace colour. */
  accent?: string;
  as?: 'div' | 'article' | 'li' | 'section';
  className?: string;
  padding?: 'none' | 'compact' | 'default';
}

export const Card = ({
  children,
  accent,
  as: Tag = 'div',
  className,
  padding = 'default',
}: CardProps) => (
  <Tag
    className={['lh-card', `lh-card--pad-${padding}`, className].filter(Boolean).join(' ')}
    style={accent ? { borderLeftColor: accent } : undefined}
    data-accent={accent ? 'true' : undefined}
  >
    {children}
  </Tag>
);
