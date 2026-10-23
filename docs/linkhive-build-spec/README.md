# LinkHive Build Specification

This folder is the source of truth for a low-end coding AI implementing the LinkHive website prototype. Read `AI-CODER-RULES.md` first. Do not invent product behavior. If a requirement is not written here, mark it `OPEN_DECISION` and stop before implementing it.

## Product in one sentence

LinkHive is a South Africa-first, globally intended connection marketplace that helps people and businesses find services, qualified people, collaborators, and suppliers through four isolated workspaces.

## Current delivery boundary

Build a responsive website prototype with mock data and client-side state. It must feel real on a phone, have clickable navigation, and never imply that payments, wallets, PPP currency, credit, cash-out, or identity-document collection are live.

## Read order

1. `AI-CODER-RULES.md`
2. `01-product/PRODUCT-SCOPE.md`
3. `02-design/DESIGN-SYSTEM.md`
4. `02-design/SCREEN-BLUEPRINT.md`
5. `03-architecture/ARCHITECTURE.md`
6. `04-data/DATA-CONTRACTS.md`
7. `04-data/STATE-MACHINES.md`
8. `05-implementation/IMPLEMENTATION-ORDER.md`
9. `06-quality/QA-CHECKLIST.md`
10. `07-github/GITHUB-WORKFLOW.md`
11. `08-future/OPEN-PROBLEMS.md`

## Non-negotiable boundaries

- Do not build a real payment flow.
- Do not collect real identity documents.
- Do not create a wallet, currency, credit facility, cash-out, or artificial exchange rate.
- Do not use real credentials or hardcode secrets.
- Do not add a dead button. Every visible action must work, show a state change, open a modal, navigate, or be explicitly disabled with an explanation.
- Do not use `TODO`, lorem ipsum, or invented legal claims in the interface.
- Do not use an unapproved library or API without recording the decision.

## Definition of done

A feature is complete only when its route, UI state, data contract, loading state, empty state, error state, success state, keyboard behavior, mobile layout, and tests are defined and implemented. A button is not complete until its click behavior has been tested.