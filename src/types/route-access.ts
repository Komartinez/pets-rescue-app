import type { UserRole } from './auth'

export type RouteAccess = 'public' | 'authenticated' | 'applicant' | 'staff'

export interface RouteDefinition {
  path: string
  access: RouteAccess
  label: string
}

export const routeDefinitions: RouteDefinition[] = [
  { path: '/', access: 'public', label: 'Home' },
  { path: '/auth/sign-in', access: 'public', label: 'Sign in' },
  { path: '/auth/register', access: 'public', label: 'Register' },
  { path: '/auth/recover', access: 'public', label: 'Recover access' },
  { path: '/auth/reset', access: 'public', label: 'Reset password' },
  { path: '/app', access: 'applicant', label: 'Applicant home' },
  { path: '/app/account', access: 'applicant', label: 'Account' },
  { path: '/staff', access: 'staff', label: 'Staff home' },
  { path: '/staff/account', access: 'staff', label: 'Account' },
]

export function canAccessRoute(access: RouteAccess, role: UserRole | null, isAuthenticated: boolean) {
  if (access === 'public') return true
  if (!isAuthenticated || !role) return false
  if (access === 'authenticated') return true
  return access === role
}
