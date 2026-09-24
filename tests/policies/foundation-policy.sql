-- Executed against a local Supabase database with test identities.
-- These assertions are intentionally written before the migration implementation.

-- Anonymous clients cannot read profiles or role assignments.
select plan(2);
select is((select count(*) from public.profiles), 0, 'anonymous profile reads are denied');
select is((select count(*) from public.role_assignments), 0, 'anonymous role reads are denied');
select * from finish();

-- Run the authenticated policy cases with a local test harness that sets request.jwt.claim.sub:
-- 1. applicant can select only their own profile and role assignment;
-- 2. applicant cannot select or update another user's profile;
-- 3. applicant cannot insert, update, or delete role_assignments;
-- 4. staff can select their own role assignment but cannot self-promote.
