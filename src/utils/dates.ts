/** Date helpers for mock timestamps. */

const DAY_MS = 24 * 60 * 60 * 1000;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatRelative = (iso: string, now: number = Date.now()): string => {
  const diff = now - new Date(iso).getTime();
  if (diff < 0) return 'in the future';
  const days = Math.floor(diff / DAY_MS);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`;
  return formatDate(iso);
};

export const daysUntil = (iso: string, now: number = Date.now()): number =>
  Math.ceil((new Date(iso).getTime() - now) / DAY_MS);

export const isExpired = (iso: string, now: number = Date.now()): boolean =>
  new Date(iso).getTime() < now;

export const addDays = (iso: string, days: number): string =>
  new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
