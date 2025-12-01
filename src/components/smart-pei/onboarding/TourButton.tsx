
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { OnboardingTour } from './OnboardingTour';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

interface TourButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  showTooltip?: boolean;
  navigateInstead?: boolean;
  label?: string;
}

export const TourButton: React.FC<TourButtonProps> = ({ 
  variant = "outline", 
  size = "sm",
  className = "",
  showIcon = true,
  showTooltip = true,
  navigateInstead = false,
  label = "Tour Interativo"
}) => {
  const [showTour, setShowTour] = useState(false);
  const navigate = useNavigate();
  
  const handleStartTour = () => {
    if (navigateInstead) {
      navigate('/smart-pei');
    } else {
      setShowTour(true);
    }
  };
  
  const handleCompleteTour = () => {
    setShowTour(false);
    localStorage.setItem('smartPeiOnboardingComplete', 'true');
  };
  
  const buttonContent = (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleStartTour}
      className={`flex items-center gap-2 transition-all hover:scale-105 ${className}`}
      aria-label={`Iniciar ${label}`}
    >
      {showIcon && <PlayCircle className="h-4 w-4" aria-hidden="true" />}
      <span>{label}</span>
    </Button>
  );
  
  return (
    <>
      {showTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>Conheça todos os recursos do Smart PEI</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}
      
      {showTour && <OnboardingTour onComplete={handleCompleteTour} />}
    </>
  );
};

export default TourButton;
