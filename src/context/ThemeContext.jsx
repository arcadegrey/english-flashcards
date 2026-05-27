import { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';
import { storage } from '../utils/storage';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = storage.getTheme();
  if (storage.hasThemePreference() && (savedTheme === 'dark' || savedTheme === 'light')) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [hasExplicitTheme, setHasExplicitTheme] = useState(() => {
    if (typeof window === 'undefined') return false;
    return storage.hasThemePreference();
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || hasExplicitTheme) return undefined;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event) => {
      setThemeState(event.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', handleSystemThemeChange);
    return () => media.removeEventListener('change', handleSystemThemeChange);
  }, [hasExplicitTheme]);

  const setTheme = (newTheme) => {
    setHasExplicitTheme(true);
    storage.setTheme(newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setHasExplicitTheme(true);
    setThemeState((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      storage.setTheme(nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
