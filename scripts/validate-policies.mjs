import { readFile } from 'node:fs/promises'

const migration = await readFile('supabase/migrations/001_foundation.sql', 'utf8')
const policyContract = await readFile('tests/policies/foundation-policy.sql', 'utf8')

const requiredMigrationMarkers = [
  'enable row level security',
  'role_assignments_select_own',
  'profiles_select_own',
  'grant select on public.role_assignments to authenticated',
  "values (new.id, 'applicant')",
]

const missingMigrationMarkers = requiredMigrationMarkers.filter(
  (marker) => !migration.toLowerCase().includes(marker.toLowerCase()),
)

if (missingMigrationMarkers.length > 0) {
  throw new Error(`Policy migration is missing: ${missingMigrationMarkers.join(', ')}`)
}

if (!policyContract.includes('anonymous profile reads are denied')) {
  throw new Error('Policy contract is missing anonymous denial coverage')
}

process.stdout.write('Static foundation policy validation passed\n')
