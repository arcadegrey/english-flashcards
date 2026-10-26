import { useLayoutEffect, useState } from 'react';
import { ThemeContext } from './theme-context';
import { storage } from '../utils/storage';

const getInitialTheme = () => {
  return storage.getTheme() || 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101724' : '#4F7CFF');
  }, [theme]);

  const setTheme = (nextTheme) => {
    if (nextTheme !== 'light' && nextTheme !== 'dark') return;
    storage.setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
