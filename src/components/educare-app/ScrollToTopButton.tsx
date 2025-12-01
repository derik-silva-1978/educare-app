
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top when button clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return isVisible ? (
    <div className="flex justify-center mt-8">
      <Button 
        variant="outline" 
        size="sm"
        className="text-sm rounded-full shadow-sm hover:shadow border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 font-medium gap-2" 
        onClick={scrollToTop}
      >
        <ArrowUp className="h-4 w-4" />
        Voltar ao topo
      </Button>
    </div>
  ) : null;
};

export default ScrollToTopButton;
