import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/tests/utils';

describe('colour mode', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('offers light, dark and system on the landing page', async () => {
    renderApp('/');

    const group = screen.getByRole('group', { name: /colour mode/i });
    expect(within(group).getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(within(group).getByRole('button', { name: /system/i })).toBeInTheDocument();
  });

  it('applies dark mode to the document and remembers it', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const group = screen.getByRole('group', { name: /colour mode/i });
    await user.click(within(group).getByRole('button', { name: /dark/i }));

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // The choice is stored with the rest of the mock state.
    await waitFor(() => {
      const stored = window.localStorage.getItem('linkhive.state.v1');
      expect(stored).toContain('"theme":"dark"');
    });
  });

  it('switches back to light mode', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const group = screen.getByRole('group', { name: /colour mode/i });
    await user.click(within(group).getByRole('button', { name: /dark/i }));
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    await user.click(within(group).getByRole('button', { name: /light/i }));
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('reaches the account drawer through the appearance panel', async () => {
    const user = userEvent.setup();
    renderApp('/app/profile');

    await user.click(screen.getByRole('button', { name: /open your account menu/i }));
    await user.click(screen.getByTestId('open-appearance'));

    expect(screen.getByRole('group', { name: /colour mode/i })).toBeInTheDocument();
  });
});

describe('profile personalisation', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows badges with the ones already earned', () => {
    renderApp('/app/profile');
    const badges = screen.getByRole('list', { name: /badges you have earned/i });
    expect(badges).toBeInTheDocument();

    const earned = screen.getByTestId('achievement-first-request');
    expect(earned).toHaveAttribute('data-state');
    expect(['earned', 'locked']).toContain(earned.getAttribute('data-state'));
  });

  it('lets the member choose an accent', async () => {
    const user = userEvent.setup();
    renderApp('/app/profile');

    const teal = screen.getByRole('button', { name: 'Teal' });
    expect(teal).toHaveAttribute('aria-pressed', 'false');
    await user.click(teal);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Teal' })).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('lets the member change their mark', async () => {
    const user = userEvent.setup();
    renderApp('/app/profile');

    const choice = screen.getByRole('button', { name: /blocks/i });
    await user.click(choice);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /blocks/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  });

  it('saves a new headline', async () => {
    const user = userEvent.setup();
    renderApp('/app/profile');

    const input = screen.getByLabelText(/your line about what you do/i);
    await user.clear(input);
    await user.type(input, 'Solar installer');
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(screen.getByText('Solar installer')).toBeInTheDocument();
    });
  });

  it('keeps the future feature labels exactly as they were', () => {
    renderApp('/app/profile');
    expect(
      screen.getAllByText(/Payments are not available in this prototype\./).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wallet is planned for a later release\./).length).toBeGreaterThan(
      0,
    );
  });
});

describe('progressive disclosure', () => {
  beforeEach(() => window.localStorage.clear());

  it('keeps secondary listing facts behind a details control', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const trigger = screen.getAllByRole('button', { name: /more details/i })[0];
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the response time out of reach until the details are opened', () => {
    renderApp('/app/customer');

    const trigger = screen.getAllByRole('button', { name: /more details/i })[0];
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // The panel is in the document but marked inert, so it is out of the
    // keyboard order and out of the accessibility tree while it is closed.
    const responseTime = screen.getAllByText(/usually replies within/i)[0];
    const panel = responseTime.closest('[inert]');
    expect(panel).not.toBeNull();
  });
});

describe('status labels', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows a verification label with a status mark and plain text', () => {
    renderApp('/app/customer');

    const label = screen.getAllByText('Business (demo)')[0];
    expect(label).toBeInTheDocument();
    // The label text sits in its own span, so it can stay in plain ink while
    // the mark next to it carries the status.
    expect(label).toHaveClass('lh-badge__text');
    expect(label.closest('.lh-badge')).toBeInTheDocument();
  });

  it('marks a pending label differently from a checked one', () => {
    renderApp('/app/customer');
    const checked = screen.getAllByText('Business (demo)')[0].closest('.lh-badge');
    const pending = screen.getAllByText('Qualification (pending)')[0].closest('.lh-badge');
    expect(checked?.className).toContain('lh-badge--success');
    expect(pending?.className).toContain('lh-badge--warning');
  });
});

describe('product tour on the landing page', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows each workspace on its own tab', async () => {
    renderApp('/');

    const tabs = screen.getByRole('tablist', { name: /workspaces in the preview/i });
    expect(within(tabs).getByRole('tab', { name: /customer service/i })).toBeInTheDocument();
    expect(within(tabs).getByRole('tab', { name: /supply/i })).toBeInTheDocument();
  });

  it('changes the preview when another workspace is chosen', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const tabs = screen.getByRole('tablist', { name: /workspaces in the preview/i });
    await user.click(within(tabs).getByRole('tab', { name: /supply/i }));

    await waitFor(() => {
      expect(within(tabs).getByRole('tab', { name: /supply/i })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });
});

describe('desktop rail', () => {
  beforeEach(() => window.localStorage.clear());

  it('collapses to icons and expands again', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const collapse = screen.getByRole('button', { name: /collapse the navigation rail/i });
    await user.click(collapse);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /expand the navigation rail/i }),
      ).toBeInTheDocument();
    });
  });
});
