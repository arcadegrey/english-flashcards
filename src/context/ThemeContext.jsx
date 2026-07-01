import { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';
import { storage } from '../utils/storage';

const getInitialTheme = () => {
  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    storage.setTheme('light');
  }, []);

  const setTheme = () => {
    storage.setTheme('light');
    setThemeState('light');
  };

  const toggleTheme = () => {
    storage.setTheme('light');
    setThemeState('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
