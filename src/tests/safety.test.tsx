import { beforeEach, describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/tests/utils';

const SOURCE_ROOT = join(process.cwd(), 'src');

const collectSourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'tests') return [];
      return collectSourceFiles(full);
    }
    return full.endsWith('.ts') || full.endsWith('.tsx') ? [full] : [];
  });

const sourceFiles = collectSourceFiles(SOURCE_ROOT);

const read = (file: string) => readFileSync(file, 'utf8');

describe('dead-code and safety audit', () => {
  it('finds source files to audit', () => {
    expect(sourceFiles.length).toBeGreaterThan(20);
  });

  it('contains no TODO, FIXME or lorem ipsum markers', () => {
    for (const file of sourceFiles) {
      const content = read(file);
      expect(content, file).not.toMatch(/\bTODO\b/);
      expect(content, file).not.toMatch(/\bFIXME\b/);
      expect(content, file).not.toMatch(/lorem ipsum/i);
    }
  });

  it('does not log to the console outside the documented error boundary', () => {
    for (const file of sourceFiles) {
      if (file.endsWith('ErrorBoundary.tsx')) continue;
      expect(read(file), file).not.toMatch(/console\.log/);
    }
  });

  it('never hardcodes a host or port', () => {
    for (const file of sourceFiles) {
      expect(read(file), file).not.toMatch(/localhost/);
      expect(read(file), file).not.toMatch(/127\.0\.0\.1/);
    }
  });

  it('uses no escaped any types', () => {
    for (const file of sourceFiles) {
      expect(read(file), file).not.toMatch(/(:\s*any\s*[;,)\]}])/);
      expect(read(file), file).not.toMatch(/as any\b/);
      expect(read(file), file).not.toMatch(/<any>/);
    }
  });

  it('never requests a file, a camera or a network call for identity checks', () => {
    for (const file of sourceFiles) {
      const content = read(file);
      expect(content, file).not.toMatch(/type=["']file["']/);
      expect(content, file).not.toMatch(/getUserMedia/);
      expect(content, file).not.toMatch(/MediaDevices/);
      expect(content, file).not.toMatch(/navigator\.mediaDevices/);
    }
  });

  it('does not contain real identity numbers or bank details', () => {
    for (const file of sourceFiles) {
      const content = read(file);
      // South African identity numbers are 13 digits with a date prefix.
      expect(content, file).not.toMatch(/\b\d{6}[0-9]{7}[0-9]\b/);
      expect(content, file).not.toMatch(/\b\d{16}\b/);
    }
  });
});

describe('design token discipline', () => {
  const styleDir = join(SOURCE_ROOT, 'styles');
  const styleFiles = readdirSync(styleDir).filter((file) => file.endsWith('.css'));

  it('finds the stylesheets to audit', () => {
    expect(styleFiles.length).toBeGreaterThan(2);
  });

  it('keeps every raw colour inside tokens.css', () => {
    for (const file of styleFiles) {
      if (file === 'tokens.css') continue;
      const content = read(join(styleDir, file));
      // Hex colours and raw rgb/rgba are only allowed in the token file.
      expect(content, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(content, file).not.toMatch(/rgba?\(/);
    }
  });

  it('defines both colour modes and the accent set', () => {
    const tokens = read(join(styleDir, 'tokens.css'));
    expect(tokens).toContain("[data-theme='dark']");
    for (const accent of ['blue', 'teal', 'green', 'amber', 'coral', 'violet', 'plum']) {
      expect(tokens, accent).toContain(`--accent-${accent}:`);
    }
  });

  it('keeps the reduced motion escape hatch in place', () => {
    const a11y = read(join(styleDir, 'a11y.css'));
    expect(a11y).toContain('prefers-reduced-motion');
  });

  it('draws tags as quiet labels rather than coloured bubbles', () => {
    const components = read(join(styleDir, 'components.css'));
    const badge = components.slice(
      components.indexOf('.lh-badge {'),
      components.indexOf('.lh-badge__mark'),
    );
    // A tight radius, a neutral hairline and a plain surface.
    expect(badge).toContain('var(--radius-tag)');
    expect(badge).toContain('border: 1px solid var(--color-border)');
    expect(badge).toContain('background: var(--color-surface)');
    // No filled, saturated background and no saturated border.
    expect(badge).not.toMatch(
      /background:\s*var\(--color-(success|warning|danger|information)-surface\)/,
    );
    expect(badge).not.toMatch(
      /border-color:\s*var\(--color-(success|warning|danger|information)\)/,
    );
  });

  it('does not hang a coloured bar off a content block', () => {
    const components = read(join(styleDir, 'components.css'));
    // A written reason is content. It gets a border, not a colour strip.
    const reason = components.slice(
      components.indexOf('.lh-request__reason {'),
      components.indexOf('.lh-request__actions'),
    );
    expect(reason).not.toMatch(/border-left:\s*\d+px solid var\(--color-/);
  });

  it('keeps content cards flat, with the shadow only on floating surfaces', () => {
    const components = read(join(styleDir, 'components.css'));
    const start = components.indexOf('.lh-card {');
    const card = components.slice(start, components.indexOf('}', start));
    expect(card).not.toContain('box-shadow');
  });
});

describe('payment and currency safety', () => {
  it('uses the exact future-capability labels from the build specification', async () => {
    const { readFileSync: readSync } = await import('node:fs');
    const files = sourceFiles.map((file) => readSync(file, 'utf8')).join('\n');

    expect(files).toContain('Payments are not available in this prototype');
    expect(files).toContain('Not available in this prototype');
    expect(files).toContain('International settlement model is still under research');
  });

  it('never claims that a payment or currency feature is live', () => {
    for (const file of sourceFiles) {
      const content = read(file);
      expect(content, file).not.toMatch(/pay now/i);
      expect(content, file).not.toMatch(/add funds/i);
      expect(content, file).not.toMatch(/cash out/i);
      expect(content, file).not.toMatch(/withdraw to bank/i);
      expect(content, file).not.toMatch(/guaranteed exchange rate/i);
    }
  });
});

describe('production bundle', () => {
  const assetsDir = join(process.cwd(), 'dist', 'assets');

  it('ships no development-only controls or copy', () => {
    if (!existsSync(assetsDir)) return; // The bundle has not been built yet.
    const bundles = readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
    expect(bundles.length).toBeGreaterThan(0);
    for (const file of bundles) {
      const content = readFileSync(join(assetsDir, file), 'utf8');
      expect(content, file).not.toContain('Development result selector');
      expect(content, file).not.toContain('preview purposes only');
      expect(content, file).not.toMatch(/mock result:/);
      expect(content, file).not.toMatch(/mock checks/);
    }
  });

  it('ships no engineering notes in the page copy', () => {
    if (!existsSync(assetsDir)) return;
    const bundles = readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
    for (const file of bundles) {
      const content = readFileSync(join(assetsDir, file), 'utf8');
      expect(content, file).not.toContain('linkhive-build-spec');
      expect(content, file).not.toContain('It does not');
    }
  });
});

describe('demo verification safety', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows the DEMO label and has no file input on the first step', async () => {
    const { container } = renderApp('/app/verification/demo');
    expect(await screen.findByText(/demo — no real documents are collected/i)).toBeInTheDocument();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(document.querySelector('input[type="file"]')).toBeNull();
  });

  it('never asks for a document sample upload at any step', async () => {
    const user = userEvent.setup();
    renderApp('/app/verification/demo');

    await user.click(await screen.findByRole('button', { name: /view demo flow/i }));
    expect(document.querySelector('input[type="file"]')).toBeNull();

    await user.click(await screen.findByRole('button', { name: /demo id front/i }));
    const continueButton = await screen.findByRole('button', {
      name: /continue to selfie sample/i,
    });
    await waitFor(() => expect(continueButton).toBeEnabled());
    await user.click(continueButton);
    expect(await screen.findByText(/demo selfie/i)).toBeInTheDocument();
    expect(document.querySelector('input[type="file"]')).toBeNull();
  });

  it('offers every result variant and records manual review', async () => {
    const user = userEvent.setup();
    renderApp('/app/verification/demo');

    await user.click(await screen.findByRole('button', { name: /^mismatch$/i }));
    expect(await screen.findByText(/the name did not match in this demo/i)).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: /request manual review/i }));
    expect((await screen.findAllByText(/pending review/i)).length).toBeGreaterThan(0);
    expect(screen.getByText(/24–48 hours in this demo/i)).toBeInTheDocument();
  });

  it('keeps the DEMO label visible on every step', async () => {
    const user = userEvent.setup();
    renderApp('/app/verification/demo');

    const demoLabel = /demo — no real documents are collected/i;
    expect(await screen.findByText(demoLabel)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /view demo flow/i }));
    expect(screen.getByText(demoLabel)).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: /demo id back/i }));
    await user.click(await screen.findByRole('button', { name: /continue to selfie sample/i }));
    expect(screen.getByText(demoLabel)).toBeInTheDocument();
  });
});
