import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { getRouteDecision } from './route-policy'
import type { RouteAccess } from '../types/route-access'
import { AccessState } from '../components/feedback/access-state'

export function ProtectedRoute({ access }: { access: RouteAccess }) {
  const auth = useAuth()
  const location = useLocation()
  const decision = getRouteDecision(access, auth)

  if (auth.name === 'loading') return <AccessState title="Loading your account" message="Please wait a moment." />
  if (auth.name === 'error') return <AccessState title="Account service unavailable" message={auth.error ?? 'Please try again.'} />
  if (auth.name === 'invalid-role') return <AccessState title="Access needs attention" message={auth.error ?? 'Please contact the rescue team.'} />
  if (decision.redirectTo) return <Navigate to={decision.redirectTo} replace state={{ from: location.pathname }} />
  return <Outlet />
}
