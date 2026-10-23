import type { AccentName, AccountType, AppState, Intent, Listing, Workspace } from '@/data/types';
import type { StoreState } from '@/state/actions';

export const WORKSPACE_ORDER: Workspace[] = [
  'customer',
  'qualification',
  'collaboration',
  'supply',
];

export const WORKSPACE_LABEL: Record<Workspace, string> = {
  customer: 'Customer Service',
  qualification: 'Qualification / Jobs',
  collaboration: 'Collaboration',
  supply: 'Supply',
};

export const WORKSPACE_PURPOSE: Record<Workspace, string> = {
  customer: 'Find or offer everyday services.',
  qualification: 'Connect qualified people with opportunities.',
  collaboration: 'Build a team or a partnership.',
  supply: 'Find supply options and compare routes.',
};

export const WORKSPACE_ACCENT_VAR: Record<Workspace, string> = {
  customer: 'var(--workspace-customer)',
  qualification: 'var(--workspace-qualification)',
  collaboration: 'var(--workspace-collaboration)',
  supply: 'var(--workspace-supply)',
};

/** The accent name each workspace carries. */
export const WORKSPACE_ACCENT: Record<Workspace, AccentName> = {
  customer: 'blue',
  qualification: 'green',
  collaboration: 'violet',
  supply: 'amber',
};

/**
 * The accent each primary navigation area carries.
 *
 * Every area is a different family, so a member can tell them apart at a
 * glance, and the set was chosen so the hues stay separable under
 * deuteranopia, protanopia and tritanopia. Warm, cool and deep families
 * are spread across the four so the bar never reads as one colour.
 */
export const NAV_ACCENT = {
  home: 'blue',
  requests: 'clay',
  messages: 'teal',
  profile: 'plum',
} as const satisfies Record<string, AccentName>;

/** Every accent a member can choose, with the name shown in the picker. */
export const ACCENT_CHOICES: { name: AccentName; label: string }[] = [
  { name: 'amber', label: 'Amber' },
  { name: 'blue', label: 'Blue' },
  { name: 'teal', label: 'Teal' },
  { name: 'green', label: 'Green' },
  { name: 'clay', label: 'Clay' },
  { name: 'violet', label: 'Violet' },
  { name: 'plum', label: 'Plum' },
];

/**
 * The workspace an account opens into, worked out from the two onboarding
 * answers. It is a suggestion, not a rule: the account can register more
 * workspaces later, and the rail lets them switch.
 */
export const workspaceForOnboarding = (intent: Intent, accountType: AccountType): Workspace => {
  if (intent === 'buy') return accountType === 'business' ? 'collaboration' : 'customer';
  return accountType === 'business' ? 'supply' : 'qualification';
};

export const WORKSPACE_HOME_ROUTE: Record<Workspace, string> = {
  customer: '/app/customer',
  qualification: '/app/qualification',
  collaboration: '/app/collaboration',
  supply: '/app/supply',
};

export const selectApp = (state: StoreState): AppState => state.app;

export const selectUser = (state: StoreState) => state.app.user;

export const selectRegisteredWorkspaces = (state: StoreState): Workspace[] =>
  state.app.user?.registeredWorkspaces ?? [];

export const selectUnregisteredWorkspaces = (state: StoreState): Workspace[] =>
  WORKSPACE_ORDER.filter((workspace) => !selectRegisteredWorkspaces(state).includes(workspace));

export const selectActiveWorkspace = (state: StoreState): Workspace =>
  state.app.user?.lastUsedWorkspace ??
  state.app.activeWorkspace ??
  selectRegisteredWorkspaces(state)[0] ??
  'customer';

export const selectListingsForWorkspace = (state: StoreState, workspace: Workspace): Listing[] =>
  state.app.listings.filter((listing) => listing.workspace === workspace);

export const selectListingById = (state: StoreState, id: string): Listing | undefined =>
  state.app.listings.find((listing) => listing.id === id);

export const selectSavedListings = (state: StoreState): Listing[] =>
  state.app.listings.filter((listing) => state.app.savedListingIds.includes(listing.id));

export const selectIsSaved = (state: StoreState, id: string): boolean =>
  state.app.savedListingIds.includes(id);

export const selectRequestsSentBy = (state: StoreState, userId: string) =>
  state.app.requests.filter((request) => request.senderId === userId);

export const selectRequestsReceivedBy = (state: StoreState, userId: string) =>
  state.app.requests.filter((request) => request.receiverId === userId);

export const selectThreadsForUser = (state: StoreState, userId: string) =>
  state.app.threads.filter((thread) => thread.participantIds.includes(userId));

export const selectReports = (state: StoreState) => state.app.reports;

export const selectPendingRequestCount = (state: StoreState, userId: string): number =>
  state.app.requests.filter(
    (request) =>
      request.receiverId === userId && (request.state === 'sent' || request.state === 'viewed'),
  ).length;

export const selectVerificationStateFor = (state: StoreState, workspace: Workspace) =>
  state.app.user?.verificationByWorkspace[workspace] ?? 'not_started';

export interface Achievement {
  id: string;
  label: string;
  /** What the member did to earn it. */
  detail: string;
  state: 'earned' | 'locked';
  /** How far along the member is, 0 to 1. Locked achievements show this. */
  progress: number;
}

/**
 * Badges earned from what the member has actually done in the prototype.
 * Every value is derived from the mock store, so the list is deterministic
 * and never claims something that did not happen.
 */
export const selectAchievements = (state: StoreState): Achievement[] => {
  const user = state.app.user;
  const userId = user?.id ?? '';
  const sent = state.app.requests.filter((request) => request.senderId === userId);
  const accepted = state.app.requests.filter(
    (request) =>
      (request.receiverId === userId || request.senderId === userId) &&
      request.state === 'accepted',
  );
  const openThreads = state.app.threads.filter((thread) => thread.canMessage);
  const comparedQuotes = state.app.quotes.filter((quote) => quote.state !== 'draft');
  const partnerCount = state.app.collaborations.filter(
    (collaboration) =>
      collaboration.agreementState === 'terms_accepted' ||
      collaboration.agreementState === 'scheduled' ||
      collaboration.agreementState === 'in_progress',
  ).length;

  const earned = [
    {
      id: 'first-request',
      label: 'First request',
      detail: 'You sent your first request to a provider.',
      done: sent.length >= 1,
      progress: Math.min(1, sent.length),
    },
    {
      id: 'accepted',
      label: 'Handshake',
      detail: 'A request you sent was accepted.',
      done: accepted.length >= 1,
      progress: Math.min(1, accepted.length),
    },
    {
      id: 'conversation',
      label: 'In conversation',
      detail: 'You opened a live conversation with someone.',
      done: openThreads.length >= 1,
      progress: Math.min(1, openThreads.length),
    },
    {
      id: 'shortlist',
      label: 'Shortlist',
      detail: 'You saved three listings for later.',
      done: state.app.savedListingIds.length >= 3,
      progress: Math.min(1, state.app.savedListingIds.length / 3),
    },
    {
      id: 'routes',
      label: 'Route reader',
      detail: 'You compared a supply quote from a supplier.',
      done: comparedQuotes.length >= 1,
      progress: Math.min(1, comparedQuotes.length),
    },
    {
      id: 'partner',
      label: 'Partnership',
      detail: 'You agreed terms with a partner.',
      done: partnerCount >= 1,
      progress: Math.min(1, partnerCount),
    },
    {
      id: 'demo',
      label: 'Demo checked',
      detail: 'You walked through the demo verification.',
      done: state.app.verificationDemo.demoVerified,
      progress: state.app.verificationDemo.demoVerified ? 1 : 0,
    },
  ];

  return earned.map((item) => ({
    id: item.id,
    label: item.label,
    detail: item.detail,
    state: item.done ? 'earned' : 'locked',
    progress: item.done ? 1 : item.progress,
  }));
};

/** Workspace label for a workspace the user has not registered yet. */
export const selectWorkspaceDisplayName = (workspace: Workspace): string =>
  WORKSPACE_LABEL[workspace];
