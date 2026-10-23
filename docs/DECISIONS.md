# Decision log

Every decision that shaped the prototype, and every question that is still open. Nothing here is
guessed silently — open items are listed as `OPEN_DECISION`.

---

## 1. Library and toolchain decisions

### D-001 — React 19 + TypeScript + Vite 7 + React Router 7

**Decision.** The prototype is a single-page React application, written in strict TypeScript, built
by Vite, and routed by `react-router-dom`.

**Why.** The specification asks for a responsive, clickable prototype with a real route table, a
central typed store and component-level tests. React Router gives a genuine route table (so
`public/manus-routes.json` can mirror one declared source), Vite gives a fast dev server and a
production build with no server, and TypeScript gives the typed mock store the specification
requires. React 19 is current and stable.

**Alternatives rejected.** A single-file HTML prototype would have been faster to produce but
cannot express a typed store, a route manifest or per-route tests. Next.js was rejected because it
adds a server runtime the prototype does not need.

### D-002 — Vitest with jsdom and Testing Library

**Decision.** Tests run in Vitest with the jsdom environment, using `@testing-library/react` and
`@testing-library/user-event`.

**Why.** The specification requires tests that assert *click behaviour*, not implementation detail.
Testing Library drives the real DOM the way a person does. Vitest shares the Vite configuration,
so the `@` alias and the test environment are configured once.

**Alternatives rejected.** Jest with a separate transformer was rejected because it duplicates the
Vite/TypeScript configuration and is slower.

### D-003 — ESLint flat config and Prettier

**Decision.** ESLint 9 flat config with `typescript-eslint`, `eslint-plugin-react-hooks` and
`eslint-plugin-react-refresh`; Prettier for formatting.

**Why.** The flat config is the ESLint 9 default format. Prettier removes formatting arguments
from code review. The `react-refresh` rule is disabled for `src/state/*.tsx` only, because the
state layer deliberately colocates its provider with the hooks that read it.

### D-004 — No UI component library, no state library

**Decision.** Every primitive (Button, IconButton, TextInput, Select, Textarea, Checkbox, Chip,
Badge, Card, Avatar, Drawer, Modal, Toast, Tabs, ProgressStepper, EmptyState, ErrorState,
Skeleton, ListingCard, RequestCard, QuoteCard, WorkspaceShell, BottomNav, DesktopRail) is written
in this repository.

**Why.** The specification fixes the exact design tokens, radii, focus ring and motion values. A
component library would have fought those values, and a state library would have replaced the
central typed store the specification mandates. Nothing extra was added to the dependency tree.

### D-005 — The store is the only source of truth; features never write to it directly

**Decision.** All mutations flow through named action creators in `src/state/actions.ts`, are
reduced in `src/state/store.tsx`, and are read through selectors in `src/state/selectors.ts`.

**Why.** The specification requires one central typed mock store where every mutation goes
through a named action and every result is shaped `{ ok, data?, error? }`. It also forbids any
component mutating mock data directly.

### D-006 — A 250ms delay only where pending feedback is visible

**Decision.** `ACTION_DELAY_MS = 250`. It is applied inside the store's `run` helper, so it applies
uniformly to state-changing actions and never to navigation.

**Why.** The specification asks for a 250ms simulated delay so that pending states are visible, and
explicitly forbids a navigation delay. Because the delay lives in the store, no page can
accidentally add one.

### D-007 — A synchronous pending mirror guards double submits

**Decision.** The store keeps a `Set` of in-flight action keys in a ref, in addition to the pending
list in React state.

**Why.** React state is not updated synchronously. Two clicks in the same tick would both pass a
guard that only reads React state. The ref is the synchronous source of truth for the guard; the
React state stays the source of truth for the UI.

### D-008 — Versioned `localStorage` with a non-blocking reset notice

**Decision.** State is persisted to `linkhive.state.v1` as the app slice. A payload that cannot be
parsed is discarded and replaced with the mock seed, and a notice explains that the demo was reset.

**Why.** The specification requires versioned storage, corrupted-state recovery and a
non-blocking notice. The payload is the app slice rather than the whole store, so the pending list
and toasts never survive a reload.

### D-009 — Listing creation is a modal, not a route

**Decision.** "Create listing" opens a modal. It is not a route.

**Why.** The specification fixes the route table at exactly 18 routes and requires every
non-API route to appear in `public/manus-routes.json`. Adding a route for listing creation would
have broken that count. A modal keeps the route manifest exact.

### D-010 — The demo verification flow is a separate flag from real verification

**Decision.** `verificationDemo.demoVerified` is separate from `verificationByWorkspace`, and the
demo never touches the workspace verification state.

**Why.** The specification requires the demo to be clearly separated from production verification,
with a default result of manual review, no file input, no camera access and no network upload.

### D-011 — Unregistered workspaces show a register prompt rather than being hidden

**Decision.** A workspace the person has not registered still renders, with a visible "Register to
unlock" notice. The navigation only ever lists the current workspace's Home, Requests, Messages
and Profile.

**Why.** The information-architecture revision requires unregistered workspaces to sit behind a
"Register to unlock" prompt, and requires the navigation to show only four entries. Hiding the
route behind a hard redirect would have made most of the prototype unreachable in a demo.

### D-012 — Mock repository behind the store

**Decision.** The mock fixtures in `src/data/mock/` are the repository. Store actions read and
write them through the reducer.

**Why.** The specification asks for "actions call a mock repository". In this prototype the
repository *is* the mock data module, and the reducer is the single write path. A separate
repository interface would have added indirection without changing the observable behaviour. If
the product later needs a real backend, the reducer is the seam where the repository call goes.

---

## 2. Design decisions

### D-013 — Raw colour values appear only in `tokens.css`

**Decision.** Every other stylesheet uses `var(--color-*)`. A test scans the source for stray
hex values.

**Why.** The specification requires tokens from `DESIGN-SYSTEM.md` only, with no raw hex outside
the token file.

### D-014 — Status is always carried by text, never by colour alone

**Decision.** Every badge, chip and status label has a text label. Colour is decoration.

**Why.** Required by the specification and by accessibility guidance.

### D-015 — One shadow, one radius scale

**Decision.** Only `0 8px 24px rgba(20,33,61,.08)` is used as a shadow. Cards use 16px, controls
10px, pills 999px.

**Why.** The specification fixes these values.

---

## 3. Open decisions

These are **not** decided in this prototype. Each one needs a product answer before the real build
starts.

### OPEN_DECISION-01 — Which language set ships first, and who maintains it?

The prototype ships English only, with a language control in the profile drawer that changes a
single stored preference. The specification calls for a South Africa-first product, which implies
English, isiZulu, Afrikaans and Sesotho at minimum. The decision is needed on: the translation
source of truth, whether the app shell is translated at all, and who owns the strings.

### OPEN_DECISION-02 — What is the real verification provider and what does it cost?

The demo flow is built to the shape of a document-and-selfie review with a manual review queue. The
prototype does not select a provider. The decision is needed on the provider, the data retention
period, whether South African identity documents are ever stored, and the cost per check.

### OPEN_DECISION-03 — How are the trade units and the published basket actually settled?

The concept note describes a fully funded internal trade unit based on a published basket, with
issued units never exceeding verified reserves. The prototype implements none of this. The decision
is needed on the basket contents, the reserve custodian, the issuance mechanism and the accounting
treatment.

### OPEN_DECISION-04 — What is the international settlement model?

The interface says only "International settlement model is still under research". The decision is
needed on whether settlement is in ZAR only, how FX exposure is handled, and whether the platform
ever holds a foreign currency balance.

### OPEN_DECISION-05 — Who is allowed into the admin review queue, and what may they see?

The prototype's admin surface has no authorisation model and no audit retention policy. The
decision is needed on roles, the action set, whether a suspension can be lifted by the same person
who applied it, and what record is kept.

### OPEN_DECISION-06 — What is the request expiry window, and does it apply to every workspace?

The prototype expires an ignored request after seven days and states that in the interface. The
decision is needed on whether the window differs per workspace, whether expiry is automatic or
manual, and whether the requester is notified.

### OPEN_DECISION-07 — What is the data retention policy for reports and blocked accounts?

Blocked targets and reports are stored in mock state with no expiry. The decision is needed on how
long a report is kept, whether a blocked person can appeal, and what is deleted when an account is
closed.

### OPEN_DECISION-08 — Which "Contact me" visibility levels are supported?

The prototype models `accepted_connections` only. The specification refers to broader visibility
settings. The decision is needed on the full list of levels and whether a listing can narrow
visibility further than the account default.

### OPEN_DECISION-09 — Does a business account get a different listing lifecycle?

A listing created in the prototype is always `pending_review`. The decision is needed on whether a
business listing is reviewed at all, who reviews it, and what the person sees while it waits.

### OPEN_DECISION-10 — What are the notification channel requirements per country?

The prototype offers in-app, email, SMS, WhatsApp and push, with in-app locked as essential. The
decision is needed on which channels are legally or commercially required in South Africa, and on
consent capture for SMS and WhatsApp.

---

## 4. Explicitly out of scope for this prototype

Payments, wallets, currency conversion, credit, cash-out, identity-document collection, real
verification, messaging delivery, notifications delivery, file uploads, camera access, analytics,
authentication, server-side rendering, internationalisation and any real network request.
