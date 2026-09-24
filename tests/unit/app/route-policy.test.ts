import { describe, expect, it } from 'vitest'

import { getRouteDecision } from '../../../src/app/route-policy'
import type { AuthState } from '../../../src/types/auth'

const base: AuthState = { name: 'anonymous', session: null, user: null, role: null, error: null }

describe('route access policy', () => {
  it('allows public routes for anonymous users', () => {
    expect(getRouteDecision('public', base)).toEqual({ allowed: true })
  })

  it('redirects anonymous users to sign-in', () => {
    expect(getRouteDecision('applicant', base)).toEqual({ allowed: false, redirectTo: '/auth/sign-in' })
  })

  it('allows applicants only into applicant routes', () => {
    const state = { ...base, name: 'authenticated-applicant' as const, role: 'applicant' as const }
    expect(getRouteDecision('applicant', state)).toEqual({ allowed: true })
    expect(getRouteDecision('staff', state)).toEqual({ allowed: false, redirectTo: '/app' })
  })

  it('allows staff only into staff routes', () => {
    const state = { ...base, name: 'authenticated-staff' as const, role: 'staff' as const }
    expect(getRouteDecision('staff', state)).toEqual({ allowed: true })
    expect(getRouteDecision('applicant', state)).toEqual({ allowed: false, redirectTo: '/staff' })
  })

  it('fails closed for invalid roles', () => {
    const state = { ...base, name: 'invalid-role' as const, error: 'invalid' }
    expect(getRouteDecision('staff', state)).toEqual({ allowed: false, redirectTo: '/auth/sign-in' })
  })
})
