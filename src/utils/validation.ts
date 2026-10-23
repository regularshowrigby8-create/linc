/**
 * Form validation helpers.
 * Messages match the copy required by docs/linkhive-build-spec/02-design/INPUT-SPEC.md.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export const validateName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: false, error: 'Enter your name.' };
  if (trimmed.length < 2) return { ok: false, error: 'Enter your name.' };
  if (trimmed.length > 80) return { ok: false, error: 'Keep the name under 80 characters.' };
  if (!/\S/.test(trimmed)) return { ok: false, error: 'Enter your name.' };
  return { ok: true };
};

export const validateEmail = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: false, error: 'Enter a valid email address.' };
  if (!EMAIL_PATTERN.test(trimmed)) return { ok: false, error: 'Enter a valid email address.' };
  return { ok: true };
};

export const validatePassword = (value: string): ValidationResult => {
  if (value.length === 0) return { ok: false, error: 'Use at least 8 characters.' };
  if (value.length < 8) return { ok: false, error: 'Use at least 8 characters.' };
  return { ok: true };
};

export const validateAccountType = (value: string): ValidationResult =>
  value === 'personal' || value === 'business'
    ? { ok: true }
    : { ok: false, error: 'Choose Personal or Business.' };

export const validateBusinessName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: false, error: 'Enter the business name.' };
  return { ok: true };
};

export const validateReason = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length === 0)
    return { ok: false, error: 'Tell the provider why you are contacting them.' };
  if (trimmed.length < 10) {
    return {
      ok: false,
      error: 'Use at least 10 characters so the provider understands your request.',
    };
  }
  if (trimmed.length > 500) return { ok: false, error: 'Keep the reason under 500 characters.' };
  return { ok: true };
};

export const validateReportDetails = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: false, error: 'Describe what happened.' };
  if (trimmed.length < 20) return { ok: false, error: 'Add at least 20 characters of detail.' };
  if (trimmed.length > 1000) return { ok: false, error: 'Keep the detail under 1000 characters.' };
  return { ok: true };
};

export const validateListingTitle = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length < 5) return { ok: false, error: 'Use at least 5 characters.' };
  if (trimmed.length > 80) return { ok: false, error: 'Keep the title under 80 characters.' };
  return { ok: true };
};

export const validateListingDescription = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (trimmed.length < 20) return { ok: false, error: 'Use at least 20 characters.' };
  if (trimmed.length > 1000)
    return { ok: false, error: 'Keep the description under 1000 characters.' };
  return { ok: true };
};
