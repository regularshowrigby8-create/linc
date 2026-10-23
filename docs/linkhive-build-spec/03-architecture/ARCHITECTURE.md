# Architecture

## Preferred prototype architecture

Use a small typed frontend with route-level pages, shared components, a central mock store, and deterministic mock repositories. If the selected scaffold already chooses React/TypeScript, keep it. If using Python/Django for the real website, keep templates and API boundaries aligned with the same contracts.

## Required source layout

```text
src/
  app/                 route definitions, providers, error boundary
  components/          reusable UI primitives
  features/
    auth/
    workspaces/
    customer/
    qualification/
    collaboration/
    supply/
    requests/
    messages/
    profile/
    verification/
    admin/
  data/                types, mock data, mock repository
  state/               store, actions, selectors
  styles/              tokens, globals, accessibility
  utils/               validation, dates, formatting
  tests/               unit and interaction tests
public/
  manus-routes.json
```

Do not place all application code in one file. Do not place business logic inside presentational components.

## Layer rules

Pages compose features. Features call store actions. Store actions call mock repository functions. Components receive typed props and emit typed callbacks. Formatting and validation live in utilities. No component directly mutates mock data.

## Error boundary

Provide a top-level error boundary with a retry action. Route-not-found must have a useful page and a link back to the current user’s workspace.

## Storage

For prototype state, use in-memory state plus optional localStorage with a version key. On parse failure, discard corrupted state and show a non-blocking reset notice. Never store secrets or real documents.

## Routing

Routes must be declared once. Create `public/manus-routes.json` containing every non-API route. Use relative browser URLs. Do not hardcode localhost or internal preview hosts.

## Data flow

All state-changing operations return `{ok:boolean, data?, error?}` and update pending/success/error state. Simulated delays must be short and cancellable where possible. Double-submit protection is required.

## Future backend boundary

Future Django endpoints should preserve entity names, status values, validation messages, and permission boundaries in `DATA-CONTRACTS.md`. Do not make the prototype dependent on a future endpoint.