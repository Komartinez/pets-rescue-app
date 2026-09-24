import { readFile } from 'node:fs/promises'

const migration = await readFile('supabase/migrations/001_foundation.sql', 'utf8')
const workflowMigration = await readFile('supabase/migrations/002_adoption_workflows.sql', 'utf8')
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

const requiredWorkflowMarkers = [
  'alter table public.animals enable row level security',
  'create policy animals_visible_to_applicants',
  'create policy animals_staff_write',
  'create policy applications_own_insert',
  'create policy applications_staff_update',
  'create policy appointments_own_insert',
  'create policy appointments_staff_update',
  'create policy animal_photos_staff_insert',
]
const missingWorkflowMarkers = requiredWorkflowMarkers.filter(
  (marker) => !workflowMigration.toLowerCase().includes(marker.toLowerCase()),
)
if (missingWorkflowMarkers.length > 0) {
  throw new Error(`Workflow migration is missing: ${missingWorkflowMarkers.join(', ')}`)
}

if (!policyContract.includes('anonymous profile reads are denied')) {
  throw new Error('Policy contract is missing anonymous denial coverage')
}

process.stdout.write('Static foundation policy validation passed\n')
