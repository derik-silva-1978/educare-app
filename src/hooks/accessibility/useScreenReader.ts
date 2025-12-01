
import { useState } from 'react';
import { announceScreenReaderMessage } from '@/utils/accessibility';

export const useScreenReader = () => {
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(() => 
    localStorage.getItem('screen-reader-optimized') === 'true'
  );
  
  // Toggle screen reader optimizations
  const toggleScreenReaderOptimizations = () => {
    const optimized = !screenReaderOptimized;
    setScreenReaderOptimized(optimized);
    
    if (optimized) {
      // Apply screen reader optimizations
      document.documentElement.classList.add('screen-reader-optimized');
    } else {
      // Remove screen reader optimizations
      document.documentElement.classList.remove('screen-reader-optimized');
    }
    
    localStorage.setItem('screen-reader-optimized', optimized.toString());
    return optimized;
  };
  
  // Announce message for screen readers
  const announce = (message: string) => {
    announceScreenReaderMessage(message);
  };
  
  return {
    screenReaderOptimized,
    toggleScreenReaderOptimizations,
    announce
  };
};

export default useScreenReader;
