
import { useEffect } from 'react';
import { useAccessibility } from './index';

export const useAdminAccessibility = () => {
  const {
    darkMode,
    highContrast,
    fontSize,
    simplifiedInterface,
    reduceMotion,
    screenReaderOptimized,
    focusOutline
  } = useAccessibility();

  useEffect(() => {
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;

    // Apply admin-specific accessibility classes
    const classList = adminContainer.classList;
    
    // High contrast
    if (highContrast) {
      classList.add('admin-high-contrast');
    } else {
      classList.remove('admin-high-contrast');
    }

    // Simplified interface
    if (simplifiedInterface) {
      classList.add('admin-simplified-ui');
    } else {
      classList.remove('admin-simplified-ui');
    }

    // Enhanced focus
    if (focusOutline) {
      classList.add('admin-focus-enhanced');
    } else {
      classList.remove('admin-focus-enhanced');
    }

    // Screen reader optimizations
    if (screenReaderOptimized) {
      classList.add('admin-screen-reader-optimized');
    } else {
      classList.remove('admin-screen-reader-optimized');
    }

    // Reduced motion
    if (reduceMotion) {
      classList.add('reduce-motion');
    } else {
      classList.remove('reduce-motion');
    }

  }, [highContrast, simplifiedInterface, focusOutline, screenReaderOptimized, reduceMotion]);

  return {
    darkMode,
    highContrast,
    fontSize,
    simplifiedInterface,
    reduceMotion,
    screenReaderOptimized,
    focusOutline
  };
};

export default useAdminAccessibility;
