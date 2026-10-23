/**
 * The single list of non-API routes for the prototype.
 * `public/manus-routes.json` mirrors this file and a test keeps them in sync.
 */
export const ROUTE_PATHS = [
  '/',
  '/register',
  '/onboarding/workspaces',
  '/app',
  '/app/customer',
  '/app/customer/listings/:id',
  '/app/qualification',
  '/app/qualification/profiles/:id',
  '/app/collaboration',
  '/app/collaboration/:id',
  '/app/supply',
  '/app/supply/quotes/:id',
  '/app/requests',
  '/app/messages',
  '/app/profile',
  '/app/settings/notifications',
  '/app/verification/demo',
  '/app/admin/review',
] as const;

export type RoutePath = (typeof ROUTE_PATHS)[number];
