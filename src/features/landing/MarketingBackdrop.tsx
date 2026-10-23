/**
 * The moving background behind the marketing pages.
 *
 * It is a field of hexagons that wakes up in a travelling wave, the way a
 * hive comes alive, over two slow honey blooms and a wide wash. The wave is
 * one CSS rule: every cell carries its own index as a custom property and
 * the animation is delayed by it, so a hundred and twenty cells cost one
 * keyframe block rather than a hundred and twenty.
 *
 * Nothing here is interactive and nothing here is announced. It is a
 * surface, so it is hidden from assistive technology.
 *
 * There is no canvas and no WebGL. The whole effect is transforms and
 * opacities, which the compositor can run without the main thread waking
 * up, and it degrades to a still composition when the reader has asked for
 * reduced motion.
 */

interface Cell {
  x: number;
  y: number;
  points: string;
  index: number;
}

/** Hexagons are pointy topped, so the grid runs in offset rows. */
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
    <div className="lh-mkt__wash" />
    <div className="lh-mkt__bloom lh-mkt__bloom--a" />
    <div className="lh-mkt__bloom lh-mkt__bloom--b" />
    <svg
      className="lh-lattice"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {CELLS.map((cell) => (
        <polygon
          key={cell.index}
          className={`lh-lattice__cell${cell.index % 5 === 0 ? ' lh-lattice__cell--lit' : ''}`}
          points={cell.points}
          transform={`translate(${cell.x.toFixed(1)} ${cell.y.toFixed(1)})`}
          style={{ '--i': cell.index } as React.CSSProperties}
        />
      ))}
    </svg>
    <div className="lh-mkt__grain" />
  </div>
);
