/** Display formatting helpers. No business logic lives here. */

const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
});

const ZAR_PLAIN = new Intl.NumberFormat('en-ZA', {
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number): string => ZAR.format(amount);

export const formatNumber = (value: number): string => ZAR_PLAIN.format(value);

export const formatPriceLabel = (label: string): string => label;

export const formatResponseTime = (hours: number): string => {
  if (hours <= 1) return 'Usually replies within an hour';
  if (hours < 24) return `Usually replies within ${hours} hours`;
  const days = Math.round(hours / 24);
  return `Usually replies within ${days} day${days === 1 ? '' : 's'}`;
};

export const formatRating = (rating: number, reviewCount: number): string => {
  if (reviewCount === 0) return 'No completed connections yet';
  return `${rating.toFixed(1)} from ${reviewCount} completed connection${
    reviewCount === 1 ? '' : 's'
  }`;
};

export const titleCase = (value: string): string =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const initialsFromName = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
