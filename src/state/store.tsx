import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type {
  AppState,
  Collaboration,
  CollaborationCategory,
  ConnectionRequest,
  ConnectionState,
  Listing,
  MessageThread,
  NotificationChannel,
  OpportunityType,
  Reach,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  ServiceCategory,
  ServiceType,
  SupplyQuote,
  User,
  Workspace,
} from '@/data/types';
import { mockCollaborations, mockQuotes, mockReports } from '@/data/mock/collaborations';
import { mockListings } from '@/data/mock/listings';
import { mockCurrentUser, mockNotificationSettings } from '@/data/mock/users';
import { mockRequests, mockThreads } from '@/data/mock/requests';
import {
  addListing,
  addMessage,
  addReport,
  addRequest,
  createUser,
  dismissToast,
  pushToast,
  setActiveWorkspace,
  setNotification,
  setPending,
  setReportStatus,
  setRequestState,
  setResetNotice,
  setUser,
  setVerificationDemo,
  setWorkspaces,
  toggleSave,
  updateCollaboration,
  updateCollaborationMember,
  updateQuote,
  type ActionResult,
  type StoreAction,
  type StoreState,
  type ToastMessage,
} from '@/state/actions';

/** Simulated latency for actions that need pending feedback. */
export const ACTION_DELAY_MS = 250;
const STORAGE_KEY = 'linkhive.state.v1';

export const createInitialState = (): StoreState => ({
  app: {
    user: { ...mockCurrentUser },
    registered: true,
    listings: mockListings,
    requests: mockRequests,
    threads: mockThreads,
    collaborations: mockCollaborations,
    quotes: mockQuotes,
    reports: mockReports,
    savedListingIds: ['lst-cust-1', 'lst-sup-2'],
    activeWorkspace: mockCurrentUser.lastUsedWorkspace ?? 'customer',
    notifications: mockNotificationSettings,
    verificationDemo: {
      step: 'explain',
      sampleId: null,
      result: null,
      demoVerified: false,
      auditEvents: [],
    },
  },
  pending: [],
  toasts: [],
  resetNotice: null,
});

const reducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'set_user':
      return { ...state, app: { ...state.app, user: action.user } };

    case 'set_workspaces': {
      const user = state.app.user;
      if (!user) return state;
      const previous = user.registeredWorkspaces;
      const added = action.workspaces.filter((w) => !previous.includes(w));
      const verificationByWorkspace = { ...user.verificationByWorkspace };
      for (const workspace of added) {
        verificationByWorkspace[workspace] = 'pending';
      }
      const nextUser: User = {
        ...user,
        registeredWorkspaces: action.workspaces,
        verificationByWorkspace,
        lastUsedWorkspace: action.workspaces[0] ?? user.lastUsedWorkspace,
      };
      return {
        ...state,
        app: {
          ...state.app,
          user: nextUser,
          registered: true,
          activeWorkspace: nextUser.lastUsedWorkspace ?? state.app.activeWorkspace,
        },
      };
    }

    case 'set_verification_state': {
      const user = state.app.user;
      if (!user) return state;
      return {
        ...state,
        app: {
          ...state.app,
          user: {
            ...user,
            verificationByWorkspace: {
              ...user.verificationByWorkspace,
              [action.workspace]: action.state,
            },
          },
        },
      };
    }

    case 'set_active_workspace':
      return {
        ...state,
        app: {
          ...state.app,
          activeWorkspace: action.workspace,
          user: state.app.user ? { ...state.app.user, lastUsedWorkspace: action.workspace } : null,
        },
      };

    case 'add_request':
      return { ...state, app: { ...state.app, requests: [action.request, ...state.app.requests] } };

    case 'add_listing':
      return { ...state, app: { ...state.app, listings: [action.listing, ...state.app.listings] } };

    case 'set_request_state':
      return {
        ...state,
        app: {
          ...state.app,
          requests: state.app.requests.map((request) =>
            request.id === action.id
              ? { ...request, state: action.state, updatedAt: new Date().toISOString() }
              : request,
          ),
        },
      };

    case 'add_message':
      return {
        ...state,
        app: {
          ...state.app,
          threads: state.app.threads.map((thread) =>
            thread.id === action.threadId
              ? {
                  ...thread,
                  messages: [...thread.messages, action.message],
                  lastMessageAt: action.message.sentAt,
                }
              : thread,
          ),
        },
      };

    case 'toggle_save':
      return {
        ...state,
        app: {
          ...state.app,
          savedListingIds: state.app.savedListingIds.includes(action.listingId)
            ? state.app.savedListingIds.filter((id) => id !== action.listingId)
            : [...state.app.savedListingIds, action.listingId],
        },
      };

    case 'add_report':
      return { ...state, app: { ...state.app, reports: [action.report, ...state.app.reports] } };

    case 'set_report_status':
      return {
        ...state,
        app: {
          ...state.app,
          reports: state.app.reports.map((report) =>
            report.id === action.id
              ? {
                  ...report,
                  status: action.status,
                  assignedRole: action.assignedRole ?? report.assignedRole,
                  auditEvents: [
                    ...report.auditEvents,
                    {
                      id: `aud-${report.auditEvents.length + 1}`,
                      at: new Date().toISOString(),
                      actor: action.assignedRole ?? 'Administrator',
                      action: `Status changed to ${action.status.replace(/_/g, ' ')}`,
                    },
                  ],
                }
              : report,
          ),
        },
      };

    case 'update_collaboration':
      return {
        ...state,
        app: {
          ...state.app,
          collaborations: state.app.collaborations.map((collaboration) =>
            collaboration.id === action.id
              ? {
                  ...collaboration,
                  agreementState: action.agreementState ?? collaboration.agreementState,
                }
              : collaboration,
          ),
        },
      };

    case 'update_collaboration_member':
      return {
        ...state,
        app: {
          ...state.app,
          collaborations: state.app.collaborations.map((collaboration) =>
            collaboration.id === action.id
              ? {
                  ...collaboration,
                  members: collaboration.members.map((member) =>
                    member.userId === action.userId
                      ? { ...member, state: 'accepted', role: 'member' }
                      : member,
                  ),
                  inviteStates: collaboration.inviteStates.map((state_) =>
                    state_ === 'pending' || state_ === 'invited' ? 'accepted' : state_,
                  ),
                }
              : collaboration,
          ),
        },
      };

    case 'update_quote':
      return {
        ...state,
        app: {
          ...state.app,
          quotes: state.app.quotes.map((quote) =>
            quote.id === action.id ? { ...quote, state: action.state ?? quote.state } : quote,
          ),
        },
      };

    case 'set_notification':
      return {
        ...state,
        app: {
          ...state.app,
          notifications: {
            ...state.app.notifications,
            channels: { ...state.app.notifications.channels, [action.channel]: action.enabled },
          },
        },
      };

    case 'set_verification_demo':
      return {
        ...state,
        app: {
          ...state.app,
          verificationDemo: { ...state.app.verificationDemo, ...action.patch },
        },
      };

    case 'push_toast':
      return { ...state, toasts: [...state.toasts, action.toast] };

    case 'dismiss_toast':
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) };

    case 'set_pending':
      return {
        ...state,
        pending: action.active
          ? [...state.pending, action.key]
          : state.pending.filter((key) => key !== action.key),
      };

    case 'set_reset_notice':
      return { ...state, resetNotice: action.notice };

    case 'reset_all':
      return action.state;

    default:
      return state;
  }
};

interface StoreContextValue {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const loadPersistedState = (): { state: StoreState; notice: string | null } => {
  const fallback = createInitialState();
  if (typeof window === 'undefined' || !window.localStorage) {
    return { state: fallback, notice: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: fallback, notice: null };
    // The persisted payload is the app slice itself, not the whole store.
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed.user) return { state: fallback, notice: null };
    return {
      state: { ...fallback, app: { ...fallback.app, ...parsed } },
      notice: null,
    };
  } catch {
    return {
      state: fallback,
      notice: 'Your saved details could not be read, so the demo was reset.',
    };
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    (): StoreState => loadPersistedState().state,
  );
  const noticeRef = useRef<string | null>(null);

  // Show the reset notice once, after mount, so it is never blocking.
  useEffect(() => {
    const { notice } = loadPersistedState();
    if (notice && !noticeRef.current) {
      noticeRef.current = notice;
      dispatch(setResetNotice(notice));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.app));
    } catch {
      /* Storage may be unavailable. The prototype still works in memory. */
    }
  }, [state.app]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider.');
  return context;
};

/* ------------------------------------------------------------------- actions */

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CreateListingInput {
  workspace: Workspace;
  title: string;
  description: string;
  location: string;
  reach: Reach;
  availability: string;
  priceMode: 'starting_price' | 'quote_required' | 'price_range';
  priceLabel: string;
  included: string;
  excluded: string;
  language?: string;
  serviceCategory?: ServiceCategory;
  serviceType?: ServiceType;
  qualificationLevel?: string;
  opportunityType?: OpportunityType;
  collaborationCategory?: CollaborationCategory;
  product?: string;
  quantity?: number;
  deliveryTarget?: string;
}

export interface StoreActions {
  registerAccount: (input: {
    name: string;
    email: string;
    password: string;
    accountType: 'personal' | 'business';
    businessName?: string;
  }) => Promise<ActionResult<User>>;
  selectWorkspaces: (workspaces: Workspace[]) => Promise<ActionResult>;
  switchWorkspace: (workspace: Workspace) => Promise<ActionResult>;
  signOut: () => Promise<ActionResult>;
  resetDemo: () => Promise<ActionResult>;
  sendRequest: (input: {
    listing: Listing;
    reason: string;
    desiredOutcome?: string;
    timing?: string;
    locationBoundaries?: string;
    budgetNote?: string;
  }) => Promise<ActionResult<ConnectionRequest>>;
  acceptRequest: (requestId: string) => Promise<ActionResult>;
  declineRequest: (requestId: string, reason?: string) => Promise<ActionResult>;
  ignoreRequest: (requestId: string) => Promise<ActionResult>;
  cancelRequest: (requestId: string) => Promise<ActionResult>;
  completeRequest: (requestId: string) => Promise<ActionResult>;
  sendMessage: (threadId: string, body: string) => Promise<ActionResult>;
  createListing: (input: CreateListingInput) => Promise<ActionResult<Listing>>;
  toggleSave: (listingId: string) => Promise<ActionResult<{ saved: boolean }>>;
  reportTarget: (input: {
    targetType: ReportTargetType;
    targetId: string;
    reason: ReportReason;
    details: string;
  }) => Promise<ActionResult>;
  setReportStatus: (
    id: string,
    status: ReportStatus,
    assignedRole: string | null,
  ) => Promise<ActionResult>;
  blockTarget: (input: { targetType: ReportTargetType; targetId: string }) => Promise<ActionResult>;
  inviteCollaborator: (collaborationId: string, name: string) => Promise<ActionResult>;
  approveMember: (collaborationId: string, userId: string) => Promise<ActionResult>;
  acceptTerms: (collaborationId: string) => Promise<ActionResult>;
  requestAlternative: (quoteId: string) => Promise<ActionResult>;
  selectQuote: (quoteId: string) => Promise<ActionResult>;
  setNotificationChannel: (channel: NotificationChannel, enabled: boolean) => Promise<ActionResult>;
  runVerificationDemoStep: (
    step: 'document' | 'selfie' | 'result' | 'manual_review' | 'complete',
  ) => Promise<ActionResult>;
  selectDemoSample: (sampleId: 'id_front' | 'id_back') => Promise<ActionResult>;
  setDemoResult: (
    result: 'passed' | 'manual_review' | 'mismatch' | 'rejected',
  ) => Promise<ActionResult>;
  requestManualReview: () => Promise<ActionResult>;
  dismissToast: (id: string) => void;
  dismissResetNotice: () => void;
  isPending: (key: string) => boolean;
}

const ActionsContext = createContext<StoreActions | null>(null);

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatch } = useStore();
  const stateRef = useRef(state);
  stateRef.current = state;
  /** Synchronous mirror of in-flight actions, used for double-submit protection. */
  const pendingRef = useRef<Set<string>>(new Set());

  const toast = useCallback(
    (message: string, tone: ToastMessage['tone']) => {
      dispatch(pushToast({ id: nextId('toast'), message, tone }));
    },
    [dispatch],
  );

  const run = useCallback(
    async <T,>(
      key: string,
      operation: () => ActionResult<T>,
      successMessage?: string,
    ): Promise<ActionResult<T>> => {
      if (pendingRef.current.has(key)) {
        const error = 'This action is already running.';
        toast(error, 'error');
        return { ok: false, error };
      }
      pendingRef.current.add(key);
      dispatch(setPending(key, true));
      try {
        await delay(ACTION_DELAY_MS);
        const result = operation();
        if (result.ok) {
          if (successMessage) toast(successMessage, 'success');
        } else {
          toast(result.error, 'error');
        }
        return result;
      } finally {
        pendingRef.current.delete(key);
        dispatch(setPending(key, false));
      }
    },
    [dispatch, toast],
  );

  const actions = useMemo<StoreActions>(() => {
    const currentUser = () => stateRef.current.app.user;

    return {
      async registerAccount(input) {
        return run(
          'register',
          () => {
            const trimmedName = input.name.trim();
            const trimmedEmail = input.email.trim();
            if (trimmedName.length < 2) return { ok: false, error: 'Enter your name.' };
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
              return { ok: false, error: 'Enter a valid email address.' };
            }
            if (input.password.length < 8) {
              return { ok: false, error: 'Use at least 8 characters.' };
            }
            const user = createUser(
              trimmedName,
              trimmedEmail,
              input.accountType,
              input.accountType === 'business' ? input.businessName?.trim() : undefined,
              nextId('user'),
            );
            dispatch(setUser(user));
            dispatch(setWorkspaces([]));
            return { ok: true, data: user };
          },
          'Account created. Choose what you want to use LinkHive for.',
        );
      },

      async selectWorkspaces(workspaces) {
        return run(
          'workspaces',
          () => {
            if (workspaces.length === 0) {
              return { ok: false, error: 'Select at least one workspace to continue.' };
            }
            dispatch(setWorkspaces(workspaces));
            return { ok: true, data: undefined };
          },
          'Workspace selected.',
        );
      },

      async switchWorkspace(workspace) {
        return run('switch-workspace', () => {
          const user = currentUser();
          if (!user) return { ok: false, error: 'Sign in to switch workspace.' };
          if (!user.registeredWorkspaces.includes(workspace)) {
            return { ok: false, error: 'Register to unlock this workspace.' };
          }
          dispatch(setActiveWorkspace(workspace));
          return { ok: true, data: undefined };
        });
      },

      async signOut() {
        return run('sign-out', () => {
          dispatch(
            setUser({
              ...mockCurrentUser,
              registeredWorkspaces: [],
              verificationByWorkspace: {
                customer: 'not_started',
                qualification: 'not_started',
                collaboration: 'not_started',
                supply: 'not_started',
              },
            }),
          );
          dispatch(setWorkspaces([]));
          return { ok: true, data: undefined };
        });
      },

      async resetDemo() {
        return run(
          'reset',
          () => {
            dispatch({ type: 'reset_all', state: createInitialState() });
            return { ok: true, data: undefined };
          },
          'Demo data reset.',
        );
      },

      async sendRequest(input) {
        return run(
          `request:${input.listing.id}`,
          () => {
            const user = currentUser();
            if (!user) return { ok: false, error: 'Sign in to send a request.' };
            if (input.reason.trim().length < 10) {
              return { ok: false, error: 'Enter a reason of at least 10 characters.' };
            }
            if (input.reason.trim().length > 500) {
              return { ok: false, error: 'Keep the reason under 500 characters.' };
            }
            const now = new Date();
            const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const request: ConnectionRequest = {
              id: nextId('req'),
              listingId: input.listing.id,
              senderId: user.id,
              receiverId: input.listing.ownerId,
              message: input.reason.trim(),
              reason: input.reason.trim(),
              state: 'sent',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              expiresAt: expires.toISOString(),
              workspace: input.listing.workspace,
              ...(input.desiredOutcome?.trim()
                ? { desiredOutcome: input.desiredOutcome.trim() }
                : {}),
              ...(input.timing?.trim() ? { timing: input.timing.trim() } : {}),
              ...(input.locationBoundaries?.trim()
                ? { locationBoundaries: input.locationBoundaries.trim() }
                : {}),
              ...(input.budgetNote?.trim() ? { budgetNote: input.budgetNote.trim() } : {}),
            };
            dispatch(addRequest(request));
            return { ok: true, data: request };
          },
          'Request sent.',
        );
      },

      async acceptRequest(requestId) {
        return run(
          `accept:${requestId}`,
          () => {
            const request = stateRef.current.app.requests.find((r) => r.id === requestId);
            if (!request) return { ok: false, error: 'That request no longer exists.' };
            if (request.state !== 'sent' && request.state !== 'viewed') {
              return { ok: false, error: 'This request cannot be accepted now.' };
            }
            dispatch(setRequestState(requestId, 'accepted'));
            return { ok: true, data: undefined };
          },
          'Request accepted. Messaging is now open.',
        );
      },

      async declineRequest(requestId, reason) {
        return run(
          `decline:${requestId}`,
          () => {
            const request = stateRef.current.app.requests.find((r) => r.id === requestId);
            if (!request) return { ok: false, error: 'That request no longer exists.' };
            if (request.state !== 'sent' && request.state !== 'viewed') {
              return { ok: false, error: 'This request cannot be declined now.' };
            }
            dispatch(setRequestState(requestId, 'declined'));
            if (reason?.trim()) {
              toast('Decline reason recorded.', 'info');
            }
            return { ok: true, data: undefined };
          },
          'Request declined.',
        );
      },

      async ignoreRequest(requestId) {
        return run(
          `ignore:${requestId}`,
          () => {
            const request = stateRef.current.app.requests.find((r) => r.id === requestId);
            if (!request) return { ok: false, error: 'That request no longer exists.' };
            if (request.state !== 'sent' && request.state !== 'viewed') {
              return { ok: false, error: 'This request cannot be ignored now.' };
            }
            dispatch(setRequestState(requestId, 'expired'));
            return { ok: true, data: undefined };
          },
          'Request ignored. It now shows as expired.',
        );
      },

      async cancelRequest(requestId) {
        return run(
          `cancel:${requestId}`,
          () => {
            const request = stateRef.current.app.requests.find((r) => r.id === requestId);
            if (!request) return { ok: false, error: 'That request no longer exists.' };
            if (!['draft', 'sent', 'viewed'].includes(request.state)) {
              return { ok: false, error: 'This request can no longer be cancelled.' };
            }
            dispatch(setRequestState(requestId, 'cancelled'));
            return { ok: true, data: undefined };
          },
          'Request cancelled.',
        );
      },

      async completeRequest(requestId) {
        return run(
          `complete:${requestId}`,
          () => {
            const request = stateRef.current.app.requests.find((r) => r.id === requestId);
            if (!request) return { ok: false, error: 'That request no longer exists.' };
            if (request.state !== 'accepted') {
              return { ok: false, error: 'Only an accepted connection can be completed.' };
            }
            dispatch(setRequestState(requestId, 'completed'));
            return { ok: true, data: undefined };
          },
          'Connection completed. Ratings can now be published.',
        );
      },

      async sendMessage(threadId, body) {
        return run(
          `message:${threadId}`,
          () => {
            const thread = stateRef.current.app.threads.find((t) => t.id === threadId);
            if (!thread) return { ok: false, error: 'That conversation no longer exists.' };
            if (!thread.canMessage) {
              return { ok: false, error: 'Messaging opens after a request is accepted.' };
            }
            const trimmed = body.trim();
            if (trimmed.length === 0) return { ok: false, error: 'Write a message first.' };
            const user = currentUser();
            if (!user) return { ok: false, error: 'Sign in to send a message.' };
            dispatch(
              addMessage(threadId, {
                id: nextId('msg'),
                senderId: user.id,
                body: trimmed,
                sentAt: new Date().toISOString(),
              }),
            );
            return { ok: true, data: undefined };
          },
          'Message sent.',
        );
      },

      async createListing(input) {
        return run(
          `create-listing:${input.workspace}`,
          () => {
            const user = currentUser();
            if (!user) return { ok: false, error: 'Sign in to create a listing.' };
            if (input.title.trim().length < 5) {
              return { ok: false, error: 'Use at least 5 characters for the title.' };
            }
            if (input.description.trim().length < 20) {
              return { ok: false, error: 'Use at least 20 characters for the description.' };
            }
            if (!input.location.trim()) {
              return { ok: false, error: 'Enter a location, or choose Remote.' };
            }
            if (!input.availability.trim()) {
              return { ok: false, error: 'Enter when you are available.' };
            }

            const base = {
              id: nextId('lst'),
              title: input.title.trim(),
              ownerId: user.id,
              ownerName: user.businessName || user.name,
              ownerType:
                user.accountType === 'business' ? ('business' as const) : ('individual' as const),
              location: input.location.trim(),
              reach: input.reach,
              description: input.description.trim(),
              included: input.included
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
              excluded: input.excluded
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
              priceLabel:
                input.priceMode === 'quote_required' ? 'Quote required' : input.priceLabel.trim(),
              quoteRequired: input.priceMode === 'quote_required',
              availability: input.availability.trim(),
              verificationBadges: [],
              rating: 0,
              reviewCount: 0,
              tags: input.language ? [input.language.toLowerCase()] : [],
              createdAt: new Date().toISOString(),
              status: 'pending_review' as const,
            };

            let listing: Listing;
            switch (input.workspace) {
              case 'customer':
                listing = {
                  ...base,
                  workspace: 'customer',
                  serviceCategory: input.serviceCategory ?? 'cleaning',
                  serviceType: input.serviceType ?? 'in_person',
                  responseTimeHours: 12,
                  priceValue: null,
                  currency: 'ZAR',
                };
                break;
              case 'qualification':
                listing = {
                  ...base,
                  workspace: 'qualification',
                  qualificationLevel: input.qualificationLevel ?? 'Certificate',
                  certificateStatus: 'not_verified',
                  opportunityType: input.opportunityType ?? 'contract',
                  field: input.language?.trim() || 'General',
                  remoteOrOnSite: 'remote',
                };
                break;
              case 'collaboration':
                listing = {
                  ...base,
                  workspace: 'collaboration',
                  category: input.collaborationCategory ?? 'defined_service',
                  participantsNeeded: 2,
                  agreementState: 'draft',
                  inviteStates: [],
                  responseTimeHours: 12,
                };
                break;
              case 'supply':
                listing = {
                  ...base,
                  workspace: 'supply',
                  product: input.product?.trim() || input.title.trim(),
                  quantity: input.quantity && input.quantity > 0 ? input.quantity : 1,
                  moq: 1,
                  supplierLocation: input.location.trim(),
                  deliveryWindow: input.deliveryTarget?.trim() || 'To be confirmed',
                  confidence: 'low',
                  estimatedTotal: 0,
                  currency: 'ZAR',
                };
                break;
              default:
                return { ok: false, error: 'That workspace is not available.' };
            }

            dispatch(addListing(listing));
            return { ok: true, data: listing };
          },
          'Listing created. It is marked pending review until evidence is checked.',
        );
      },

      async toggleSave(listingId) {
        return run(`save:${listingId}`, () => {
          const listing = stateRef.current.app.listings.find((l) => l.id === listingId);
          if (!listing) return { ok: false, error: 'That listing no longer exists.' };
          const wasSaved = stateRef.current.app.savedListingIds.includes(listingId);
          dispatch(toggleSave(listingId));
          return { ok: true, data: { saved: !wasSaved } };
        });
      },

      async reportTarget(input) {
        return run(
          `report:${input.targetId}`,
          () => {
            const user = currentUser();
            if (!user) return { ok: false, error: 'Sign in to report.' };
            const details = input.details.trim();
            if (details.length < 20) {
              return { ok: false, error: 'Add at least 20 characters of detail.' };
            }
            if (details.length > 1000) {
              return { ok: false, error: 'Keep the detail under 1000 characters.' };
            }
            dispatch(
              addReport({
                id: nextId('rep'),
                reporterId: user.id,
                targetType: input.targetType,
                targetId: input.targetId,
                reason: input.reason,
                details,
                status: 'submitted',
                assignedRole: null,
                createdAt: new Date().toISOString(),
                auditEvents: [
                  {
                    id: 'aud-1',
                    at: new Date().toISOString(),
                    actor: user.name,
                    action: 'Report submitted for review',
                  },
                ],
              }),
            );
            return { ok: true, data: undefined };
          },
          'Report sent for review.',
        );
      },

      async setReportStatus(id, status, assignedRole) {
        return run(
          `report-status:${id}:${status}`,
          () => {
            const report = stateRef.current.app.reports.find((item) => item.id === id);
            if (!report) return { ok: false, error: 'That report no longer exists.' };
            if (report.status === 'resolved' || report.status === 'dismissed') {
              return { ok: false, error: 'This report has already been closed.' };
            }
            dispatch(setReportStatus(id, status, assignedRole));
            return { ok: true, data: undefined };
          },
          'Report updated.',
        );
      },

      async blockTarget(input) {
        return run(
          `block:${input.targetId}`,
          () => {
            const request = stateRef.current.app.requests.find(
              (r) => r.listingId === input.targetId || r.id === input.targetId,
            );
            if (request) {
              dispatch(setRequestState(request.id, 'blocked'));
            }
            return { ok: true, data: undefined };
          },
          'Blocked. This member can no longer contact you.',
        );
      },

      async inviteCollaborator(collaborationId, name) {
        const trimmed = name.trim();
        return run(
          `invite:${collaborationId}`,
          () => {
            if (trimmed.length < 2) {
              return { ok: false, error: 'Enter the name of the person you are inviting.' };
            }
            const collaboration = stateRef.current.app.collaborations.find(
              (c) => c.id === collaborationId,
            );
            if (!collaboration) return { ok: false, error: 'That collaboration no longer exists.' };
            dispatch(updateCollaboration(collaborationId, 'invitation_sent'));
            return { ok: true, data: undefined };
          },
          `Invitation sent to ${trimmed}.`,
        );
      },

      async approveMember(collaborationId, userId) {
        return run(
          `approve:${userId}`,
          () => {
            const collaboration = stateRef.current.app.collaborations.find(
              (c) => c.id === collaborationId,
            );
            if (!collaboration) return { ok: false, error: 'That collaboration no longer exists.' };
            const member = collaboration.members.find((m) => m.userId === userId);
            if (!member) return { ok: false, error: 'That member is no longer listed.' };
            if (member.state !== 'invited' && member.state !== 'pending') {
              return { ok: false, error: 'This member has already been approved.' };
            }
            dispatch(updateCollaborationMember(collaborationId, userId));
            return { ok: true, data: undefined };
          },
          'Member approved.',
        );
      },

      async acceptTerms(collaborationId) {
        return run(
          `terms:${collaborationId}`,
          () => {
            const collaboration = stateRef.current.app.collaborations.find(
              (c) => c.id === collaborationId,
            );
            if (!collaboration) return { ok: false, error: 'That collaboration no longer exists.' };
            if (collaboration.agreementState !== 'terms_proposed') {
              return { ok: false, error: 'Terms have not been proposed yet.' };
            }
            dispatch(updateCollaboration(collaborationId, 'terms_accepted'));
            return { ok: true, data: undefined };
          },
          'Terms accepted.',
        );
      },

      async requestAlternative(quoteId) {
        return run(
          `alternative:${quoteId}`,
          () => {
            const quote = stateRef.current.app.quotes.find((q) => q.id === quoteId);
            if (!quote) return { ok: false, error: 'That quote no longer exists.' };
            if (quote.state !== 'quote_received' && quote.state !== 'buyer_comparing') {
              return { ok: false, error: 'This quote cannot be changed right now.' };
            }
            dispatch(updateQuote(quoteId, 'alternative_requested'));
            return { ok: true, data: undefined };
          },
          'Alternative requested. Suppliers have been asked for another route.',
        );
      },

      async selectQuote(quoteId) {
        return run(
          `select-quote:${quoteId}`,
          () => {
            const quote = stateRef.current.app.quotes.find((q) => q.id === quoteId);
            if (!quote) return { ok: false, error: 'That quote no longer exists.' };
            if (quote.state !== 'quote_received' && quote.state !== 'buyer_comparing') {
              return { ok: false, error: 'This quote cannot be selected yet.' };
            }
            dispatch(updateQuote(quoteId, 'selected'));
            return { ok: true, data: undefined };
          },
          'Quote selected. No payment is taken.',
        );
      },

      async setNotificationChannel(channel, enabled) {
        return run(
          `notification:${channel}`,
          () => {
            const settings = stateRef.current.app.notifications;
            if (settings.lockedChannels.includes(channel)) {
              return { ok: false, error: 'Safety and security notices cannot be turned off.' };
            }
            dispatch(setNotification(channel, enabled));
            return { ok: true, data: undefined };
          },
          'Notification preference saved.',
        );
      },

      async runVerificationDemoStep(step) {
        return run(`verification:${step}`, () => {
          dispatch(setVerificationDemo({ step }));
          return { ok: true, data: undefined };
        });
      },

      async selectDemoSample(sampleId) {
        return run(`verification:sample:${sampleId}`, () => {
          dispatch(setVerificationDemo({ sampleId }));
          return { ok: true, data: undefined };
        });
      },

      async setDemoResult(result) {
        return run(`verification:result:${result}`, () => {
          dispatch(
            setVerificationDemo({
              result,
              step: 'result',
              auditEvents: [
                {
                  id: nextId('aud'),
                  at: new Date().toISOString(),
                  actor: 'Demo verification',
                  action: `Demo result recorded: ${result.replace(/_/g, ' ')}`,
                },
              ],
            }),
          );
          return { ok: true, data: undefined };
        });
      },

      async requestManualReview() {
        return run(
          'verification:manual-review',
          () => {
            dispatch(
              setVerificationDemo({
                step: 'manual_review',
                auditEvents: [
                  {
                    id: nextId('aud'),
                    at: new Date().toISOString(),
                    actor: 'Demo verification',
                    action: 'Manual review requested',
                  },
                ],
              }),
            );
            return { ok: true, data: undefined };
          },
          'Manual review requested.',
        );
      },

      dismissToast(id) {
        dispatch(dismissToast(id));
      },

      dismissResetNotice() {
        dispatch(setResetNotice(null));
      },

      isPending(key) {
        // Read through the ref so the answer is always current, even though the
        // actions object itself is created once.
        return stateRef.current.pending.includes(key);
      },
    };
  }, [dispatch, run, toast]);

  return <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>;
};

export const useActions = (): StoreActions => {
  const actions = useContext(ActionsContext);
  if (!actions) throw new Error('useActions must be used inside ActionsProvider.');
  return actions;
};

export type {
  Collaboration,
  ConnectionRequest,
  ConnectionState,
  Listing,
  MessageThread,
  SupplyQuote,
  User,
  Workspace,
};
