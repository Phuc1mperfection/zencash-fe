import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

// Simple theme hook using localStorage
export function useTheme(defaultTheme: Theme = 'system', storageKey: string = 'vite-ui-theme') {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      return (storedTheme as Theme) || defaultTheme;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Ignore localStorage errors
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let effectiveTheme = theme;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      effectiveTheme = systemTheme;
    }

    root.classList.add(effectiveTheme);

    try {
      localStorage.setItem(storageKey, theme); // Store the user's preference (light, dark, or system)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        //
    }
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
