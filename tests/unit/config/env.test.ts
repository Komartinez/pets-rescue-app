import { describe, expect, it } from 'vitest'

import { ConfigurationError, getPublicConfig } from '../../../src/lib/config/env'

describe('public runtime configuration', () => {
  it('accepts the public Supabase values', () => {
    expect(getPublicConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'public-key' })).toEqual({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'public-key',
    })
  })

  it('rejects missing values', () => {
    expect(() => getPublicConfig({})).toThrow(ConfigurationError)
  })

  it('rejects malformed URLs', () => {
    expect(() => getPublicConfig({ VITE_SUPABASE_URL: 'not-a-url', VITE_SUPABASE_PUBLISHABLE_KEY: 'key' })).toThrow(ConfigurationError)
  })

  it('does not include values in the configuration error', () => {
    expect(() => getPublicConfig({ VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: 'do-not-log-me' })).toThrow(/VITE_SUPABASE_URL/)
    expect(() => getPublicConfig({ VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: 'do-not-log-me' })).not.toThrow(/do-not-log-me/)
  })
})
