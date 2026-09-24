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
import { QuestionnairePage } from '../features/adoption/pages/questionnaire-page'
import { RecommendationsPage } from '../features/adoption/pages/recommendations-page'
import { AnimalDetailPage } from '../features/adoption/pages/animal-detail-page'
import { ApplicationPage } from '../features/adoption/pages/application-page'
import { AppointmentsPage } from '../features/adoption/pages/appointments-page'
import { AssistantPage } from '../features/adoption/pages/assistant-page'
import { StaffAnimalsPage } from '../features/staff/pages/staff-animals-page'
import { StaffApplicationsPage } from '../features/staff/pages/staff-applications-page'
import { StaffAppointmentsPage } from '../features/staff/pages/staff-appointments-page'
import { StaffApplicantsPage } from '../features/staff/pages/staff-applicants-page'

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
          <Route path="/app/questionnaire" element={<QuestionnairePage />} />
          <Route path="/app/recommendations" element={<RecommendationsPage />} />
          <Route path="/app/animals/:id" element={<AnimalDetailPage />} />
          <Route path="/app/applications" element={<ApplicationPage />} />
          <Route path="/app/applications/new" element={<ApplicationPage />} />
          <Route path="/app/appointments" element={<AppointmentsPage />} />
          <Route path="/app/appointments/new" element={<AppointmentsPage />} />
          <Route path="/app/assistant" element={<AssistantPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute access="staff" />}>
        <Route element={<StaffShell />}>
          <Route path="/staff" element={<StaffHomePage />} />
          <Route path="/staff/account" element={<StaffAccountPage />} />
          <Route path="/staff/animals" element={<StaffAnimalsPage />} />
          <Route path="/staff/animals/:id/edit" element={<StaffAnimalsPage />} />
          <Route path="/staff/animals/:id" element={<StaffAnimalsPage />} />
          <Route path="/staff/applications" element={<StaffApplicationsPage />} />
          <Route path="/staff/applicants" element={<StaffApplicantsPage />} />
          <Route path="/staff/appointments" element={<StaffAppointmentsPage />} />
        </Route>
      </Route>
      <Route path="/unauthorized" element={<AccessState title="Access denied" message="You do not have access to this page." />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
