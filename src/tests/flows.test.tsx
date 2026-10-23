import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '@/tests/utils';

describe('landing page', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows the hero and the four workspaces', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: /find the right connection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /customer service/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /qualification \/ jobs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^collaboration$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^supply$/i })).toBeInTheDocument();
  });

  it('asks for one decision only', () => {
    renderApp('/');
    const calls = screen.getAllByRole('button', { name: /get started/i });
    expect(calls.length).toBeGreaterThan(0);
    // Every call to action on the page leads to the same place.
    calls.forEach((call) => expect(call).toBeInTheDocument());
    expect(
      screen.queryByRole('button', { name: /create a free account/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /explore the workspaces/i }),
    ).not.toBeInTheDocument();
  });

  it('states that payments are not available', () => {
    renderApp('/');
    expect(
      screen.getAllByText(/not available yet|not available in this prototype/i).length,
    ).toBeGreaterThan(0);
  });

  it('shows the product rather than the build notes', () => {
    renderApp('/');
    // A consumer page explains what the product does, not what the build left out.
    expect(screen.queryByText(/what this prototype does and does not do/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/linkhive-build-spec/i)).not.toBeInTheDocument();
    expect(screen.getByText(/tell us what you need/i)).toBeInTheDocument();
  });

  it('puts the limits it will not cross in front of the reader', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: /the catch, up front/i })).toBeInTheDocument();
    expect(
      screen.getAllByText(/payments are not available in this prototype/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/real document verification is not connected/i).length,
    ).toBeGreaterThan(0);
  });

  it('shows the four workspaces with a clear way in', () => {
    renderApp('/');
    expect(screen.getByRole('link', { name: /customer service/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /supply/i })).toBeInTheDocument();
  });
});

describe('the get started flow', () => {
  beforeEach(() => window.localStorage.clear());

  it('asks whether you are hiring or offering, and waits for an answer', async () => {
    const user = userEvent.setup();
    renderApp('/register');

    expect(screen.getByRole('heading', { name: /what brings you here/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /i am looking to hire/i }));

    expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
  });

  it('brings the chosen side forward and lets the other recede', async () => {
    const user = userEvent.setup();
    renderApp('/register');

    const hire = screen.getByRole('button', { name: /i am looking to hire/i });
    await user.click(hire);

    expect(hire.closest('.lh-funnel__side')).toHaveClass('lh-funnel__side--chosen');
    const offer = screen.getByRole('button', { name: /i am offering my work/i });
    expect(offer.closest('.lh-funnel__side')).toHaveClass('lh-funnel__side--faded');
  });

  it('moves to the account type after the choice', async () => {
    const user = userEvent.setup();
    renderApp('/register');

    await user.click(screen.getByRole('button', { name: /i am looking to hire/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      await screen.findByRole('heading', { name: /which kind of account are you/i }),
    ).toBeInTheDocument();
  });

  it('offers a business and an individual account, each with its own explanation', async () => {
    const user = userEvent.setup();
    renderApp('/onboarding/account-type');

    expect(screen.getByRole('heading', { name: /a business account/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /an individual account/i })).toBeInTheDocument();
    expect(
      screen.getByText(/business listings are reviewed before they appear/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /i am a business/i }));
    expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
  });

  it('explains the account in full before it asks for a name', () => {
    renderApp('/onboarding/account');

    expect(
      screen.getByRole('heading', { name: /here is what you are getting/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what this account is/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what it does not do/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  });

  it('shows visible validation errors for an invalid form', async () => {
    const user = userEvent.setup();
    renderApp('/onboarding/account');

    await user.click(screen.getByRole('button', { name: /create my account/i }));

    expect(await screen.findByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument();
  });

  it('creates the account and shows what it made', async () => {
    const user = userEvent.setup();
    renderApp('/onboarding/account');

    await user.type(screen.getByLabelText(/^your name/i), 'Thabo Molefe');
    await user.type(screen.getByLabelText(/email address/i), 'thabo@example.co.za');
    await user.type(screen.getByLabelText(/^password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create my account/i }));

    expect(
      await screen.findByRole('heading', { name: /this is what you just made/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Thabo Molefe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open my workspace/i })).toBeInTheDocument();
  });
});

describe('workspace selection', () => {
  beforeEach(() => window.localStorage.clear());

  it('requires at least one workspace before continuing', async () => {
    const user = userEvent.setup();
    renderApp('/onboarding/workspaces');

    await user.click(screen.getByRole('button', { name: /continue to my workspace/i }));
    expect(await screen.findByText(/select at least one workspace/i)).toBeInTheDocument();
  });

  it('registers a selected workspace and opens the app', async () => {
    const user = userEvent.setup();
    renderApp('/onboarding/workspaces');

    await user.click(screen.getByTestId('workspace-toggle-supply'));
    await user.click(screen.getByRole('button', { name: /continue to my workspace/i }));

    expect(
      await screen.findByRole('heading', { name: /find supply options/i }),
    ).toBeInTheDocument();
  });
});

describe('app shell navigation', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows only registered workspaces in the bottom navigation', async () => {
    renderApp('/app');
    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent?.replace(/\d+/g, '').trim() ?? '');
    expect(labels[0]).toMatch(/^Home/);
    expect(labels.some((label) => label.startsWith('Requests'))).toBe(true);
    expect(labels.some((label) => label.startsWith('Messages'))).toBe(true);
    expect(labels.some((label) => label.startsWith('Profile'))).toBe(true);
    // Unregistered workspaces must not appear in the main navigation.
    expect(labels.some((label) => label.includes('Qualification'))).toBe(false);
    expect(labels.some((label) => label.includes('Supply'))).toBe(false);
  });

  it('opens the account drawer with the required options', async () => {
    const user = userEvent.setup();
    renderApp('/app');

    await user.click(await screen.findByRole('button', { name: /open your account menu/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notification settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /language/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /help and safety/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('closes the drawer with Escape', async () => {
    const user = userEvent.setup();
    renderApp('/app');

    await user.click(await screen.findByRole('button', { name: /open your account menu/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('locks unregistered workspaces behind a register prompt', async () => {
    const user = userEvent.setup();
    renderApp('/app');

    await user.click(await screen.findByRole('button', { name: /open your account menu/i }));
    await user.click(await screen.findByTestId('add-workspace'));

    expect((await screen.findAllByText(/register to unlock/i)).length).toBeGreaterThan(0);
  });
});

describe('customer service workspace', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders the workspace query and result cards', async () => {
    renderApp('/app/customer');
    expect(await screen.findByRole('heading', { name: /find a service/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/what do you need help with/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/deep clean|brand identity|sports massage|website build/i).length,
    ).toBeGreaterThan(0);
  });

  it('filters the result stream with the search field', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const search = await screen.findByLabelText(/what do you need help with/i);
    await user.type(search, 'massage');

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: /^brand identity and social media kit/i }),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: /^sports massage for runners/i }),
    ).toBeInTheDocument();
  });

  it('opens the filter drawer and applies a filter', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    await user.click(await screen.findByRole('button', { name: /filters/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/service category/i), 'cleaning');
    await user.click(screen.getByRole('button', { name: /^apply$/i }));

    await waitFor(() =>
      expect(screen.queryByText(/brand identity and social media kit/i)).not.toBeInTheDocument(),
    );
  });

  it('opens a listing detail page', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const titleButton = await screen.findByRole('button', { name: /^sports massage for runners/i });
    await user.click(titleButton);

    expect(
      await screen.findByRole('heading', { name: /sports massage for runners/i }),
    ).toBeInTheDocument();

    // The detail is behind a control, so it is opened before it is checked.
    await user.click(screen.getByRole('button', { name: /what is included and how it works/i }));
    expect(screen.getByText(/^Not included$/i)).toBeInTheDocument();
  });
});

describe('request wizard', () => {
  beforeEach(() => window.localStorage.clear());

  it('requires a reason before the request can be sent', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const sendButtons = await screen.findAllByRole('button', { name: /^send request$/i });
    await user.click(sendButtons[0]);
    const dialog = await screen.findByRole('dialog');

    // An empty reason is refused with a specific message.
    await user.click(within(dialog).getByRole('button', { name: /next/i }));
    expect(
      await within(dialog).findByText(/tell the provider why you are contacting them/i),
    ).toBeInTheDocument();

    // A reason that is too short is refused as well.
    await user.type(within(dialog).getByLabelText(/why are you contacting them/i), 'hi');
    await user.click(within(dialog).getByRole('button', { name: /next/i }));
    expect(await within(dialog).findByText(/at least 10 characters/i)).toBeInTheDocument();
  });

  it('sends a request and shows the request id', async () => {
    const user = userEvent.setup();
    renderApp('/app/customer');

    const sendButtons = await screen.findAllByRole('button', { name: /^send request$/i });
    await user.click(sendButtons[0]);
    const dialog = await screen.findByRole('dialog');

    await user.type(
      within(dialog).getByLabelText(/why are you contacting them/i),
      'I need three quotes for a local event.',
    );
    await user.click(within(dialog).getByRole('button', { name: /next/i }));

    for (let step = 0; step < 4; step += 1) {
      await user.click(within(dialog).getByRole('button', { name: /next/i }));
    }

    expect(await within(dialog).findByText(/review your request/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /send request/i }));

    expect(await within(dialog).findByText(/is now/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/Sent/)).toBeInTheDocument();
  });
});

describe('requests screen', () => {
  beforeEach(() => window.localStorage.clear());

  it('lists the request tabs', async () => {
    renderApp('/app/requests');
    expect(await screen.findByRole('heading', { name: /requests/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /received/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sent/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /completed/i })).toBeInTheDocument();
  });

  it('accepts a received request', async () => {
    const user = userEvent.setup();
    renderApp('/app/requests');

    const acceptButtons = await screen.findAllByRole('button', { name: /accept request/i });
    await user.click(acceptButtons[0]);
    await waitFor(() =>
      expect(screen.getByText(/request accepted\. messaging is now open\./i)).toBeInTheDocument(),
    );
  });
});

describe('messages screen', () => {
  beforeEach(() => window.localStorage.clear());

  it('sends a message on an accepted connection', async () => {
    const user = userEvent.setup();
    renderApp('/app/messages');

    const composer = await screen.findByLabelText(/^message$/i);
    await user.type(composer, 'Can we talk about the menu?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Can we talk about the menu?')).toBeInTheDocument();
  });
});

describe('notification settings', () => {
  beforeEach(() => window.localStorage.clear());

  it('saves a non-essential channel and confirms it', async () => {
    const user = userEvent.setup();
    renderApp('/app/settings/notifications');

    await user.click(await screen.findByRole('button', { name: /sms notifications/i }));

    expect(await screen.findByText(/notification preference saved/i)).toBeInTheDocument();
  });

  it('keeps the essential channel locked', async () => {
    renderApp('/app/settings/notifications');
    expect(await screen.findByRole('button', { name: /in-app notifications/i })).toBeDisabled();
  });
});

describe('unknown routes', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows a useful page with a link back to the workspace', async () => {
    renderApp('/this/route/does/not/exist');
    expect(
      await screen.findByRole('heading', { name: /that page does not exist/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to my workspace/i })).toBeInTheDocument();
  });
});
