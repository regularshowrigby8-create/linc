import { describe, expect, it } from 'vitest';
import manifest from '../../public/manus-routes.json';
import { ROUTE_PATHS } from '@/app/routePaths';

describe('route manifest', () => {
  it('lists exactly the routes declared in the application', () => {
    expect([...manifest.routes].sort()).toEqual([...ROUTE_PATHS].sort());
  });

  it('declares every route as a relative browser path', () => {
    for (const route of manifest.routes) {
      expect(route.startsWith('/')).toBe(true);
      expect(route).not.toContain('localhost');
      expect(route).not.toContain('http');
    }
  });

  it('covers the routes named in the screen blueprint', () => {
    const required = [
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
    ];
    for (const route of required) {
      expect(manifest.routes).toContain(route);
    }
  });
});
