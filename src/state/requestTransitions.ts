import type { ConnectionState } from '@/data/types';

/**
 * The only actions a connection request may offer in a given state.
 * A card must never show an action that is not listed here.
 */
export type RequestAction = 'accept' | 'decline' | 'ignore' | 'cancel' | 'complete';

export const REQUEST_ACTIONS_BY_STATE: Record<ConnectionState, RequestAction[]> = {
  draft: ['cancel'],
  sent: ['accept', 'decline', 'ignore', 'cancel'],
  viewed: ['accept', 'decline', 'ignore', 'cancel'],
  accepted: ['complete'],
  declined: [],
  expired: [],
  cancelled: [],
  completed: [],
  reported: [],
  blocked: [],
};

/** Actions that only the receiver of a request can take. */
export const RECEIVER_ONLY_ACTIONS: RequestAction[] = ['accept', 'decline', 'ignore'];

/** Actions that only the sender of a request can take. */
export const SENDER_ONLY_ACTIONS: RequestAction[] = ['cancel'];

export const REQUEST_STATE_LABEL: Record<ConnectionState, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled',
  completed: 'Completed',
  reported: 'Reported',
  blocked: 'Blocked',
};

export const REQUEST_STATE_TONE: Record<
  ConnectionState,
  'neutral' | 'success' | 'warning' | 'danger' | 'information' | 'hive'
> = {
  draft: 'neutral',
  sent: 'information',
  viewed: 'information',
  accepted: 'success',
  declined: 'warning',
  expired: 'neutral',
  cancelled: 'neutral',
  completed: 'success',
  reported: 'danger',
  blocked: 'danger',
};

/**
 * Actions available to a request in the given state and direction.
 * The receiver can accept, decline or ignore; the sender can cancel;
 * either side can complete an accepted connection.
 */
export const resolveRequestActions = (
  state: ConnectionState,
  direction: 'sent' | 'received',
): RequestAction[] =>
  REQUEST_ACTIONS_BY_STATE[state].filter((action) => {
    if (action === 'complete') return true;
    if (direction === 'received') return RECEIVER_ONLY_ACTIONS.includes(action);
    return SENDER_ONLY_ACTIONS.includes(action);
  });
