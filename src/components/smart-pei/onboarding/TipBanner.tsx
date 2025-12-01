
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LightbulbIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TipBannerProps {
  id: string;
  title: string;
  description: string;
}

export const TipBanner: React.FC<TipBannerProps> = ({ id, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if this tip has been dismissed before
    const dismissedTips = JSON.parse(localStorage.getItem('smartPeiDismissedTips') || '{}');
    if (!dismissedTips[id]) {
      // Only show after a short delay for better UX
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [id]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Store in localStorage to prevent showing again
    const dismissedTips = JSON.parse(localStorage.getItem('smartPeiDismissedTips') || '{}');
    dismissedTips[id] = true;
    localStorage.setItem('smartPeiDismissedTips', JSON.stringify(dismissedTips));
  };
  
  if (!isVisible) return null;
  
  return (
    <Alert className="mb-4 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <LightbulbIcon className="h-4 w-4 text-amber-500" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
      <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar</span>
      </Button>
    </Alert>
  );
};

export default TipBanner;
