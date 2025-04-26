import { useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

export function useTheme(defaultTheme: Theme = 'light', storageKey: string = 'vite-ui-theme') {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    requestAnimationFrame(() => {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      document.body.dataset.theme = newTheme;
    });

    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      console.error('Failed to save theme to localStorage');
    }
  }, [storageKey]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(theme);
    }
  }, [applyTheme, storageKey, theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme !== theme) {
      setThemeState(newTheme);
      applyTheme(newTheme);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentStoredTheme = localStorage.getItem(storageKey) as Theme;
        if (currentStoredTheme !== theme) {
          setThemeState(currentStoredTheme);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [storageKey, theme]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && (e.newValue === 'light' || e.newValue === 'dark')) {
        if (e.newValue !== theme) {
          setThemeState(e.newValue as Theme);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, theme]);

  return { theme, setTheme };
}