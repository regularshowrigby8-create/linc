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