import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useTheme = () => {
  const { settings } = useSettings();

  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    const { theme } = settings;

    if (theme === 'light') {
      applyTheme(false);
    } else if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'system') {
      // Detect system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      // Listen for system theme changes
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', listener);

      // Cleanup listener
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [settings.theme]);
};