# Quickstart: MVP Foundation Validation

This guide validates the foundation after implementation. It is intentionally limited to
authentication, role separation, protected navigation, configuration, and the initial shell.

## Prerequisites

- Node.js and npm versions supported by the project dependencies.
- Supabase CLI and a local Supabase runtime, or a dedicated development Supabase project.
- Two test identities: one applicant and one provisioned staff account.
- No production credentials or real applicant data in local development.

## Configure the Environment

1. Copy the example environment file to the local environment file.
2. Set the public Supabase project URL and publishable client key.
3. Do not add service-role, OpenAI, email-provider, or calendar credentials to browser-facing
   variables.
4. Start or connect to the development Supabase project.
5. Apply the migrations and seed only local test data.

Expected result: the application can initialize its browser client without exposing privileged
credentials.

## Run the Application and Checks

Use the project package scripts once implementation is present:

```bash
npm install
npm run dev
npm run test
npm run test:e2e
```

For local database validation, reset the local database using the project Supabase workflow and
run the policy checks under `tests/policies/`.

When no live Supabase test project is configured, Playwright still runs the public shell and
responsive checks; live applicant and staff authentication journeys are skipped until
`E2E_SUPABASE_URL`, `E2E_STAFF_EMAIL`, and `E2E_STAFF_PASSWORD` are provided.

## Validation Scenarios

### Applicant journey

1. Open the public landing page.
2. Register with a new test email and password.
3. Confirm the account receives the applicant role.
4. Sign in and verify the applicant shell is displayed.
5. Open the applicant account placeholder.
6. Sign out and verify `/app` redirects to sign-in.

### Staff journey

1. Provision a staff test role through the trusted development setup.
2. Sign in with the staff identity.
3. Verify the staff shell and staff navigation are displayed.
4. Verify applicant-only routes are not available to staff.
5. Sign out and verify staff routes are protected.

### Authorization journey

1. While signed out, open `/app` and `/staff`; both must redirect to sign-in.
2. While signed in as an applicant, open `/staff` directly; no staff content may be returned.
3. Attempt to edit another user's profile through the data client; the operation must be denied.
4. Attempt to insert or update a role assignment through the browser client; the operation must
   be denied.
5. Remove or invalidate a role assignment in local test data; the user must fail closed.

### Configuration journey

1. Start the app with each required public configuration variable missing.
2. Verify a safe configuration error is displayed.
3. Search the browser bundle, visible errors, and client logs for privileged secret values.
4. Verify no privileged value is present.

### Accessibility and responsive journey

1. Navigate landing, sign-in, registration, and the authenticated shell using only the keyboard.
2. Verify every core action has an accessible name and visible focus state.
3. Check viewport widths of 320 pixels and 1440 pixels.
4. Verify navigation and authentication actions remain readable and usable.
