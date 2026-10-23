# Changelog

All notable changes to the LinkHive website prototype are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
semantic versioning once the prototype graduates to a live product.

---

## [0.2.0] — 2026-10-23

Refined the prototype into a consumer product surface, and prepared it for deployment.

### Added

- A modern landing page: a hero with an abstract illustration, a three-step "how it works"
  section, and four workspace tiles with artwork.
- Abstract generated imagery for the hero and the workspace tiles — geometry in the design-system
  palette, no photography, no faces, no logos.
- `vercel.json` with the SPA rewrite, so deep links such as `/app/customer` resolve on a static
  host.
- Deployed to Vercel as project `linkhive` and live at **https://linkhive-chi.vercel.app**. The
  landing page, the customer workspace, the demo verification page and the route manifest were
  each fetched from the deployed address and verified.
- A `Node >= 22` engine declaration so the deployment target matches the build environment.
- Tests that grep the production bundle and fail if any development-only control, mock copy or
  build note ships to a person.

### Changed

- The landing page no longer carries an "it does / it does not" section. It explains the product,
  and the honest notice about payments stays as a single quiet line.
- The footer no longer names the specification folder.
- The error boundary speaks like a product: a plain apology, a retry, and a way back. It no longer
  prints a raw error reason.
- The admin review queue is labelled "Preview only", as the build rules require for fake admin
  data.
- Copy across the app reads as product copy. "Not available yet" replaces "not available in this
  prototype" where the specification does not require the longer wording.
- The workspace pages show a "Register to unlock" notice when a workspace is not registered.

### Fixed

- The development-only result selector is now guarded at the call site, so the whole branch is
  removed from a production build. It was previously compiled into the bundle even though it
  never rendered.

### Unchanged

- The five mandated future-capability labels are still exact.
- The demo verification flow still uses fake `DEMO ID FRONT`, `DEMO ID BACK` and `DEMO SELFIE`
  samples, with the `DEMO` label on every step and no file input, camera API or upload.
- All 18 routes, the route manifest and the 93 existing tests still pass, now 97 in total.

---

## [0.1.0] — 2026-10-23

The first complete pass of the website prototype, built against the 21-file build specification in
`docs/linkhive-build-spec/`.

### Added

**Foundation**

- Vite 7 + React 19 + TypeScript in strict mode, with the `@` path alias.
- Design tokens in `src/styles/tokens.css` — the only place raw colour values appear.
- Reset, typography, focus-ring, skip-link and reduced-motion rules.
- ESLint 9 flat config, Prettier, Vitest with jsdom and Testing Library.
- Versioned `localStorage` (`linkhive.state.v1`) with corrupt-state recovery and a non-blocking
  reset notice.

**Data and state**

- Typed entity contracts for users, listings, requests, threads, collaborations, quotes, reports and
  the verification demo.
- Deterministic mock fixtures: 6 people, 13 listings across four workspaces, 6 requests, 1 thread,
  2 collaborations, 3 quotes, 3 reports.
- A central typed store with about 30 named actions. Every action returns `{ ok, data?, error? }`,
  exposes pending, success and error states, applies a 250ms delay where pending feedback is
  visible, and blocks a double submit.
- A request transition map that is the single source of truth for which actions a request card may
  offer in each state.

**Primitives**

- Button, IconButton, TextInput, Select, Textarea, Checkbox, Chip, Badge, Card, Avatar, Drawer,
  Modal, Toast, Tabs, ProgressStepper, EmptyState, ErrorState, Skeleton, ListingCard, RequestCard,
  QuoteCard, WorkspaceShell, BottomNav, DesktopRail, and inline SVG icons.
- A shared dialog with a focus trap, Escape handling, focus restoration and a scrim.

**Screens**

- All 18 routes, declared once in `src/app/routePaths.ts` and mirrored in
  `public/manus-routes.json`.
- Landing page, registration, workspace selection, a responsive app shell, and a profile drawer.
- Four workspace surfaces: Customer Service, Qualification / Jobs, Collaboration and Supply, each
  with search, filters, a saved section, listing creation and a request wizard.
- Detail pages for a listing, a professional profile, a collaboration agreement and a quote
  comparison.
- Requests inbox, messages, profile, notification settings, a mock admin review queue and a demo
  verification walkthrough.

**Safety**

- Future capabilities use the agreed wording and are disabled with an explanation:
  payments, wallet, international settlement, real document verification and unconfirmed delivery
  cost.
- The demo verification flow uses fake `DEMO ID FRONT`, `DEMO ID BACK` and `DEMO SELFIE` tiles
  only — no file input, no camera API, no upload — and defaults to manual review.
- `demoVerified` is kept separate from the workspace verification state.

**Tests**

- 93 tests across five suites: route manifest, route smoke, state transitions, interaction flows
  and a source-level safety and dead-code audit.

### Fixed

- The persisted payload is the app slice, and the loader reads that shape. Saved state and
  preferences now survive a reload.
- The dialog focus effect no longer re-runs on every render, so it stops stealing focus from a
  field mid-typing.
- `isPending` reads through a ref, so a loading indicator is never stale.
- The request action map now offers the sender only the actions the sender may take, and an
  accepted request offers only completion.
- A listing created in the prototype starts as `pending_review` and carries no verification badge.
- A broken `typecheck` script no longer emits compiled JavaScript into `src/`, where it shadowed
  the TypeScript sources.

### Known gaps

- No screenshot set: no browser is available in the build environment, so the route smoke suite is
  used as the structural evidence instead.
- No real translation. The language control stores a preference; the interface stays English.
- The admin review queue has no authorisation model.
- Message and notification delivery are local only.
- Ten open product decisions are listed in `docs/DECISIONS.md`.

[0.1.0]: https://github.com/regularshowrigby8-create/linc
