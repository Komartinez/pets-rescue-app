/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '../../lib/supabase/client'
import type { AuthState, UserRole } from '../../types/auth'

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const initialAuthState: AuthState = {
  name: 'loading',
  session: null,
  user: null,
  role: null,
  error: null,
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function resolveSession(session: Session | null): Promise<AuthState> {
  if (!session) {
    return { ...initialAuthState, name: 'anonymous' }
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('role_assignments')
      .select('role')
      .eq('user_id', session.user.id)
      .maybeSingle<{ role: UserRole }>()

    if (error) throw error
    if (!data || (data.role !== 'applicant' && data.role !== 'staff')) {
      return {
        name: 'invalid-role',
        session,
        user: session.user,
        role: null,
        error: 'Your account needs to be provisioned before you can continue.',
      }
    }

    return {
      name: data.role === 'staff' ? 'authenticated-staff' : 'authenticated-applicant',
      session,
      user: session.user,
      role: data.role,
      error: null,
    }
  } catch {
    return {
      name: 'error',
      session,
      user: session.user,
      role: null,
      error: 'We could not load your access details. Please try again.',
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialAuthState)

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, name: 'loading', error: null }))
    try {
      const { data, error } = await getSupabaseClient().auth.getSession()
      if (error) throw error
      setState(await resolveSession(data.session))
    } catch {
      setState({ ...initialAuthState, name: 'error', error: 'We could not connect to the account service.' })
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let unsubscribe = () => {}

    const initialize = async () => {
      try {
        const client = getSupabaseClient()
        const { data } = client.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
          if (!mounted) return
          if (event === 'SIGNED_OUT') {
            setState({ ...initialAuthState, name: 'anonymous' })
            return
          }
          void resolveSession(session).then((next) => mounted && setState(next))
        })
        unsubscribe = () => data.subscription.unsubscribe()
        const { data: sessionData, error } = await client.auth.getSession()
        if (error) throw error
        if (mounted) setState(await resolveSession(sessionData.session))
      } catch {
        if (mounted) {
          setState({ ...initialAuthState, name: 'error', error: 'We could not connect to the account service.' })
        }
      }
    }

    void initialize()
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    await getSupabaseClient().auth.signOut()
    setState({ ...initialAuthState, name: 'anonymous' })
  }, [])

  const value = useMemo(() => ({ ...state, signOut, refresh }), [refresh, signOut, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
