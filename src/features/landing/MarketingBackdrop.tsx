/**
 * The moving background behind the marketing pages.
 *
 * Research: animated backgrounds reduce reading speed by ~9% even when
 * contrast is held (Springer 2022) and an animation that passes at frame 0
 * can fail at frame 60 — always check the brightest frame. The fix:
 * 1) the animation sits on a near-black canvas (#0B0B0D) and is two very
 *    soft radial glows (Meridian: 1200×700@50% -10% rgba(169,41,46,0.35),
 *    900×600@100% 40% rgba(120,20,26,0.18) + linear #0B0B0D→#110A0B→#170B0C)
 * 2) every piece of text sits on a card with a scrim (30% opacity is the
 *    measured threshold for legibility over a textured field, ResearchGate
 *    2020), so the background never competes with the letterforms.
 * 3) the lattice itself is 6% white, not amber, and wakes at 7s so it is
 *    texture, not signal. prefers-reduced-motion freezes it.
 */

interface Cell {
  x: number;
  y: number;
  points: string;
  index: number;
}

const RADIUS = 72;
const COLUMN_SPACING = Math.sqrt(3) * RADIUS;
const ROW_SPACING = RADIUS * 1.5;
const WIDTH = 1600;
const HEIGHT = 900;

const hexPoints = (radius: number): string => {
  const corners = [30, 90, 150, 210, 270, 330].map((degrees) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(radius * Math.cos(radians)).toFixed(2)},${(radius * Math.sin(radians)).toFixed(2)}`;
  });
  return corners.join(' ');
};

const POINTS = hexPoints(RADIUS);

const buildCells = (): Cell[] => {
  const cells: Cell[] = [];
  const columns = Math.ceil(WIDTH / COLUMN_SPACING) + 1;
  const rows = Math.ceil(HEIGHT / ROW_SPACING) + 1;
  for (let row = -1; row < rows; row += 1) {
    for (let column = -1; column < columns; column += 1) {
      const x = column * COLUMN_SPACING + (row % 2 === 0 ? 0 : COLUMN_SPACING / 2);
      const y = row * ROW_SPACING;
      cells.push({ x, y, points: POINTS, index: cells.length });
    }
  }
  return cells;
};

const CELLS = buildCells();

export const MarketingBackdrop = () => (
  <div className="lh-mkt__backdrop" aria-hidden="true">
    <div className="lh-mkt__base" />
    <div className="lh-mkt__glow lh-mkt__glow--a" />
    <div className="lh-mkt__glow lh-mkt__glow--b" />
    <div className="lh-mkt__wash" />
    <svg
      className="lh-lattice"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {CELLS.map((cell) => (
        <polygon
          key={cell.index}
          className={`lh-lattice__cell${cell.index % 7 === 0 ? ' lh-lattice__cell--lit' : ''}`}
          points={cell.points}
          transform={`translate(${cell.x.toFixed(1)} ${cell.y.toFixed(1)})`}
          style={{ '--i': cell.index } as React.CSSProperties}
        />
      ))}
    </svg>
    <div className="lh-mkt__grain" />
    {/* Scrim: ensures any text that still sits directly on the canvas
        (only the hero lead) hits ≥4.5:1 on the brightest frame. */}
    <div className="lh-mkt__scrim" />
  </div>
);
