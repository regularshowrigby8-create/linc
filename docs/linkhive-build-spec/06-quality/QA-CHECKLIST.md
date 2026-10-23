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
