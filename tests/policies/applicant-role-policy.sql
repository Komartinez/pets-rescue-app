-- Applicant role isolation contract.
-- This file is run by the local Supabase policy harness after foundation migrations.

-- An applicant may read their own role but cannot change it.
-- The harness must assert that INSERT, UPDATE, and DELETE on role_assignments fail.
-- The harness must also assert that a second user's profile is not visible.
