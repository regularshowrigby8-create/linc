import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/routes';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { ToastHost } from '@/components/Toast';
import { ActionsProvider, StoreProvider } from '@/state/store';
import '@/styles/globals.css';
import '@/styles/a11y.css';
import '@/styles/components.css';
import '@/styles/motion.css';
import '@/styles/marketing.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <ActionsProvider>
          <BrowserRouter>
            <AppRoutes />
            <ToastHost />
          </BrowserRouter>
        </ActionsProvider>
      </StoreProvider>
    </ErrorBoundary>
  </StrictMode>,
);
