
import { useState, useEffect } from 'react';
import { 
  toggleDarkMode as toggleDarkModeUtil,
  toggleContrast as toggleContrastUtil
} from '@/utils/accessibility';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('dark-mode') === 'true'
  );
  
  const [highContrast, setHighContrast] = useState(() => 
    localStorage.getItem('high-contrast') === 'true'
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    const isDark = toggleDarkModeUtil();
    setDarkMode(isDark);
    return isDark;
  };
  
  // Toggle high contrast
  const toggleContrast = () => {
    const isHighContrast = toggleContrastUtil();
    setHighContrast(isHighContrast);
    return isHighContrast;
  };

  // Set up listeners for system preference changes
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('dark-mode') === null) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  return {
    darkMode,
    highContrast,
    toggleDarkMode,
    toggleContrast
  };
};

export default useTheme;
