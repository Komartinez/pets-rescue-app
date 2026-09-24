# Research: MVP Foundation

## Decision 1: Use a single Vite React TypeScript application

- **Decision**: Use Vite's React TypeScript template as the browser application foundation,
  with feature-oriented source directories and no separate backend project for this feature.
- **Rationale**: The MVP is a browser-first application, and the current scope can use Supabase
  Auth and database policies directly without adding a custom API service. Vite provides an
  official React TypeScript starting point and a small development/build surface.
- **Alternatives considered**: Next.js was rejected for this feature because server rendering
  and server components are not required by the foundation scope; a custom backend was rejected
  because it would add complexity before any privileged integration is needed.
- **Reference**: [Vite Getting Started](https://vite.dev/guide/)

## Decision 2: Use Supabase Auth with PostgreSQL Row Level Security

- **Decision**: Use Supabase Auth for email/password sessions and Supabase PostgreSQL for the
  application profile and role-assignment records. Enable RLS on every exposed application table.
- **Rationale**: The approved constitution requires Supabase and least-privilege access. Supabase
  Auth supplies the identity context used by PostgreSQL policies, allowing the browser client to
  access only rows authorized for the signed-in user.
- **Alternatives considered**: A custom authentication service was rejected because it duplicates
  managed authentication responsibilities; client-only role checks were rejected because they
  cannot enforce database access.
- **Reference**: [Supabase Auth](https://supabase.com/docs/guides/auth) and [Supabase Row Level
  Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Decision 3: Keep role assignment separate from editable profile data

- **Decision**: Store the user's basic profile in `profiles` and the authorization role in a
  separate `role_assignments` table. A trusted database trigger creates an applicant role for
  new registrations. Staff promotion is performed only through a trusted provisioning path.
- **Rationale**: Separating role data prevents normal profile updates from changing authorization.
  The database remains the source of truth for route guards and RLS, while self-registration has
  a safe applicant default.
- **Alternatives considered**: A client-editable role column on `profiles` was rejected because
  it creates an avoidable privilege-escalation risk; custom JWT claims were deferred because the
  foundation does not need a claims synchronization mechanism yet.

## Decision 4: Use a small explicit route-access policy

- **Decision**: Define public, authenticated-applicant, and staff-only route groups in one typed
  route-access policy consumed by both navigation and route guards.
- **Rationale**: A shared policy prevents the UI from hiding links while leaving direct URL access
  unprotected. It also makes role behavior easy to test and extend when future features arrive.
- **Alternatives considered**: Independent checks in every page were rejected because they invite
  inconsistent authorization; navigation-only hiding was rejected because it is not security.

## Decision 5: Use layered testing

- **Decision**: Use Vitest with React Testing Library for pure logic and accessible component
  behavior, local Supabase policy checks for database authorization, and Playwright for complete
  browser journeys.
- **Rationale**: The constitution requires focused tests for authentication, authorization, RLS,
  configuration, and accessible interaction. Vitest shares the Vite configuration, Testing
  Library emphasizes user-visible behavior, and Playwright provides isolated browser assertions.
- **Alternatives considered**: End-to-end-only testing was rejected because RLS and route policy
  failures are harder to localize; snapshot-heavy component tests were rejected because they do
  not adequately verify user behavior or authorization.
- **References**: [Vitest Guide](https://vitest.dev/guide/index.html), [React Testing
  Library](https://testing-library.com/docs/react-testing-library/intro/), and [Playwright
  Writing Tests](https://playwright.dev/docs/writing-tests)

## Decision 6: Restrict browser configuration to public Supabase values

- **Decision**: The browser receives only the Supabase project URL and public publishable key.
  Service-role keys, OpenAI keys, and all other privileged credentials remain outside browser
  configuration and are not needed for this feature.
- **Rationale**: Supabase's current API-key guidance recommends publishable keys for browser
  applications. Vite exposes variables with the `VITE_` prefix to client code, so only values
  intended for browser use may use that prefix. Supabase RLS remains the authorization boundary.
- **Alternatives considered**: Placing a service-role key in the browser was rejected as a
  direct violation of the constitution; adding a custom secret proxy was deferred because no
  privileged server-side operation is in scope yet.
- **Reference**: [Vite Env Variables and Modes](https://vite.dev/guide/env-and-mode)

All technical-context unknowns are resolved for this feature. No clarification marker remains.
