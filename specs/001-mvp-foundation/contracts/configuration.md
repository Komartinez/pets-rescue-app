# Runtime Configuration Contract

## Browser-Available Values

The browser may receive only values intended for public client use:

| Variable | Required | Purpose |
|---|---:|---|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anonymous client key used with RLS |

The application MUST validate both values before creating the browser client. Missing or
malformed values must produce a safe configuration error that does not include secret contents.

## Server-Only Values

The following values MUST NOT be placed in `VITE_` variables, browser bundles, local-storage
session data, user-visible errors, or client logs:

- Supabase service-role key
- OpenAI/ChatGPT API key
- Transactional email credentials
- Outlook/Microsoft Graph credentials
- Any future privileged integration secret

These values are not required by the MVP foundation. They will be introduced only alongside a
server-side integration boundary in a later feature plan.

## Configuration Failure Behavior

- Development startup reports which public configuration variable is missing by name only.
- Production displays a generic configuration-unavailable message.
- Authenticated routes remain unavailable until configuration is valid.
- No credential value is logged or rendered.
