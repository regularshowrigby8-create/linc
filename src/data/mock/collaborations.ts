import type { Collaboration, Report, SupplyQuote } from '@/data/types';

/** Deterministic mock collaborations, supply quotes and reports. */

export const mockCollaborations: Collaboration[] = [
  {
    id: 'col-1',
    category: 'defined_service',
    creatorId: 'user-thandi',
    title: 'Hotel and wellness partner for in-room massage service',
    members: [
      { userId: 'user-thandi', name: 'Mokoena Home Services', role: 'admin', state: 'accepted' },
      { userId: 'user-lerato', name: 'Lerato Nkosi', role: 'member', state: 'accepted' },
      { userId: 'user-rian', name: 'Botha Design Studio', role: 'pending', state: 'pending' },
    ],
    inviteStates: ['accepted', 'accepted', 'pending'],
    agreementState: 'terms_proposed',
    agreementFields: [
      {
        key: 'service',
        label: 'Service provided',
        value: 'Two 45-minute in-room massage sessions per week, evenings only.',
        required: true,
      },
      {
        key: 'price',
        label: 'Price method',
        value: 'Fixed monthly amount agreed by both parties in writing.',
        required: true,
      },
      {
        key: 'location',
        label: 'Location',
        value: 'Guest rooms at the partner property in Gqeberha.',
        required: true,
      },
      {
        key: 'equipment',
        label: 'Equipment responsibility',
        value: 'Provider brings a portable table and towels; property supplies room access.',
        required: true,
      },
      {
        key: 'supervision',
        label: 'Supervision',
        value:
          'Property front desk supervises guest access; provider supervises clinical practice.',
        required: true,
      },
      {
        key: 'cancellation',
        label: 'Cancellation',
        value: 'Two hours notice on either side for a session.',
        required: true,
      },
      {
        key: 'quality',
        label: 'Quality criteria',
        value: 'Guest feedback above agreed threshold, checked monthly.',
        required: false,
      },
    ],
    schedule: {
      startsAt: '2026-11-03T17:00:00.000Z',
      durationHours: 3,
      location: 'Gqeberha',
      remote: false,
    },
    completionConfirmations: [
      { userId: 'user-thandi', confirmedAt: null },
      { userId: 'user-lerato', confirmedAt: null },
    ],
    createdAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'col-2',
    category: 'joint_project',
    creatorId: 'user-ayanda',
    title: 'Joint catering project for a regional food festival',
    members: [
      { userId: 'user-ayanda', name: 'Dlamini Catering', role: 'admin', state: 'accepted' },
      { userId: 'user-pieter', name: 'VW Bulk Supply', role: 'pending', state: 'invited' },
    ],
    inviteStates: ['accepted', 'invited'],
    agreementState: 'pending_acceptance',
    agreementFields: [
      {
        key: 'service',
        label: 'Service provided',
        value: 'Hot food service and site logistics split between two partner businesses.',
        required: true,
      },
      {
        key: 'price',
        label: 'Price method',
        value: 'Shared revenue split agreed before the event, no platform payment involved.',
        required: true,
      },
      {
        key: 'schedule',
        label: 'Event dates',
        value: 'Two event days, eight hours each.',
        required: true,
      },
      {
        key: 'equipment',
        label: 'Equipment responsibility',
        value: 'Each party brings its own equipment; shared kitchen booked separately.',
        required: true,
      },
      {
        key: 'supervision',
        label: 'Supervision',
        value: 'Each party supervises its own staff on the day.',
        required: true,
      },
    ],
    schedule: {
      startsAt: '2027-02-11T08:00:00.000Z',
      durationHours: 16,
      location: 'Durban',
      remote: false,
    },
    completionConfirmations: [
      { userId: 'user-ayanda', confirmedAt: null },
      { userId: 'user-pieter', confirmedAt: null },
    ],
    createdAt: '2026-08-30T08:00:00.000Z',
  },
];

export const mockQuotes: SupplyQuote[] = [
  {
    id: 'quote-1',
    requestId: 'req-6',
    supplierId: 'user-pieter',
    supplierName: 'VW Bulk Supply',
    state: 'quote_received',
    currencyLabel: 'ZAR',
    timestamp: '2026-09-08T10:00:00.000Z',
    expiresAt: '2026-10-08T10:00:00.000Z',
    confidence: 'high',
    components: [
      {
        id: 'cmp-1',
        label: 'Product — 1 000 kraft takeaway boxes',
        amount: 14800,
        kind: 'product',
        certainty: 'confirmed',
      },
      {
        id: 'cmp-2',
        label: 'Shipping — Bloemfontein to Gqeberha',
        amount: 2100,
        kind: 'shipping',
        certainty: 'estimated',
      },
      {
        id: 'cmp-3',
        label: 'Customs and duty',
        amount: 0,
        kind: 'customs',
        certainty: 'confirmed',
      },
      {
        id: 'cmp-4',
        label: 'Local delivery to premises',
        amount: 750,
        kind: 'local_delivery',
        certainty: 'estimated',
      },
    ],
    responsibilityChanges: [],
  },
  {
    id: 'quote-2',
    requestId: 'req-6',
    supplierId: 'user-rian',
    supplierName: 'Botha Design Studio',
    state: 'buyer_comparing',
    currencyLabel: 'ZAR',
    timestamp: '2026-09-09T10:00:00.000Z',
    expiresAt: '2026-10-09T10:00:00.000Z',
    confidence: 'medium',
    components: [
      {
        id: 'cmp-5',
        label: 'Product — 1 000 kraft takeaway boxes',
        amount: 15900,
        kind: 'product',
        certainty: 'confirmed',
      },
      {
        id: 'cmp-6',
        label: 'Shipping — Cape Town to Gqeberha',
        amount: 1850,
        kind: 'shipping',
        certainty: 'confirmed',
      },
      {
        id: 'cmp-7',
        label: 'Local delivery to premises',
        amount: 0,
        kind: 'local_delivery',
        certainty: 'confirmed',
      },
    ],
    responsibilityChanges: [
      {
        componentId: 'cmp-6',
        from: 'VW Bulk Supply',
        to: 'Botha Design Studio',
        reason:
          'Buyer replaced the shipping route after the first supplier could not confirm a date.',
      },
    ],
  },
  {
    id: 'quote-3',
    requestId: 'req-6',
    supplierId: 'user-ayanda',
    supplierName: 'Dlamini Catering',
    state: 'alternative_requested',
    currencyLabel: 'ZAR',
    timestamp: '2026-09-11T10:00:00.000Z',
    expiresAt: '2026-10-11T10:00:00.000Z',
    confidence: 'low',
    components: [
      {
        id: 'cmp-8',
        label: 'Product — 1 000 kraft takeaway boxes',
        amount: 17250,
        kind: 'product',
        certainty: 'estimated',
      },
      {
        id: 'cmp-9',
        label: 'Shipping — Durban to Gqeberha',
        amount: 2450,
        kind: 'shipping',
        certainty: 'estimated',
      },
      {
        id: 'cmp-10',
        label: 'Customs and duty',
        amount: 0,
        kind: 'customs',
        certainty: 'estimated',
      },
      {
        id: 'cmp-11',
        label: 'Local delivery to premises',
        amount: 600,
        kind: 'local_delivery',
        certainty: 'estimated',
      },
    ],
    responsibilityChanges: [
      {
        componentId: 'cmp-8',
        from: 'VW Bulk Supply',
        to: 'Dlamini Catering',
        reason:
          'Buyer requested an alternative supplier when the first quote could not meet the event date.',
      },
      {
        componentId: 'cmp-9',
        from: 'VW Bulk Supply',
        to: 'Dlamini Catering',
        reason: 'Shipping responsibility follows the replaced supplier.',
      },
    ],
  },
];

export const mockReports: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-you',
    targetType: 'listing',
    targetId: 'lst-cust-3',
    reason: 'unsafe_service',
    details:
      'The listing advertises a service that needs a qualification check, and the evidence attached is still pending review.',
    status: 'assigned',
    assignedRole: 'Moderation reviewer',
    createdAt: '2026-10-13T09:00:00.000Z',
    auditEvents: [
      {
        id: 'aud-1',
        at: '2026-10-13T09:00:00.000Z',
        actor: 'Naledi Khumalo',
        action: 'Report submitted for review',
      },
      {
        id: 'aud-2',
        at: '2026-10-13T12:30:00.000Z',
        actor: 'System',
        action: 'Report triaged as a safety concern',
      },
      {
        id: 'aud-3',
        at: '2026-10-14T08:10:00.000Z',
        actor: 'Moderation reviewer',
        action: 'Assigned to moderation reviewer',
      },
    ],
  },
  {
    id: 'rep-2',
    reporterId: 'user-thandi',
    targetType: 'profile',
    targetId: 'user-pieter',
    reason: 'other',
    details: 'Repeated messages about a supply route that the listing already answered.',
    status: 'under_review',
    assignedRole: 'Moderation reviewer',
    createdAt: '2026-10-06T15:40:00.000Z',
    auditEvents: [
      {
        id: 'aud-4',
        at: '2026-10-06T15:40:00.000Z',
        actor: 'Thandi Mokoena',
        action: 'Report submitted for review',
      },
      {
        id: 'aud-5',
        at: '2026-10-07T09:20:00.000Z',
        actor: 'Moderation reviewer',
        action: 'Review started',
      },
    ],
  },
  {
    id: 'rep-3',
    reporterId: 'user-you',
    targetType: 'listing',
    targetId: 'lst-coll-3',
    reason: 'false_documents',
    details:
      'The premises listing shows a verification badge with no explanation of what was checked.',
    status: 'resolved',
    assignedRole: 'Administrator',
    createdAt: '2026-09-20T11:00:00.000Z',
    auditEvents: [
      {
        id: 'aud-6',
        at: '2026-09-20T11:00:00.000Z',
        actor: 'Naledi Khumalo',
        action: 'Report submitted for review',
      },
      {
        id: 'aud-7',
        at: '2026-09-21T10:00:00.000Z',
        actor: 'Administrator',
        action: 'Report resolved and badge removed',
      },
    ],
  },
];
