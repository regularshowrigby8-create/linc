# Delivery report — LinkHive website prototype

Branch: `arena/9f751416-linc`
Built from: `docs/linkhive-build-spec/` (21 files, branch `The-plan`)

---

## 1. Commands

| Purpose          | Command          | Result                                    |
| ---------------- | ---------------- | ----------------------------------------- |
| Install          | `npm install`    | 270 packages                              |
| Start            | `npm run dev`    | Vite on `0.0.0.0:5173`                    |
| Build            | `npm run build`  | `tsc -b` clean, `dist/` built in ~2s      |
| Test             | `npm run test`   | **97 passed / 97 total, 5 suites**        |
| Type check       | `npm run typecheck` | Clean, strict mode                       |
| Lint             | `npm run lint`   | Clean, 0 errors, 0 warnings               |
| Format check     | `npm run format:check` | Clean                              |

Build output:

```
dist/index.html                   0.68 kB │ gzip:   0.40 kB
dist/assets/index-DPMduW0B.css   33.16 kB │ gzip:   5.58 kB
dist/assets/index-eALOd-FJ.js   425.05 kB │ gzip: 121.50 kB
```

---

## 2. Route manifest

Declared once in `src/app/routePaths.ts`, mirrored in `public/manus-routes.json`. A test fails if
the two drift apart.

```
/                                Landing page
/register                        Registration
/onboarding/workspaces           Workspace selection
/app                             Active workspace home (redirect)
/app/customer                    Customer Service workspace
/app/customer/listings/:id       Customer Service listing detail
/app/qualification               Qualification / Jobs workspace
/app/qualification/profiles/:id  Professional profile
/app/collaboration               Collaboration workspace
/app/collaboration/:id           Collaboration detail and agreement
/app/supply                      Supply workspace
/app/supply/quotes/:id           Quote comparison
/app/requests                    Requests inbox
/app/messages                    Messages
/app/profile                     Profile
/app/settings/notifications      Notification settings
/app/verification/demo           Demo verification walkthrough
/app/admin/review                Mock report review queue
```

18 routes. No route contains a host, a port or a protocol. A test asserts this.

Every route is exercised by `src/tests/routeSmoke.test.tsx`, which renders it, asserts the level-1
heading, and asserts the global error boundary is **not** what the person sees.

---

## 3. File tree

```
.
├── .env.example
├── .github/workflows/ci.yml
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
├── docs/
│   ├── DECISIONS.md
│   ├── DELIVERY-REPORT.md
│   └── linkhive-build-spec/        (21 spec files)
├── eslint.config.js
├── index.html
├── package.json
├── public/
│   └── manus-routes.json
├── src/
│   ├── app/
│   │   ├── AppShell.tsx            responsive shell, top bar, drawers
│   │   ├── ErrorBoundary.tsx       global error boundary
│   │   ├── NotFoundPage.tsx        404 with a way back
│   │   ├── routePaths.ts           THE route table
│   │   └── routes.tsx              router wiring all 18 routes
│   ├── components/                 presentational primitives only
│   │   ├── Badge.tsx               Badge, Chip, Avatar
│   │   ├── BottomNav.tsx           mobile navigation (4 entries)
│   │   ├── Button.tsx              Button, IconButton
│   │   ├── Card.tsx                Card
│   │   ├── DesktopRail.tsx         desktop navigation rail (240px)
│   │   ├── Form.tsx                FieldShell, TextInput, Select, Textarea, Checkbox
│   │   ├── ListingCard.tsx         one listing, callbacks only
│   │   ├── Logo.tsx                wordmark and mark
│   │   ├── Overlay.tsx             shared Dialog, Modal, Drawer
│   │   ├── ProgressStepper.tsx     step indicator
│   │   ├── QuoteCard.tsx           quote with per-component certainty
│   │   ├── RequestCard.tsx         state-specific actions from the transition map
│   │   ├── States.tsx              EmptyState, ErrorState, Skeleton, InlineNotice
│   │   ├── Tabs.tsx                Tabs
│   │   ├── Toast.tsx               ToastHost
│   │   ├── WorkspaceShell.tsx      workspace chrome
│   │   └── icons.tsx               inline SVG icons
│   ├── data/
│   │   ├── mock/                   collaborations, listings, requests, users
│   │   └── types.ts                every entity contract
│   ├── features/
│   │   ├── admin/AdminReviewPage.tsx
│   │   ├── auth/RegistrationPage.tsx
│   │   ├── collaboration/{CollaborationDetailPage,CollaborationWorkspacePage}.tsx
│   │   ├── customer/{CustomerListingDetailPage,CustomerWorkspacePage}.tsx
│   │   ├── landing/LandingPage.tsx
│   │   ├── listings/CreateListingModal.tsx
│   │   ├── messages/MessagesPage.tsx
│   │   ├── profile/{ProfileDrawer,ProfilePage}.tsx
│   │   ├── qualification/{QualificationProfilePage,QualificationWorkspacePage}.tsx
│   │   ├── requests/{ReportModal,RequestWizard,RequestsPage}.tsx
│   │   ├── settings/NotificationSettingsPage.tsx
│   │   ├── supply/{SupplyQuotePage,SupplyWorkspacePage}.tsx
│   │   ├── verification/DemoVerificationPage.tsx
│   │   └── workspaces/{FilterDrawer,WorkspaceSelectionPage,WorkspaceVerificationNotice,
│   │                   filters.ts,useWorkspaceBrowser.ts,workspaceConfig.ts}
│   ├── main.tsx
│   ├── state/
│   │   ├── actions.ts              action creators, StoreAction, ActionResult
│   │   ├── requestTransitions.ts   the only legal request actions per state
│   │   ├── selectors.ts            reads, workspace labels and home routes
│   │   └── store.tsx               provider, reducer, ~30 async actions
│   ├── styles/
│   │   ├── a11y.css                focus ring, skip link, reduced motion
│   │   ├── components.css          component styles
│   │   ├── globals.css             reset and typography
│   │   └── tokens.css              THE only place raw colour values appear
│   ├── tests/
│   │   ├── flows.test.tsx
│   │   ├── routeSmoke.test.tsx
│   │   ├── routes.test.ts
│   │   ├── safety.test.tsx
│   │   ├── setup.ts
│   │   ├── transitions.test.tsx
│   │   └── utils.tsx
│   ├── utils/{dates,format,validation}.ts
│   └── vite-env.d.ts
└── tsconfig.{json,app.json,node.json}
```

69 TypeScript files, 10,543 lines of source, plus five generated illustrations in `src/assets/`.

---

## 4. CTA to state-transition table

Every visible call to action, what it changes, and where that behaviour is tested.
A button is not complete until its click behaviour is tested.

### Landing and registration

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Create a free account`              | Navigate to `/register`                                                  | `flows.test.tsx` › registration                   |
| `Sign in`                            | Navigate to `/register` (no auth service exists)                        | `flows.test.tsx` › landing                       |
| `See the workspaces`                 | Navigate to `/onboarding/workspaces`                                     | `routeSmoke.test.tsx` › `/`                       |
| `Create account`                     | Validate → `registerAccount` → account created → route `/onboarding/workspaces` | `flows.test.tsx` › registration        |
| `Create account` (invalid)           | Field errors shown, no state change                                      | `flows.test.tsx` › registration                   |

### Workspace selection and navigation

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| Workspace card toggle                | Toggles the workspace in the local draft selection                      | `flows.test.tsx` › workspace selection           |
| `Continue to my workspace`           | Validate → `selectWorkspaces` → workspaces registered, verification `pending` → route to workspace home | `flows.test.tsx` › workspace selection |
| `Continue to my workspace` (none)    | Error "Select at least one workspace"                                    | `flows.test.tsx` › workspace selection           |
| `Register to unlock`                 | Navigate to `/onboarding/workspaces`                                     | `routeSmoke.test.tsx` › unregistered workspace   |
| `Switch workspace`                   | Opens the workspace switcher in the account drawer                      | `flows.test.tsx` › app shell navigation          |
| Bottom nav / rail item               | Route change only, no delay                                             | `flows.test.tsx` › app shell navigation          |

### Workspace browsing

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| Search field                         | Filters the result stream locally, no store mutation                    | `flows.test.tsx` › customer workspace            |
| `Filters`                            | Opens the filter drawer                                                  | `flows.test.tsx` › customer workspace            |
| `Apply`                              | Filter values committed → result stream narrows                          | `flows.test.tsx` › customer workspace            |
| `Reset`                              | Filter values cleared → full result stream returns                       | `flows.test.tsx` › customer workspace            |
| `Clear all`                          | Removes every applied filter                                             | `flows.test.tsx` › customer workspace            |
| `Create listing` / `Post an opportunity` | Opens the creation modal                                            | `flows.test.tsx` › customer workspace            |
| `View details`                       | Navigate to the detail route                                             | `flows.test.tsx` › customer workspace            |

### Listing detail, profile and collaboration

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Save` / `Remove from saved`         | `toggleSave` → listing added to or removed from the saved set           | `transitions.test.tsx` › saved listings           |
| `Send request`                       | Opens the request wizard                                                | `flows.test.tsx` › request wizard                |
| `Report`                             | Opens the report modal                                                  | `transitions.test.tsx` › reporting               |
| `Report for review`                  | Validates reason and details → `reportTarget` → report recorded with an audit event | `transitions.test.tsx` › reporting    |
| `Block`                              | `blockTarget` → target marked blocked                                   | `transitions.test.tsx` › connection transitions   |
| `Accept terms`                      | `acceptTerms` → agreement state `terms_accepted`                        | `transitions.test.tsx` › collaboration            |
| `Go back and edit`                   | Agreement returns to the proposal state                                 | `flows.test.tsx` › collaboration detail          |
| Approve member                      | `approveMember` → member state `accepted`                               | `transitions.test.tsx` › collaboration            |
| `Send invitation`                    | `inviteCollaborator` → invitation recorded, agreement `invitation_sent` | `transitions.test.tsx` › collaboration            |

### Request wizard and requests inbox

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Next` (reason empty)                | Blocked, "Tell the provider why you are contacting them"                | `flows.test.tsx` › request wizard                |
| `Next` (reason too short)            | Blocked, "Use at least 10 characters"                                    | `flows.test.tsx` › request wizard                |
| `Next` (steps 2–5)                   | Advances the draft, no store mutation                                    | `flows.test.tsx` › request wizard                |
| `Back`                               | Returns to the previous step, draft preserved                           | `flows.test.tsx` › request wizard                |
| `Cancel`                             | Closes the wizard, nothing is sent                                      | `flows.test.tsx` › request wizard                |
| `Send request`                       | `sendRequest` → request created → success panel with the request id and `Sent` | `flows.test.tsx` › request wizard        |
| `Send request` (double click)        | Second call refused while pending                                       | `transitions.test.tsx` › double submit           |
| `Accept request`                     | `acceptRequest` → state `accepted`, messaging opens                     | `flows.test.tsx` › requests screen               |
| `Decline request`                    | `declineRequest` → state `declined`                                     | `transitions.test.tsx` › connection transitions   |
| `Ignore`                             | `ignoreRequest` → state `expired`                                       | `transitions.test.tsx` › connection transitions   |
| `Cancel request`                     | `cancelRequest` → state `cancelled`                                     | `transitions.test.tsx` › connection transitions   |
| `Complete request`                   | `completeRequest` → state `completed`                                   | `transitions.test.tsx` › connection transitions   |
| `Accept request` on an expired request | Refused, state unchanged                                               | `transitions.test.tsx` › connection transitions   |
| `Decline request` on an accepted request | Refused, state unchanged                                             | `transitions.test.tsx` › connection transitions   |
| `Open messages`                      | Navigate to `/app/messages`                                             | `flows.test.tsx` › requests screen               |

### Messages

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Send message`                       | `sendMessage` → message appended to the thread                          | `flows.test.tsx` › messages screen               |
| `Send message` (empty)               | Refused, nothing appended                                                | `transitions.test.tsx` › messaging rules         |
| `Attachments are not connected in this prototype` | Disabled, explains the limit                            | Source scan in `safety.test.tsx`                 |
| `Report`                             | Opens the report modal for the thread                                    | `transitions.test.tsx` › reporting               |
| `Block`                              | `blockTarget` on the thread                                              | `transitions.test.tsx` › connection transitions   |

### Supply and quotes

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Compare quotes`                     | Navigate to `/app/supply/quotes/:id`                                     | `routeSmoke.test.tsx` › quote page               |
| `Select this quote`                  | `selectQuote` → quote state `selected`                                   | `transitions.test.tsx` › supply quotes            |
| `Select this quote` after an alternative | Refused, the quote is not in a selectable state                    | `transitions.test.tsx` › supply quotes            |
| `Request alternative`                | `requestAlternative` → quote state `alternative_requested`                | `transitions.test.tsx` › supply quotes            |
| `Payments are not available in this prototype` | Disabled, explains the limit                                    | Source scan in `safety.test.tsx`                 |

### Profile, settings and administration

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `Turn on` / `Turn off` (channel)     | `setNotificationChannel` → preference saved immediately                  | `flows.test.tsx` › notification settings         |
| `Turn off` (essential channel)       | Disabled, the preference cannot be changed                               | `flows.test.tsx` › notification settings         |
| `My profile`                         | Navigate to `/app/profile`                                               | `flows.test.tsx` › app shell navigation          |
| `Account settings`                   | Navigate to `/app/settings/notifications`                               | `flows.test.tsx` › app shell navigation          |
| `Notification settings`              | Navigate to `/app/settings/notifications`                               | `flows.test.tsx` › app shell navigation          |
| `Language`                           | Stores the chosen language, interface stays English                      | `flows.test.tsx` › app shell navigation          |
| `Help and safety`                    | Opens the detail panel with the explanation                              | `flows.test.tsx` › app shell navigation          |
| `Sign out`                           | Returns to the landing page                                              | `flows.test.tsx` › app shell navigation          |
| `Assign to reviewer`                 | `setReportStatus` → report `assigned`, role recorded                    | `routeSmoke.test.tsx` › admin page               |
| `Start review`                       | `setReportStatus` → report `under_review`                                | `routeSmoke.test.tsx` › admin page               |
| `Resolve` / `Dismiss`                | `setReportStatus` → report `resolved` or `dismissed`                    | `routeSmoke.test.tsx` › admin page               |

### Demo verification

| CTA                                  | Implemented transition                                                   | Test                                             |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------ |
| `View demo flow`                     | `runVerificationDemoStep` → step `document`                             | `safety.test.tsx` › demo verification            |
| `DEMO ID FRONT` / `DEMO ID BACK`     | `selectDemoSample` → the chosen sample is selected                       | `safety.test.tsx` › demo verification            |
| `Continue to selfie sample`          | `runVerificationDemoStep` → step `selfie`                                | `safety.test.tsx` › demo verification            |
| `Skip to result`                     | `runVerificationDemoStep` → step `result`                                | `safety.test.tsx` › demo verification            |
| `Request manual review`              | `requestManualReview` → step `manual_review`, pending queue shown       | `safety.test.tsx` › demo verification            |
| Result selector (passed / manual review / mismatch / rejected) | `setDemoResult` → the demo outcome changes            | `safety.test.tsx` › demo verification            |

No demo step offers a file input, a camera permission or a network upload. The `DEMO` label is
present on every step. Both facts are asserted by test, not just by inspection.

---

## 4b. Consumer refinement (v0.2.0)

The brief was a modern, simple product surface with little to no engineering visible to a person.
The changes below serve that brief without weakening any honesty requirement.

### Engineering removed from the interface

| Was                                                        | Now                                                    | Why                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| A "Development result selector" card on the verification page | Compiled out of the production build entirely        | The spec asks for that selector *only for development*   |
| The landing page's "It does / It does not" section          | Replaced with a three-step "how it works" section       | A product page explains the product, not the build        |
| "LinkHive prototype. Built from docs/linkhive-build-spec."  | "LinkHive does not hold money, convert currency or collect identity documents." | Naming the build folder is engineering shown to a user |
| The error boundary printing `Reason: <raw message>`         | A plain apology, a retry and a way back                | A raw error reason is engineering shown to a user         |
| "Mock admin surface"                                        | "Preview only"                                          | The build rules require that wording for fake admin data  |
| "Prototype. Payments and currency are not available."        | "Payments and currency are not available."              | Same                                                    |
| "This part of the prototype could not load."                 | "This section could not be loaded."                      | Same                                                    |
| "Sign in is a mock path in this prototype."                 | "Sign in is not available yet."                          | Same                                                    |

### Preserved on purpose

- The five mandated labels are still exact and still disabled:
  `Payments are not available in this prototype`,
  `Wallet is planned for a later release`,
  `International settlement model is still under research`,
  `Real document verification is not connected`,
  `Delivery cost is estimated until a route is confirmed`.
- The profile drawer's money rows still read **Not available in this prototype**, as the menu
  specification requires.
- The `DEMO` label is still on every verification step, and there is still no file input, camera
  API or upload anywhere.

### Modernised

- The landing page is now a product page: a hero with an abstract illustration, a short lead, two
  calls to action, a three-step "how it works" strip, four workspace tiles with artwork, and a
  clean footer.
- Imagery is five generated abstract illustrations in the design-system palette, quantised and
  resized to 292 kB in total. No photography, no faces, no logos.
- The colour palette, radii, the single shadow, the type scale and the breakpoints are unchanged,
  because the design system fixes them.

### Guaranteed by test, not by inspection

`src/tests/safety.test.tsx` greps the built bundle in `dist/assets/` and fails if it finds
`Development result selector`, `preview purposes only`, `mock result:`, `mock checks`,
`linkhive-build-spec` or `It does not`. CI builds before it tests, so the bundle always exists.


---

## 5. What is deliberately not live

| Label                                                | Behaviour                                        |
| ---------------------------------------------------- | ------------------------------------------------ |
| `Payments are not available in this prototype`       | Disabled button, explanation shown                |
| `Wallet is planned for a later release`              | Disabled row in the profile drawer               |
| `International settlement model is still under research` | Stated in the profile drawer and profile page |
| `Real document verification is not connected`        | Stated on every demo verification step           |
| `Delivery cost is estimated until a route is confirmed` | Stated on the quote comparison page           |

Automated checks in `safety.test.tsx` fail the build if any of these labels disappear, if a file
input or camera API appears anywhere in the source, or if the source claims a payment or currency
feature is live.

---

## 6. Responsive and accessibility evidence

| Requirement                       | Implementation                                                              | Test                                    |
| --------------------------------- | --------------------------------------------------------------------------- | --------------------------------------- |
| 16px body padding at 375px        | `globals.css`                                                               | Manual CSS review                       |
| 44px minimum tap target           | `--tap-target` on every button, nav item and control                        | Manual CSS review                       |
| 64px bottom nav plus safe area    | `--bottom-nav-height` plus `env(safe-area-inset-bottom)`                    | Manual CSS review                       |
| No horizontal overflow             | Every grid uses `minmax(0, 1fr)`; long strings wrap                          | Manual CSS review                       |
| Content max 1200px at 1440px      | `--content-max`                                                              | Manual CSS review                       |
| 240px rail                        | `--rail-width`                                                               | Manual CSS review                       |
| Primary column 640–760px          | `.lh-detail__main { max-width: 760px }`                                      | Manual CSS review                       |
| Detail panel 320–360px            | `.lh-detail` second column is `340px`                                       | Manual CSS review                       |
| Focus ring                        | `a11y.css`: 3px `rgba(37,99,235,.28)` plus a 1px info border                | Manual CSS review                       |
| Reduced motion                    | `a11y.css` disables transitions under `prefers-reduced-motion`              | Manual CSS review                       |
| Modal focus trap, Escape, restore | `components/Overlay.tsx`                                                     | `flows.test.tsx` › app shell navigation |

---

## 7. Known gaps

- **No screenshot set.** No browser is available in the build environment, so the route smoke suite
  is the structural evidence in place of screenshots. Layout rules above are marked as manual
  review for that reason.
- **No real translation.** The language control stores a preference; the interface stays English.
  See `OPEN_DECISION-01`.
- **Admin queue has no authorisation model.** See `OPEN_DECISION-05`.
- **Notification and message delivery are local only.** There is no transport.

---

## 8. Open decisions

All ten open items are listed in `docs/DECISIONS.md` under `OPEN_DECISION-01` to
`OPEN_DECISION-10`. In summary:

1. Language set and ownership.
2. Verification provider and cost.
3. Trade unit and basket settlement.
4. International settlement model.
5. Admin roles and permissions.
6. Request expiry window.
7. Report and block data retention.
8. Contact visibility levels.
9. Business listing lifecycle.
10. Notification channel requirements per country.

Nothing in the prototype assumes an answer to any of these.
