import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ActionsProvider, StoreProvider, useActions, useStore } from '@/state/store';
import { resolveRequestActions } from '@/state/requestTransitions';

const wrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>
    <ActionsProvider>{children}</ActionsProvider>
  </StoreProvider>
);

const setup = () => {
  const store = renderHook(() => ({ store: useStore(), actions: useActions() }), { wrapper });
  return store;
};

const actAsync = async <T,>(fn: () => Promise<T>): Promise<T> => {
  let value!: T;
  await act(async () => {
    value = await fn();
  });
  return value;
};

describe('connection request transitions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('accepts a sent request and marks it accepted', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.acceptRequest('req-1'));
    expect(response.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-1')?.state,
    ).toBe('accepted');
  });

  it('refuses to accept a request that is already expired', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.acceptRequest('req-5'));
    expect(response.ok).toBe(false);
    if (!response.ok) expect(response.error).toMatch(/cannot be accepted/i);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-5')?.state,
    ).toBe('expired');
  });

  it('declines a viewed request', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.declineRequest('req-2', 'Not available'),
    );
    expect(response.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-2')?.state,
    ).toBe('declined');
  });

  it('refuses to decline an accepted request', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.declineRequest('req-3'));
    expect(response.ok).toBe(false);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-3')?.state,
    ).toBe('accepted');
  });

  it('ignores a request and moves it to expired', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.ignoreRequest('req-1'));
    expect(response.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-1')?.state,
    ).toBe('expired');
  });

  it('cancels a sent request', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.cancelRequest('req-1'));
    expect(response.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-1')?.state,
    ).toBe('cancelled');
  });

  it('completes only an accepted connection', async () => {
    const { result } = setup();
    const failed = await actAsync(() => result.current.actions.completeRequest('req-1'));
    expect(failed.ok).toBe(false);

    const succeeded = await actAsync(() => result.current.actions.completeRequest('req-3'));
    expect(succeeded.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-3')?.state,
    ).toBe('completed');
  });

  it('blocks a request', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.blockTarget({
        targetType: 'request',
        targetId: 'req-1',
      }),
    );
    expect(response.ok).toBe(true);
    expect(
      result.current.store.state.app.requests.find((request) => request.id === 'req-1')?.state,
    ).toBe('blocked');
  });

  it('protects against a double submit while an action is pending', async () => {
    const { result } = setup();
    const [first, second] = await Promise.all([
      result.current.actions.acceptRequest('req-1'),
      result.current.actions.acceptRequest('req-1'),
    ]);
    const outcomes = [first.ok, second.ok].sort();
    expect(outcomes).toEqual([false, true]);
  });
});

describe('request action map', () => {
  it('offers the receiver only the actions allowed by the state', () => {
    expect(resolveRequestActions('sent', 'received')).toEqual(['accept', 'decline', 'ignore']);
    expect(resolveRequestActions('sent', 'sent')).toEqual(['cancel']);
    expect(resolveRequestActions('accepted', 'received')).toEqual(['complete']);
    expect(resolveRequestActions('accepted', 'sent')).toEqual(['complete']);
  });

  it('offers no actions on a closed request', () => {
    expect(resolveRequestActions('expired', 'received')).toEqual([]);
    expect(resolveRequestActions('completed', 'sent')).toEqual([]);
    expect(resolveRequestActions('reported', 'received')).toEqual([]);
  });
});

describe('messaging rules', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('sends a message on an accepted thread', async () => {
    const { result } = setup();
    const before = result.current.store.state.app.threads[0].messages.length;
    const response = await actAsync(() =>
      result.current.actions.sendMessage('thr-1', 'Hello there'),
    );
    expect(response.ok).toBe(true);
    expect(result.current.store.state.app.threads[0].messages.length).toBe(before + 1);
  });

  it('refuses an empty message', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.sendMessage('thr-1', '   '));
    expect(response.ok).toBe(false);
  });
});

describe('saved listings', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('adds and removes a listing from the saved set', async () => {
    const { result } = setup();
    expect(result.current.store.state.app.savedListingIds).not.toContain('lst-cust-3');
    await actAsync(() => result.current.actions.toggleSave('lst-cust-3'));
    expect(result.current.store.state.app.savedListingIds).toContain('lst-cust-3');
    await actAsync(() => result.current.actions.toggleSave('lst-cust-3'));
    expect(result.current.store.state.app.savedListingIds).not.toContain('lst-cust-3');
  });
});

describe('collaboration agreement transitions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('accepts terms only when terms are proposed', async () => {
    const { result } = setup();
    const failed = await actAsync(() => result.current.actions.acceptTerms('col-2'));
    expect(failed.ok).toBe(false);

    const succeeded = await actAsync(() => result.current.actions.acceptTerms('col-1'));
    expect(succeeded.ok).toBe(true);
    expect(
      result.current.store.state.app.collaborations.find((c) => c.id === 'col-1')?.agreementState,
    ).toBe('terms_accepted');
  });

  it('approves a pending member', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.approveMember('col-1', 'user-rian'),
    );
    expect(response.ok).toBe(true);
    const collaboration = result.current.store.state.app.collaborations.find(
      (c) => c.id === 'col-1',
    );
    expect(collaboration?.members.find((m) => m.userId === 'user-rian')?.state).toBe('accepted');
  });

  it('refuses to approve a member that is already accepted', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.approveMember('col-1', 'user-lerato'),
    );
    expect(response.ok).toBe(false);
  });
});

describe('supply quote transitions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('selects a quote that has been received', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.selectQuote('quote-1'));
    expect(response.ok).toBe(true);
    expect(result.current.store.state.app.quotes.find((q) => q.id === 'quote-1')?.state).toBe(
      'selected',
    );
  });

  it('requests an alternative from a received quote', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.requestAlternative('quote-1'));
    expect(response.ok).toBe(true);
    expect(result.current.store.state.app.quotes.find((q) => q.id === 'quote-1')?.state).toBe(
      'alternative_requested',
    );
  });

  it('refuses to select a quote that is still being prepared', async () => {
    const { result } = setup();
    await actAsync(() => result.current.actions.requestAlternative('quote-1'));
    const response = await actAsync(() => result.current.actions.selectQuote('quote-1'));
    expect(response.ok).toBe(false);
  });
});

describe('notification settings', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves a non-essential channel immediately', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.setNotificationChannel('sms', true),
    );
    expect(response.ok).toBe(true);
    expect(result.current.store.state.app.notifications.channels.sms).toBe(true);
  });

  it('refuses to disable an essential channel', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.setNotificationChannel('in_app', false),
    );
    expect(response.ok).toBe(false);
    expect(result.current.store.state.app.notifications.channels.in_app).toBe(true);
  });
});

describe('reporting', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('records a report with an audit event', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.reportTarget({
        targetType: 'listing',
        targetId: 'lst-cust-3',
        reason: 'unsafe_service',
        details: 'A written reason that is long enough to be accepted by validation.',
      }),
    );
    expect(response.ok).toBe(true);
    const report = result.current.store.state.app.reports[0];
    expect(report.status).toBe('submitted');
    expect(report.auditEvents.length).toBeGreaterThan(0);
  });

  it('refuses a report without enough detail', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.reportTarget({
        targetType: 'listing',
        targetId: 'lst-cust-3',
        reason: 'other',
        details: 'too short',
      }),
    );
    expect(response.ok).toBe(false);
  });
});

describe('registration and workspace registration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('refuses a registration with an invalid email', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.registerAccount({
        name: 'Test Person',
        email: 'not-an-email',
        password: 'password123',
        accountType: 'personal',
      }),
    );
    expect(response.ok).toBe(false);
  });

  it('refuses a registration with a short password', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.registerAccount({
        name: 'Test Person',
        email: 'test@example.co.za',
        password: 'short',
        accountType: 'personal',
      }),
    );
    expect(response.ok).toBe(false);
  });

  it('registers workspaces and never creates a verification by itself', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.selectWorkspaces(['supply']));
    expect(response.ok).toBe(true);
    const user = result.current.store.state.app.user;
    expect(user?.registeredWorkspaces).toEqual(['supply']);
    expect(user?.verificationByWorkspace.supply).toBe('pending');
  });

  it('refuses to continue with no workspace selected', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.selectWorkspaces([]));
    expect(response.ok).toBe(false);
  });

  it('refuses to switch to a workspace that is not registered', async () => {
    const { result } = setup();
    const response = await actAsync(() => result.current.actions.switchWorkspace('supply'));
    expect(response.ok).toBe(false);
    if (!response.ok) expect(response.error).toMatch(/unlock/i);
  });
});

describe('listing creation', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates a listing that starts as pending review', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.createListing({
        workspace: 'customer',
        title: 'Garden maintenance service',
        description: 'A weekly garden maintenance service for small gardens and courtyards.',
        location: 'Cape Town',
        reach: 'local',
        availability: 'Next week',
        priceMode: 'starting_price',
        priceLabel: 'From R250',
        included: 'Lawn cutting',
        excluded: '',
        serviceCategory: 'cleaning',
        serviceType: 'in_person',
      }),
    );
    expect(response.ok).toBe(true);
    const created = result.current.store.state.app.listings[0];
    expect(created.title).toBe('Garden maintenance service');
    expect(created.status).toBe('pending_review');
    expect(created.verificationBadges).toHaveLength(0);
  });

  it('refuses a listing with a too-short description', async () => {
    const { result } = setup();
    const response = await actAsync(() =>
      result.current.actions.createListing({
        workspace: 'customer',
        title: 'Garden maintenance service',
        description: 'short',
        location: 'Cape Town',
        reach: 'local',
        availability: 'Next week',
        priceMode: 'quote_required',
        priceLabel: '',
        included: '',
        excluded: '',
      }),
    );
    expect(response.ok).toBe(false);
  });
});

describe('storage recovery', () => {
  it('discards corrupted stored state and shows a non-blocking notice', async () => {
    window.localStorage.setItem('linkhive.state.v1', '{ this is not json');
    const { result } = setup();
    expect(result.current.store.state.resetNotice).toMatch(/reset/i);
    expect(result.current.store.state.app.listings.length).toBeGreaterThan(0);
  });

  it('restores stored state on a later session', async () => {
    window.localStorage.clear();
    const first = setup();
    await act(async () => {
      await first.result.current.actions.toggleSave('lst-cust-4');
    });
    const second = setup();
    expect(second.result.current.store.state.app.savedListingIds).toContain('lst-cust-4');
  });
});
