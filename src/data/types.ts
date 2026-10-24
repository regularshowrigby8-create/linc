/**
 * LinkHive data contracts.
 * String unions and entity shapes mirror docs/linkhive-build-spec/04-data/DATA-CONTRACTS.md.
 * Status values are exact: do not add alternate spellings.
 */

export type Workspace = 'customer' | 'qualification' | 'collaboration' | 'supply';
export type AccountType = 'personal' | 'business';

/**
 * Which side of the marketplace a person is on when they start.
 * `buy` means they are looking for someone to do something for them.
 * `sell` means they are offering something.
 */
export type Intent = 'buy' | 'sell';

export type VerificationState =
  'not_started' | 'pending' | 'verified' | 'rejected' | 'manual_review';

export type ConnectionState =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'cancelled'
  | 'completed'
  | 'reported'
  | 'blocked';

export type AgreementState =
  | 'draft'
  | 'invitation_sent'
  | 'pending_acceptance'
  | 'discussion'
  | 'terms_proposed'
  | 'terms_accepted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'closed';

export type QuoteState =
  | 'draft'
  | 'requested'
  | 'supplier_responding'
  | 'quote_received'
  | 'buyer_comparing'
  | 'alternative_requested'
  | 'selected'
  | 'expired'
  | 'cancelled'
  | 'fulfilled'
  | 'disputed';

export type ReportReason =
  | 'fraud'
  | 'theft'
  | 'identity_fraud'
  | 'false_documents'
  | 'illegal_activity'
  | 'harassment'
  | 'unsafe_service'
  | 'payment_issue'
  | 'other';

export type ContactVisibility = 'private' | 'accepted_connections' | 'public';
export type Reach = 'local' | 'south_africa_wide' | 'international';
export type OwnerType = 'individual' | 'business';
export type ListingStatus = 'active' | 'pending_review' | 'suspended';

export type ServiceCategory =
  | 'cleaning'
  | 'graphic_design'
  | 'massage_therapy'
  | 'translation'
  | 'website_development'
  | 'home_repair';

export type ServiceType = 'remote' | 'in_person' | 'hybrid';
export type CertificateStatus = 'not_verified' | 'pending' | 'verified';
export type OpportunityType = 'employment' | 'contract' | 'project' | 'referral' | 'other';
export type RemoteOrOnSite = 'remote' | 'on_site' | 'hybrid';
export type QuoteConfidence = 'high' | 'medium' | 'low';
export type CollaborationCategory =
  | 'defined_service'
  | 'multi_provider'
  | 'capacity_request'
  | 'joint_project'
  | 'referral_partnership'
  | 'shared_premises';

export type InviteState = 'invited' | 'pending' | 'accepted' | 'declined';
export type AgreementPresentation = 'complete' | 'incomplete';

export interface VerificationBadge {
  /** Machine id of the badge. */
  id: string;
  /** Short label shown on cards. */
  label: string;
  /** Exactly what was checked. Never a generic "verified" claim. */
  detail: string;
  state: 'verified' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  /** Business accounts show the linked business name. */
  businessName?: string;
  registeredWorkspaces: Workspace[];
  verificationByWorkspace: Record<Workspace, VerificationState>;
  contactVisibility: ContactVisibility;
  location: string;
  avatarInitials: string;
  /** Workspace the user last opened. Used to pick the landing workspace. */
  lastUsedWorkspace?: Workspace;
}

interface BaseListing {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerType: OwnerType;
  location: string;
  reach: Reach;
  description: string;
  included: string[];
  excluded: string[];
  priceLabel: string;
  quoteRequired: boolean;
  availability: string;
  verificationBadges: VerificationBadge[];
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  status: ListingStatus;
}

export interface CustomerListing extends BaseListing {
  workspace: 'customer';
  serviceCategory: ServiceCategory;
  serviceType: ServiceType;
  responseTimeHours: number;
  priceValue: number | null;
  currency: 'ZAR';
}

export interface QualificationListing extends BaseListing {
  workspace: 'qualification';
  qualificationLevel: string;
  certificateStatus: CertificateStatus;
  opportunityType: OpportunityType;
  field: string;
  remoteOrOnSite: RemoteOrOnSite;
  employerName?: string;
  /** Only present when the listing owner explicitly states it. Never implied. */
  statedExperienceRequirement?: string;
}

export interface CollaborationListing extends BaseListing {
  workspace: 'collaboration';
  category: CollaborationCategory;
  participantsNeeded: number;
  agreementState: AgreementState;
  inviteStates: InviteState[];
  responseTimeHours: number;
  /** Optional stated amount. Null means a quote is required. */
  priceValue?: number | null;
}

export interface SupplyListing extends BaseListing {
  workspace: 'supply';
  product: string;
  quantity: number;
  moq: number;
  supplierLocation: string;
  deliveryWindow: string;
  confidence: QuoteConfidence;
  estimatedTotal: number;
  currency: 'ZAR';
}

export type Listing = CustomerListing | QualificationListing | CollaborationListing | SupplyListing;

export interface ConnectionRequest {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  reason: string;
  state: ConnectionState;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  workspace: Workspace;
  /** Optional wizard steps. */
  desiredOutcome?: string;
  timing?: string;
  locationBoundaries?: string;
  budgetNote?: string;
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
}

export interface MessageThread {
  id: string;
  connectionId: string;
  participantIds: string[];
  messages: ThreadMessage[];
  canMessage: boolean;
  lastMessageAt: string;
}

export interface CollaborationMember {
  userId: string;
  name: string;
  role: 'admin' | 'member' | 'pending';
  state: InviteState;
}

export interface AgreementField {
  key: string;
  label: string;
  value: string;
  required: boolean;
}

export interface CollaborationSchedule {
  startsAt: string;
  durationHours: number;
  location: string;
  remote: boolean;
}

export interface CompletionConfirmation {
  userId: string;
  confirmedAt: string | null;
}

export interface Collaboration {
  id: string;
  category: CollaborationCategory;
  creatorId: string;
  title: string;
  members: CollaborationMember[];
  inviteStates: InviteState[];
  agreementState: AgreementState;
  agreementFields: AgreementField[];
  schedule: CollaborationSchedule;
  completionConfirmations: CompletionConfirmation[];
  createdAt: string;
}

export type QuoteComponentKind = 'product' | 'shipping' | 'customs' | 'tax' | 'local_delivery';

export interface QuoteComponent {
  id: string;
  label: string;
  amount: number;
  kind: QuoteComponentKind;
  certainty: 'estimated' | 'confirmed';
  /** Component id this one replaces, when the buyer asked for an alternative. */
  alternativeFor?: string;
}

export interface ResponsibilityChange {
  componentId: string;
  from: string;
  to: string;
  reason: string;
}

export interface SupplyQuote {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  state: QuoteState;
  components: QuoteComponent[];
  currencyLabel: string;
  timestamp: string;
  expiresAt: string;
  confidence: QuoteConfidence;
  responsibilityChanges: ResponsibilityChange[];
}

export type ReportTargetType = 'listing' | 'profile' | 'request' | 'thread';
export type ReportStatus =
  'submitted' | 'triaged' | 'assigned' | 'under_review' | 'resolved' | 'dismissed';

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  assignedRole: string | null;
  createdAt: string;
  auditEvents: AuditEvent[];
  /** Set when a serious report pauses the target's activity. */
  temporarySuspension?: { until: string; reason: string };
}

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';

export interface NotificationSettings {
  channels: Record<NotificationChannel, boolean>;
  /** Essential notices cannot be switched off. */
  lockedChannels: NotificationChannel[];
}

export interface DemoVerificationState {
  step: 'explain' | 'document' | 'selfie' | 'result' | 'manual_review' | 'complete';
  sampleId: 'id_front' | 'id_back' | null;
  result: 'passed' | 'manual_review' | 'mismatch' | 'rejected' | null;
  /** Set by the demo flow only. Never grants production verification. */
  demoVerified: boolean;
  auditEvents: AuditEvent[];
}

/** Light, dark, or follow the operating system. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** The accent colours a member can choose for their own profile. Red is high-arousal and reserved for one profile only, at ≤5% area. */
export type AccentName = 'blue' | 'teal' | 'green' | 'amber' | 'clay' | 'violet' | 'plum' | 'red';

/** Abstract avatar treatments. Portraits are never shown. */
export type AvatarStyle = 'initials' | 'blocks' | 'rings';

export interface ProfilePreferences {
  theme: ThemePreference;
  /** Accent used across the member's own profile surfaces. */
  accent: AccentName;
  /** What the member does, in their own words. Shown under their name. */
  headline: string;
  avatarStyle: AvatarStyle;
  /** Whether the desktop rail is reduced to icons. */
  navCollapsed: boolean;
}

/** The answers given during onboarding, before the account exists. */
export interface OnboardingState {
  /** Sell or buy, chosen on the first onboarding screen. */
  intent: Intent | null;
  /** Business or individual, chosen on the second screen. */
  accountType: AccountType | null;
  /** The workspace the account opens into. */
  workspace: Workspace | null;
}

export interface AppState {
  user: User | null;
  registered: boolean;
  listings: Listing[];
  requests: ConnectionRequest[];
  threads: MessageThread[];
  collaborations: Collaboration[];
  quotes: SupplyQuote[];
  reports: Report[];
  savedListingIds: string[];
  activeWorkspace: Workspace;
  notifications: NotificationSettings;
  verificationDemo: DemoVerificationState;
  preferences: ProfilePreferences;
  onboarding: OnboardingState;
}
