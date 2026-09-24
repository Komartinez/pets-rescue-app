import { getSupabaseClient } from '../../lib/supabase/client'

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    if (/invalid login credentials/i.test(error.message)) return 'The email or password is incorrect.'
    if (/already registered|already exists/i.test(error.message)) return 'Unable to create this account with those details.'
    return error.message
  }
  return 'Something went wrong. Please try again.'
}

export async function registerApplicant(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut()
  if (error) throw error
}

export async function requestPasswordRecovery(email: string) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  })
  if (error) throw error
}

export async function resetPassword(password: string) {
  const { error } = await getSupabaseClient().auth.updateUser({ password })
  if (error) throw error
}
