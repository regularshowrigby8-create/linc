import type { Listing } from '@/data/types';

export type FilterValues = Record<string, string>;

const REACH_ORDER: Record<string, number> = {
  local: 0,
  south_africa_wide: 1,
  international: 2,
};

const CONFIDENCE_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

const verifiedBadgeCount = (listing: Listing): number =>
  listing.verificationBadges.filter((badge) => badge.state === 'verified').length;

const matchesSearch = (listing: Listing, term: string): boolean => {
  const needle = term.trim().toLowerCase();
  if (needle.length === 0) return true;
  const haystack = [
    listing.title,
    listing.description,
    listing.ownerName,
    listing.location,
    ...listing.tags,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
};

const matchesFilters = (listing: Listing, values: FilterValues): boolean => {
  for (const [id, value] of Object.entries(values)) {
    if (!value) continue;

    switch (id) {
      case 'category':
        if (listing.workspace === 'customer' && listing.serviceCategory !== value) return false;
        if (listing.workspace === 'collaboration' && listing.category !== value) return false;
        break;
      case 'level':
        if (listing.workspace === 'qualification' && listing.qualificationLevel !== value)
          return false;
        break;
      case 'reach':
        if (listing.reach !== value) return false;
        break;
      case 'availability':
        if (listing.workspace === 'customer') {
          const soon = listing.availability.toLowerCase().includes('week');
          if (value === 'soon' && !soon) return false;
          if (value === 'later' && soon) return false;
        }
        break;
      case 'type':
        if (listing.workspace === 'customer' && listing.serviceType !== value) return false;
        if (listing.workspace === 'qualification' && listing.remoteOrOnSite !== value) return false;
        break;
      case 'price':
        if (listing.workspace === 'customer') {
          if (value === 'quote' && !listing.quoteRequired) return false;
          if (value === 'listed' && listing.quoteRequired) return false;
        }
        break;
      case 'verification':
        if (value === 'verified' && verifiedBadgeCount(listing) === 0) return false;
        break;
      case 'mode':
        if (listing.workspace === 'supply') {
          const bulk = listing.moq > 1 || listing.quantity > 1;
          if (value === 'bulk' && !bulk) return false;
          if (value === 'single' && bulk) return false;
        }
        break;
      case 'confidence':
        if (listing.workspace === 'supply' && listing.confidence !== value) return false;
        break;
      case 'size':
        if (listing.workspace === 'collaboration') {
          if (value === '2' && listing.participantsNeeded > 2) return false;
          if (value === '3' && listing.participantsNeeded < 3) return false;
        }
        break;
      default:
        break;
    }
  }
  return true;
};

const compare = (a: Listing, b: Listing, sortKey: string): number => {
  switch (sortKey) {
    case 'price': {
      const aValue = a.workspace === 'customer' ? (a.priceValue ?? Number.MAX_SAFE_INTEGER) : 0;
      const bValue = b.workspace === 'customer' ? (b.priceValue ?? Number.MAX_SAFE_INTEGER) : 0;
      return aValue - bValue;
    }
    case 'total': {
      const aValue = a.workspace === 'supply' ? a.estimatedTotal : 0;
      const bValue = b.workspace === 'supply' ? b.estimatedTotal : 0;
      return aValue - bValue;
    }
    case 'response': {
      const aValue =
        a.workspace === 'customer' || a.workspace === 'collaboration' ? a.responseTimeHours : 0;
      const bValue =
        b.workspace === 'customer' || b.workspace === 'collaboration' ? b.responseTimeHours : 0;
      return aValue - bValue;
    }
    case 'verification':
      return verifiedBadgeCount(b) - verifiedBadgeCount(a);
    case 'rating':
      return b.rating - a.rating;
    case 'distance':
      return (REACH_ORDER[a.reach] ?? 9) - (REACH_ORDER[b.reach] ?? 9);
    case 'soonest':
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case 'delivery': {
      if (a.workspace === 'supply' && b.workspace === 'supply') {
        return a.deliveryWindow.localeCompare(b.deliveryWindow);
      }
      return 0;
    }
    case 'confidence':
      return (
        (CONFIDENCE_ORDER[a.workspace === 'supply' ? a.confidence : 'medium'] ?? 9) -
        (CONFIDENCE_ORDER[b.workspace === 'supply' ? b.confidence : 'medium'] ?? 9)
      );
    case 'quote': {
      const aValue =
        a.workspace === 'collaboration' ? (a.priceValue ?? Number.MAX_SAFE_INTEGER) : 0;
      const bValue =
        b.workspace === 'collaboration' ? (b.priceValue ?? Number.MAX_SAFE_INTEGER) : 0;
      return aValue - bValue;
    }
    default:
      return 0;
  }
};

export const applyWorkspaceFilters = (
  listings: Listing[],
  search: string,
  values: FilterValues,
  sortKey: string,
): Listing[] => {
  const filtered = listings.filter(
    (listing) => matchesSearch(listing, search) && matchesFilters(listing, values),
  );
  return [...filtered].sort((a, b) => compare(a, b, sortKey));
};

export const countActiveFilters = (values: FilterValues): number =>
  Object.values(values).filter((value) => value.length > 0).length;
