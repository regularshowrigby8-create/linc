import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AppRoutes } from '@/app/routes';
import { ToastHost } from '@/components/Toast';
import { ActionsProvider, StoreProvider } from '@/state/store';

export const renderApp = (route = '/') =>
  render(
    <StoreProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
          <ToastHost />
        </MemoryRouter>
      </ActionsProvider>
    </StoreProvider>,
  );

export const renderWithProviders = (ui: ReactElement, route = '/') =>
  render(
    <StoreProvider>
      <ActionsProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ActionsProvider>
    </StoreProvider>,
  );
