# Contributing to the LinkHive prototype

Thanks for helping. This repository holds a **prototype**, not a live product. The rules below
exist so that the prototype never starts claiming things it cannot do.

---

## Before you start

1. Read `docs/linkhive-build-spec/` — it is the authoritative specification.
2. Read `AGENTS.md` — the rules that apply to every change, human or automated.
3. Read `docs/DECISIONS.md` so you do not re-litigate a settled decision, and so you know which
   questions are still open.

---

## Setup

```bash
npm install
npm run dev
```

Node 22 and npm 10. The dev server binds `0.0.0.0:5173`.

---

## The rules that matter

### Never claim a feature is live

The prototype has no backend. If a capability is not implemented, the interface must say so with
the agreed wording and the control must be disabled:

| Wording                                                     | Use for                        |
| ----------------------------------------------------------- | ------------------------------ |
| `Payments are not available in this prototype`               | anything involving money       |
| `Wallet is planned for a later release`                      | wallet balances                |
| `International settlement model is still under research`     | cross-border settlement        |
| `Real document verification is not connected`                | identity or business checks    |
| `Delivery cost is estimated until a route is confirmed`      | any cost that is not confirmed |

A test in `src/tests/safety.test.tsx` enforces this. Do not work around it.

### Never collect real documents

No file input, no camera API, no upload, no network request for identity purposes. The demo
verification flow uses fake `DEMO ID FRONT`, `DEMO ID BACK` and `DEMO SELFIE` tiles only.

### Never introduce real personal or financial data

Mock fixtures use invented names, initials-only portraits and clearly fake numbers. Do not add a
real identity number, bank account, card number or phone number to the mock data.

### Respect the layer rules

```
page (features)  →  store action  →  mock data
```

- Presentational components in `src/components/` hold no business rules.
- No component mutates mock data directly. Every mutation is a named action.
- Every action returns `{ ok, data?, error? }`.
- Every async-looking action shows a pending state and is protected against a double submit.

### Use the design tokens

Raw colour values belong in `src/styles/tokens.css` and nowhere else. Use the existing CSS custom
properties. Do not add a second shadow, a third radius or a raw hex value.

---

## Working on a feature

A feature is not done until all of these exist:

- [ ] The route exists in `src/app/routePaths.ts` **and** in `public/manus-routes.json`.
- [ ] The loading, empty, error and success states all exist and are reachable.
- [ ] Every visible CTA has a real click behaviour.
- [ ] The behaviour is covered by a test that clicks it.
- [ ] Keyboard behaviour works: reachable, operable, with a visible focus ring.
- [ ] The mobile layout holds at 375px with no horizontal overflow.
- [ ] Any new capability that is not live says so in the agreed wording.

---

## Checks before you push

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run format:check
```

All five must pass. The CI workflow runs the same five.

---

## Commit messages

Short and factual. Describe what changed, not how you felt about it.

```
Add quote comparison route and per-component certainty labels
Fix focus trap stealing input focus while typing in a modal
```

---

## Pull requests

- Keep the change focused on one thing.
- Say which parts of the specification the change satisfies.
- Say which `OPEN_DECISION` items, if any, you assumed an answer to. If you assumed one, say so
  explicitly — an unstated assumption is a bug.
- Note any CTA you added and the test that covers it.

---

## Adding a dependency

Dependencies are a decision, not a convenience. Before adding one:

1. Check whether the design system or the specification already covers the need.
2. Write the choice into `docs/DECISIONS.md` with the reason and the alternatives you rejected.
3. Prefer the platform. A new dependency for a small helper is usually a net loss.

---

## Reporting a problem

Open an issue with the route, the state and what you expected instead. If the behaviour is a
deliberate prototype limit rather than a bug, it is probably already listed in
`docs/DELIVERY-REPORT.md` under "Known gaps".
