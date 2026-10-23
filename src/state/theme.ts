import { useEffect, useState } from 'react';
import type { ThemePreference } from '@/data/types';

export type AppliedTheme = 'light' | 'dark';

/**
 * The theme preference lives in the central store, but it has to reach the
 * <html> element before React mounts, otherwise the page paints in the wrong
 * mode for a frame. index.html carries a tiny inline script that reads the
 * same stored state and sets the attribute early. This module keeps the two
 * in step and follows the operating system when the preference is "system".
 */

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const resolveTheme = (
  preference: ThemePreference,
  systemPrefersDark: boolean,
): AppliedTheme => {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  return systemPrefersDark ? 'dark' : 'light';
};

const systemPrefersDark = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(DARK_QUERY).matches;
};

/** Applies the resolved theme to <html> and keeps it in step with the system. */
export const useAppliedTheme = (preference: ThemePreference): AppliedTheme => {
  const [applied, setApplied] = useState<AppliedTheme>(() =>
    resolveTheme(preference, systemPrefersDark()),
  );

  useEffect(() => {
    const next = resolveTheme(preference, systemPrefersDark());
    setApplied(next);
    document.documentElement.setAttribute('data-theme', next);
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return;
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      const next = resolveTheme('system', media.matches);
      setApplied(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  return applied;
};
