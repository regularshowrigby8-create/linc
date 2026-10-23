# LinkHive — website prototype

A responsive, clickable prototype of LinkHive: a South Africa-first connection marketplace
that connects people and businesses who need something with the people and businesses who can
provide it.

The prototype runs entirely on mock data and client-side state. **It is not a live product.** No
payment, wallet, currency, credit, cash-out, identity-document or verification service is
connected, and the interface never implies otherwise.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Vite dev server on `0.0.0.0:5173`                                |
| `npm run build`     | Type-check and build the production bundle into `dist/`          |
| `npm run preview`   | Serve the built bundle on `0.0.0.0:4173`                        |
| `npm run test`      | Run the Vitest suite once                                       |
| `npm run test:watch`| Run the Vitest suite in watch mode                               |
| `npm run typecheck` | Type-check the app and the tooling config                        |
| `npm run lint`      | ESLint (flat config, TypeScript-aware)                          |
| `npm run format`    | Prettier write                                                  |

Node 22 and npm 10 are the versions this prototype was built against.

---

## Routes

Routing is declared once, in `src/app/routePaths.ts`. The same list is mirrored in
`public/manus-routes.json`, and a test fails if the two ever drift apart.

| Route                              | Screen                                       |
| ---------------------------------- | -------------------------------------------- |
| `/`                                | Landing page                                 |
| `/register`                        | Registration                                 |
| `/onboarding/workspaces`           | Workspace selection                          |
| `/app`                             | Redirects to the active workspace home       |
| `/app/customer`                    | Customer Service workspace                   |
| `/app/customer/listings/:id`       | Customer Service listing detail              |
| `/app/qualification`               | Qualification / Jobs workspace               |
| `/app/qualification/profiles/:id`  | Professional profile                         |
| `/app/collaboration`               | Collaboration workspace                      |
| `/app/collaboration/:id`           | Collaboration detail and agreement           |
| `/app/supply`                      | Supply workspace (products and quotes)       |
| `/app/supply/quotes/:id`           | Quote comparison                             |
| `/app/requests`                    | Requests inbox                               |
| `/app/messages`                    | Messages                                     |
| `/app/profile`                     | Profile                                      |
| `/app/settings/notifications`      | Notification settings                        |
| `/app/verification/demo`           | Demo verification walkthrough                |
| `/app/admin/review`                | Mock report review queue                     |

---

## Source layout

```
src/
├── app/          Route table, router, app shell, error boundary, 404
├── components/   Presentational primitives only — no business rules
├── features/     One folder per screen or flow; composes components
├── data/         Types and deterministic mock fixtures
├── state/        Typed store, action creators, selectors, transitions
├── styles/       Design tokens, reset, accessibility rules, components, motion
├── utils/        Formatting, date and validation helpers
└── tests/        Vitest suites
public/
└── manus-routes.json   The route manifest
```

### Layer rules

```
page (features)  →  store action  →  mock data
```

- Pages compose features. Features call named store actions. Store actions mutate the mock data.
- Presentational components hold no business rules and never mutate mock data directly.
- Every mutation goes through a named action. Every action returns `{ ok, data?, error? }`.
- Every async-looking action exposes a pending state, a success state and an error state, and is
  protected against a double submit.

---

## Design system

Tokens live in `src/styles/tokens.css` and are the only place raw colour values appear.

| Token group        | Value                                                      |
| ------------------ | ---------------------------------------------------------- |
| Ink                | `#14213D`                                                   |
| Muted text         | `#536174`                                                   |
| Canvas             | `#F7F8FA`                                                   |
| Surface            | `#FFFFFF`                                                   |
| Border             | `#E3E8EF`                                                   |
| Hive / deep hive   | `#F2B84B` / `#B87313`                                       |
| Success            | `#198754`                                                   |
| Warning            | `#B7791F`                                                   |
| Danger             | `#C0392B`                                                   |
| Info               | `#2563EB`                                                   |
| Disabled           | `#A7B0BE`                                                   |

- System sans stack, 4px spacing base.
- Card radius 16px, control radius 10px, pill radius 999px.
- One shadow only: `0 8px 24px rgba(20,33,61,.08)`.
- Breakpoints: 0–639, 640–1023, 1024+.
- Focus ring: 3px `rgba(37,99,235,.28)` plus a 1px info border.
- Motion 150–220ms ease-out, disabled under `prefers-reduced-motion`.

### Colour modes and accents

The same token names serve both colour modes. `:root` holds the light values and
`[data-theme='dark']` overrides them, so no component knows which mode is active.

A member picks **light**, **dark** or **system** from the landing page header, the account drawer
or the profile. The choice is stored with the rest of the mock state, and an inline script in
`index.html` applies it before the first paint.

Seven accents sit alongside the core palette:

| Accent  | Used for                          |
| ------- | --------------------------------- |
| `blue`  | Customer Service, Home            |
| `teal`  | Messages, completed requests      |
| `green` | Qualification / Jobs              |
| `amber` | Supply, your own accent           |
| `coral` | Requests, received requests        |
| `violet`| Collaboration                      |
| `plum`  | Profile, blocked requests         |

A surface declares its accent with `data-accent`, and everything inside it reads `--accent`,
`--accent-surface` and `--accent-line`. Colour is only used where it carries meaning: a status, a
workspace, the area you are in, or the action belonging to that area.

### Labels and cards

A status label is a **tag**, not a bubble. It has a 6px radius (`--radius-tag`), a 1px neutral
hairline, a white surface and ink text. The status is carried by a small mark in front of the
words, so it reads without relying on colour, and the label text is always there as well.

Colour is reserved for things a person can act on. A label describing someone else's status is
not actionable, so it stays neutral and the accent colour belongs to the primary action instead.

Content cards are flat. The hairline border does the separating, and the single shadow is kept for
surfaces that genuinely float — overlays, toasts, the hero and the tour panel — with
`.lh-card--raised` for anything else that needs to sit above the page.

### Responsive rules

- **Mobile (375px):** 16px body side padding, 44px minimum tap targets, 16px card radius, 64px
  bottom navigation plus safe area, no horizontal overflow.
- **Desktop (1440px):** content capped at 1200px, 240px navigation rail, primary column 640–760px,
  optional detail panel 320–360px.
- The desktop rail keeps the workspace at the top and the four navigation areas at the bottom, and
  collapses to a 76px icon rail on demand.

---

## Features that are deliberately not live

The interface states these plainly rather than faking them. Each is disabled and opens an
explanation.

| Label                                                | Where                        |
| ---------------------------------------------------- | ---------------------------- |
| `Payments are not available in this prototype`       | Supply workspace, quote page  |
| `Wallet is planned for a later release`              | Profile drawer               |
| `International settlement model is still under research` | Profile drawer, profile page |
| `Real document verification is not connected`        | Demo verification            |
| `Delivery cost is estimated until a route is confirmed` | Quote comparison           |

---

## Testing

```bash
npm run test
```

120 tests across six suites:

| Suite                   | Covers                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| `routes.test.ts`        | The route manifest matches the declared routes                       |
| `routeSmoke.test.tsx`   | All 18 routes render with the right heading and never hit the error boundary |
| `transitions.test.tsx`  | Valid and invalid state transitions, double submit, persistence, corrupt-state recovery |
| `flows.test.tsx`        | Registration, workspace selection, navigation, wizard, requests, messages, notifications |
| `safety.test.tsx`       | No dead code, no file input, no camera, no payment or currency claims, no raw colour outside `tokens.css`, no filled status bubbles, no coloured bars on content, no resting shadow on a content card, and nothing development-only in the production bundle |
| `personalisation.test.tsx` | Colour mode, the account appearance panel, badge states, label marks and tones, the accent and mark pickers, disclosure behaviour, the product tour and the collapsing rail |

A button is not considered done until its click behaviour is covered.

---

## Documentation

- `docs/DECISIONS.md` — library and architecture decisions, plus the open decisions.
- `docs/DELIVERY-REPORT.md` — delivery evidence, including the CTA-to-state-transition table.
- `docs/linkhive-build-spec/` — the authoritative build specification this prototype follows.
- `CONTRIBUTING.md` — how to work on this repository.
- `AGENTS.md` — the rules an automated agent must follow here.

---

## Deployment

`vercel.json` sets the Vite build, the `dist` output directory and the SPA rewrite that lets deep
links such as `/app/customer` resolve on a static host.

```bash
npm run build   # produces dist/
```

The project is deployed to Vercel from the `arena/9f751416-linc` branch and is live at:

**https://linkhive-chi.vercel.app**

`docs/DELIVERY-REPORT.md` records the deployment identifiers and the live verification results.

---

## Known limits

- State lives in `localStorage` under `linkhive.state.v1`. Clearing site data resets the demo.
- The report review queue at `/app/admin/review` is a mock surface with no authorisation model.
- No screenshot set is included: no browser is available in the build environment, so the route
  smoke suite is used as the structural evidence instead.

## Licence

See `LICENSE`.
