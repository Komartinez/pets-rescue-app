-- Staff role isolation contract.
-- Staff role provisioning is trusted-only and is never performed through the browser client.

-- The harness must assert that a staff session can read its own role assignment.
-- The harness must assert that a staff session cannot mutate role_assignments.
-- The harness must assert that an applicant session cannot read staff role rows.
