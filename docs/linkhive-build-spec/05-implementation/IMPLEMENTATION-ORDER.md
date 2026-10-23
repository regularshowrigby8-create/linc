# Implementation Order

## Required tools

Node.js LTS, package manager already selected by the repository, TypeScript if present, formatter, linter, test runner, and build tool. Do not install a second framework. For the real Python version use Python 3.12+, Django, Django REST Framework, PostgreSQL, and later Redis/Celery; do not add those to a static prototype unless the task explicitly changes to a backend build.

## Phase 0: inspect

Read every specification file. Inspect existing package scripts. Record framework, entrypoint, port, and current commands. Search for existing routes and components. Do not overwrite existing code.

## Phase 1: foundation

Create tokens, global styles, app shell, error boundary, route manifest, mock data types, mock repository, store, and test setup. Confirm the root route renders before continuing.

## Phase 2: primitives

Implement and test Button, IconButton, Input, Select, Textarea, Badge, Chip, Card, Modal, Drawer, Toast, EmptyState, ErrorState, Skeleton, Avatar, ListingCard, RequestCard, QuoteCard, WorkspaceShell, BottomNav, and DesktopRail. Every primitive must have keyboard and disabled behavior.

## Phase 3: account and navigation

Implement registration, workspace selection, mock user state, profile drawer, hidden workspaces, locked workspace explanation, responsive navigation, and language selector. Test every route from mobile and desktop navigation.

## Phase 4: workspace surfaces

Implement Customer Service first, then Qualification / Jobs, Collaboration, and Supply. Reuse primitives but keep workspace content and navigation isolated.

## Phase 5: interaction flows

Add search, filters, save, listing detail, request wizard, request status, accept/decline/ignore, messages, reports, blocks, collaboration invites, agreements, supply alternatives, and demo verification.

## Phase 6: admin and settings

Add notifications settings, mock admin review, audit event display, report assignment, and temporary suspension state. Keep admin-only route protected by mock role.

## Phase 7: polish

Add loading states, empty states, error states, focus styles, reduced-motion behavior, responsive corrections, realistic copy, route manifest validation, and no-payment future notices.

## Every feature loop

1. Define the contract and transition.
2. Add mock data.
3. Add action and selector.
4. Add page and components.
5. Wire every button.
6. Add tests.
7. Run formatter, lint, typecheck, tests, and build.
8. Inspect git diff for accidental files, unused code, secrets, raw colours, and dead buttons.
9. Update the implementation checklist.

## Never do

Do not create a real upload field for identity documents. Do not add payment SDKs. Do not add an AI API. Do not use random data. Do not hide broken functionality behind a spinner. Do not mark a feature complete without a test or a documented reason a test is impossible.