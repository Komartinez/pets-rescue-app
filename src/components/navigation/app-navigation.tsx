import { NavLink } from 'react-router-dom'

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
          {role === 'staff' ? <>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/staff/animals">Animals</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/staff/applications">Applications</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/staff/applicants">Applicants</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/staff/appointments">Appointments</NavLink>
          </> : <>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/app/questionnaire">Questionnaire</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/app/recommendations">Matches</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/app/applications">Applications</NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/app/assistant">Assistant</NavLink>
          </>}
        </nav>
        <div className="header-actions">
          <span className="role-badge">{roleLabels[role]}</span>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
