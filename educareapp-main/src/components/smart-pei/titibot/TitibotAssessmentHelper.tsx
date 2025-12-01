
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTitibot } from './TitibotProvider';
import useAccessibility from '@/hooks/useAccessibility';
import { AssessmentItem } from '@/types/assessment';

interface TitibotAssessmentHelperProps {
  domain?: string;
  item?: AssessmentItem;
  onRequestHelp?: () => void;
}

export const TitibotAssessmentHelper: React.FC<TitibotAssessmentHelperProps> = ({
  domain,
  item,
  onRequestHelp
}) => {
  const [showHelper, setShowHelper] = useState(false);
  const { openTitibot, isEnabled } = useTitibot();
  const { announce } = useAccessibility();
  
  if (!isEnabled) return null;
  
  const handleOpenTitibot = () => {
    openTitibot();
    
    // Announce to screen readers
    if (item) {
      announce(`Assistente aberto para ajudar com o item ${item.title}`);
    } else if (domain) {
      announce(`Assistente aberto para ajudar com o domínio ${domain}`);
    } else {
      announce(`Assistente aberto`);
    }
    
    // Call the optional callback
    if (onRequestHelp) {
      onRequestHelp();
    }
    
    setShowHelper(false);
  };

  return (
    <div className="assessment-titibot-helper">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center text-primary"
        onClick={handleOpenTitibot}
      >
        <svg
          className="w-4 h-4 mr-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12" y2="17" />
        </svg>
        Preciso de ajuda com este {item ? 'item' : 'domínio'}
      </Button>
    </div>
  );
};

export default TitibotAssessmentHelper;
