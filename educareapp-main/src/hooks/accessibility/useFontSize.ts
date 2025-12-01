
import { useState } from 'react';
import {
  increaseFontSize as increaseFontSizeUtil,
  decreaseFontSize as decreaseFontSizeUtil
} from '@/utils/accessibility';

export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(() => 
    parseInt(localStorage.getItem('font-size') || '0')
  );
  
  // Increase font size
  const increaseFontSize = () => {
    const newSize = increaseFontSizeUtil();
    setFontSize(newSize);
    return newSize;
  };
  
  // Decrease font size
  const decreaseFontSize = () => {
    const newSize = decreaseFontSizeUtil();
    setFontSize(newSize);
    return newSize;
  };
  
  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize
  };
};

export default useFontSize;
