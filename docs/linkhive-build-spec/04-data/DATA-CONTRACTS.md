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