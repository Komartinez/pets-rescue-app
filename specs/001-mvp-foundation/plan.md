# Implementation Plan: MVP Foundation

**Branch**: `001-mvp-foundation` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-mvp-foundation/spec.md`

## Summary

Build the secure foundation for the rescue platform: email/password account access,
applicant and staff role separation, protected navigation, the initial responsive application
shell, and the database/access-control primitives that future features will use. The feature
uses a single React web application with Supabase Auth and PostgreSQL protected by Row Level
Security. Matching, AI assistance, appointments, notifications, applications, and adoption
decisions remain out of scope.

## Technical Context

**Language/Version**: TypeScript with React; current project-approved versions, using Vite

**Primary Dependencies**: React, React Router, `@supabase/supabase-js`, Zod for runtime
configuration and form validation, Vitest, React Testing Library, and Playwright

**Storage**: Supabase Auth and PostgreSQL; Supabase Storage is reserved for later animal photos

**Testing**: Vitest and React Testing Library for unit/component tests; Playwright for browser
journeys; Supabase local database reset and policy checks for authorization behavior

**Target Platform**: Modern desktop and mobile browsers, with local Supabase development and a
managed web deployment

**Project Type**: Single web application

**Performance Goals**: After authentication succeeds, role resolution and the initial shell
should become usable within 2 seconds at the 95th percentile under normal MVP traffic

**Constraints**: The browser may contain only public Supabase connection values; service-role,
OpenAI, and other privileged secrets MUST remain server-side. Every exposed application table
MUST have grants and RLS policies. The feature MUST remain limited to foundation workflows.

**Scale/Scope**: One rescue center, applicant and staff roles, approximately six public/auth
routes and two protected shells; no animal or adoption domain data yet

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **PASS — Stack Alignment and Simplicity**: A single Vite/React/TypeScript application,
  Supabase Auth/PostgreSQL, and a small route/auth boundary satisfy the approved stack without
  introducing a backend service or premature abstraction.
- **PASS — Security and Least-Privilege Access**: Authentication is handled by Supabase Auth;
  role assignments are read-only to clients; profile access is protected by RLS; privileged
  secrets are excluded from browser configuration.
- **PASS — Deterministic and Transparent Animal Matching**: Matching is explicitly out of scope;
  no AI or matching decision is introduced by this plan.
- **PASS — Human-Controlled Adoption Decisions**: Adoption decisions and workflows are out of
  scope; no automated decision path is created.
- **PASS — Grounded and Safe AI Assistance**: AI assistance is out of scope and no AI boundary
  is added in this feature.
- **PASS — Privacy, Data Minimization, and Auditability**: The schema stores only account,
  profile, and role data needed for foundation access. Role changes use a trusted provisioning
  path and are auditable through database timestamps and deployment records.
- **PASS — Testable, Accessible, and Incremental Delivery**: Auth, role authorization, RLS,
  configuration, session expiry, responsive layout, and keyboard-accessible core actions have
  planned unit, policy, and end-to-end validation.
- **PASS — No exceptions**: No constitutional violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-foundation/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/                 # App bootstrap, router, providers, and auth-aware boundaries
├── components/          # Shared accessible UI components
├── features/
│   ├── auth/            # Registration, sign-in, recovery, session state, and role loading
│   └── layout/          # Public, applicant, and staff shells
├── lib/
│   ├── config/          # Validated public runtime configuration
│   └── supabase/        # Browser client and typed data-access helpers
├── styles/              # Global tokens and responsive styles
└── types/               # Shared domain and route-access types

supabase/
├── migrations/          # Versioned schema, trigger, grants, and RLS policies
└── seed.sql             # Local development users/data only, with no real secrets

tests/
├── unit/                # Auth state, config validation, route policy, and form behavior
├── integration/         # React shell and Supabase client boundary behavior
├── policies/            # Local database/RLS authorization checks
└── e2e/                 # Applicant and staff browser journeys

public/                  # Static public assets
```

**Structure Decision**: Use one browser application with feature-oriented source directories,
versioned Supabase migrations, and separate unit, integration, policy, and end-to-end tests.
No separate backend project is needed for this feature; browser access uses Supabase Auth and
RLS, while future privileged integrations will use server-side functions behind their own
boundaries.

## Post-Design Constitution Check

*GATE: Re-checked after research and design artifacts.*

- **PASS — Security**: The data model separates editable profiles from role assignments, denies
  browser writes to roles, and defines RLS/grant coverage for every foundation table.
- **PASS — Secret Handling**: The configuration contract permits only public Supabase values in
  the browser and explicitly excludes service-role, OpenAI, email, and calendar credentials.
- **PASS — Simplicity**: The design uses one browser application, two small application tables,
  one route-access policy, and no custom backend until a privileged integration requires one.
- **PASS — Testability and Accessibility**: The contracts and quickstart cover auth states,
  direct-route authorization, RLS denial, configuration failure, keyboard use, and responsive
  layouts.
- **PASS — Scope**: Matching, AI, appointments, notifications, applications, and adoption
  decisions remain deferred.
- **PASS — No exceptions**: No constitutional violations require justification.

## Complexity Tracking

No constitutional violations or unnecessary complexity were identified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
