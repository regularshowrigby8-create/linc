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