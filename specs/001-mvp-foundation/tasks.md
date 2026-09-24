---

description: "Implementation tasks for the Animal Rescue Adoption Platform MVP foundation"

---

# Tasks: MVP Foundation

**Input**: Design documents from `specs/001-mvp-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and
`quickstart.md`

**Tests**: Tests are required for constitution-critical behavior: authentication,
authorization, Row Level Security, secret boundaries, configuration failures, session expiry,
accessibility, and protected browser journeys.

**Organization**: Tasks are grouped by user story. Foundational tasks complete the shared
platform boundaries before story work begins.

## Phase 1: Setup

**Purpose**: Initialize the React application, dependency tooling, and safe local configuration.

- [X] T001 Initialize the Vite React TypeScript application in `package.json`, `index.html`, `src/main.tsx`, and `src/vite-env.d.ts`
- [X] T002 Add runtime and test dependencies in `package.json` and `package-lock.json`: React Router, `@supabase/supabase-js`, Zod, Vitest, React Testing Library, Playwright, and accessibility test utilities
- [X] T003 Configure TypeScript, Vite, Vitest, ESLint, and formatting in `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, and `.prettierrc`
- [X] T004 Add the safe browser configuration contract in `.env.example` and `.gitignore`, documenting only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Phase 2: Foundational

**Purpose**: Build the blocking database, configuration, session, authorization, and application
boundaries required by every user story.

**⚠️ CRITICAL**: No user story implementation is complete until these foundations are available.

- [X] T005 [P] Write failing Row Level Security authorization scenarios in `tests/policies/foundation-policy.sql` for anonymous denial, own-profile access, cross-user denial, and browser role-assignment write denial
- [X] T006 Create the versioned foundation schema, role enum, profile table, role-assignment table, timestamps, signup trigger, grants, and RLS policies in `supabase/migrations/001_foundation.sql`
- [X] T007 [P] Add local-only applicant and staff fixtures plus trusted role-provisioning instructions in `supabase/seed.sql`
- [X] T008 [P] Write failing runtime configuration tests in `tests/unit/config/env.test.ts` for missing, malformed, valid, and secret-like values
- [X] T009 Implement validated public configuration loading in `src/lib/config/env.ts` with safe error messages and no secret logging
- [X] T010 Implement the browser Supabase client boundary in `src/lib/supabase/client.ts` using only validated public configuration
- [X] T011 [P] Define authentication, role, and explicit auth-state types in `src/types/auth.ts` and `src/types/route-access.ts`
- [X] T012 Write failing session-provider tests in `tests/unit/auth/auth-context.test.tsx` covering loading, anonymous, applicant, staff, invalid-role, error, and sign-out states
- [X] T013 Implement session and role resolution in `src/features/auth/auth-context.tsx`, including auth event handling, role lookup, session expiry, and fail-closed invalid-role behavior
- [X] T014 Write failing route-policy tests in `tests/unit/app/route-policy.test.ts` for public, applicant, staff, loading, anonymous, and invalid-role access
- [X] T015 Implement the shared typed route-access policy in `src/app/route-policy.ts` for navigation and route guards
- [X] T016 Implement the protected-route boundary and application router in `src/app/protected-route.tsx`, `src/app/router.tsx`, and `src/app/app.tsx`
- [X] T017 Add the root application styles and accessible focus baseline in `src/styles/globals.css` and `src/styles/tokens.css`

**Checkpoint**: Database policies, configuration validation, session state, route policy, and
application bootstrap are ready for independently testable user stories.

---

## Phase 3: User Story 1 - Applicant Creates an Account and Reaches the App Shell (Priority: P1) 🎯 MVP

**Goal**: Let a visitor register as an applicant, sign in, recover access, reach the applicant
shell, and sign out without exposing staff content.

**Independent Test**: A new applicant can register, sign in, see the applicant shell, sign out,
and be redirected away from protected routes; invalid credentials produce safe errors.

### Tests for User Story 1

- [X] T018 [P] [US1] Write failing applicant authentication component tests in `tests/integration/auth/applicant-auth.test.tsx` for registration, sign-in, sign-out, recovery, duplicate credentials, and safe errors
- [X] T019 [P] [US1] Write the applicant browser journey in `tests/e2e/applicant-auth.spec.ts` covering registration, role resolution, protected access, and sign-out

### Implementation for User Story 1

- [X] T020 [US1] Implement the authentication service boundary in `src/features/auth/auth-service.ts` for registration, sign-in, sign-out, recovery, and password reset
- [X] T021 [US1] Implement accessible registration and sign-in forms in `src/features/auth/components/register-form.tsx` and `src/features/auth/components/sign-in-form.tsx`
- [X] T022 [US1] Implement recovery and reset forms in `src/features/auth/components/recover-form.tsx` and `src/features/auth/components/reset-form.tsx`
- [X] T023 [US1] Implement applicant auth pages and safe error/loading states in `src/features/auth/pages/register-page.tsx`, `src/features/auth/pages/sign-in-page.tsx`, `src/features/auth/pages/recover-page.tsx`, and `src/features/auth/pages/reset-page.tsx`
- [X] T024 [US1] Implement the authenticated applicant home placeholder in `src/features/auth/pages/applicant-home-page.tsx` and wire applicant routes in `src/app/router.tsx`
- [X] T025 [US1] Verify applicant registration creates only an applicant role and cannot write role assignments through `tests/policies/applicant-role-policy.sql`

**Checkpoint**: User Story 1 is independently usable and testable as the MVP increment.

---

## Phase 4: User Story 2 - Staff Member Accesses a Protected Staff Area (Priority: P1)

**Goal**: Let a provisioned staff member reach a staff-only shell while applicants and anonymous
visitors are denied without staff content disclosure.

**Independent Test**: A provisioned staff account reaches `/staff`, an applicant is denied from
`/staff`, and an anonymous visitor is redirected to sign-in.

### Tests for User Story 2

- [X] T026 [P] [US2] Write failing staff authorization component tests in `tests/integration/auth/staff-access.test.tsx` for staff success, applicant denial, anonymous redirect, invalid role, and direct URL access
- [X] T027 [P] [US2] Add staff fixture setup and role-isolation assertions in `tests/e2e/fixtures/staff-user.ts` and `tests/e2e/staff-access.spec.ts`

### Implementation for User Story 2

- [X] T028 [US2] Implement the staff shell layout in `src/features/layout/staff-shell.tsx` with staff-only navigation and account/sign-out controls
- [X] T029 [US2] Implement staff home and account placeholder pages in `src/features/layout/pages/staff-home-page.tsx` and `src/features/layout/pages/staff-account-page.tsx`
- [X] T030 [US2] Wire staff routes and denial redirects in `src/app/router.tsx` and `src/app/protected-route.tsx` using the shared route policy
- [X] T031 [US2] Verify staff role provisioning remains trusted-only and applicant sessions cannot read or mutate staff role data in `tests/policies/staff-role-policy.sql`

**Checkpoint**: User Stories 1 and 2 both enforce independent applicant/staff access boundaries.

---

## Phase 5: User Story 3 - User Understands the Initial Platform Layout (Priority: P2)

**Goal**: Provide a clear, responsive, keyboard-usable public, applicant, and staff application
shell with labeled placeholders for future workflows.

**Independent Test**: An evaluator can use the public, applicant, and staff shells at 320px and
1440px widths and identify role, navigation, sign-out, and the next available action.

### Tests for User Story 3

- [X] T032 [P] [US3] Write failing accessible layout tests in `tests/integration/layout/accessibility.test.tsx` for landmarks, accessible names, focus order, keyboard navigation, and role-specific navigation
- [X] T033 [P] [US3] Write failing responsive shell and keyboard journeys in `tests/e2e/shell-accessibility.spec.ts` for 320px and 1440px viewports

### Implementation for User Story 3

- [X] T034 [US3] Implement the shared navigation components in `src/components/navigation/app-navigation.tsx`, `src/components/navigation/user-menu.tsx`, and `src/components/navigation/future-feature-link.tsx`
- [X] T035 [US3] Implement the public landing shell in `src/features/layout/public-shell.tsx` and `src/features/layout/pages/landing-page.tsx`
- [X] T036 [US3] Implement the responsive applicant shell in `src/features/layout/applicant-shell.tsx` and integrate it with the applicant route tree in `src/app/router.tsx`
- [X] T037 [US3] Add responsive layout, typography, form, navigation, and visible-focus styles in `src/styles/globals.css` and `src/styles/tokens.css`
- [X] T038 [US3] Add accessible not-found, unauthorized, invalid-role, and loading screens in `src/components/feedback/access-state.tsx` and `src/components/feedback/loading-screen.tsx`

**Checkpoint**: All three user stories are independently navigable, responsive, and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete foundation, harden failure behavior, and keep the design
artifacts executable.

- [X] T039 [P] Add a top-level error boundary and safe auth/configuration error reporting in `src/app/error-boundary.tsx` and `src/components/feedback/error-message.tsx`
- [X] T040 [P] Add client-bundle and log assertions for privileged-secret absence in `tests/security/no-client-secrets.test.ts`
- [X] T041 [P] Add CI scripts for type-checking, linting, unit tests, policy tests, and build validation in `package.json` and `.github/workflows/ci.yml`
- [X] T042 Run the full applicant, staff, authorization, configuration, responsive, and accessibility scenarios and record any required command adjustments in `specs/001-mvp-foundation/quickstart.md`
- [X] T043 Re-check implementation against the constitution and update `specs/001-mvp-foundation/plan.md` if the final structure or security boundaries changed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001–T004 establish the application and tooling.
- **Foundational (Phase 2)**: Depends on Setup; T005–T017 block all user stories.
- **User Story 1 (Phase 3)**: Depends on the Foundational phase and is the recommended MVP.
- **User Story 2 (Phase 4)**: Depends on the Foundational phase; can proceed in parallel with
  User Story 1 after shared boundaries are complete.
- **User Story 3 (Phase 5)**: Depends on the shared router and auth state from the Foundational
  phase; it integrates with the applicant and staff shells and can begin after their route
  contracts exist.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1**: Requires T001–T017; no dependency on US2 or US3 beyond the shared route boundary.
- **US2**: Requires T001–T017; no dependency on US1, but it reuses the shared auth context.
- **US3**: Requires T001–T017 and the route contracts; it may integrate with US1 and US2 shell
  components when those are available.

### Parallel Opportunities

- T003, T004, T007, and T011 can run in parallel after T001–T002.
- T005, T008, T012, and T014 are independent test-first tasks and can run in parallel.
- T018 and T019 can run in parallel after foundational boundaries are available.
- T026 and T027 can run in parallel after the shared auth context exists.
- T032 and T033 can run in parallel before the layout implementation tasks.
- T039, T040, and T041 can run in parallel after the core stories stabilize.

## Parallel Example: User Story 1

```text
Task T018: Applicant authentication component tests in tests/integration/auth/applicant-auth.test.tsx
Task T019: Applicant browser journey in tests/e2e/applicant-auth.spec.ts
```

After the tests are written, implementation can proceed in this order:

```text
T020 auth service → T021/T022 forms → T023 pages → T024 applicant route → T025 policy verification
```

## Parallel Example: User Story 2

```text
Task T026: Staff authorization component tests in tests/integration/auth/staff-access.test.tsx
Task T027: Staff browser fixture and journey in tests/e2e/fixtures/staff-user.ts and tests/e2e/staff-access.spec.ts
```

## Parallel Example: User Story 3

```text
Task T032: Accessible layout tests in tests/integration/layout/accessibility.test.tsx
Task T033: Responsive keyboard journey in tests/e2e/shell-accessibility.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete User Story 1 only.
3. Run the applicant quickstart and security checks.
4. Stop and validate the applicant registration/sign-in increment before adding staff features.

### Incremental Delivery

1. Add User Story 2 and validate the staff boundary independently.
2. Add User Story 3 and validate responsive/accessibility behavior.
3. Complete Polish tasks and rerun the full quickstart.
4. Create the next feature specification for animal management only after this foundation passes.

### Completion Criteria

- Every task above is completed or explicitly deferred with a documented reason.
- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:policies`, `npm run build`,
  and `npm run test:e2e` pass in the configured development environment.
- The browser contains no privileged secrets.
- Anonymous, applicant, and staff access behavior matches the route and RLS contracts.
- The final implementation remains within the foundation scope.
