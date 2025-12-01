
import { useTheme } from './useTheme';
import { useFontSize } from './useFontSize';
import { useMotion } from './useMotion';
import { useInterface } from './useInterface';
import { useScreenReader } from './useScreenReader';
import { useCallback } from 'react';

export type AccessibilityProfile = 'default' | 'highContrast' | 'largeText' | 'screenReader';

export const useAccessibilityProfile = () => {
  // Use all the required hooks
  const { darkMode, highContrast, toggleDarkMode, toggleContrast } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();
  const { reduceMotion, toggleReduceMotion } = useMotion();
  const { 
    simplifiedInterface, 
    focusOutline, 
    toggleSimplifiedInterface, 
    toggleFocusOutline 
  } = useInterface();
  const { 
    screenReaderOptimized, 
    toggleScreenReaderOptimizations, 
    announce 
  } = useScreenReader();

  // Get all accessibility settings as an object
  const getSettings = useCallback(() => {
    return {
      darkMode,
      highContrast,
      fontSize,
      simplifiedInterface,
      reduceMotion,
      screenReaderOptimized,
      focusOutline
    };
  }, [
    darkMode, 
    highContrast, 
    fontSize, 
    simplifiedInterface, 
    reduceMotion, 
    screenReaderOptimized, 
    focusOutline
  ]);
  
  // Apply a predefined accessibility profile
  const applyProfile = useCallback((profile: AccessibilityProfile) => {
    // Reset to defaults first
    document.documentElement.classList.remove(
      'dark', 'high-contrast', 'simplified-ui', 
      'reduce-motion', 'screen-reader-optimized',
      'focus-visible'
    );
    
    // Remove any existing font size classes
    document.documentElement.classList.remove(
      'text-size--2', 'text-size--1', 'text-size-0',
      'text-size-1', 'text-size-2', 'text-size-3'
    );
    
    // Apply the selected profile
    switch (profile) {
      case 'default':
        if (darkMode) toggleDarkMode();
        if (highContrast) toggleContrast();
        
        // Reset font size to 0
        for (let i = 0; i < Math.abs(fontSize); i++) {
          if (fontSize > 0) decreaseFontSize();
          else if (fontSize < 0) increaseFontSize();
        }
        
        if (simplifiedInterface) toggleSimplifiedInterface();
        if (reduceMotion) toggleReduceMotion();
        if (screenReaderOptimized) toggleScreenReaderOptimizations();
        if (focusOutline) toggleFocusOutline();
        
        document.documentElement.classList.add('text-size-0');
        break;
        
      case 'highContrast':
        if (!darkMode) toggleDarkMode();
        if (!highContrast) toggleContrast();
        
        // Set font size to 1
        for (let i = 0; i < Math.abs(fontSize - 1); i++) {
          if (fontSize > 1) decreaseFontSize();
          else if (fontSize < 1) increaseFontSize();
        }
        
        if (!simplifiedInterface) toggleSimplifiedInterface();
        if (!reduceMotion) toggleReduceMotion();
        if (!focusOutline) toggleFocusOutline();
        
        document.documentElement.classList.add(
          'dark', 'high-contrast', 'simplified-ui', 
          'reduce-motion', 'focus-visible', 'text-size-1'
        );
        break;
        
      case 'largeText':
        // Set font size to 3
        for (let i = 0; i < Math.abs(fontSize - 3); i++) {
          if (fontSize > 3) decreaseFontSize();
          else if (fontSize < 3) increaseFontSize();
        }
        
        if (!simplifiedInterface) toggleSimplifiedInterface();
        if (!reduceMotion) toggleReduceMotion();
        
        document.documentElement.classList.add(
          'simplified-ui', 'reduce-motion', 'text-size-3'
        );
        break;
        
      case 'screenReader':
        if (!simplifiedInterface) toggleSimplifiedInterface();
        if (!reduceMotion) toggleReduceMotion();
        if (!screenReaderOptimized) toggleScreenReaderOptimizations();
        if (!focusOutline) toggleFocusOutline();
        
        document.documentElement.classList.add(
          'simplified-ui', 'reduce-motion', 
          'screen-reader-optimized', 'focus-visible'
        );
        break;
    }
    
    announce(`Perfil de acessibilidade "${profile}" aplicado.`);
  }, [
    darkMode,
    highContrast,
    fontSize,
    simplifiedInterface,
    reduceMotion,
    screenReaderOptimized,
    focusOutline,
    toggleDarkMode,
    toggleContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleSimplifiedInterface,
    toggleReduceMotion,
    toggleScreenReaderOptimizations,
    toggleFocusOutline,
    announce
  ]);
  
  return {
    getSettings,
    applyProfile
  };
};

export default useAccessibilityProfile;
