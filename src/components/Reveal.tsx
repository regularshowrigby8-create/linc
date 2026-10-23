import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Stagger step, 1 to 4. Each step waits one beat longer than the last. */
  step?: 1 | 2 | 3 | 4;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Reveals content as it enters the viewport.
 *
 * The motion is a short rise and fade that confirms the reader's progress
 * down the page. It never delays the content: the panel is fully readable
 * without it, and it is switched off entirely when the reader has asked for
 * reduced motion or when the browser cannot observe intersections.
 */
export const Reveal = ({
  children,
  step = 1,
  className,
  as: Tag = 'div',
  ...rest
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={['lh-reveal', `lh-reveal--step-${step}`, shown && 'lh-reveal--shown', className]
        .filter(Boolean)
        .join(' ')}
      data-reveal={shown ? 'shown' : 'pending'}
      {...rest}
    >
      {children}
    </Tag>
  );
};
