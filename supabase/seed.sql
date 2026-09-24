-- This seed file intentionally contains no real credentials or service-role values.
-- Create local test users through the Supabase Auth dashboard/CLI, then provision a staff role
-- through a trusted local-only operation. Browser clients must never execute role writes.

-- Example trusted local provisioning statement:
-- update public.role_assignments
-- set role = 'staff', updated_at = timezone('utc', now())
-- where user_id = '<LOCAL_AUTH_USER_UUID>';
