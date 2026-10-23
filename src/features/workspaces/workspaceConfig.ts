import type { Workspace } from '@/data/types';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  id: string;
  label: string;
  options: SelectOption[];
}

export interface WorkspaceConfig {
  workspace: Workspace;
  title: string;
  purpose: string;
  accent: string;
  searchPlaceholder: string;
  primaryActionLabel: string;
  sortOptions: SelectOption[];
  filters: FilterDefinition[];
  emptyTitle: string;
  emptyDescription: string;
}

const ALL = { value: '', label: 'Any' };

export const WORKSPACE_CONFIGS: Record<Workspace, WorkspaceConfig> = {
  customer: {
    workspace: 'customer',
    title: 'Find a service',
    purpose: 'Find someone who provides the service you need.',
    accent: 'var(--workspace-customer)',
    searchPlaceholder: 'What do you need help with?',
    primaryActionLabel: 'Create a service listing',
    sortOptions: [
      { value: 'match', label: 'Best match' },
      { value: 'price', label: 'Lowest price' },
      { value: 'distance', label: 'Nearest' },
      { value: 'response', label: 'Fastest response' },
      { value: 'verification', label: 'Highest verification' },
      { value: 'rating', label: 'Highest rating' },
    ],
    filters: [
      {
        id: 'category',
        label: 'Service category',
        options: [
          ALL,
          { value: 'cleaning', label: 'Cleaning' },
          { value: 'graphic_design', label: 'Graphic design' },
          { value: 'massage_therapy', label: 'Massage therapy' },
          { value: 'translation', label: 'Translation' },
          { value: 'website_development', label: 'Website development' },
          { value: 'home_repair', label: 'Home repair' },
        ],
      },
      {
        id: 'reach',
        label: 'Local or global',
        options: [
          ALL,
          { value: 'local', label: 'Local' },
          { value: 'south_africa_wide', label: 'South Africa-wide' },
          { value: 'international', label: 'International' },
        ],
      },
      {
        id: 'availability',
        label: 'Availability',
        options: [
          ALL,
          { value: 'soon', label: 'Available this week' },
          { value: 'later', label: 'Available later' },
        ],
      },
      {
        id: 'type',
        label: 'Delivery or remote',
        options: [
          ALL,
          { value: 'in_person', label: 'In person' },
          { value: 'remote', label: 'Remote' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
      },
      {
        id: 'price',
        label: 'Price or quote',
        options: [
          ALL,
          { value: 'listed', label: 'Price listed' },
          { value: 'quote', label: 'Quote required' },
        ],
      },
      {
        id: 'verification',
        label: 'Verification',
        options: [ALL, { value: 'verified', label: 'Verified only' }],
      },
    ],
    emptyTitle: 'No services match these filters.',
    emptyDescription:
      'Try clearing a filter, widening the location, or sending a request so providers can come to you.',
  },
  qualification: {
    workspace: 'qualification',
    title: 'Qualifications and opportunities',
    purpose: 'Connect qualified people with the work they are prepared to do.',
    accent: 'var(--workspace-qualification)',
    searchPlaceholder: 'What qualified person or opportunity are you looking for?',
    primaryActionLabel: 'Create qualification profile',
    sortOptions: [
      { value: 'match', label: 'Best match' },
      { value: 'distance', label: 'Closest' },
      { value: 'verification', label: 'Verified first' },
      { value: 'response', label: 'Fastest response' },
      { value: 'rating', label: 'Highest rating' },
    ],
    filters: [
      {
        id: 'level',
        label: 'Qualification level',
        options: [
          ALL,
          { value: 'Registered professional', label: 'Registered professional' },
          { value: 'Certificate', label: 'Certificate' },
          { value: 'Diploma', label: 'Diploma' },
          { value: 'Degree', label: 'Degree' },
        ],
      },
      {
        id: 'reach',
        label: 'Local or global',
        options: [
          ALL,
          { value: 'local', label: 'Local' },
          { value: 'south_africa_wide', label: 'South Africa-wide' },
          { value: 'international', label: 'International' },
        ],
      },
      {
        id: 'mode',
        label: 'Remote or on-site',
        options: [
          ALL,
          { value: 'remote', label: 'Remote' },
          { value: 'on_site', label: 'On-site' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
      },
      {
        id: 'type',
        label: 'Opportunity type',
        options: [
          ALL,
          { value: 'employment', label: 'Employment' },
          { value: 'contract', label: 'Contract' },
          { value: 'project', label: 'Project' },
          { value: 'referral', label: 'Referral' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'verification',
        label: 'Qualification evidence',
        options: [ALL, { value: 'verified', label: 'Verified only' }],
      },
    ],
    emptyTitle: 'No matching opportunities yet.',
    emptyDescription: 'Adjust the filters, or create a profile so providers can find you instead.',
  },
  collaboration: {
    workspace: 'collaboration',
    title: 'Build a team or partnership',
    purpose: 'Create defined collaborations, group projects and capacity arrangements.',
    accent: 'var(--workspace-collaboration)',
    searchPlaceholder: 'What kind of partner or capacity do you need?',
    primaryActionLabel: 'Create collaboration request',
    sortOptions: [
      { value: 'match', label: 'Best match' },
      { value: 'soonest', label: 'Available soonest' },
      { value: 'distance', label: 'Closest' },
      { value: 'verification', label: 'Verified first' },
      { value: 'quote', label: 'Lowest quote' },
      { value: 'rating', label: 'Highest rating' },
    ],
    filters: [
      {
        id: 'category',
        label: 'Collaboration category',
        options: [
          ALL,
          { value: 'defined_service', label: 'One business providing a service' },
          { value: 'multi_provider', label: 'Multiple providers for one request' },
          { value: 'capacity_request', label: 'Business capacity request' },
          { value: 'joint_project', label: 'Joint project' },
          { value: 'referral_partnership', label: 'Referral partnership' },
          { value: 'shared_premises', label: 'Shared premises or equipment' },
        ],
      },
      {
        id: 'reach',
        label: 'Local or global',
        options: [
          ALL,
          { value: 'local', label: 'Local' },
          { value: 'south_africa_wide', label: 'South Africa-wide' },
          { value: 'international', label: 'International' },
        ],
      },
      {
        id: 'size',
        label: 'Group size',
        options: [
          ALL,
          { value: '2', label: 'Two participants' },
          { value: '3', label: 'Three or more participants' },
        ],
      },
      {
        id: 'verification',
        label: 'Business verification',
        options: [ALL, { value: 'verified', label: 'Verified only' }],
      },
    ],
    emptyTitle: 'No collaborations match these filters.',
    emptyDescription:
      'Clear a filter to see more, or create a collaboration request so partners can find you.',
  },
  supply: {
    workspace: 'supply',
    title: 'Find supply options',
    purpose: 'Find products, compare suppliers and see who is responsible for each route.',
    accent: 'var(--workspace-supply)',
    searchPlaceholder: 'What product, quantity, and delivery location do you need?',
    primaryActionLabel: 'Create sourcing request',
    sortOptions: [
      { value: 'match', label: 'Best match' },
      { value: 'price', label: 'Lowest product price' },
      { value: 'total', label: 'Lowest estimated total' },
      { value: 'delivery', label: 'Fastest delivery' },
      { value: 'distance', label: 'Nearest supplier' },
      { value: 'confidence', label: 'Highest confidence' },
    ],
    filters: [
      {
        id: 'mode',
        label: 'Single item or bulk',
        options: [ALL, { value: 'single', label: 'Single item' }, { value: 'bulk', label: 'Bulk' }],
      },
      {
        id: 'reach',
        label: 'Supplier reach',
        options: [
          ALL,
          { value: 'local', label: 'Local' },
          { value: 'south_africa_wide', label: 'South Africa-wide' },
          { value: 'international', label: 'International' },
        ],
      },
      {
        id: 'confidence',
        label: 'Quote confidence',
        options: [
          ALL,
          { value: 'high', label: 'High confidence' },
          { value: 'medium', label: 'Medium confidence' },
          { value: 'low', label: 'Low confidence' },
        ],
      },
      {
        id: 'verification',
        label: 'Supplier verification',
        options: [ALL, { value: 'verified', label: 'Verified only' }],
      },
    ],
    emptyTitle: 'No supply options match these filters.',
    emptyDescription:
      'Clear a filter to see more, or create a sourcing request so suppliers can come to you.',
  },
};

/** Mock-only, deterministic search suggestions from the input specification. */
export const SEARCH_SUGGESTIONS = [
  'cleaning',
  'graphic design',
  'massage service',
  'qualified assistant',
  'bulk packaging',
  'local delivery',
  'translation',
  'website development',
];
