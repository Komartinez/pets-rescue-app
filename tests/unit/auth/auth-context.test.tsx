import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthProvider, useAuth } from '../../../src/features/auth/auth-context'

const getSession = vi.fn()
const onAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
const from = vi.fn()

vi.mock('../../../src/lib/supabase/client', () => ({
  getSupabaseClient: () => ({ auth: { getSession, onAuthStateChange }, from }),
}))

function Probe() {
  const auth = useAuth()
  return <output data-testid="auth-state">{auth.name}:{auth.role ?? 'none'}</output>
}

describe('auth context', () => {
  it('resolves an anonymous session', async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null })
    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous:none'))
  })

  it('resolves an applicant role from the database', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null })
    from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: vi.fn().mockResolvedValue({ data: { role: 'applicant' }, error: null }) }) }) })
    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated-applicant:applicant'))
  })
})
