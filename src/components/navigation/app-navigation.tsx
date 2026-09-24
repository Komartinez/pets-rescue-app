import { NavLink } from 'react-router-dom'

import { FutureFeatureLink } from './future-feature-link'
import { UserMenu } from './user-menu'
import type { UserRole } from '../../types/auth'

const roleLabels = { applicant: 'Applicant', staff: 'Rescue staff' } as const

export function AppNavigation({ role }: { role: UserRole }) {
  const home = role === 'staff' ? '/staff' : '/app'

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to={home} aria-label="Animal Rescue home">
          <span className="brand-mark" aria-hidden="true">AR</span>
          <span>Animal Rescue</span>
        </NavLink>
        <nav aria-label={`${roleLabels[role]} navigation`}>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to={home}>
            Dashboard
          </NavLink>
          <FutureFeatureLink label={role === 'staff' ? 'Animals' : 'Find a companion'} />
          <FutureFeatureLink label={role === 'staff' ? 'Applicants' : 'My applications'} />
        </nav>
        <div className="header-actions">
          <span className="role-badge">{roleLabels[role]}</span>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
