import type { AuthState } from '../types/auth'
import { canAccessRoute, type RouteAccess } from '../types/route-access'

export interface RouteDecision {
  allowed: boolean
  redirectTo?: string
}

export function getRouteDecision(access: RouteAccess, state: AuthState): RouteDecision {
  if (state.name === 'loading') return { allowed: false }
  if (state.name === 'error' || state.name === 'invalid-role') {
    return access === 'public' ? { allowed: true } : { allowed: false, redirectTo: '/auth/sign-in' }
  }

  const isAuthenticated = state.name === 'authenticated-applicant' || state.name === 'authenticated-staff'
  if (canAccessRoute(access, state.role, isAuthenticated)) return { allowed: true }
  if (!isAuthenticated) return { allowed: false, redirectTo: '/auth/sign-in' }
  return { allowed: false, redirectTo: state.role === 'staff' ? '/staff' : '/app' }
}
