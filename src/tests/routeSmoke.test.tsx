import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from '@/tests/utils';
import { ROUTE_PATHS } from '@/app/routePaths';

/** Concrete paths for the routes that carry a parameter. */
const RESOLVED_ROUTES: Record<string, string> = {
  '/app/customer/listings/:id': '/app/customer/listings/lst-cust-1',
  '/app/qualification/profiles/:id': '/app/qualification/profiles/lst-qual-1',
  '/app/collaboration/:id': '/app/collaboration/col-1',
  '/app/supply/quotes/:id': '/app/supply/quotes/quote-1',
};

const EXPECTED_HEADING: Record<string, RegExp> = {
  '/': /find the right connection/i,
  '/register': /create your account/i,
  '/onboarding/workspaces': /what do you want to use linkhive for/i,
  '/app': /find a service/i,
  '/app/customer': /find a service/i,
  '/app/customer/listings/:id': /two-hour deep clean/i,
  '/app/qualification': /qualifications and opportunities/i,
  '/app/qualification/profiles/:id': /registered nurse/i,
  '/app/collaboration': /build a team or partnership/i,
  '/app/collaboration/:id': /hotel and wellness partner/i,
  '/app/supply': /find supply options/i,
  '/app/supply/quotes/:id': /quote from/i,
  '/app/requests': /^requests$/i,
  '/app/messages': /^messages$/i,
  '/app/profile': /my profile/i,
  '/app/settings/notifications': /notification settings/i,
  '/app/verification/demo': /demo verification/i,
  '/app/admin/review': /report review/i,
};

const ERROR_BOUNDARY_TEXT = /something went wrong/i;

describe('every declared route renders', () => {
  beforeEach(() => window.localStorage.clear());

  it('covers exactly the routes in the manifest', () => {
    expect(Object.keys(RESOLVED_ROUTES).filter((key) => key.includes(':'))).toHaveLength(4);
    expect(ROUTE_PATHS).toHaveLength(18);
  });

  for (const route of ROUTE_PATHS) {
    it(`renders ${route}`, async () => {
      const path = RESOLVED_ROUTES[route] ?? route;
      renderApp(path);

      // The error boundary must never be the visible result of a normal route.
      expect(screen.queryByText(ERROR_BOUNDARY_TEXT)).not.toBeInTheDocument();

      const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 2000 });
      expect(heading).toHaveTextContent(EXPECTED_HEADING[route]);
    });
  }
});

describe('unregistered workspaces stay behind a register prompt', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows a register prompt on a workspace the person has not registered', async () => {
    renderApp('/app/qualification');
    expect(
      await screen.findByText(/this workspace is not registered/i, undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register to unlock/i })).toBeInTheDocument();
  });

  it('does not show a register prompt on a registered workspace', async () => {
    renderApp('/app/customer');
    await screen.findByRole('heading', { name: /find a service/i });
    expect(screen.queryByText(/this workspace is not registered/i)).not.toBeInTheDocument();
  });
});
