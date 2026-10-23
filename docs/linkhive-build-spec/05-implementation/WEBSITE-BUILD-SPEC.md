# Actual Website Build Specification

## Build target

Create a polished responsive website prototype from the existing repository scaffold. Do not start a second framework. First inspect the repository and use its existing scripts. The prototype uses deterministic mock state and must be runnable from a fresh clone using the documented README commands.

## Page construction order

1. App shell and tokens.
2. Landing page.
3. Registration and onboarding.
4. Workspace shell and profile drawer.
5. Customer Service pages.
6. Qualification / Jobs pages.
7. Collaboration pages.
8. Supply pages.
9. Requests and messages.
10. Demo verification.
11. Notifications and admin review.
12. QA and polish.

## Exact component responsibilities

`AppShell`: route outlet, global error handling, current mock user, responsive shell.

`WorkspaceShell`: workspace title, accent, primary CTA, search, filter trigger, children, empty/error/loading slots.

`ListingCard`: renders one listing only; never owns global state; callbacks are `onOpen`, `onSave`, `onRequest`.

`RequestWizard`: owns step index and draft only; submit delegates to store action; supports back, cancel, validation, pending, success, failure.

`RequestCard`: renders state-specific actions from a transition map; never shows an action not allowed by the current state.

`ReportModal`: receives target type/id; validates reason/details; dispatches report action; closes only after success or explicit cancel.

`DemoVerification`: uses fake sample state only; never has a file input or camera access.

`QuoteComparison`: renders each cost component independently and shows estimate/confirmed/confidence labels.

## Placeholder policy

Use `<Skeleton />` for loading, `EmptyState` for zero records, `ErrorState` with Retry for failure, and inline helper text for unavailable features. Do not use blank white panels. Use fake portraits as initials or abstract shapes, never generated realistic identity photos. Use text and simple CSS marks instead of unlicensed logos.

## Exact future-feature placeholders

Payment button label: `Payments are not available in this prototype`.
Wallet row label: `Wallet is planned for a later release`.
Currency row label: `International settlement model is still under research`.
Document upload label: `Real document verification is not connected`.
Shipping guarantee label: `Delivery cost is estimated until a route is confirmed`.

Each placeholder must be disabled, readable, and non-dead: opening it shows an explanation drawer or tooltip.

## Mock interaction timing

Use 250ms simulated loading only for actions that need pending feedback. Do not delay navigation. Disable the submitting control during the pending period. Resolve deterministically; expose a development-only failure toggle in mock state if tests need it.

## Mobile acceptance measurements

At 375px: body has 16px side padding, buttons are at least 44px tall, tap targets at least 44x44px, cards use 16px radius, bottom nav is 64px plus safe area, no horizontal overflow. At 1440px: content max width 1200px, rail 240px, primary content 640–760px, optional detail panel 320–360px.

## Build completion evidence

Provide the start command, build command, test command, route manifest, file tree, screenshot list if available, and a table mapping every visible CTA to its implemented state transition. Any missing decision is listed under `OPEN_DECISION`; it is never silently filled.