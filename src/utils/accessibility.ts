
// Utility function to announce messages to screen readers
export const announceScreenReaderMessage = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after a brief delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Additional accessibility utilities
export const setFocusToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
};

export const trapFocus = (container: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
};

// Initialize accessibility settings
export const initAccessibilitySettings = (): void => {
  // Apply saved theme settings
  const darkMode = localStorage.getItem('dark-mode') === 'true';
  const highContrast = localStorage.getItem('high-contrast') === 'true';
  
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }
  
  if (highContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Apply saved font size
  const fontSize = parseInt(localStorage.getItem('font-size') || '0');
  if (fontSize !== 0) {
    document.documentElement.classList.add(`text-size-${fontSize}`);
  }
  
  // Apply other accessibility settings
  const reduceMotion = localStorage.getItem('reduce-motion') === 'true';
  const simplifiedInterface = localStorage.getItem('simplified-interface') === 'true';
  
  if (reduceMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
  
  if (simplifiedInterface) {
    document.documentElement.classList.add('simplified-ui');
  }
};

// Theme utilities
export const toggleDarkMode = (): boolean => {
  const isDark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('dark-mode', isDark.toString());
  return isDark;
};

export const toggleContrast = (): boolean => {
  const isHighContrast = !document.documentElement.classList.contains('high-contrast');
  document.documentElement.classList.toggle('high-contrast', isHighContrast);
  localStorage.setItem('high-contrast', isHighContrast.toString());
  return isHighContrast;
};

// Font size utilities
export const increaseFontSize = (): number => {
  const currentSize = parseInt(localStorage.getItem('font-size') || '0');
  const newSize = Math.min(currentSize + 1, 3); // Max size of 3
  
  // Remove old size class
  document.documentElement.classList.remove(`text-size-${currentSize}`);
  // Add new size class
  document.documentElement.classList.add(`text-size-${newSize}`);
  
  localStorage.setItem('font-size', newSize.toString());
  return newSize;
};

export const decreaseFontSize = (): number => {
  const currentSize = parseInt(localStorage.getItem('font-size') || '0');
  const newSize = Math.max(currentSize - 1, -2); // Min size of -2
  
  // Remove old size class
  document.documentElement.classList.remove(`text-size-${currentSize}`);
  // Add new size class
  document.documentElement.classList.add(`text-size-${newSize}`);
  
  localStorage.setItem('font-size', newSize.toString());
  return newSize;
};

// Motion utilities
export const toggleReduceMotion = (): boolean => {
  const reduceMotion = !document.documentElement.classList.contains('reduce-motion');
  document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  localStorage.setItem('reduce-motion', reduceMotion.toString());
  return reduceMotion;
};

// Interface utilities
export const toggleSimplifiedInterface = (): boolean => {
  const simplified = !document.documentElement.classList.contains('simplified-ui');
  document.documentElement.classList.toggle('simplified-ui', simplified);
  localStorage.setItem('simplified-interface', simplified.toString());
  return simplified;
};

export const toggleFocusOutline = (): boolean => {
  const focusVisible = !document.documentElement.classList.contains('focus-visible');
  document.documentElement.classList.toggle('focus-visible', focusVisible);
  localStorage.setItem('focus-outline', focusVisible.toString());
  return focusVisible;
};

// Screen reader utilities
export const toggleScreenReaderOptimizations = (): boolean => {
  const optimized = !document.documentElement.classList.contains('screen-reader-optimized');
  document.documentElement.classList.toggle('screen-reader-optimized', optimized);
  localStorage.setItem('screen-reader-optimized', optimized.toString());
  return optimized;
};
