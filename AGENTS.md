# AGENTS.md

Rules for any automated agent working in this repository. They are binding. If an instruction here
conflicts with a general habit — for example "the model usually adds a dependency", or "the model
usually fills in an unclear requirement" — this file wins.

Read `docs/linkhive-build-spec/` before changing anything. It is the authoritative specification.

---

## 1. Evidence over prose

Do not claim something works unless you ran it. A change is reported with:

- the command you ran and its real output,
- the files you touched,
- the behaviour that changed.

Do not describe a feature as "implemented" when only part of it works. If something is incomplete,
say which part.

---

## 2. Never silently fill a gap

If the specification does not answer a question, do not invent an answer and do not quietly pick
the most common option. Instead:

- choose the safest behaviour that cannot mislead a user,
- record the question in `docs/DECISIONS.md` as an `OPEN_DECISION-NN` item,
- mention it in your final report.

The same applies to a missing label, an empty state or a disabled control: never invent legal
wording, terms of service, privacy policy text or a support promise.

---

## 3. Do not add a dependency without recording the decision

Every new package goes into `docs/DECISIONS.md` with:

- what it is used for,
- why the platform or the existing code was not enough,
- what you rejected instead.

Prefer writing 30 lines of local code over adding a package for 30 lines of behaviour.

---

## 4. No dead code

Nothing ships that does nothing.

- No button without a click behaviour.
- No TODO, FIXME, "coming soon" or lorem ipsum in shipped code.
- No unused export, variable or type — the lint rule is an error, not a warning.
- No placeholder image, avatar or logo that pretends to be a real asset.
- No `console.log` outside the documented error boundary.

A test scans the source for all of these.

---

## 5. The prototype must never lie about money, identity or verification

- No payment flow, wallet, balance, currency conversion, credit, cash-out or FX rate.
- No real identity-document collection: no file input, no camera API, no upload.
- No real credentials, secrets or API keys, in code or in `.env` files.
- Any capability that is not live uses the agreed wording and a disabled control:
  - `Payments are not available in this prototype`
  - `Wallet is planned for a later release`
  - `International settlement model is still under research`
  - `Real document verification is not connected`
  - `Delivery cost is estimated until a route is confirmed`

---

## 6. Respect the layer rules

```
page (features)  →  store action  →  mock data
```

- Presentational components contain no business rules.
- No component mutates mock data directly.
- Every mutation goes through a named action in `src/state/actions.ts`.
- Every action returns `{ ok, data?, error? }`.
- Every async-looking action exposes pending, success and error, and blocks a double submit.

---

## 7. Routing is declared once

`src/app/routePaths.ts` is the only route table. `public/manus-routes.json` mirrors it and a test
fails if they drift.

- Only relative URLs. Never a hardcoded host, port or protocol.
- Adding a route means adding it in both places.
- Do not add a route to solve a UI problem that a modal solves — the manifest is a fixed contract.

---

## 8. Use the design tokens

Raw colour values live in `src/styles/tokens.css` and nowhere else. Use the CSS custom properties.

- Ink `#14213D`, muted `#536174`, canvas `#F7F8FA`, surface `#FFFFFF`, border `#E3E8EF`
- Hive `#F2B84B`, deep hive `#B87313`
- Success `#198754`, warning `#B7791F`, danger `#C0392B`, info `#2563EB`, disabled `#A7B0BE`
- 4px spacing base. Card radius 16px, control radius 10px, pill 999px.
- One shadow: `0 8px 24px rgba(20,33,61,.08)`.
- Breakpoints 0–639 / 640–1023 / 1024+.
- Focus ring 3px `rgba(37,99,235,.28)` plus a 1px info border.
- Motion 150–220ms ease-out, disabled under `prefers-reduced-motion`.

---

## 9. Content rules

- Plain English, sentence case.
- Primary actions are verb-led: "Find a provider", "Create a listing", "Send request",
  "Accept request", "Compare quotes".
- Never "Click here".
- Every estimate says "Estimated". Every future capability says "Not available yet".
- Status is carried by text, never by colour alone.
- Portraits are initials or abstract shapes. No real photographs, no unlicensed logos.

---

## 10. A button is not done until its click is tested

When you add a control, add the test in the same change. The test drives the real DOM. If the
behaviour is a state transition, assert the new state. If it opens something, assert that
something. If it is intentionally disabled, assert that too.

---

## 11. Run the checks before you report

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run format:check
```

All five must pass on the final state of the tree. If one fails, fix it or say clearly that it
fails and why. Do not report success with a failing check.

---

## 12. Git

- Work on the branch you were given. Do not switch, rename or create another branch.
- Do not push to `main`, `The-app`, `The-plan`, `The-website` or `Tools-imported-...`.
- Do not delete or move the repository root or its `.git` directory.
- Never commit `node_modules`, `dist`, `coverage` or local state.

---

## 13. Keep generated artefacts out of the repository

Mock data, screenshots, reports and build output stay out of Git unless the specification asks for
them to be committed. `public/manus-routes.json` is committed because the specification requires
it to be part of the deliverable.
