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