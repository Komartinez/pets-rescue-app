import { Outlet } from 'react-router-dom'

import { AppNavigation } from '../../components/navigation/app-navigation'

export function StaffShell() {
  return (
    <div className="site-shell app-shell staff-shell">
      <AppNavigation role="staff" />
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="site-footer">Rescue operations workspace.</footer>
    </div>
  )
}
