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