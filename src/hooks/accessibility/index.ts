
import { useState, useEffect } from 'react';
import { initAccessibilitySettings } from '@/utils/accessibility';
import useTheme from './useTheme';
import useFontSize from './useFontSize';
import useMotion from './useMotion';
import useInterface from './useInterface';
import useScreenReader from './useScreenReader';
import useAccessibilityProfile, { AccessibilityProfile } from './useAccessibilityProfile';

export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: number;
  simplifiedInterface: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  focusOutline: boolean;
}

export const useAccessibility = () => {
  // Initialize accessibility settings on component mount
  useEffect(() => {
    initAccessibilitySettings();
  }, []);

  // Import all the smaller hooks
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
  const { getSettings, applyProfile } = useAccessibilityProfile();
  
  return {
    // State
    darkMode,
    highContrast,
    fontSize,
    simplifiedInterface,
    reduceMotion,
    screenReaderOptimized,
    focusOutline,
    
    // Actions
    toggleDarkMode,
    toggleContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleSimplifiedInterface,
    toggleReduceMotion,
    toggleScreenReaderOptimizations,
    toggleFocusOutline,
    announce,
    getSettings,
    applyProfile
  };
};

export { 
  useTheme,
  useFontSize,
  useMotion,
  useInterface,
  useScreenReader,
  useAccessibilityProfile
};

export default useAccessibility;
