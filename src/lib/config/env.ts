import { z } from 'zod'

const publicConfigSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

export type PublicConfig = z.infer<typeof publicConfigSchema>

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

export function getPublicConfig(values: Record<string, unknown> = import.meta.env): PublicConfig {
  const parsed = publicConfigSchema.safeParse(values)
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new ConfigurationError(`Missing or invalid public configuration: ${fields}`)
  }
  return parsed.data
}
