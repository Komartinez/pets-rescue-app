import { describe, expect, it } from 'vitest'

import { getRouteDecision } from '../../../src/app/route-policy'

describe('staff access boundary', () => {
  it('permits a staff role into staff routes', () => {
    expect(getRouteDecision('staff', { name: 'authenticated-staff', role: 'staff', session: null, user: null, error: null })).toEqual({ allowed: true })
  })

  it('denies applicants from staff routes', () => {
    expect(getRouteDecision('staff', { name: 'authenticated-applicant', role: 'applicant', session: null, user: null, error: null })).toEqual({ allowed: false, redirectTo: '/app' })
  })
})
