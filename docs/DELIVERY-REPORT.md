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
| Test             | `npm run test`   | **115 passed / 115 total, 6 suites**      |
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

## 4c. Design overhaul (v0.3.0)

The brief was that the site read as a static prototype: too much detail per section, no colour
meaning, no motion, a profile with nothing to customise, and no light or dark mode. The work
below is what changed, and why.

### Information load

| Area | Before | After | Why |
| --- | --- | --- | --- |
| Listing card | Five labelled facts always visible, plus badges, description and two actions | Title, byline, verification, price and the two actions on the surface; availability, response time, rating, field, opportunity and delivery details behind **More details** | A person cannot act on response time. It should cost one click, not a screen |
| Listing detail | Five facts, three long sections and four buttons in one column | Title, byline, verification, description, price and the two primary actions; the rest behind **What is included and how it works**; report and block moved into the side panel | The side panel was repeating the name and location that were already on the card |
| Profile | A flat list of account values | Hero with the member's accent and earned badges, a badge grid, a **Make it yours** panel, then verification, details and the unavailable features | The profile was a settings list. It is now a place a member arranges |
| Workspace header | A coloured strip down the left edge of every header | A workspace mark, the workspace name in its accent, and an action button in that accent | The coloured strip was decoration, and it was on every page |

### Colour

Seven accents now exist as tokens: `blue`, `teal`, `green`, `amber`, `coral`, `violet` and `plum`.
Each one is a set of three values, and a surface declares its accent with `data-accent`, so colour
is scoped rather than scattered.

| Where | Accent |
| --- | --- |
| Customer Service | blue |
| Qualification / Jobs | green |
| Collaboration | violet |
| Supply | amber |
| Home / Requests / Messages / Profile | blue / coral / teal / plum |
| Request state tabs | coral, blue, green, teal, amber, coral, plum |

Colour now only appears where it means something. Statuses keep their semantic colours,
verification badges keep success and warning, and everything else is neutral ink. The
`data-accent="true"` marker on `Card` was left as it was, because it means "this card has a
workspace edge", which is a different thing from an accent name.

### Motion

| Animation | What it explains | Reduced motion |
| --- | --- | --- |
| Hero elements arrive in reading order | The page has a reading order | Off |
| Sections rise as they are scrolled to | You have reached new content | Off, and the content is shown immediately |
| The preview panel slides on change | The workspace changed | Off |
| Two slow gradients drift behind the hero | The hero is alive without moving the text | Off |
| Badge progress bars fill | How close a locked badge is | Off |
| Buttons lift on hover, panels grow on open | A press or a change happened | Off, and the transition is instant |

`prefers-reduced-motion: reduce` neutralises the whole of `motion.css`, and the scroll reveal
gives up and renders the content when the browser cannot observe intersections.

### Profile personalisation

- **Accent**: seven colours, applied to the member's own surfaces.
- **Mark**: three abstract treatments (initials, blocks, rings). Portraits are still never shown.
- **Headline**: a free-text line, up to 60 characters, saved to the store.
- **Badges**: seven, derived from what the member has actually done. Locked badges show progress.
- **Appearance**: light, dark or system.

### What the research changed

The design was checked against the published tells of machine-generated interfaces before it was
written, and the following were deliberately avoided: the purple-to-blue gradient, the three
identical feature cards with icons, the uppercase eyebrow repeated above every heading, the
coloured left border, the same fade-up on every section, gradient text on a headline,
glassmorphism, boxes inside boxes, invented statistics, invented testimonials, fake faces, and
em dashes used as the default separator. The "how it works" section is a horizontal carousel of
four cards rather than a row of three.

### Tests added

Twenty one new tests across `src/tests/personalisation.test.tsx` and `src/tests/safety.test.tsx`:
colour mode switching and persistence, the account drawer appearance panel, badge states, the
accent picker, the mark picker, saving a headline, the exact future-feature labels, disclosure
behaviour, the product tour tabs, the collapsing rail, and a new audit that keeps every raw
colour inside `tokens.css`.

## 4d. Label and card system (v0.4.0)

The third brief pointed at one specific thing: the little bubbles and accents around the
"Business (demo)" and "Qualification (pending)" labels were wrong. The label text itself was fine.
The treatment around it was not, and the same treatment was sitting on the rest of the site.

### What was actually wrong

Every status label was three loud objects stacked on top of each other: a saturated background, a
saturated border in the same hue, and text in that hue again, all at pill radius. On a listing card
that meant three coloured objects in a row, and the label was louder than the listing title.

### What the label became

A **tag**: 6px radius, a 1px neutral hairline, a white surface and ink text. The status is carried
by a small mark in front of the words — a check circle for verified, a hollow ring for neutral and
pending, a filled dot for the rest — so it still reads without relying on colour.

| Before | After |
| --- | --- |
| Filled background in the status colour | White surface, no fill |
| Border in the status colour | 1px neutral hairline |
| Text in the status colour | Ink text, colour only on the mark |
| Pill radius (999px) | 6px radius (`--radius-tag`) |
| Status shown by colour alone | Text plus a redundant mark |

### What changed across the site

The same principles were applied everywhere rather than to the labels alone.

| Area | Change |
| --- | --- |
| Content cards | Flat. The hairline border does the separating. The shadow is kept only for surfaces that float — overlays, toasts, the hero, the tour panel — and exposed as `.lh-card--raised` |
| Listing and request titles | 20px at weight 600 with `-0.01em` tracking, instead of the bold heading weight |
| Chips | Tight, 6px radius, hairline border, ink text — a filter chip rather than a button |
| Workspace header | The eyebrow is muted ink. Colour stays on the workspace mark and the primary action |
| Request reason | A neutral bordered quote block. The coloured left bar is gone, because it was decoration on a piece of content |
| Avatars | Neutral surface, hairline border, ink initials, weight 600 |
| "South Africa first" eyebrow | Muted uppercase text with a small amber dot, not a coloured bubble |
| Achievement marks | 32px rounded squares rather than filled circles |
| Profile verification badges | The same tag treatment |
| Landing headline | Display size at weight 500 with `-0.03em` tracking and balanced wrapping |
| Landing and carousel headings | Weight 500 rather than bold |

### The reference, and what was left out of it

The brief was to study LinkedIn and apply its design, better. That was read as a transfer of
principles rather than a copy of a stylesheet.

Taken: one brand colour reserved for action and primary buttons; hairline borders for everything
else; hierarchy from spacing and contrast rather than elevation; weights stopping at 600; a system
sans with no webfont; content itself as the argument.

Left out: the exact blue, the 24px radius on every rounded element, and the padded panel grid.
LinkHive keeps its own token set, its own accent system for workspaces and tabs, and its own
rounded scale (16px cards, 10px controls, 6px tags).

### Tests added

Five new tests, across `src/tests/personalisation.test.tsx` and `src/tests/safety.test.tsx`:

- The badge stylesheet must not reintroduce a filled or saturated background or border.
- A content block must not regain a coloured left bar.
- A content card must stay free of a resting shadow.
- A rendered label must carry its status mark and keep its text in its own span.
- A verified label and a pending label must be distinguishable by tone.


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

---

## 9. Deployment

| Item              | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Host              | Vercel                                                                 |
| Project           | `linkhive` (`prj_YK60TMsrBy7uHdRZ8ahsgTFluENg`)                      |
| **Live address**  | **https://linkhive-chi.vercel.app**                                    |
| Deployment        | `dpl_5yMiyeH1qXmYegCBYQm9gbGRcV5s` — READY, PROMOTED, production      |
| Source            | GitHub `regularshowrigby8-create/linc`, branch `arena/9f751416-linc`   |
| Commit deployed   | `9795987113f4fdea057bf5768d93b1938efb8890`                            |
| Framework         | Vite 7, Node 24                                                        |
| Build             | `npm run build` → `dist/`                                              |
| Routing           | `vercel.json` rewrite: every path except `/assets/*` → `/index.html`   |

### Verified on the live deployment

Each of these was fetched from the deployed address, not from a local build:

| Check                                                                            | Result |
| -------------------------------------------------------------------------------- | ------ |
| `/` renders the hero, the live preview, the four steps and the workspace tiles    | Pass   |
| `/app/profile` shows the badge grid, the accent picker, the mark picker and the colour mode | Pass |
| `/app/customer` renders the result stream with the secondary facts behind **More details** | Pass |
| `/app/requests` renders the seven state tabs with the correct state actions     | Pass   |
| `/app/verification/demo` shows the `DEMO` label and **no** development result selector | Pass |
| `/app/admin/review` shows `Preview only`, not `Mock admin surface`                | Pass   |
| `/manus-routes.json` is served as JSON and is **not** rewritten to the app shell  | Pass   |
| The production bundle contains **no** occurrence of "Development result selector" | Pass   |
| The production bundle contains the dark theme block and the no-flash script       | Pass   |
| The deployed stylesheet is the built one: its content hash `index-GYhab8Pp.css` matches the local `npm run build` output | Pass |
| The deployed stylesheet carries the new tag tokens (`--radius-tag`, `--weight-semibold`, `--text-title`) | Pass |

### A note on the team's deployment protection

This Vercel team has `ssoProtection.deploymentType = all_except_custom_domains`. The project's own
production alias, `linkhive-chi.vercel.app`, serves publicly. The team-scoped alias
`linkhive-savage-coo.vercel.app` and the branch alias
`linkhive-git-arena-9f751416-linc-savage-coo.vercel.app` both redirect to a Vercel sign-in page,
because they are not custom domains.

**Share `https://linkhive-chi.vercel.app`.** If the team-scoped address also has to serve
publicly, the team owner needs to either relax `defaultDeploymentProtection` or attach a custom
domain to the project. No domain exists on this account today, and none was invented for this
deployment.
