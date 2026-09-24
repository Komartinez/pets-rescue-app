<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: replaced all template placeholders with seven project principles
- Added sections: Additional Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Templates requiring updates: ✅ .specify/templates/plan-template.md; ✅ .specify/templates/tasks-template.md;
  ✅ .specify/templates/spec-template.md validated; ✅ command templates validated (directory absent)
- Follow-up TODOs: original ratification date is unknown and is recorded below
-->

# Animal Rescue Adoption Platform Constitution

## Core Principles

### I. Stack Alignment and Simplicity

The platform MUST use React with TypeScript for the frontend and Supabase for PostgreSQL,
email/password authentication, Row Level Security, storage, and server-side functions.
The architecture MUST prefer the smallest set of components that can support the MVP.
New frameworks, services, abstractions, and microservices require a documented need and
must not be introduced speculatively.

### II. Security and Least-Privilege Access

All applicant and staff operations MUST be authenticated and authorized. Supabase Row Level
Security MUST protect applicant, staff, animal, application, appointment, and AI conversation
data. Staff-only operations MUST be restricted by role. Protected animal photos MUST use
controlled storage access. The OpenAI API key MUST remain server-side and MUST NOT appear in
browser code, client-side environment variables, database records, logs, or API responses.
AI requests MUST pass through a trusted server-side function or equivalent backend boundary.

### III. Deterministic and Transparent Animal Matching

Mandatory eligibility requirements MUST be evaluated by deterministic application rules and
MUST NOT be decided by an AI model. The system MUST support configurable eligibility filters
and a transparent weighted compatibility score covering housing, time availability, prior
experience, children, existing pets, financial and care capacity, and applicant preferences.
Matching results MUST expose passed criteria, failed criteria, warnings, and score components
to authorized staff and provide an understandable explanation to applicants when appropriate.

### IV. Human-Controlled Adoption Decisions

Compatibility scores and AI-generated explanations are advisory only. The system MUST NOT
automatically approve or reject an adoption. Rescue staff retain final authority over
applications, appointments, animal status, and adoption decisions. Staff actions, decisions,
and important status changes MUST be auditable.

### V. Grounded and Safe AI Assistance

The AI assistant MUST use verified animal and rescue-center records as its source of truth.
It MAY answer questions about care, temperament, compatibility, preparation, and the adoption
process, but it MUST identify missing information and MUST NOT invent medical or behavioral
facts, provide veterinary diagnoses, guarantee adoption approval, or replace staff judgment.
When information is insufficient or a safety-sensitive judgment is required, the assistant
MUST direct the user to rescue staff.

### VI. Privacy, Data Minimization, and Auditability

The platform MUST collect only information necessary for adoption screening and operations.
Applicant personal data, household information, information about children, existing-pet
information, medical information, AI conversations, and staff records MUST be protected from
unauthorized access. Logs MUST NOT contain secrets or unnecessary personal data. Security
events, permissions, application decisions, and external integration outcomes MUST be recorded
with enough context to support investigation without exposing protected information.

### VII. Testable, Accessible, and Incremental Delivery

Every feature MUST have clear acceptance criteria and automated tests appropriate to its risk.
Authentication, authorization, Row Level Security, matching rules, status transitions, API
boundaries, and AI safety behavior MUST have focused tests. The interface MUST support mobile
and desktop use and follow accessible interaction patterns. Delivery MUST proceed in
independently testable increments, prioritizing authentication, animal management,
questionnaire and matching, applications, appointments, and AI assistance.

## Additional Constraints

- Supabase PostgreSQL is the source of truth for application data.
- Applicant and staff roles MUST be explicitly represented and enforced.
- Animal records MUST support availability, health, behavior, personality, care, restrictions,
  compatibility information, and protected photos.
- Animal, application, and appointment status transitions MUST be validated and auditable.
- The initial animal scope is dogs and cats, but the data model MUST remain extensible to other
  domestic animals.
- OpenAI, Outlook Calendar, and transactional email integrations MUST be isolated behind
  server-side boundaries.
- External service failures MUST NOT corrupt adoption applications or silently change adoption
  decisions.
- Secrets MUST be managed through secure environment configuration.
- The platform MUST avoid presenting an AI recommendation as a guarantee, diagnosis, or final
  adoption decision.

## Development Workflow and Quality Gates

- Every feature plan MUST include a Constitution Check before research and again after design.
- Plans MUST explicitly address security, authorization, data privacy, matching correctness,
  AI safety, accessibility, and external-service failure behavior when relevant.
- Implementation tasks MUST identify the tests needed for constitution-critical behavior before
  that behavior is considered complete.
- Reviews MUST verify Row Level Security policies, role boundaries, secret handling, deterministic
  matching behavior, status transitions, and AI grounding where applicable.
- Exceptions MUST document the violated principle, reason, risk, mitigation, and approval.
- A feature MUST NOT be considered complete while it contains unexplained security, privacy,
  matching, or AI-safety gaps.

## Governance

This constitution is authoritative for project planning, implementation, review, and release.
When another project practice conflicts with it, the conflict MUST be resolved in favor of this
constitution or documented as an approved exception.

Amendments MUST describe the rationale, affected principles and templates, compatibility impact,
and any migration or follow-up work. Constitution versions follow semantic versioning: a MAJOR
increment is required for incompatible governance or principle changes; a MINOR increment is
required for new or materially expanded principles; and a PATCH increment is used for
clarifications and non-semantic corrections.

Every plan, implementation review, and release review MUST verify compliance with the current
constitution. The constitution MUST be revisited when the stack, data sensitivity, matching
rules, AI responsibilities, or external integrations materially change.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date is unknown | **Last Amended**: 2026-09-24
