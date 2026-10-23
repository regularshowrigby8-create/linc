import type { AppState, Listing, Workspace } from '@/data/types';
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

/** Workspace label for a workspace the user has not registered yet. */
export const selectWorkspaceDisplayName = (workspace: Workspace): string =>
  WORKSPACE_LABEL[workspace];
