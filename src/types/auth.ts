import type { Session, User } from '@supabase/supabase-js'

export type UserRole = 'applicant' | 'staff'

export type AuthStateName =
  | 'loading'
  | 'anonymous'
  | 'authenticated-applicant'
  | 'authenticated-staff'
  | 'invalid-role'
  | 'error'

export interface AuthState {
  name: AuthStateName
  session: Session | null
  user: User | null
  role: UserRole | null
  error: string | null
}

export interface RoleAssignment {
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  created_at: string
  updated_at: string
}
