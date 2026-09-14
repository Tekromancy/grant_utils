import { type ThemeId, type ThemeConfig, AVAILABLE_THEMES } from './types.js';

export const THEME_STORAGE_KEY = 'acbf_theme_preference';

export function getTheme(id: ThemeId): ThemeConfig {
  const found = AVAILABLE_THEMES.find(t => t.id === id);
  return found || AVAILABLE_THEMES[0];
}

export function getSavedTheme(): ThemeId {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (saved && AVAILABLE_THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
  }
  return 'slate';
}

export function saveTheme(id: ThemeId): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, id);
      document.documentElement.setAttribute('data-theme', id);
    } catch {
      // ignore
    }
  }
}
