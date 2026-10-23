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

### D-016 — The development result selector is compiled out of production builds

**Decision.** The verification demo's result selector is guarded at the call site with
`import.meta.env.DEV ? (...) : null`, not with a wrapper component.

**Why.** The build specification requires a visible result selector *only for development*, and the
default result in the user-facing flow is manual review. A wrapper component still evaluates its
children at the call site, so the branch survives minification. Guarding at the call site lets
the bundler remove the whole branch, and a test greps the production bundle to prove the control
and its copy are absent.

### D-017 — Abstract generated imagery, no photography and no faces

**Decision.** The landing page uses one abstract hero image and four abstract workspace tiles. All
are geometric illustrations in the design-system palette. No generated photograph, no human
likeness and no logo.

**Why.** The build specification forbids realistic identity photos and unlicensed logos, and asks
for portraits as initials or abstract shapes. Abstract geometry gives the product a modern feel
without introducing anything that could be mistaken for a real person, a real supplier or a real
brand.

### D-018 — The product copy speaks like a product, not like a build

**Decision.** The interface does not describe the build. The landing page no longer has an "it
does / it does not" section, the footer no longer names the specification folder, the error
boundary no longer prints a raw error reason, and the admin queue is labelled "Preview only" as
the build rules require for fake admin data.

**Why.** A person using the product should read it as a product. The honesty requirements are
unaffected: the five mandated labels stay verbatim, unavailable capabilities stay disabled with an
explanation, and no screen implies that a money or identity feature is live.

### D-019 — Two colour modes share one set of token names

`tokens.css` defines every colour once. `:root` holds the light values and
`[data-theme='dark']` overrides the same names. No component knows which mode is active, and no
component carries a second set of colours for dark mode.

The preference is `light`, `dark` or `system`, and it lives in the central store with everything
else. A short inline script in `index.html` reads the stored preference and sets the attribute on
`<html>` before the first paint, so the page never flashes the wrong mode. `system` follows the
operating system and keeps following it while the page is open.

### D-020 — The accent palette was extended with three new hues

`teal`, `coral` and `violet` were added next to the existing navy, amber, blue and green, and
`plum` joins them, giving seven accents. The original twelve colours in `DESIGN-SYSTEM.md` are
unchanged and still carry every status meaning. The new hues are accents only: they never stand
in for success, warning, danger or a verification state.

This extends the design system rather than replacing it. The addition was recorded here because the
specification fixes the core palette but does not forbid additional accents.

### D-021 — Colour is scoped to surfaces, and only where it means something

Any element can declare `data-accent="blue"` and everything inside it reads `--accent`,
`--accent-surface` and `--accent-line`. This replaced scattered inline colours with one rule set.

Colour is only used where it carries meaning: a status, a workspace, the area you are in, or the
action belonging to that area. Anything a person cannot act on, and anything that is not a status,
is left in neutral ink. The coloured left strip that used to mark every workspace header was
removed for this reason. The workspace is now marked by an icon, a name in the accent colour, and
an action button in that colour.

### D-022 — Anything a person cannot act on sits behind a disclosure

`Disclosure` is a button with `aria-expanded`, a panel that is `inert` while it is closed, and a
grid-row transition so the panel grows rather than jumps. Secondary listing facts, the account
summary on the profile, and the included and excluded lists on a listing detail page are all
behind it.

The rule applied throughout: if a person cannot act on it and would not need it at a glance, it
does not take up space on the surface.

### D-023 — Motion has to explain something

Every animation answers a question. The hero elements arrive in reading order, sections rise as
they are scrolled to, the preview panel slides when the workspace changes, a badge progress bar
fills, and the hero carries two slow gradients that drift behind the text. Nothing loops for
decoration and nothing animates on a timer the reader did not cause.

`prefers-reduced-motion: reduce` switches all of it off, and the scroll reveal falls back to
showing the content immediately. The reveal also gives up and shows everything if the browser
cannot observe intersections.

Research on artificial-looking sites was used to decide what to avoid: the purple-to-blue
gradient, the three identical feature cards, the repeated uppercase eyebrow, the coloured left
border, the same fade-up on every section, gradient text on a headline, glassmorphism, invented
statistics and testimonials. None of those appear.

### D-024 — The landing page preview runs on the real mock data

`ProductTour` reads the same store the app reads and shows real listings, real prices and real
verification badges. It is not a picture of a product. Each workspace tab has its own accent, and
the action opens the real workspace.

This is the "advertisement" the page needed: it shows the product working rather than describing
it in three identical cards.

### D-025 — Badges are derived, never stored

`selectAchievements` reads the store and works out what a member has actually done, so a badge
cannot be claimed that was not earned. Locked badges show a progress bar, which tells the member
what to do next.

A member's own preferences, their accent and their headline are stored, because those are
choices rather than facts.

### D-026 — A status label is a quiet tag, not a bubble

The status labels around "Business (demo)" and "Qualification (pending)" were the loudest thing on
the page: a saturated fill, a saturated border and matching coloured text, all at pill radius. On a
listing card that is three loud objects in a row, and the label ends up competing with the listing
it belongs to.

The label is now a **tag**. 6px radius (`--radius-tag`), a 1px neutral hairline, a white surface and
ink text. The status is carried by a small mark in front of the text — a check circle, a hollow ring
or a filled dot — so the label still reads without relying on colour. This keeps D-014 intact: the
status is still carried by text, and the mark is a second, redundant signal rather than the only one.

The rules behind it:

- One brand voltage. Colour is reserved for things a person can act on. A label describing someone
  else's status is not actionable, so it stays neutral.
- Hierarchy comes from spacing and contrast, not elevation. Content cards are flat, with a hairline
  border doing the separating. The single shadow is kept for surfaces that genuinely float —
  overlays, toasts, the hero, the tour panel — and exposed as `.lh-card--raised`.
- A label is not a button. It gets a 6px radius, never a pill radius.
- Weights stop at 600. A label is not a heading.
- No coloured bars on content. A written reason is content, so it gets a neutral bordered quote
  block, not a coloured left strip. The same goes for the workspace header, the avatar and the
  "South Africa first" eyebrow.

### D-027 — The reference was used for its principles, not its pixels

The brief was to apply LinkedIn's website design to LinkHive, better. That was treated as a
transfer of principles, not a copy of a stylesheet.

What was taken: one brand colour reserved for action, hairline borders for everything else, soft
pill chips for filter chips only, a 24px display size at weight 400, section headings at weight
400 to 500, system sans with no webfont, and content itself as the argument.

What was deliberately not taken: the exact blue, the 24px radius on every rounded element, and the
padded panel grid. LinkHive has its own token set, its own accent system for workspaces and tabs,
and its own rounded scale (16px cards, 10px controls, 6px tags). The result is a tag that reads as
a label on this site rather than a chip copied from another one.

### D-028 — The label rules are covered by tests

The rules in D-026 are enforced by tests, because a stylesheet is easy to regress by hand. The
stylesheet must not reintroduce a filled or saturated background on a badge, content blocks must not
regain a coloured left bar, and content cards must stay free of a resting shadow. A rendered label
must keep both its status mark and its text.

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

### OPEN_DECISION-11 — Should the workspace tiles become photographs?

The tiles are abstract geometry. Real photography of real suppliers would be the obvious next step
for a live product, but it needs a decision on where the imagery comes from, who supplies it, how
it is licensed, and what happens when a supplier has no photo. Until then, abstract tiles are the
honest choice.

### OPEN_DECISION-12 — Should a member's accent be free choice?

A member can pick any of the seven accents for their own profile. The prototype does not check
whether the colour clashes with a workspace accent, and it does not remember the choice per
workspace. The decision is needed on whether the accent follows the member everywhere, whether it
is limited to their profile surfaces, and what happens when a member picks a colour that reads
poorly against a status badge.

---

## 4. Explicitly out of scope for this prototype

Payments, wallets, currency conversion, credit, cash-out, identity-document collection, real
verification, messaging delivery, notifications delivery, file uploads, camera access, analytics,
authentication, server-side rendering, internationalisation and any real network request.
