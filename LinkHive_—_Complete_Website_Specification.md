# LinkHive — Complete Website Specification

> Single source of truth for designing and building the LinkHive website prototype. This document contains product decisions, visual design, navigation, forms, mock flows, architecture, implementation order, QA, and GitHub delivery rules.

**Status:** Website specification only. This file does not contain application source code.

## Master Table of Contents

1. Product plan
2. AI coding rules
3. Product scope
4. Design system
5. Information architecture
6. Menus and navigation
7. Input and query specification
8. Workspace tab designs
9. Screen blueprint
10. Verification demo
11. Architecture
12. Data contracts
13. State machines
14. Website build specification
15. Implementation order
16. QA checklist
17. GitHub workflow
18. Open problems
19. Explicit layout specification

---



---

# LinkHive — Complete Product Plan

**Document status:** Product and website plan only. No prototype or production build is included in this document.

**Working name:** LinkHive

**Launch position:** South Africa first, country-wide from launch, with global access and global expansion planned. The product is not Kimberley-specific. Kimberley may be an early learning or recruitment market, but it is not a product boundary.

## 1. The product

LinkHive is a global connection marketplace for people and businesses that need something and people or businesses able to provide it. The platform reduces the fragmented process of finding a provider, qualified person, business partner, supplier, or fulfilment route.

The product is one brand and one account system, but it contains four deliberately isolated workspaces:

1. **Customer Service:** find or offer lawful services.
2. **Qualification / Jobs:** connect qualified people with opportunities, requests, and work. The emphasis is on qualifications and capability, not making prior experience a requirement for unemployed users.
3. **Collaboration:** let registered service providers and businesses form project groups, capacity arrangements, referrals, joint work, and supplier relationships.
4. **Supply:** find local, South African, or international products and compare supplier and fulfilment options.

The platform is not a normal job board, ordinary shopping site, staffing agency, or freight company. Its defining product is connection, coordination, comparison, and safe progression toward an agreement.

## 2. Product principles

- Connection is the first success condition; payments are a later capability and must not be forced into every interaction.
- One person may have multiple roles, but each workspace remains focused and separated.
- Buyers should find affordable and efficient options; providers should be able to protect the value of their work.
- Users set prices or quote requirements. LinkHive must not silently force providers below their chosen minimum.
- Verified providers rank above unverified providers, but verification badges must state exactly what was verified.
- Open categories are allowed only within lawful and technically supportable boundaries.
- The platform distinguishes confirmed facts, estimates, recommendations, and unknown costs.
- LinkHive must not claim global payment, legal, verification, shipping, or support capability before those capabilities exist.

## 3. Geographic and market strategy

- South Africa is the first fully supported country.
- The first release must work country-wide across South Africa, not only in Kimberley.
- The platform is designed for global access from the beginning, but country-specific support is labelled honestly.
- International supply may be local, South Africa-wide, or international depending on supplier capability.
- Each listing and country should show whether it supports contact only, provider verification, payments, payouts, delivery, or other capabilities.
- Global launch ambition does not mean every country has identical legal, payment, verification, language, tax, or logistics support on day one.

## 4. Account and workspace behavior

### Registration

The initial account uses email and password. Phone verification may be added where a provider supports it. No full identity or qualification verification is required merely to explore the prototype.

### Workspace visibility

- A user begins with the workspace they first registered for.
- Additional workspaces are hidden inside the profile drawer until the user opts to register for them.
- If the user registers for two, three, or four workspaces, only those workspaces appear in the main navigation.
- A workspace becomes fully functional only after its required verification state is successful.
- Pending workspaces show a clear pending state and the next required step.
- Each workspace should feel like switching to a different focused product, with its own interface, fields, filters, listings, and actions.

### Profiles

- Personal accounts use the person’s name.
- Business accounts are registered and linked to the business name.
- Profile sections with no information are omitted rather than shown as empty spaces.
- Contact details are controlled by the profile owner: private, accepted connections, or public.
- Providers may add an optional tax number for future tax and payout requirements.

## 5. Verification and trust model

The platform uses layered verification rather than one universal badge:

1. Email/account verification.
2. Identity verification.
3. Business verification.
4. Qualification or credential verification.
5. Professional licence or registration verification where required.
6. Service-specific evidence such as insurance, equipment, or permits.

The prototype may show a **Demo verification** flow using fake sample documents only. It must not collect real identity documents until a real provider, secure storage model, legal basis, retention policy, and review process are integrated.

### Intended bank-style verification

The future identity flow should support:

- government ID or passport capture;
- front/back quality checks;
- OCR extraction;
- document authenticity checks;
- selfie capture;
- liveness detection;
- face match;
- duplicate identity detection;
- sanctions/PEP screening where legally required;
- manual review when automated checks disagree.

The account, identity document, qualification certificate, and payout name should normally match. Detected mismatches go to manual authorization rather than automatic rejection.

A user gets up to three automated attempts before manual review or temporary lock. Confirmed false documents may result in permanent account, identity, linked business, device, or payment-identity bans where legally permitted. The user must have an appeal route. Evidence is preserved only as legally required and access is restricted.

### Legal and licence classification

For known low-risk categories, multiple models may classify whether a licence or document is likely required. The system may auto-process clear cases only under approved rules. Uncertain, regulated, disputed, or high-risk cases go to an authorised human reviewer. The platform must quote the applicable rule or source where practical and must not allow an AI system to make an unsupported legal statement.

If the platform cannot confidently determine whether a service is lawful or requires a licence, the listing remains pending legal review and is not offered as an approved transaction.

## 6. Discovery, matching, and ranking

Search must support both:

- natural-language search;
- structured filters.

Local filters and global filters should be grouped separately while remaining available.

The ranking order is:

1. Match to the request.
2. Distance or delivery practicality.
3. Verification and legal eligibility.
4. Price or estimated total cost.
5. Availability and response time.
6. Ratings after completed connections.

Users can switch among best match, lowest price, lowest estimated total, nearest, fastest response, highest relevant verification, rating, and availability.

A request is created through optional slides or steps. At least one field must explain the reason for the request. The sender reviews the structured summary before sending.

## 7. Connections, messaging, and safety

### Connection states

- Draft
- Sent
- Viewed
- Accepted
- Declined
- Expired
- Cancelled
- Completed
- Reported
- Blocked

The receiver sees the sender’s request and message, then chooses to accept, decline, or ignore. An ignored request expires and is removed after seven days.

Messaging becomes available after acceptance. Contact information is not automatically exposed; the profile owner controls visibility.

### Collaboration groups

- Any registered service provider may initiate a collaboration.
- The sender can invite providers, businesses, or other necessary participants.
- Invitees have visible states: invited, pending, accepted, or declined.
- New participants may request to join.
- The group admin approves new members and may appoint additional admins.
- Members see everyone’s profile and role, but not contact details unless each person has chosen to share them.

### Ratings

Ratings are available after a connection is completed and are public on the relevant profile.

### Reports and blocks

Users may report or block a profile, listing, request, or chat at any time. A report requires a clear written reason to reduce spam reporting. Categories should include fraud, theft, identity fraud, false documents, illegal activity, harassment, unsafe service, payment issue, and other.

Serious reports remain visible pending admin review unless an authorised administrator chooses a restriction. A temporary 24–48 hour suspension may pause activity while the case is reviewed. Admin decisions and rule changes are audited.

## 8. Workspace-specific rules

### Customer Service

Providers may list ordinary lawful services without a qualification unless the service legally or operationally requires one. The system classifies categories and sends uncertain cases to review.

### Qualification / Jobs

The workspace supports qualified people and opportunities. A person may register as a customer before becoming a provider. They may become a provider only after the required identity and qualification evidence is approved.

A qualification badge states exactly what was checked. A qualification alone must not be presented as permission to practise a regulated profession.

### Collaboration

Supported categories include:

- one business providing a defined service to another;
- multiple providers fulfilling one request;
- business capacity requests;
- joint projects or revenue-sharing collaboration;
- referral partnerships;
- shared equipment or premises.

The MVP excludes employee placement, labour hire, payroll, and placing one company’s employees under another company’s day-to-day control. A business may sell a defined service while remaining responsible for its own workers.

Each collaboration category has its own structured agreement prompts. The agreement records the service, price or quote method, date/time, location, equipment, supervision, staff responsibility, cancellation terms, quality criteria, and non-performance response. Both parties review and accept the agreement before it becomes active.

Scheduling supports structured date, time, duration, location, capacity, and availability fields plus free text.

Agreement states:

- Draft
- Invitation sent
- Pending acceptance
- Discussion
- Terms proposed
- Terms accepted
- Scheduled
- In progress
- Completed
- Cancelled
- Disputed
- Closed

Both parties confirm completion. If one does not confirm within 24 hours after the scheduled end, the record becomes incomplete. An unresolved collaboration request is removed from the user-facing interface after seven days; it is not the same as deleting a completed or active collaboration.

### Supply

Supported listing types:

- single product/item;
- bulk/wholesale;
- custom sourcing response;
- local-only;
- South Africa-wide;
- international shipping.

Rentals are excluded from the initial supply scope.

Individuals may request single items. Businesses may request single items or bulk/wholesale supply.

Visibility rules:

- single-item listings are available to eligible individual and business users;
- bulk/wholesale listings are visible to business profiles;
- suppliers select local, South Africa-wide, or international reach.

All lawful categories may be submitted. Prohibited and restricted categories are blocked or held for review.

International quotes show, where available:

- product price;
- currency and quote timestamp;
- shipping estimate;
- customs and duty estimate;
- tax estimate;
- local delivery estimate;
- delivery time;
- minimum order quantity;
- returns and damage terms;
- quote expiry;
- responsibility for each chain component;
- confidence level.

The buyer may use one supplier for the whole chain or replace individual components with alternatives such as another supplier, carrier, customs broker, or local delivery provider. Once the buyer chooses alternatives, the responsibility change is shown clearly and the original supplier is not responsible for the replaced component unless agreed otherwise.

Supply quote states:

- Draft
- Requested
- Supplier responding
- Quote received
- Buyer comparing
- Alternative requested
- Selected
- Expired
- Cancelled
- Fulfilled
- Disputed

Delivery remains estimated until the responsible supplier confirms the final quote. A confirmed route identifies who is responsible for product, shipping, customs, duties, local delivery, damage, loss, returns, and refunds.

## 9. Pricing and international economics

Providers and suppliers set prices or quote methods. The platform can recommend cheaper or more locally affordable options but cannot silently reduce the provider’s required payout.

For remote services, LinkHive may later recommend country-specific prices using local economic information, with a clear explanation and green/orange/red affordability signal:

- green: affordable compared with the local market;
- orange: around local market pricing or price-sensitive;
- red: likely expensive compared with local alternatives.

The signal is advisory. The provider may choose a different lawful price.

For physical or location-bound services, local supply, travel, equipment, time, and operating costs remain real. PPP cannot remove those costs. For cross-border supply, PPP cannot replace shipping, customs, taxes, insurance, or delivery economics.

## 10. Payments and currency — unresolved by design

The platform’s currency and international settlement problem is not solved in this plan and must not be presented as solved in the website prototype.

The following are explicitly excluded from the first website plan:

- real payments;
- wallet balances;
- PPP currency;
- LinkHive currency issuance;
- credit;
- cash-out;
- artificial Forex rates;
- provider payout guarantees;
- payment-provider connectors.

The unresolved question is how to reduce the gap between local affordability and provider cost without creating an unfunded liability, issuing unsafe credit, or pretending that PPP is a real exchange rate.

Future research may examine:

- mutual-credit clearing;
- reserve-backed units;
- transaction-backed settlement claims;
- multilateral netting;
- local-value exchange;
- pooled demand;
- service decomposition;
- licensed wallet and payment partners.

No future model may be approved until it explains who bears the difference when the buyer’s affordable price is below the provider’s viable cost.

When payments are eventually considered, the company must define its legal role, funds flow, provider onboarding, fees, refunds, chargebacks, disputes, payout currencies, tax treatment, safeguarding, and country-by-country compliance.

## 11. Administration and operating roles

The platform separates power by function:

### Administrators
Admins hold ultimate authority over platform settings, users, rules, bans, categories, staff roles, and escalations.

### Finance handlers
Finance handlers manage financial investigations, payment trails, freezes, releases, payout issues, and financial fraud cases within their permission scope. They cannot change identity evidence, legal category rules, or administrator permissions.

### Customer support
Customer support handles everyday questions. Support may use AI assistance but escalates flagged cases to the appropriate finance, verification, moderation, or admin role. Support does not independently make sensitive financial or identity decisions.

### Verification reviewers
Verification staff review identity, qualification, business, and service evidence.

### Moderation reviewers
Moderation staff review reports, listings, chats, safety flags, and suspensions.

A person may hold multiple roles at the beginning, but permissions remain separated in the system.

## 12. Data, privacy, and account lifecycle

- Identity and qualification documents are handled by approved verification providers where possible.
- Raw documents are visible only to verification staff, finance handlers where necessary, and authorised admins.
- Documents are retained only for the approved retention period and then deleted or replaced by a verification result/reference.
- Account deletion may be requested, but deletion is blocked while unresolved disputes, unpaid fees, or legally required retention obligations remain.
- Public content is hidden when an account is deactivated.
- Completed transaction, dispute, fraud, and audit records are retained as legally required.
- Admin actions, verification decisions, bans, appeals, rule changes, and financial actions are logged.
- Admins may access private chats only when a report, safety incident, fraud signal, or dispute is opened.

## 13. Notifications and accessibility

The first product should support:

- in-app notifications;
- email;
- SMS;
- WhatsApp where a compliant provider is available;
- push notifications when a mobile app exists.

Users may disable non-essential notifications. Security, verification, legal, transaction, and safety notices may remain mandatory.

The interface must include responsive design, keyboard navigation, readable contrast, clear labels, meaningful error states, alt text, focus states, and accessible dialogs.

## 14. Website design direction

The website should be mobile-first but support desktop equally. Navigation is workspace-first rather than an information-heavy universal dashboard.

The visual identity should communicate trustworthy connection, practical usefulness, and global reach without looking like a bank, job board, or generic ecommerce store. Use a calm, professional interface with strong workspace separation, clear status labels, compact cards, and obvious next steps. The logo is being developed separately, so the wordmark must remain replaceable.

Core prototype screens:

1. Landing/home.
2. Registration and account setup.
3. Workspace selection.
4. Profile drawer with hidden and registered workspaces.
5. Workspace dashboard.
6. Customer Service search, filters, listing detail, and request flow.
7. Qualification / Jobs search, qualification profile, and opportunity detail.
8. Collaboration discovery, group invitation, agreement prompts, and status view.
9. Supply discovery, product detail, quote comparison, and alternative route flow.
10. Connection requests and state transitions.
11. Accepted-connection messages.
12. Public profile and contact-visibility settings.
13. Notification preferences.
14. Demo verification flow using fake documents.
15. Report/block modal.
16. Admin-review and temporary-flag state surface.
17. Future-capability notice for payments and currency, clearly marked “Not available yet.”

## 15. Technical implementation plan for the real website

The original implementation preference is HTML plus Python. The recommended production architecture is:

- Python 3.12+;
- Django for authentication, server-rendered pages, admin, and ORM;
- Django REST Framework for a future mobile API;
- PostgreSQL;
- PostGIS later for geographic matching;
- HTML templates with CSS and progressive JavaScript/HTMX or Alpine.js;
- Redis and Celery later for notifications, document processing, and provider callbacks;
- secure object storage for documents and media;
- a translation layer with locale-aware content and fallback language;
- an event/audit model for requests, verification decisions, reports, moderation, and agreements.

The first prototype may use mock data and client-side state, but the real product requires a backend, database, authentication, roles, permissions, audit logging, secure document handling, provider integrations, moderation tools, and operational dashboards.

## 16. What building the real product requires

### Product and operations

- final category taxonomy;
- country rollout plan;
- service-risk classification;
- support procedures;
- verification review procedures;
- moderation and appeals process;
- dispute and refund policy;
- provider quality standards;
- incident response plan.

### Legal and compliance

- company and marketplace structure;
- privacy and data-protection compliance;
- consumer-protection review;
- qualification and professional-practice boundaries;
- labour-law review for collaboration features;
- payment and wallet licensing analysis;
- tax and cross-border obligations;
- customs and restricted-goods rules;
- contracts with verification, payment, logistics, translation, and messaging providers.

### Engineering

- authentication and account recovery;
- role-based access control;
- listings and version history;
- search and matching;
- messaging and notifications;
- connection lifecycle;
- group collaboration and agreement records;
- supply quotes and alternatives;
- moderation and reporting;
- verification-provider integration;
- analytics and audit logs;
- localization;
- security monitoring, backups, and recovery;
- API for the future native mobile app.

### Payments and future currency research

Do not build the wallet or currency until the unresolved gap problem has a financially and legally defensible answer. The approved research question is:

> How can LinkHive reduce the gap between buyer affordability and provider viability using completed user transactions, real settlement, and no unsecured credit or hidden subsidy?

## 17. Definition of success for the first website

The first website succeeds if a user can:

1. register with a clear purpose;
2. see only relevant workspace interfaces;
3. create or discover a listing;
4. search using words and filters;
5. compare providers, qualifications, collaborations, or supply options;
6. submit a reasoned connection request;
7. receive, accept, decline, or ignore a request;
8. communicate after acceptance;
9. form a moderated collaboration group;
10. compare supply routes and responsibilities;
11. report unsafe or fraudulent activity;
12. understand what is verified, estimated, pending, or unavailable;
13. see that payments and the currency model are future capabilities rather than misleading promises.

The first website validates whether LinkHive can create useful connections. It does not claim to have solved global currency inequality yet.


---

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

---

# Product Scope

## Geography

South Africa is the first fully supported country. The product is country-wide, not Kimberley-specific. The architecture is global, but unsupported countries must be labelled rather than silently treated as supported.

## Four workspaces

### Customer Service
Find or offer lawful everyday services. Normal services do not automatically require qualifications unless the category requires them.

### Qualification / Jobs
Connect qualified people with opportunities. Qualifications matter; prior experience must not be a hidden requirement for unemployed users. A qualification badge says exactly what evidence was checked.

### Collaboration
Registered service providers and businesses create defined collaborations, group projects, capacity requests, referrals, shared equipment, and premises arrangements. Exclude employee placement, labour hire, payroll, and temporary staffing.

### Supply
Find single products, bulk/wholesale products, custom sourcing responses, local supply, South Africa-wide supply, or international shipping. Exclude rentals. Individuals can request single items; businesses can request single or bulk items.

## Account behavior

Email and password registration is the prototype baseline. Workspaces are hidden until registered. Only successfully verified workspaces become fully functional. Pending workspaces show the next step.

Personal accounts use the person’s name. Business accounts use the linked business name. Empty profile sections are omitted. Contact visibility is owner-controlled: private, accepted connections, or public.

## Trust behavior

The prototype may show a fake bank-style demo verification flow, clearly labelled Demo. It must not collect real documents. Future verification includes identity, liveness, OCR, document checks, face match, duplicate detection, and manual mismatch review.

## Discovery

Support natural language and structured search. Keep local and global filters grouped. Rank by match, distance, verification/legal eligibility, price, availability/response time, then completed-connection ratings.

## Connections

States: Draft, Sent, Viewed, Accepted, Declined, Expired, Cancelled, Completed, Reported, Blocked. A receiver sees the sender message and can accept, decline, or ignore. Ignored requests expire after seven days. Messaging opens after acceptance. Ratings are public after completion. Reports require a written reason.

## Supply quote requirements

Show product price, currency and timestamp, shipping, customs/duty, tax, local delivery, delivery time, MOQ, returns/damage, expiry, component responsibility, and confidence where available. Buyers can replace supplier, product, carrier, customs broker, or local delivery. Replaced responsibility must be displayed.

## Collaboration agreement requirements

Use category-specific agreement prompts. Show service, price/quote method, time, location, equipment, supervision, staff responsibility, cancellation, quality criteria, and non-performance response. Both parties accept before activation. Completion requires both parties; after 24 hours unconfirmed it is incomplete, and unresolved requests disappear from the user view after seven days.

## Explicitly excluded

No real payments, wallet, PPP currency, LinkHive currency, credit, cash-out, artificial Forex rate, identity-document collection, real provider connectors, or final AI legal decisions. The currency/settlement problem remains an open research item.

---

# LinkHive Design System

## Design movement

Trustworthy civic marketplace: calm, practical, human, and globally aware. Avoid bank-like heaviness, generic SaaS gradients, and ecommerce clutter.

## Brand essence

LinkHive helps people find the right connection and move from need to agreement. Personality: practical, fair, connected.

## Colour tokens

Use CSS variables only. Primary ink `#14213D`; muted ink `#536174`; canvas `#F7F8FA`; surface `#FFFFFF`; border `#E3E8EF`; signature hive colour `#F2B84B`; signature deep hive `#B87313`; success `#198754`; warning `#B7791F`; danger `#C0392B`; information `#2563EB`; disabled `#A7B0BE`.

Never use raw colour values outside the token file. Do not use red for normal emphasis. Red means danger, blocked, or failed.

## Typography

Use a system sans stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Body 16px/1.5. Small label 12px/1.35. Caption 13px/1.4. H1 32px/1.1 desktop and 28px/1.15 mobile. H2 24px/1.2. H3 18px/1.25. Button text 14px/1.2, weight 700.

## Spacing

Use a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Default page padding 16px mobile, 24px tablet, 32px desktop. Card gap 12px mobile and 16px desktop. Maximum reading width 720px. Maximum app content width 1200px.

## Shape and elevation

Card radius 16px. Button radius 10px. Input radius 10px. Pill radius 999px. Use one subtle shadow only: `0 8px 24px rgba(20,33,61,.08)`. Prefer borders over stacked shadows.

## Layout

Mobile-first. At 375px width the main page must fit without horizontal scrolling. Bottom navigation is fixed on mobile with safe-area padding. Desktop uses a left workspace rail and a content column. Do not use a centered dashboard grid as the only structure; use a content stream with purposeful sections.

## Signature elements

Use a small honeycomb mark or six-dot cluster as a replaceable logo placeholder. Use a left-edge coloured workspace rail. Use status chips with text, never colour alone.

## Interaction

Every interactive element has hover, focus-visible, pressed, disabled, and loading behavior where relevant. Focus ring: 3px `rgba(37,99,235,.28)` plus 1px information border. Motion is 150–220ms ease-out. Respect `prefers-reduced-motion`.

## Components

Required primitives: Button, IconButton, TextInput, Select, Textarea, Checkbox, Chip, Badge, Card, Avatar, Drawer, Modal, Toast, Tabs, ProgressStepper, EmptyState, ErrorState, Skeleton, ListingCard, RequestCard, QuoteCard, WorkspaceShell, BottomNav, DesktopRail.

## Content rules

Use plain English, sentence case, and direct actions. Primary CTAs use verbs: “Find a provider”, “Create a listing”, “Send request”, “Accept request”, “Compare quotes”. Never use “Click here”. Every estimate says “Estimated”. Every future capability says “Not available yet”.

## Responsive breakpoints

Base: 0–639px. Tablet: 640–1023px. Desktop: 1024px and above. At base, one column and bottom navigation. At tablet, two-column detail layouts where safe. At desktop, rail plus content and optional right detail panel.

---

# Information Architecture Revision — One Workspace at a Time

## Correction

The previous visual previews placed Customer Service, Qualification / Jobs, Collaboration, and Supply on one screen. That is rejected because it creates cognitive overload and makes the product look like four unrelated applications at once.

## New rule

A user enters one workspace at a time. The active workspace owns the page, language, query, filters, cards, and primary action. Other workspaces do not appear as cards on the active home screen.

## First screen after login

Show only the user’s first registered workspace. If the user has registered for multiple workspaces, show the last-used workspace only. Provide a small profile/menu control labelled “Switch workspace” rather than showing all workspace cards.

## Workspace switching

Open the profile drawer or workspace switcher. List only registered workspaces. Unregistered workspaces appear under “Add workspace” and are not mixed into the active product screen. Selecting a workspace navigates to that workspace’s home route and resets only workspace-specific filters; global account state remains.

## Active workspace layout

One header, one purpose statement, one main query, one filter control, one result stream, and one primary action. Maximum visible content on first load: two result cards plus one optional saved/recent section. No dashboard mosaic.

## Mobile navigation

Bottom navigation contains only: current workspace Home, Requests, Messages, Profile. If the workspace has an additional core area, it is opened from the workspace header or profile drawer, not added as a fifth crowded tab.

## Desktop navigation

The left rail shows the current workspace name and four global utilities: Home, Requests, Messages, Profile. Workspace switching is a single button at the top of the rail. Do not show four simultaneous workspace tiles.

## Query design

Each workspace has one plain-language query with an optional filter drawer. The page should not show every possible filter until the user opens Filters. Applied filters appear as compact chips beneath the query.

## Separate sections

Customer Service, Qualification / Jobs, Collaboration, and Supply each receive separate route screens and separate simplified previews. Shared components may be reused, but the screen content must not mix.

## Acceptance

A first-time user can understand the purpose of the current screen in five seconds. A user can switch workspace in two taps or fewer after opening the profile/menu control. At 375px width, no screen contains four workspace cards or more than two primary result cards above the first scroll.


---

# Exact Menu and Navigation Specification

## Global top bar

Mobile top bar, left to right: menu/profile icon, current workspace name, optional search icon, notification bell, avatar. Desktop: LinkHive wordmark, workspace rail, search, notifications, language selector, avatar.

## Profile drawer options

Always show: My profile, Account settings, Notification settings, Language, Help and safety, Sign out.

Show registered workspaces as active: Customer Service, Qualification / Jobs, Collaboration, Supply. Show unregistered workspaces as hidden behind “Add workspace”. When opened, an unregistered workspace card says “Register to unlock” and displays the required verification step. Do not put unregistered workspaces in the main navigation.

Account settings options: Personal details, Business details if business account, Location, Contact visibility, Password, Sessions, Delete/deactivate account. Payment, wallet, currency, and payout entries must be visibly disabled with “Not available in this prototype.”

Help and safety options: Safety tips, Report a problem, Report a user or listing, Blocked users, Community rules, Terms placeholder, Privacy placeholder. Legal links must not invent legal text.

## Customer Service menus

Primary actions: Find a service, Create a service listing, My requests, Saved listings.

Filters: Search words, service category, location, distance, local/global, availability, price/quote, verified only, response time, rating, delivery/remote, language.

Sort: Best match, Lowest price, Lowest estimated total, Nearest, Fastest response, Highest verification, Highest rating, Available soonest.

## Qualification / Jobs menus

Primary actions: Find an opportunity, Create qualification profile, My requests, Saved profiles.

Filters: Search words, qualification category, qualification level, location, local/global, remote/on-site, availability, verified qualification, employer/business, engagement type, language.

Sort: Best match, Closest, Verified first, Lowest stated cost, Fastest response, Highest rating.

## Collaboration menus

Primary actions: Find collaborators, Create collaboration request, My groups, Invitations, Agreements.

Filters: Collaboration category, provider/business, location, local/global, capacity, date range, group size, verified business, availability, remote/on-site.

Sort: Best match, Available soonest, Closest, Verified first, Lowest quote, Highest rating.

## Supply menus

Primary actions: Find products, Create sourcing request, My quotes, Saved suppliers.

Filters: Single item/bulk, category, supplier location, buyer location, local/South Africa-wide/international, quantity/MOQ, estimated total, delivery time, supplier verification, quote confidence, returns available.

Sort: Best match, Lowest product price, Lowest estimated total, Fastest delivery, Nearest supplier, Verified first, Highest confidence.

## Query behavior

Every filter has a label, current value, clear action, and applied-filter chip. “Clear all” resets filters but never deletes the user’s typed search. Enter submits search. Escape closes filter drawers and modals. Mobile filters open in a full-height drawer with Apply and Reset buttons. Desktop filters are a left column or popover.

## Disabled option behavior

Payments, wallet, currency, cash-out, real document upload, real provider connection, and live legal automation are not clickable capabilities. Render them as disabled rows with an explanation, not as active buttons.

---

# Input and Query Specification

## Common input rules

Every field has a visible label, optional/required indicator, helper text when needed, validation message, and accessible error association. Never validate only on blur; validate on submit and preserve user input. Trim whitespace. Do not accept invisible-only text. Use realistic examples, not lorem ipsum.

## Registration

Name: required, 2–80 characters. Email: required, valid format. Password: required, minimum 8 characters, show/hide control. Account type: Personal or Business. Business name appears only when Business is selected. Submit label: Create account.

Errors: “Enter your name.” “Enter a valid email address.” “Use at least 8 characters.” “Choose Personal or Business.” “Enter the business name.”

## Workspace registration

Prompt: “What do you want to use LinkHive for first?” Options: I need a service, I offer a service, I have qualifications, I need a collaborator, I need supplies, I supply products. The selection maps to one or more workspace registrations and never silently creates verification.

## Search query prompts

Customer Service placeholder: “What do you need help with?”
Qualification / Jobs: “What qualified person or opportunity are you looking for?”
Collaboration: “What kind of partner or capacity do you need?”
Supply: “What product, quantity, and delivery location do you need?”

Search suggestions are mock-only and deterministic: cleaning, graphic design, massage service, qualified assistant, bulk packaging, local delivery, translation, website development.

## Listing creation: common fields

Title required, 5–80 characters. Description required, 20–1,000 characters. Location required unless Remote is selected. Reach required: Local, South Africa-wide, International. Availability required. Price mode required: Starting price, Quote required, Price range. Include/exclude fields optional but omitted when blank. Language optional. Contact visibility uses profile setting.

## Customer Service fields

Service category required. Service type: Remote, In-person, Hybrid. Duration optional. Starting price optional. Service boundaries required for regulated or sensitive category. Prompt: “What exactly will the customer receive?”

## Qualification / Jobs fields

Qualification title required. Institution optional in prototype. Qualification level required. Certificate status: Not verified, Pending, Verified. Opportunity type: Employment, Contract, Project, Referral, Other. Experience is optional and must never be required. Prompt: “What are you qualified or prepared to help with?”

## Collaboration fields

Category required. Request/offer required. Title required. Desired participants required. Description required. Date/time and duration required before scheduling. Location or remote required. Equipment responsibility required. Supervision responsibility required. Price or quote method required. Prompt: “What must each party agree to before work begins?”

## Supply request fields

Product required. Quantity required and numeric greater than zero. Single item or bulk required. Buyer location required. Delivery target required. Acceptable alternatives optional. Budget optional. Prompt: “What can be replaced if the first supplier or route is unavailable?”

## Connection request wizard

Step 1 Reason: required, 10–500 characters. Step 2 Desired outcome: optional. Step 3 Timing: optional. Step 4 Location/boundaries: optional. Review shows all entered values before Send request.

Reason examples: “I need three quotes for a local event.” “I want to understand whether you can provide this remotely.” “I am looking for a qualified person for a short project.”

## Report form

Reason required select from the approved categories. Details required, 20–1,000 characters. Checkbox: “I understand this report is reviewed and false/spam reports may be restricted.” Submit: Report for review.

## Agreement acceptance

Show every required agreement field in read-only review. Checkbox required: “I have reviewed the scope and responsibilities.” Buttons: Accept terms, Go back and edit. No payment acceptance exists.

## Notification settings

Channels: In-app, Email, SMS, WhatsApp, Push. Essential safety, security, and verification notices are locked on. Non-essential channels have toggles. Each toggle updates state immediately and shows “Notification preference saved.”

---

# Workspace Tab Designs

## Shared workspace shell

Each workspace has: a unique accent stripe, workspace title, one-sentence purpose, primary CTA, search/query area, filters, result stream, saved/request shortcut, and contextual help. The global shell remains recognizable, but the content language and cards do not mix across workspaces.

## Customer Service tab

Accent: information blue. Header title: “Find a service”. Primary CTA: “Create a service listing”. Hero query asks “What do you need help with?” Result cards show provider, service, location/reach, verification badges, availability, price or quote required, rating, and response time. Detail page has “Send request” as primary CTA.

Empty state: “No services match these filters.” Actions: Clear filters, broaden location, create a request.

## Qualification / Jobs tab

Accent: success green. Header title: “Qualifications and opportunities”. Primary CTA changes by account: “Create qualification profile” or “Post an opportunity”. Query asks “What qualified person or opportunity are you looking for?” Cards prioritize verified qualification, field, location, availability, and opportunity type. Never show “experience required” unless the listing owner explicitly adds it; label it separately from qualification.

Empty state: “No matching opportunities yet.” Actions: adjust filters, save search, create profile.

## Collaboration tab

Accent: deep hive gold. Header title: “Build a team or partnership”. Primary CTA: “Create collaboration request”. Query asks “What kind of partner or capacity do you need?” Cards show category, participants needed, date, location, business/provider verification, agreement status, and response time.

Detail page uses an agreement stepper: Scope, Responsibilities, Schedule, Terms, Members. Admin approval is visible for invitations.

## Supply tab

Accent: deep ink. Header title: “Find supply options”. Primary CTA: “Create sourcing request”. Query asks “What product, quantity, and delivery location do you need?” Cards show product, quantity/MOQ, supplier location, reach, product price, estimated route total, delivery window, confidence, and responsibility note.

Detail page uses a route comparison panel: Product, Shipping, Customs, Local delivery. Each component can show an alternative. Estimated and confirmed labels are always text-based.

## Mobile tab behavior

Only registered workspaces appear in the bottom navigation. If more than three workspaces are registered, use a More drawer rather than cramped labels. The active workspace label is always visible at the top. Switching workspaces preserves the current route state and does not mix result data.

## Desktop tab behavior

The left rail shows icons plus text. The selected workspace has a coloured rail marker and active background. The right side may show detail or request context but never replaces the primary content on smaller widths.

---

# Screen Blueprint

Every route below must have a loading, empty, error, and success state. Mock data is deterministic.

## Routes

`/` landing; `/register`; `/onboarding/workspaces`; `/app`; `/app/customer`; `/app/customer/listings/:id`; `/app/qualification`; `/app/qualification/profiles/:id`; `/app/collaboration`; `/app/collaboration/:id`; `/app/supply`; `/app/supply/quotes/:id`; `/app/requests`; `/app/messages`; `/app/profile`; `/app/settings/notifications`; `/app/verification/demo`; `/app/admin/review`.

## Landing `/`

Header: logo, language selector, Sign in, Create account. Hero: “Find the right connection.” Supporting sentence explains services, qualified people, collaborations, and supply. Four workspace cards. CTA buttons navigate to registration or the relevant public explainer. Footer links are functional anchors or clearly marked unavailable.

## Registration `/register`

Fields: name, email, password, account type personal/business. Validation is visible. Submit creates mock user and navigates to workspace selection. Sign in is a mock success path; forgot password shows a safe demo notice.

## Workspace selection `/onboarding/workspaces`

Four selectable cards with title, purpose, required next step, and selection state. Continue stores selected workspaces and opens `/app`. Do not expose unselected workspaces in the main nav.

## App shell `/app`

Mobile: top bar with wordmark and profile button; fixed bottom nav with only registered workspaces plus Requests and Profile. Desktop: left rail with same items. Profile drawer contains unregistered workspaces as locked options with “Register to unlock”.

## Workspace dashboard

Each workspace has a distinct title, accent rail, primary action, search field, filter button, result cards, saved section, and empty state. Do not mix listings from other workspaces in the main stream.

## Listing detail

Show title, provider, location, verification badges with explanations, price or “Quote required”, availability, description, what is included, what is not included, and primary Send request CTA. Report and block are secondary actions. Contact details obey visibility settings.

## Request flow

Use 4 optional steps: goal/reason, timing, location/boundaries, budget or quote preference. The reason step is required. Review summary before Send request. Show success state with request ID and status Sent. Disable duplicate send while pending.

## Requests

Tabs or filters for Sent, Received, Accepted, Completed, Expired, Reported, Blocked. Request card shows state, sender/receiver, message, timestamp, and valid next actions. Ignore leads to Expired after simulated confirmation; Accept opens messages; Decline records the reason optionally.

## Messages

Only accepted connections appear. Before acceptance, show an explanation rather than a blank chat. Accepted chat has message composer, attachment placeholder disabled with explanation, report, block, and connection status. Sending a message appends to mock state.

## Collaboration

Show collaboration categories, group cards, invite states, agreement stepper, member list, and admin approval controls. Agreement acceptance changes Terms proposed to Terms accepted. Completion has two confirmations and a 24-hour incomplete explanation in the detail screen.

## Supply

Show single/bulk tabs, local/South Africa-wide/international filters, listing cards, quote details, component cards, alternatives, responsibility changes, estimated/confirmed labels, expiry, and compare view. Any disabled payment button says “Payments are not available in this prototype.”

## Demo verification

Use fake document tiles labelled DEMO. Never request upload from the user. Stepper: document sample, selfie sample, automated checks, manual review, result. Mismatch result requires “Request manual review” and records Pending review.

## Admin review

Mock-only admin surface with report queue, reason categories, temporary suspension status, assigned role, decision, and audit event. Do not expose raw documents. Show permission notice.

## Required interaction inventory

Registration submit, workspace select, drawer open/close, workspace unlock prompt, search, filters, listing detail, save/unsave, request wizard next/back, request submit, accept, decline, ignore, message send, invite, approve member, accept agreement, report, block, notification toggle, demo verification next/review, admin assign/resolve, language select, responsive bottom navigation.

---

# Verification Demo Specification

## Safety boundary

This is a visual demo only. It must never access a camera, request a real identity document, upload a real file, call a verification vendor, or claim a real identity decision. Every screen includes a small `DEMO — no real documents are collected` label.

## Entry

Profile drawer > workspace pending card > “See demo verification”. The route is `/app/verification/demo`. The user can exit at any step without losing account state.

## Step 1: Explain

Title: “Verification protects the marketplace.” Explain that a real product would use an approved verification provider. CTA: “View demo flow”. Secondary: “Not now”.

## Step 2: Fake document sample

Show two prebuilt fake tiles: `DEMO ID FRONT` and `DEMO ID BACK`. The user chooses a sample; no file input exists. Show quality checks as mock progress: Image quality, Text extraction, Security checks.

## Step 3: Fake selfie/liveness

Show a stylised placeholder avatar, not a human likeness. Label: `DEMO SELFIE`. Mock checks: Liveness, Face match. No camera permission request.

## Step 4: Result variants

Provide a visible demo selector only for development: Passed, Manual review, Mismatch, Rejected. In the user-facing flow, the default is Manual review. Each result has a specific explanation.

Passed: “Demo checks passed. This is not real verification.”
Manual review: “The demo needs a human reviewer.” CTA: Request manual review.
Mismatch: “The name did not match in this demo.” CTA: Request manual review.
Rejected: “The demo document could not be accepted.” CTA: Return to profile.

## Step 5: Manual review

Show status Pending review, expected mock response window “24–48 hours in this demo”, assigned role Verification reviewer, and an audit event. Do not promise a real decision time.

## Step 6: Completion

Return to the relevant workspace card with status Pending or Verified demo. The workspace must not become genuinely verified because of this demo. Use a `demoVerified` flag separate from production `verificationState`.

## Required tests

Verify no file input, camera API, network upload, real ID strings, or provider call exists. Verify DEMO label appears on every step. Verify exit, back, retry, manual review, and all result variants work.

---

# Architecture

## Preferred prototype architecture

Use a small typed frontend with route-level pages, shared components, a central mock store, and deterministic mock repositories. If the selected scaffold already chooses React/TypeScript, keep it. If using Python/Django for the real website, keep templates and API boundaries aligned with the same contracts.

## Required source layout

```text
src/
  app/                 route definitions, providers, error boundary
  components/          reusable UI primitives
  features/
    auth/
    workspaces/
    customer/
    qualification/
    collaboration/
    supply/
    requests/
    messages/
    profile/
    verification/
    admin/
  data/                types, mock data, mock repository
  state/               store, actions, selectors
  styles/              tokens, globals, accessibility
  utils/               validation, dates, formatting
  tests/               unit and interaction tests
public/
  manus-routes.json
```

Do not place all application code in one file. Do not place business logic inside presentational components.

## Layer rules

Pages compose features. Features call store actions. Store actions call mock repository functions. Components receive typed props and emit typed callbacks. Formatting and validation live in utilities. No component directly mutates mock data.

## Error boundary

Provide a top-level error boundary with a retry action. Route-not-found must have a useful page and a link back to the current user’s workspace.

## Storage

For prototype state, use in-memory state plus optional localStorage with a version key. On parse failure, discard corrupted state and show a non-blocking reset notice. Never store secrets or real documents.

## Routing

Routes must be declared once. Create `public/manus-routes.json` containing every non-API route. Use relative browser URLs. Do not hardcode localhost or internal preview hosts.

## Data flow

All state-changing operations return `{ok:boolean, data?, error?}` and update pending/success/error state. Simulated delays must be short and cancellable where possible. Double-submit protection is required.

## Future backend boundary

Future Django endpoints should preserve entity names, status values, validation messages, and permission boundaries in `DATA-CONTRACTS.md`. Do not make the prototype dependent on a future endpoint.

---

# Data Contracts

Use exact string unions/enums. Do not invent alternate spellings.

```ts
type Workspace = 'customer' | 'qualification' | 'collaboration' | 'supply';
type AccountType = 'personal' | 'business';
type VerificationState = 'not_started' | 'pending' | 'verified' | 'rejected' | 'manual_review';
type ConnectionState = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired' | 'cancelled' | 'completed' | 'reported' | 'blocked';
type AgreementState = 'draft' | 'invitation_sent' | 'pending_acceptance' | 'discussion' | 'terms_proposed' | 'terms_accepted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'closed';
type QuoteState = 'draft' | 'requested' | 'supplier_responding' | 'quote_received' | 'buyer_comparing' | 'alternative_requested' | 'selected' | 'expired' | 'cancelled' | 'fulfilled' | 'disputed';
type ReportReason = 'fraud' | 'theft' | 'identity_fraud' | 'false_documents' | 'illegal_activity' | 'harassment' | 'unsafe_service' | 'payment_issue' | 'other';
```

## User

`id`, `name`, `email`, `accountType`, `registeredWorkspaces`, `verificationByWorkspace`, `contactVisibility`, `location`, `avatarInitials`.

## Listing

`id`, `workspace`, `title`, `ownerId`, `ownerName`, `ownerType`, `location`, `reach`, `description`, `included`, `excluded`, `priceLabel`, `quoteRequired`, `availability`, `verificationBadges`, `rating`, `reviewCount`, `tags`, `createdAt`, `status`.

## ConnectionRequest

`id`, `listingId`, `senderId`, `receiverId`, `message`, `reason`, `state`, `createdAt`, `updatedAt`, `expiresAt`, `workspace`.

## MessageThread

`id`, `connectionId`, `participantIds`, `messages[]`, `canMessage`, `lastMessageAt`.

## Collaboration

`id`, `category`, `creatorId`, `title`, `members[]`, `inviteStates`, `agreementState`, `agreementFields`, `schedule`, `completionConfirmations`, `createdAt`.

## SupplyQuote

`id`, `requestId`, `supplierId`, `state`, `components[]`, `currencyLabel`, `timestamp`, `expiresAt`, `confidence`, `responsibilityChanges[]`.

## Report

`id`, `reporterId`, `targetType`, `targetId`, `reason`, `details`, `status`, `assignedRole`, `createdAt`, `auditEvents[]`.

## Mock rules

Use at least three records per workspace, one verified, one pending, and one unverified where appropriate. Use fake names and fake locations. Use no real phone numbers, identity numbers, bank details, document images, or provider logos. Keep fixtures in `src/data/mock` and never create mock objects inline in page components.

---

# State Machines

Every transition must be implemented as a named action and tested. Invalid transitions must return an error and leave state unchanged.

## Registration

`unregistered -> account_created -> workspace_selection -> active`.

## Workspace

`not_registered -> registered_pending -> verification_pending -> active` or `verification_rejected -> manual_review`. A hidden workspace is not the same as rejected.

## Connection

`draft -> sent -> viewed -> accepted`; `sent/viewed -> declined`; `sent/viewed -> expired` after seven simulated days; `draft/sent/viewed -> cancelled`; `accepted -> completed`; any active state can become `reported` or `blocked` through moderation. Only accepted can open a message thread.

## Collaboration agreement

`draft -> invitation_sent -> pending_acceptance -> discussion -> terms_proposed -> terms_accepted -> scheduled -> in_progress -> completed`. Cancellation and dispute can branch from active states. After scheduled end plus 24 hours without both confirmations, use `incomplete` presentation state; do not silently call it completed.

## Supply quote

`draft -> requested -> supplier_responding -> quote_received -> buyer_comparing -> selected -> fulfilled`. `buyer_comparing -> alternative_requested -> quote_received`. Expired, cancelled, and disputed may branch according to the quote status.

## Verification demo

`not_started -> sample_selected -> checks_running -> checks_passed` or `manual_review` or `rejected`. Always show the DEMO label.

## Reports

`submitted -> triaged -> assigned -> under_review -> resolved` or `dismissed`. A serious report may set `temporary_suspension`, but the user-facing reason must be shown.

## Notification settings

Essential notifications cannot be disabled. Non-essential channels can be toggled. Changing a toggle immediately updates mock state and shows a confirmation toast.

## Buttons mapped to transitions

- Send request: draft -> sent.
- Accept: sent/viewed -> accepted.
- Decline: sent/viewed -> declined.
- Ignore: sent/viewed -> expired after simulated confirmation.
- Send message: accepted thread only.
- Invite: collaboration -> invitation_sent.
- Approve member: pending -> accepted.
- Accept terms: terms_proposed -> terms_accepted.
- Report: any visible target -> submitted.
- Block: any visible target -> blocked.
- Save: add/remove listing ID from saved set.
- Payment actions: disabled with explanation; no state transition.

---

# Actual Website Build Specification

## Build target

Create a polished responsive website prototype from the existing repository scaffold. Do not start a second framework. First inspect the repository and use its existing scripts. The prototype uses deterministic mock state and must be runnable from a fresh clone using the documented README commands.

## Page construction order

1. App shell and tokens.
2. Landing page.
3. Registration and onboarding.
4. Workspace shell and profile drawer.
5. Customer Service pages.
6. Qualification / Jobs pages.
7. Collaboration pages.
8. Supply pages.
9. Requests and messages.
10. Demo verification.
11. Notifications and admin review.
12. QA and polish.

## Exact component responsibilities

`AppShell`: route outlet, global error handling, current mock user, responsive shell.

`WorkspaceShell`: workspace title, accent, primary CTA, search, filter trigger, children, empty/error/loading slots.

`ListingCard`: renders one listing only; never owns global state; callbacks are `onOpen`, `onSave`, `onRequest`.

`RequestWizard`: owns step index and draft only; submit delegates to store action; supports back, cancel, validation, pending, success, failure.

`RequestCard`: renders state-specific actions from a transition map; never shows an action not allowed by the current state.

`ReportModal`: receives target type/id; validates reason/details; dispatches report action; closes only after success or explicit cancel.

`DemoVerification`: uses fake sample state only; never has a file input or camera access.

`QuoteComparison`: renders each cost component independently and shows estimate/confirmed/confidence labels.

## Placeholder policy

Use `<Skeleton />` for loading, `EmptyState` for zero records, `ErrorState` with Retry for failure, and inline helper text for unavailable features. Do not use blank white panels. Use fake portraits as initials or abstract shapes, never generated realistic identity photos. Use text and simple CSS marks instead of unlicensed logos.

## Exact future-feature placeholders

Payment button label: `Payments are not available in this prototype`.
Wallet row label: `Wallet is planned for a later release`.
Currency row label: `International settlement model is still under research`.
Document upload label: `Real document verification is not connected`.
Shipping guarantee label: `Delivery cost is estimated until a route is confirmed`.

Each placeholder must be disabled, readable, and non-dead: opening it shows an explanation drawer or tooltip.

## Mock interaction timing

Use 250ms simulated loading only for actions that need pending feedback. Do not delay navigation. Disable the submitting control during the pending period. Resolve deterministically; expose a development-only failure toggle in mock state if tests need it.

## Mobile acceptance measurements

At 375px: body has 16px side padding, buttons are at least 44px tall, tap targets at least 44x44px, cards use 16px radius, bottom nav is 64px plus safe area, no horizontal overflow. At 1440px: content max width 1200px, rail 240px, primary content 640–760px, optional detail panel 320–360px.

## Build completion evidence

Provide the start command, build command, test command, route manifest, file tree, screenshot list if available, and a table mapping every visible CTA to its implemented state transition. Any missing decision is listed under `OPEN_DECISION`; it is never silently filled.

---

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

---

# QA and Acceptance Checklist

## Automated checks

Run formatter check, lint, typecheck, unit tests, interaction tests, and production build. The build must fail on type errors. Do not suppress warnings without a written reason.

## Route checks

Every route in `manus-routes.json` returns the correct page, not a blank page or generic fallback. Every navigation item reaches a valid route. Back and close controls work.

## Dead-button audit

For every button and link, record: label, route/state effect, disabled condition, loading state, success state, error state, and test location. Fail the audit if a button has no effect, uses `href="#"`, logs only to console, or silently closes without feedback.

## Dead-code audit

Run unused export/import checks where available. Search for `TODO`, `FIXME`, `lorem`, `console.log`, `any`, fake endpoints, `localhost`, hardcoded secrets, and commented-out components. Each exception must be documented.

## State tests

Test every valid transition in `STATE-MACHINES.md` and at least one invalid transition per state machine. Test double submit, refresh persistence if enabled, expired request behavior, permissions, and reset corrupted local state.

## Responsive checks

Check 375x812, 390x844, 768x1024, and 1440x900. Verify no horizontal overflow, fixed bottom navigation does not cover content, dialogs fit, long names wrap, cards do not collapse, and all controls remain reachable.

## Accessibility checks

Keyboard-only navigation; visible focus; labelled inputs; labelled icon buttons; modal focus trap; Escape closes modal; screen-reader-friendly status text; colour is not the only status signal; contrast; reduced motion.

## Product safety checks

Confirm no real payment, wallet, currency, credit, cash-out, identity upload, legal guarantee, customs guarantee, or hidden unsupported country claim appears. Demo verification uses fake samples and a DEMO label.

## Manual scenario script

1. Register a personal user.
2. Select Customer Service only.
3. Confirm other workspaces are hidden from main navigation.
4. Search and filter a listing.
5. Open detail and save it.
6. Send a request with a reason.
7. Switch mock receiver and accept the request.
8. Send a message.
9. Complete the connection and view public rating state.
10. Report a listing with a reason.
11. Register an additional workspace and confirm its tab appears only after the intended mock verification state.
12. Test supply quote alternatives and responsibility changes.
13. Test collaboration invitation and agreement acceptance.
14. Open demo verification; confirm no real upload is possible.
15. Toggle a non-essential notification and confirm the toast.


---

# GitHub Workflow

## Repository layout

Keep the application source in the repository root and this specification in a top-level `docs/linkhive-build-spec/` folder, or keep this folder as the planning repository until implementation begins. Do not mix generated build output, secrets, screenshots, or local databases into commits.

## Required files

`.gitignore`, `README.md`, `CONTRIBUTING.md`, `.env.example`, `LICENSE` chosen by the owner, `docs/linkhive-build-spec/`, source code, tests, and CI configuration.

## Secrets

Use environment variables only. `.env.example` contains names and safe placeholder descriptions, never values. Check git diff and `git grep` before every commit for API keys, tokens, passwords, card data, ID numbers, private URLs, and uploaded documents.

## Branches

`main` is always buildable. Work in feature branches such as `feat/customer-search`, `feat/connection-flow`, or `fix/mobile-nav`. One logical feature per branch. Never commit generated dependencies or `node_modules`.

## Commit format

Use small commits: `feat: add workspace selection`, `fix: prevent duplicate request submit`, `test: cover connection transitions`, `docs: update prototype boundary`. Explain behavior changes in the body when needed.

## Pull request template

Every PR states purpose, routes changed, state transitions, mock data changes, screenshots or responsive notes, tests run, limitations, and whether any `OPEN_DECISION` remains. Confirm no payments, real documents, secrets, or unsupported claims were added.

## CI gates

CI must run install, format check, lint, typecheck, tests, production build, and a secret scan. A PR cannot merge when any gate fails. Add accessibility and route checks when the framework supports them.

## Delivery checklist

Before a GitHub upload: verify the app starts using documented commands; verify the route manifest; verify mobile and desktop layouts; run all QA checks; inspect the diff; remove temporary files; update `CHANGELOG.md`; update the README with setup commands; and include a clear statement that this is a mock prototype with unresolved payments/currency.

---

# Open Problems — Do Not Invent Answers

## Currency and international settlement

The gap between buyer affordability and provider viability is unresolved. Do not implement PPP currency, credit, wallet balances, artificial Forex, provider payout guarantees, or cash-out. Future research must explain who funds any gap, how reserves are verified, how redemptions work, and what happens during a one-way withdrawal run.

## Payments

Choose marketplace facilitator, agent, merchant of record, or another legal structure. Obtain written provider confirmation for onboarding, split payouts, refunds, disputes, chargebacks, holding funds, and cross-border settlement. A disclaimer cannot remove mandatory consumer, privacy, payment, fraud, or tax obligations.

## Verification

Choose an approved identity/qualification provider, secure document handling, retention, mismatch review, appeals, sanctions screening, and country coverage. Do not accept real documents in the prototype.

## Legal service classification

Create a maintained country/category rules source. AI may assist classification but cannot be the final authority for uncertain or high-risk cases.

## Supply operations

Choose carrier, customs, tax, returns, insurance, prohibited-goods, damage, and responsibility models. Never promise cheapest landed cost without data and confirmed responsibility.

## Global launch

Define country support tiers, languages, local support, privacy requirements, tax, payment availability, provider quality, moderation, and incident escalation before claiming full global functionality.

## Scale and resilience

Define rate limits, abuse prevention, backups, audit retention, disaster recovery, observability, moderation staffing, and data deletion before production.

## Mobile application

The website is first. A later native app should consume the same stable API and preserve workspace isolation, permissions, notification settings, and state contracts.

When an AI coding model encounters any of these questions, it must stop, write `OPEN_DECISION`, and ask the owner. It must not choose a convenient implementation silently.

---

# 19. Explicit Layout Specification

## 19.1 Layout principle

LinkHive uses one focused workspace per screen. Do not build a multi-product dashboard with four workspace cards. The active workspace owns the page. Other workspaces are available through the profile/workspace drawer only.

The visual order on every primary workspace screen is:

1. Top app bar.
2. Workspace title.
3. One-sentence purpose statement.
4. One main query input.
5. One filter/sort control row.
6. Applied-filter chips, only when filters exist.
7. Result count or short context label.
8. Maximum two primary result cards before the user scrolls.
9. Empty, loading, or error state when applicable.
10. Fixed mobile bottom navigation or desktop side rail.

Do not place promotional banners, four-workspace tiles, unrelated recommendations, payment prompts, or multiple competing CTAs above the first result cards.

## 19.2 Mobile viewport layout

Target viewport: 375px × 812px first, then verify 390px × 844px. Use 16px left and right page padding. The main content width is viewport width minus 32px. The minimum tap target is 44px × 44px. Buttons are at least 44px high. Inputs are 52px high. Cards use 16px internal padding and 16px radius.

The mobile vertical layout is:

```text
┌──────────────────────────────────┐
│ Safe area + top app bar          │ 56px minimum
├──────────────────────────────────┤
│ Workspace title                  │ 36–42px line height
│ Purpose statement                │ 24–48px content height
│                                  │ 16px gap
│ Main query input                │ 52px
│                                  │ 12px gap
│ Filter / sort controls          │ 44px
│ Applied filter chips (optional) │ 28–36px each
│                                  │ 20px gap
│ Result context/count             │ 20–24px
│                                  │ 12px gap
│ Result card 1                   │ variable, target 150–190px
│                                  │ 12px gap
│ Result card 2                   │ variable, target 150–190px
│                                  │ remaining scroll content
├──────────────────────────────────┤
│ Fixed bottom navigation          │ 64px + safe area
└──────────────────────────────────┘
```

The bottom navigation must have four items: Home, Requests, Messages, Profile. If a user has registered for several workspaces, Home remains the active workspace and switching happens through Profile or the workspace switcher; do not add a fifth cramped bottom-navigation item.

The page must reserve bottom padding equal to the bottom-navigation height plus 16px so the last card is never hidden behind the fixed navigation.

## 19.3 Mobile top app bar

The top app bar is 56px high excluding the device safe area. It contains the LinkHive mark or current workspace label on the left and the profile/menu control on the right. The menu control is at least 44px × 44px and has an accessible label: “Open profile and workspace menu”.

Do not show a large global hero image, four workspace tiles, a large promotional block, or multiple badges in the top area. The top bar is functional, not decorative.

## 19.4 Desktop layout

Target viewport: 1440px × 900px. Use a three-region structure:

```text
┌──────────────┬──────────────────────────────┬──────────────┐
│ Desktop rail │ Main workspace content       │ Detail panel │
│ 240px        │ max 720px, centered/left     │ 320–360px    │
│              │                              │ optional     │
└──────────────┴──────────────────────────────┴──────────────┘
```

The full application content has a maximum width of 1,200px and is horizontally centered. The desktop rail is 240px wide and remains visible. The primary content column is 640–760px wide. A detail panel is optional and appears only when the current screen requires comparison, a request preview, a quote, or a conversation.

Desktop rail order:

1. LinkHive wordmark.
2. Current workspace switcher.
3. Home.
4. Requests.
5. Messages.
6. Profile.
7. Help and safety at the bottom.

The active item has a coloured left marker, active background, icon, and text. The rail must never show unregistered workspaces as active destinations.

## 19.5 Tablet layout

At 640–1023px, use 24px page padding and one main column. The desktop rail becomes a compact top or drawer navigation. Use two columns only for short comparison cards; do not force two-column text forms. The bottom navigation may remain visible if the interface is being used as a touch device.

## 19.6 Landing page layout

The landing page is the only public page allowed to explain the overall concept. It must not behave like the authenticated workspace dashboard.

Desktop order:

```text
Header: wordmark | language | Sign in | Create account
Hero: title + explanation + primary CTA + secondary CTA
How it works: 3 numbered steps
Use-case explanation: one concise section
Trust boundary: verification and safety explanation
Footer: support, privacy placeholder, terms placeholder
```

Mobile order:

```text
Header
Hero title
Hero explanation
Create account button
Sign in link
Three-step explanation
Safety/trust section
Footer
```

The landing page must not promise payments, universal verification, guaranteed delivery, or equal global currency conversion.

## 19.7 Registration layout

Use a single-column form with a maximum width of 480px. On mobile use 16px side padding. On desktop centre the form in a 520px panel with a short explanatory heading above it.

Vertical order: wordmark, progress indicator if applicable, name, email, password, account type, conditional business name, consent/acknowledgement, submit button, sign-in link.

Use one primary submit button. Do not place unrelated promotional content beside the form. Validation appears below the relevant field and does not shift the entire form unpredictably.

## 19.8 Workspace selection layout

Show one vertical list of four selectable workspace rows, not a four-card dashboard. Each row includes an icon, title, one-line purpose, selection control, and verification note. On mobile each row is 72–92px high. On desktop the list is 600px wide.

The Continue button is sticky at the bottom of the content area on mobile and placed below the list on desktop. It is disabled until at least one workspace is selected and displays the reason for being disabled.

## 19.9 Workspace screen layout

All four workspaces share the same structural layout but use different accent colours and content.

### Customer Service

```text
Top bar
Customer Service
Get help from trusted local professionals.
[ What do you need help with?                     ]
[Filter] [Sort]                                    
2 results found
[ Service card 1                                  ]
[ Service card 2                                  ]
```

A service card contains provider name, provider type, verification badge, service description, location/reach, availability, price or quote label, rating if available, and a right-facing detail affordance. The primary action appears on the detail screen, not on every card.

### Qualification / Jobs

```text
Top bar
Qualifications / Jobs
Find qualified people or opportunities to work together.
[ What qualified person or opportunity are you looking for? ]
[Filters]
2 results found
[ Qualification/opportunity card 1 ]
[ Qualification/opportunity card 2 ]
```

Each card separates qualification from experience. Verification status is visible. Experience is never implied when absent.

### Collaboration

```text
Top bar
Collaboration
Find the right people to create, build, and grow together.
[ What kind of partner or capacity do you need? ]
[Filter] [Sort]
2 open collaborations
[ Collaboration card 1 ]
[ Collaboration card 2 ]
```

Each card shows category, title, short description, members needed, date or schedule, agreement status, and whether the request is open or in progress.

### Supply

```text
Top bar
Supply
Find trusted suppliers. Get quotes. Keep your projects moving.
[ What product, quantity, and delivery location do you need? ]
[Filter] [Sort]
2 supply options
[ Supply card 1 ]
[ Supply card 2 ]
```

Each supply card shows product, supplier, origin, estimated delivery, match/confidence, quote status, and whether the figure is estimated or confirmed. Do not place a checkout button on the discovery card.

## 19.10 Query and filter layout

The query input is full width within the main content column. It contains a search icon, plain-language placeholder, typed value, clear control when non-empty, and submit behavior on Enter. The filter button sits below or beside it depending on width.

Mobile filter drawer:

```text
Filter                         [Close]
Location/reach                 [control]
Category                       [control]
Verification                   [control]
Availability                   [control]
Price/quote                    [control]
Additional workspace filters  [control]
[Reset]                         [Apply filters]
```

Use a full-height drawer on mobile and a popover or left filter column on desktop. Filter controls are not permanently displayed as a dense wall of options.

## 19.11 Result-card layout

A card has a 12–16px internal gap, a clear top row, a primary title, secondary description, metadata row, status chip, and detail affordance. On mobile, cards are one column. On desktop, cards remain readable and do not become tiny tiles.

Recommended card anatomy:

```text
[optional avatar/image] [title and provider]
                       [verification/status]
[short description]
[location] [availability] [price/estimate]
[secondary tags]                              [open]
```

Images are optional. If no image exists, use initials or a simple abstract mark. Never leave a broken image icon.

## 19.12 Detail page layout

Mobile order: back button, title, owner/provider, verification explanation, description, included/excluded, location/reach, availability, price/quote, safety note, primary CTA, secondary report/block controls.

Desktop order: main detail column on the left and a sticky summary/action card on the right. The sticky card contains the current price/quote label, availability, verification summary, and primary action. Do not duplicate the entire detail content in the side panel.

## 19.13 Request wizard layout

Use a four-step horizontal progress indicator on desktop and a compact “Step 1 of 4” indicator on mobile.

```text
Step 1: Reason       required
Step 2: Outcome      optional
Step 3: Timing       optional
Step 4: Location     optional
Review: Summary      required before send
```

The wizard uses a single-column form. Mobile buttons are full width and stacked: Continue above Back, with Cancel as a text action. Desktop buttons align right. The final Send request button is disabled until the required reason is valid.

## 19.14 Requests layout

The Requests page has a page title, status filter chips, and a vertical list of request cards. Tabs are: Sent, Received, Accepted, Completed, Expired, Reported, Blocked. On mobile tabs may horizontally scroll, but the page itself must not horizontally scroll.

Each card shows state first, then people, message preview, time, and only valid actions. Accept and Decline appear for received pending requests. Message appears only for accepted requests. Expired requests have no active action except view history.

## 19.15 Messages layout

Desktop uses a conversation list column and a conversation detail column. Mobile uses a conversation list route and a separate conversation detail route. Accepted connections appear as conversations. A pending connection displays an explanation: “Messaging opens after the request is accepted.”

The composer is fixed to the bottom of the conversation panel but remains above mobile navigation. Send is disabled for blank messages and shows a pending state during submission.

## 19.16 Profile drawer layout

The drawer is 320px wide on desktop and full width minus 24px on mobile. It opens from the right and traps focus. Sections are:

```text
Profile summary
Current workspace
Registered workspaces
Add workspace
Account settings
Notification settings
Language
Help and safety
Sign out
```

Registered workspace rows are active. Unregistered rows are shown only under Add workspace and labelled “Register to unlock”. Payments, wallet, currency, cash-out, and real document upload appear only under clearly disabled future capability information, never as active navigation.

## 19.17 Collaboration agreement layout

Use a vertical stepper on mobile and a horizontal stepper on desktop:

```text
Scope → Responsibilities → Schedule → Terms → Members → Review
```

Each step has one focused group of inputs. The Review page displays a two-column label/value summary on desktop and a stacked label/value list on mobile. Accept terms is a primary button. Both parties’ acceptance status is visible.

## 19.18 Supply quote comparison layout

Use a vertical component list on mobile and a two-column comparison on desktop.

```text
Product                  estimate/confirmed
Shipping                 estimate/confirmed
Customs and duties       estimate/confirmed
Local delivery           estimate/confirmed
Total                    estimated/confirmed
Responsibility changes   visible explanation
Alternative route        compare action
```

The user can replace individual components. Every replacement updates the responsibility explanation. No payment or checkout action is active in the prototype.

## 19.19 Verification demo layout

Use a centred single-column stepper, maximum 560px desktop width and full-width mobile content. Every screen has the label `DEMO — no real documents are collected` near the title.

Order: explanation, fake sample tile, fake selfie tile, mock checks, result, manual review state. The interface contains no file input, camera permission request, upload endpoint, or real document preview.

## 19.20 Admin review layout

Admin review is a protected mock-only route. Desktop uses a queue column, case detail column, and audit panel. Mobile uses queue and detail as separate routes. The screen never displays raw identity documents. It displays report reason, target, evidence summary, assigned role, status, action buttons, and audit history.

## 19.21 Empty, loading, and error layouts

Loading uses 2–3 skeleton cards that preserve the final card dimensions. Empty states contain a title, one explanatory sentence, and one relevant action. Error states contain a plain explanation and Retry. Do not show blank pages, endless spinners, or generic “Something went wrong” without an action.

## 19.22 Visual density limits

On a 375px screen, never show more than one primary heading, one query, one filter row, and two primary result cards before scroll. Do not show more than one primary filled CTA per viewport. Secondary actions use outline, text, or icon treatments. Keep at least 16px vertical separation between unrelated sections.

## 19.23 Layout acceptance tests

Verify 375×812, 390×844, 768×1024, and 1440×900. Confirm no horizontal overflow, no clipped text, no covered bottom content, no overlapping fixed controls, no four-workspace dashboard, no more than two result cards before scroll, correct drawer width, correct desktop rail width, and usable keyboard focus order.

