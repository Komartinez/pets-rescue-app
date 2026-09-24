import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('client secret boundary', () => {
  it('does not define privileged keys in browser source', async () => {
    const source = await readFile('src/lib/supabase/client.ts', 'utf8')
    expect(source).not.toMatch(/SERVICE_ROLE|OPENAI_API_KEY|CHATGPT_API_KEY/i)
  })
})
