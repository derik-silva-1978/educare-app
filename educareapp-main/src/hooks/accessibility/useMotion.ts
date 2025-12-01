
import { useState, useEffect } from 'react';

export const useMotion = () => {
  // Helper function to check if system prefers reduced motion
  const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const [reduceMotion, setReduceMotion] = useState(() => 
    localStorage.getItem('reduce-motion') === 'true' || prefersReducedMotion()
  );
  
  // Toggle reduce motion
  const toggleReduceMotion = () => {
    const shouldReduceMotion = !reduceMotion;
    setReduceMotion(shouldReduceMotion);
    document.documentElement.classList.toggle('reduce-motion', shouldReduceMotion);
    localStorage.setItem('reduce-motion', shouldReduceMotion.toString());
    return shouldReduceMotion;
  };
  
  // Set up listeners for system preference changes
  useEffect(() => {
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('reduce-motion') === null) {
        setReduceMotion(e.matches);
        document.documentElement.classList.toggle('reduce-motion', e.matches);
      }
    };
    
    motionMediaQuery.addEventListener('change', handleMotionChange);
    
    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);
  
  return {
    reduceMotion,
    toggleReduceMotion
  };
};

export default useMotion;
