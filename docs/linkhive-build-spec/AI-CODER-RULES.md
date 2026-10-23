# Rules for the Coding AI

## Mission

Implement only the written LinkHive prototype. Prefer a small reliable feature over an invented feature. This is a mock-data prototype, not a financial, identity, or production marketplace system.

## Before coding

1. Read the README and every referenced file for the feature.
2. Search the repository before creating a new component, route, type, utility, or CSS token.
3. Check whether the feature already exists.
4. List the exact files to change.
5. If a requirement is ambiguous, write `OPEN_DECISION` in the task notes and ask instead of guessing.

## Forbidden assumptions

Never assume a payment provider, exchange rate, legal rule, tax rule, licensing rule, identity provider, shipping cost, real user, real document, or production API exists. Never claim a user is verified unless the mock state explicitly says what was verified. Never call a price guaranteed if it is an estimate.

## No hallucinated interfaces

Use only routes, fields, statuses, and actions defined in `DATA-CONTRACTS.md` and `STATE-MACHINES.md`. If a backend is not present, use a typed mock repository. Never fabricate an endpoint and pretend it works.

## Button safety

Every button must have one of these outcomes: navigate, update local state, open a modal/drawer, submit a validated mock form, or show a disabled explanation. A button labelled “Coming later” must be disabled and explain why. Icon-only buttons require an accessible label and tooltip.

## Dead-code safety

Every exported component must be imported by a route or test. Every type must be used. Delete abandoned branches and unused imports. Do not keep duplicate versions of a component. Do not leave commented-out old implementations.

## Placeholder safety

Use realistic deterministic mock data from `src/mocks`. Use `Demo`, `Example`, or `Preview only` labels for fake verification, payment, and admin data. Never use real ID numbers, bank data, credentials, phone numbers, or personal documents.

## State safety

Use one central typed mock store. Do not duplicate the same request, listing, or user object in multiple components. All mutations go through named actions. Every async-looking action must expose pending, success, and error states even if the delay is simulated.

## Visual safety

Use only design tokens from `DESIGN-SYSTEM.md`. Do not add arbitrary hex colours, spacing values, shadows, or font sizes. Do not fix mobile layout by hiding content. Do not use horizontal scrolling for the main page.

## Change safety

Make the smallest patch possible. After each feature: run formatter, typecheck, lint, tests, and a production build. Read the error before changing code. Never silence an error by weakening types or adding `any` unless documented.

## Completion report

For each completed item report: files changed, routes added, state transitions added, tests run, known limitations, and any `OPEN_DECISION` items. A feature is not done if the report says “works” without evidence.