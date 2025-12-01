
import { useState, useEffect } from 'react';

interface KeyboardNavigationOptions {
  itemCount: number;
  columnsPerRow: number;
  initialFocus?: number;
}

const useKeyboardNavigation = ({ 
  itemCount, 
  columnsPerRow, 
  initialFocus = -1 
}: KeyboardNavigationOptions) => {
  const [focusedIndex, setFocusedIndex] = useState(initialFocus);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = document.getElementById(`student-card-${focusedIndex}`);
      if (element) {
        element.focus();
      }
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, itemCount - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + columnsPerRow, itemCount - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - columnsPerRow, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        return; // Let the onClick handler manage this
      default:
        return; // Don't handle other keys
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      setFocusedIndex(newIndex);
    }
  };

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown
  };
};

export default useKeyboardNavigation;
