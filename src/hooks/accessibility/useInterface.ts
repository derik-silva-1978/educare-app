
import { useState } from 'react';

export const useInterface = () => {
  const [simplifiedInterface, setSimplifiedInterface] = useState(() => 
    localStorage.getItem('simplified-ui') === 'true'
  );
  
  const [focusOutline, setFocusOutline] = useState(() => 
    localStorage.getItem('focus-outline') === 'true'
  );
  
  // Toggle simplified interface
  const toggleSimplifiedInterface = () => {
    const isSimplified = !simplifiedInterface;
    setSimplifiedInterface(isSimplified);
    document.documentElement.classList.toggle('simplified-ui', isSimplified);
    localStorage.setItem('simplified-ui', isSimplified.toString());
    return isSimplified;
  };
  
  // Toggle focus outline
  const toggleFocusOutline = () => {
    const showOutline = !focusOutline;
    setFocusOutline(showOutline);
    document.documentElement.classList.toggle('focus-visible', showOutline);
    localStorage.setItem('focus-outline', showOutline.toString());
    return showOutline;
  };
  
  return {
    simplifiedInterface,
    focusOutline,
    toggleSimplifiedInterface,
    toggleFocusOutline
  };
};

export default useInterface;
