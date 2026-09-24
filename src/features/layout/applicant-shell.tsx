import { Outlet } from 'react-router-dom'

import { AppNavigation } from '../../components/navigation/app-navigation'
import { useAuth } from '../auth/auth-context'

export function ApplicantShell() {
  const auth = useAuth()
  return (
    <div className="site-shell app-shell">
      <AppNavigation role="applicant" />
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="site-footer">A thoughtful start to a lifelong companion.</footer>
      {auth.error && <span className="sr-only">{auth.error}</span>}
    </div>
  )
}
