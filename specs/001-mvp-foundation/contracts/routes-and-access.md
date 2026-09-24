# Routes and Access Contract

This contract defines the foundation's user-visible route groups and the authorization behavior
expected from the application shell. It does not define future animal, application, appointment,
or AI workflows.

## Route Matrix

| Route | Anonymous | Applicant | Staff | Expected behavior |
|---|---:|---:|---:|---|
| `/` | Yes | Yes | Yes | Public landing page |
| `/auth/sign-in` | Yes | Yes | Yes | Email/password sign-in |
| `/auth/register` | Yes | Yes | Yes | Applicant registration |
| `/auth/recover` | Yes | Yes | Yes | Password recovery request |
| `/auth/reset` | Recovery session | Recovery session | Recovery session | Set a new password |
| `/app` | No | Yes | No | Applicant shell home |
| `/app/account` | No | Yes | No | Applicant account placeholder |
| `/staff` | No | No | Yes | Staff shell home |
| `/staff/account` | No | No | Yes | Staff account placeholder |

## Authorization Rules

1. Anonymous users requesting `/app/*` or `/staff/*` are redirected to `/auth/sign-in`.
2. Applicants requesting `/staff/*` are denied without revealing staff content.
3. Staff requesting `/app/*` are denied or redirected to `/staff`; the behavior must be
   consistent across navigation and direct URL access.
4. A user with no valid role assignment is denied protected shell access and shown a recovery
   message that does not reveal authorization internals.
5. Sign-out invalidates the local session and makes all protected routes inaccessible.
6. Navigation is derived from the same access policy as route guards; hiding a link is never the
   only authorization control.

## Auth State Contract

The application must represent these states explicitly:

- `loading`: session or role assignment is being resolved; protected content is not rendered.
- `anonymous`: public routes are available; protected routes redirect to sign-in.
- `authenticated-applicant`: applicant shell is available.
- `authenticated-staff`: staff shell is available.
- `invalid-role`: session exists but authorization data is missing or invalid; fail closed.
- `error`: auth or role resolution failed; show a safe retry/recovery action.
