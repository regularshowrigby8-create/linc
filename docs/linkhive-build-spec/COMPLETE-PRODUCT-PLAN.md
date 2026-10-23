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
