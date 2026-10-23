import type {
  AccountType,
  AgreementState,
  AppState,
  Collaboration,
  ConnectionRequest,
  ConnectionState,
  DemoVerificationState,
  Listing,
  MessageThread,
  NotificationChannel,
  OnboardingState,
  ProfilePreferences,
  QuoteState,
  Report,
  ReportStatus,
  SupplyQuote,
  ThreadMessage,
  User,
  VerificationState,
  Workspace,
} from '@/data/types';

/** Every state-changing operation reports success or a readable error. */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface StoreState {
  app: AppState;
  /** Keys of in-flight operations, used for pending UI and double-submit protection. */
  pending: string[];
  toasts: ToastMessage[];
  /** Non-blocking notice shown when stored state could not be read. */
  resetNotice: string | null;
}

export type StoreAction =
  | { type: 'set_user'; user: User }
  | { type: 'add_listing'; listing: Listing }
  | { type: 'set_workspaces'; workspaces: Workspace[] }
  | { type: 'set_verification_state'; workspace: Workspace; state: VerificationState }
  | { type: 'set_active_workspace'; workspace: Workspace }
  | { type: 'add_request'; request: ConnectionRequest }
  | { type: 'set_request_state'; id: string; state: ConnectionState }
  | { type: 'add_message'; threadId: string; message: ThreadMessage }
  | { type: 'toggle_save'; listingId: string }
  | { type: 'add_report'; report: Report }
  | { type: 'set_report_status'; id: string; status: ReportStatus; assignedRole: string | null }
  | { type: 'update_collaboration'; id: string; agreementState?: AgreementState }
  | { type: 'update_collaboration_member'; id: string; userId: string }
  | { type: 'update_quote'; id: string; state?: QuoteState }
  | { type: 'set_notification'; channel: NotificationChannel; enabled: boolean }
  | { type: 'set_verification_demo'; patch: Partial<DemoVerificationState> }
  | { type: 'set_preferences'; patch: Partial<ProfilePreferences> }
  | { type: 'set_onboarding'; patch: Partial<OnboardingState> }
  | { type: 'push_toast'; toast: ToastMessage }
  | { type: 'dismiss_toast'; id: string }
  | { type: 'set_pending'; key: string; active: boolean }
  | { type: 'set_reset_notice'; notice: string | null }
  | { type: 'reset_all'; state: StoreState };

/* ------------------------------------------------------------------ creators */

export const createUser = (
  name: string,
  email: string,
  accountType: AccountType,
  businessName: string | undefined,
  id: string,
): User => ({
  id,
  name,
  email,
  accountType,
  ...(businessName ? { businessName } : {}),
  registeredWorkspaces: [],
  verificationByWorkspace: {
    customer: 'not_started',
    qualification: 'not_started',
    collaboration: 'not_started',
    supply: 'not_started',
  },
  contactVisibility: 'private',
  location: 'Cape Town',
  avatarInitials: name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
});

export const setUser = (user: User): StoreAction => ({ type: 'set_user', user });

export const addListing = (listing: Listing): StoreAction => ({ type: 'add_listing', listing });

export const setOnboarding = (patch: Partial<OnboardingState>): StoreAction => ({
  type: 'set_onboarding',
  patch,
});

export const setWorkspaces = (workspaces: Workspace[]): StoreAction => ({
  type: 'set_workspaces',
  workspaces,
});

export const setActiveWorkspace = (workspace: Workspace): StoreAction => ({
  type: 'set_active_workspace',
  workspace,
});

export const setVerificationState = (
  workspace: Workspace,
  state: VerificationState,
): StoreAction => ({ type: 'set_verification_state', workspace, state });

export const addRequest = (request: ConnectionRequest): StoreAction => ({
  type: 'add_request',
  request,
});

export const setRequestState = (id: string, state: ConnectionState): StoreAction => ({
  type: 'set_request_state',
  id,
  state,
});

export const addMessage = (threadId: string, message: ThreadMessage): StoreAction => ({
  type: 'add_message',
  threadId,
  message,
});

export const toggleSave = (listingId: string): StoreAction => ({
  type: 'toggle_save',
  listingId,
});

export const addReport = (report: Report): StoreAction => ({ type: 'add_report', report });

export const setReportStatus = (
  id: string,
  status: ReportStatus,
  assignedRole: string | null,
): StoreAction => ({ type: 'set_report_status', id, status, assignedRole });

export const updateCollaboration = (id: string, agreementState?: AgreementState): StoreAction => ({
  type: 'update_collaboration',
  id,
  agreementState,
});

export const updateCollaborationMember = (id: string, userId: string): StoreAction => ({
  type: 'update_collaboration_member',
  id,
  userId,
});

export const updateQuote = (id: string, state?: QuoteState): StoreAction => ({
  type: 'update_quote',
  id,
  state,
});

export const setNotification = (channel: NotificationChannel, enabled: boolean): StoreAction => ({
  type: 'set_notification',
  channel,
  enabled,
});

export const setVerificationDemo = (patch: Partial<DemoVerificationState>): StoreAction => ({
  type: 'set_verification_demo',
  patch,
});

export const setPreferences = (patch: Partial<ProfilePreferences>): StoreAction => ({
  type: 'set_preferences',
  patch,
});

export const pushToast = (toast: ToastMessage): StoreAction => ({
  type: 'push_toast',
  toast,
});

export const dismissToast = (id: string): StoreAction => ({ type: 'dismiss_toast', id });

export const setPending = (key: string, active: boolean): StoreAction => ({
  type: 'set_pending',
  key,
  active,
});

export const setResetNotice = (notice: string | null): StoreAction => ({
  type: 'set_reset_notice',
  notice,
});

export const resetAll = (state: StoreState): StoreAction => ({ type: 'reset_all', state });

/* ------------------------------------------------------------- shared shapes */

export type { AppState, Collaboration, ConnectionRequest, Listing, MessageThread, SupplyQuote };
