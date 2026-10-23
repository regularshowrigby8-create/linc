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