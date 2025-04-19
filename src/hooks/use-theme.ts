/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

// Helper function to log theme-related events with timestamps
const debug = (message: string, data?: unknown) => {
};

// Tối ưu theme hook để tránh re-render không cần thiết
export function useTheme(defaultTheme: Theme = 'light', storageKey: string = 'vite-ui-theme') {
  debug('useTheme hook initialized', { defaultTheme, storageKey });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      debug('Initial theme from localStorage', { storedTheme });
      // Only accept 'light' or 'dark' as valid themes
      return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : defaultTheme;
    } catch (e) {
      console.error('Failed to read theme from localStorage', e);
      debug('Error reading theme from localStorage', e);
      // Nếu có lỗi khi đọc localStorage, sử dụng theme mặc định
      return defaultTheme;
    }
  });

  // Tách logic thay đổi theme vào một hàm riêng để tối ưu hơn
  const applyTheme = useCallback((newTheme: Theme) => {
    debug('Applying theme', { newTheme });
    const root = window.document.documentElement;
    
    // Sử dụng requestAnimationFrame để tối ưu hiệu năng render
    requestAnimationFrame(() => {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      debug('Applied theme classes', { rootClasses: root.classList.toString() });
      
      // Tránh reflows bằng cách gom nhóm các thay đổi CSS
      document.body.dataset.theme = newTheme;
    });

    // Lưu theme vào localStorage, bọc bằng try-catch để an toàn
    try {
      localStorage.setItem(storageKey, newTheme);
      debug('Saved theme to localStorage', { key: storageKey, value: newTheme });
    } catch (e) {
      console.error('Failed to save theme to localStorage');
      debug('Error saving theme to localStorage', e);
      console.error(e);
    }
  }, [storageKey]);

  // Áp dụng theme khi component mount
  useEffect(() => {
    debug('Initial mount effect running');
    // Apply theme as soon as possible during initial mount
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    debug('Checking localStorage on mount', { savedTheme });
    
    if (savedTheme === 'light' || savedTheme === 'dark') {
      debug('Using saved theme from localStorage', { savedTheme });
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      debug('No valid saved theme found, using current theme', { theme });
      applyTheme(theme);
    }
    
    // Check if there's any mismatch between localStorage and current theme state
    if ((savedTheme === 'light' || savedTheme === 'dark') && savedTheme !== theme) {
      debug('Theme mismatch detected', { localStorage: savedTheme, state: theme });
    }
  }, [applyTheme, storageKey, theme]);
  
  // Áp dụng theme khi theme thay đổi
  useEffect(() => {
    debug('Theme changed effect running', { theme });
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Wrap setThemeState với useCallback để đảm bảo reference stability
  const setTheme = useCallback((newTheme: Theme) => {
    debug('setTheme called', { current: theme, new: newTheme });
    // Chỉ cập nhật state nếu theme thực sự thay đổi
    if (newTheme !== theme) {
      debug('Updating theme state', { from: theme, to: newTheme });
      setThemeState(newTheme);
      // Apply theme immediately to avoid flicker
      applyTheme(newTheme);
    } else {
      debug('Theme unchanged, skipping update');
    }
  }, [theme, applyTheme]);

  // Add an additional check on page visibility change (for when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        debug('Page visibility changed to visible');
        const currentStoredTheme = localStorage.getItem(storageKey) as Theme;
        debug('Checking theme consistency', { localStorage: currentStoredTheme, state: theme });
        
        // If there's a mismatch between localStorage and state, fix it
        if ((currentStoredTheme === 'light' || currentStoredTheme === 'dark') && currentStoredTheme !== theme) {
          debug('Theme inconsistency detected on visibility change', { localStorage: currentStoredTheme, state: theme });
          setThemeState(currentStoredTheme);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [storageKey, theme]);

  // Check for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && (e.newValue === 'light' || e.newValue === 'dark')) {
        debug('localStorage changed in another tab/window', { 
          key: e.key, 
          oldValue: e.oldValue, 
          newValue: e.newValue 
        });
        
        if (e.newValue !== theme) {
          debug('Syncing theme from another tab', { from: theme, to: e.newValue });
          setThemeState(e.newValue as Theme);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, theme]);

  return { theme, setTheme };
}
