import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { NotFoundPage } from '@/app/NotFoundPage';
import { AdminReviewPage } from '@/features/admin/AdminReviewPage';
import { AccountReadPage } from '@/features/onboarding/AccountReadPage';
import { AccountTypePage } from '@/features/onboarding/AccountTypePage';
import { IntentPage } from '@/features/onboarding/IntentPage';
import { CollaborationDetailPage } from '@/features/collaboration/CollaborationDetailPage';
import { CollaborationWorkspacePage } from '@/features/collaboration/CollaborationWorkspacePage';
import { CustomerListingDetailPage } from '@/features/customer/CustomerListingDetailPage';
import { CustomerWorkspacePage } from '@/features/customer/CustomerWorkspacePage';
import { LandingPage } from '@/features/landing/LandingPage';
import { MessagesPage } from '@/features/messages/MessagesPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { QualificationProfilePage } from '@/features/qualification/QualificationProfilePage';
import { QualificationWorkspacePage } from '@/features/qualification/QualificationWorkspacePage';
import { RequestsPage } from '@/features/requests/RequestsPage';
import { NotificationSettingsPage } from '@/features/settings/NotificationSettingsPage';
import { SupplyQuotePage } from '@/features/supply/SupplyQuotePage';
import { SupplyWorkspacePage } from '@/features/supply/SupplyWorkspacePage';
import { DemoVerificationPage } from '@/features/verification/DemoVerificationPage';
import { WorkspaceSelectionPage } from '@/features/workspaces/WorkspaceSelectionPage';
import { useStore } from '@/state/store';
import { WORKSPACE_HOME_ROUTE, selectActiveWorkspace } from '@/state/selectors';

/** Sends the user to the workspace they registered for first. */
const WorkspaceLanding = () => {
  const { state } = useStore();
  const workspace = selectActiveWorkspace(state);
  return <Navigate to={WORKSPACE_HOME_ROUTE[workspace]} replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/register" element={<IntentPage />} />
    <Route path="/onboarding/account-type" element={<AccountTypePage />} />
    <Route path="/onboarding/account" element={<AccountReadPage />} />
    <Route path="/onboarding/workspaces" element={<WorkspaceSelectionPage />} />

    <Route path="/app" element={<AppShell />}>
      <Route index element={<WorkspaceLanding />} />
      <Route path="customer" element={<CustomerWorkspacePage />} />
      <Route path="customer/listings/:id" element={<CustomerListingDetailPage />} />
      <Route path="qualification" element={<QualificationWorkspacePage />} />
      <Route path="qualification/profiles/:id" element={<QualificationProfilePage />} />
      <Route path="collaboration" element={<CollaborationWorkspacePage />} />
      <Route path="collaboration/:id" element={<CollaborationDetailPage />} />
      <Route path="supply" element={<SupplyWorkspacePage />} />
      <Route path="supply/quotes/:id" element={<SupplyQuotePage />} />
      <Route path="requests" element={<RequestsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="settings/notifications" element={<NotificationSettingsPage />} />
      <Route path="verification/demo" element={<DemoVerificationPage />} />
      <Route path="admin/review" element={<AdminReviewPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
