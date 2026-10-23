import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface CardCarouselProps {
  children: ReactNode;
  /** Names the region for assistive technology. */
  ariaLabel: string;
  /** Optional heading rendered above the track. */
  title?: string;
  description?: string;
}

/**
 * A horizontal track of cards that can be dragged, scrolled or stepped with
 * the arrow buttons. Cards snap into place so a card is never cut in half.
 */
export const CardCarousel = ({ children, ariaLabel, title, description }: CardCarouselProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(max - track.scrollLeft <= 2);
  }, []);

  useEffect(() => {
    syncEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      track.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-item]');
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <div className="lh-carousel">
      {title || description ? (
        <div className="lh-carousel__head">
          {title ? <h2 className="lh-h2">{title}</h2> : null}
          {description ? <p className="lh-muted">{description}</p> : null}
          <div className="lh-carousel__controls">
            <button
              type="button"
              className="lh-carousel__control"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Show the previous card"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className="lh-carousel__control"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Show the next card"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      ) : null}
      <div
        className="lh-carousel__track"
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};
