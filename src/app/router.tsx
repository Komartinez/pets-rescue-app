import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './protected-route'
import { RegisterPage } from '../features/auth/pages/register-page'
import { SignInPage } from '../features/auth/pages/sign-in-page'
import { RecoverPage } from '../features/auth/pages/recover-page'
import { ResetPage } from '../features/auth/pages/reset-page'
import { ApplicantHomePage } from '../features/auth/pages/applicant-home-page'
import { LandingPage } from '../features/layout/pages/landing-page'
import { ApplicantShell } from '../features/layout/applicant-shell'
import { StaffShell } from '../features/layout/staff-shell'
import { StaffHomePage } from '../features/layout/pages/staff-home-page'
import { StaffAccountPage } from '../features/layout/pages/staff-account-page'
import { AccountPage } from '../features/layout/pages/account-page'
import { AccessState } from '../components/feedback/access-state'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/recover" element={<RecoverPage />} />
      <Route path="/auth/reset" element={<ResetPage />} />
      <Route element={<ProtectedRoute access="applicant" />}>
        <Route element={<ApplicantShell />}>
          <Route path="/app" element={<ApplicantHomePage />} />
          <Route path="/app/account" element={<AccountPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute access="staff" />}>
        <Route element={<StaffShell />}>
          <Route path="/staff" element={<StaffHomePage />} />
          <Route path="/staff/account" element={<StaffAccountPage />} />
        </Route>
      </Route>
      <Route path="/unauthorized" element={<AccessState title="Access denied" message="You do not have access to this page." />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
