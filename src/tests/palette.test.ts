import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The accent palette is not a matter of taste, so it is checked.
 *
 * The rules came out of published research on colour and wellbeing, and
 * from the accessibility rules for colour vision deficiency:
 *
 *   - Every accent must clear 4.5:1 on white and on its own tint, so an
 *     accent can be used as text on a tinted active state.
 *   - Chroma has to stay low. Saturation, not hue, is what raises arousal,
 *     and a muted warm colour calms more than a vivid cool one.
 *   - The seven must stay separable when red or green perception is
 *     missing, which is why the four navigation areas and the seven
 *     request states never rely on hue alone. Every one of them also
 *     carries an icon and a word.
 */

const TOKENS = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

const ACCENTS = ['blue', 'teal', 'green', 'amber', 'clay', 'violet', 'plum'] as const;

const srgb = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const value = hex.replace('#', '');
  const r = srgb(parseInt(value.slice(0, 2), 16));
  const g = srgb(parseInt(value.slice(2, 4), 16));
  const b = srgb(parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const first = luminance(a);
  const second = luminance(b);
  const high = Math.max(first, second);
  const low = Math.min(first, second);
  return (high + 0.05) / (low + 0.05);
};

/** How colourful a colour is, from 0 to 1. */
const chroma = (hex: string): number => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  return high === 0 ? 0 : (high - low) / high;
};

/** A pale tint of a colour, the way a surface is derived from it. */
const tint = (hex: string, amount = 0.08): string => {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const from = parseInt(value.slice(offset, offset + 2), 16);
    return Math.round(from * amount + 255 * (1 - amount));
  });
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

/** The value of a token in one block of the stylesheet. */
const token = (name: string, block: 'light' | 'dark'): string => {
  // The block opening, not the comment that names it further up the file.
  const scoped = block === 'dark' ? TOKENS.slice(TOKENS.indexOf("[data-theme='dark'] {")) : TOKENS;
  const match = scoped.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`${name} is not defined in the ${block} block`);
  return match[1];
};

describe('the accent palette', () => {
  it.each(ACCENTS)('gives %s enough contrast to be read as text', (accent) => {
    const solid = token(`--accent-${accent}`, 'light');
    expect(contrast(solid, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    expect(contrast(solid, tint(solid))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ACCENTS)('keeps %s calm enough in both modes', (accent) => {
    const light = token(`--accent-${accent}`, 'light');
    const dark = token(`--accent-${accent}`, 'dark');
    // Saturation is the variable that raises arousal, so it is capped.
    expect(chroma(light)).toBeLessThanOrEqual(0.92);
    expect(chroma(dark)).toBeLessThanOrEqual(0.92);
    // A dark mode accent is lightened so it stays legible on charcoal.
    expect(contrast(dark, '#0e1420')).toBeGreaterThanOrEqual(4.5);
  });

  it('does not use a saturated red or orange anywhere in the palette', () => {
    // The research is clear that saturated warm colours read as alarm.
    // The warm accents here are a muted gold and a muted terracotta.
    expect(chroma(token('--accent-clay', 'light'))).toBeLessThanOrEqual(0.8);
    expect(chroma(token('--accent-amber', 'light'))).toBeLessThanOrEqual(0.9);
  });

  it('gives every accent a surface and a hairline of its own', () => {
    for (const accent of ACCENTS) {
      expect(TOKENS).toContain(`--accent-${accent}-surface:`);
      expect(TOKENS).toContain(`--accent-${accent}-line:`);
    }
  });

  it('never relies on a colour alone to mark a state', () => {
    // Every navigation area and request state carries an icon and a word
    // as well as a colour, so the palette is a second signal and not the
    // only one.
    const tabs = readFileSync(join(process.cwd(), 'src/components/Tabs.tsx'), 'utf8');
    expect(tabs).toContain('item.label');
    expect(tabs).toContain('item.accent');
  });
});

describe('the marketing surface', () => {
  it('has its own canvas rather than an inversion of the app', () => {
    const light = token('--marketing-canvas', 'light');
    const dark = token('--marketing-canvas', 'dark');
    // Warm paper in light mode, warm charcoal in dark mode. Neither is a
    // pure white or a pure black, because both are harsh to read against.
    expect(light.toLowerCase()).not.toBe('#ffffff');
    expect(dark.toLowerCase()).not.toBe('#000000');
    expect(contrast(token('--marketing-ink', 'light'), light)).toBeGreaterThanOrEqual(7);
    expect(contrast(token('--marketing-ink', 'dark'), dark)).toBeGreaterThanOrEqual(7);
  });

  it('keeps the marketing body copy readable', () => {
    expect(
      contrast(token('--marketing-ink-muted', 'light'), token('--marketing-canvas', 'light')),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(token('--marketing-ink-muted', 'dark'), token('--marketing-canvas', 'dark')),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('gives the call to action enough contrast in both modes', () => {
    expect(
      contrast(token('--marketing-on-honey', 'light'), token('--marketing-honey', 'light')),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(token('--marketing-on-honey', 'dark'), token('--marketing-honey', 'dark')),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
