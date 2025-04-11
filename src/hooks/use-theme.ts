import { useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

// Tối ưu theme hook để tránh re-render không cần thiết
export function useTheme(defaultTheme: Theme = 'system', storageKey: string = 'vite-ui-theme') {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      return (storedTheme as Theme) || defaultTheme;
    } catch (e) {
      console.error('Failed to read theme from localStorage', e);
      // Nếu có lỗi khi đọc localStorage, sử dụng theme mặc định
      return defaultTheme;
    }
  });

  // Tách logic thay đổi theme vào một hàm riêng để tối ưu hơn
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Sử dụng requestAnimationFrame để tối ưu hiệu năng render
    requestAnimationFrame(() => {
      root.classList.remove('light', 'dark');

      let effectiveTheme = newTheme;
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches ? 'dark' : 'light';
        effectiveTheme = systemTheme;
      }

      root.classList.add(effectiveTheme);
      
      // Tránh reflows bằng cách gom nhóm các thay đổi CSS
      document.body.dataset.theme = effectiveTheme;
    });

    // Lưu theme vào localStorage, bọc bằng try-catch để an toàn
    try {
      localStorage.setItem(storageKey, newTheme);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error('Failed to save theme to localStorage');
    }
  }, [storageKey]);

  // Áp dụng theme khi component mount hoặc theme thay đổi
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Wrap setThemeState với useCallback để đảm bảo reference stability
  const setTheme = useCallback((newTheme: Theme) => {
    // Chỉ cập nhật state nếu theme thực sự thay đổi
    if (newTheme !== theme) {
      setThemeState(newTheme);
    }
  }, [theme]);

  // Listen cho system theme change
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  return { theme, setTheme };
}
