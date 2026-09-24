import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getPublicConfig } from '../config/env'

let browserClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    const config = getPublicConfig()
    browserClient = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY)
  }
  return browserClient
}

export function resetSupabaseClientForTests() {
  browserClient = null
}
