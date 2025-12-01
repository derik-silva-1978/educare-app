
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DevelopmentDomain, AssessmentItem } from '@/types/assessment';

interface AssessmentContextType {
  activeDomain: DevelopmentDomain;
  setActiveDomain: (domain: DevelopmentDomain) => void;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  completedDomains: Record<DevelopmentDomain, boolean>;
  setCompletedDomains: React.Dispatch<React.SetStateAction<Record<DevelopmentDomain, boolean>>>;
  updateItem: (item: AssessmentItem) => void;
  updateObservation: (domain: DevelopmentDomain, value: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
  initialDomain: DevelopmentDomain;
  onUpdateItem: (item: AssessmentItem) => void;
  onUpdateObservation: (domain: DevelopmentDomain, value: string) => void;
  initialCompletedDomains: Record<DevelopmentDomain, boolean>;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({
  children,
  initialDomain,
  onUpdateItem,
  onUpdateObservation,
  initialCompletedDomains
}) => {
  const [activeDomain, setActiveDomain] = useState<DevelopmentDomain>(initialDomain);
  const [expandedSections, setExpandedSections] = useState<string[]>([initialDomain]);
  const [completedDomains, setCompletedDomains] = useState<Record<DevelopmentDomain, boolean>>(
    initialCompletedDomains
  );

  const value = {
    activeDomain,
    setActiveDomain,
    expandedSections,
    setExpandedSections,
    completedDomains,
    setCompletedDomains,
    updateItem: onUpdateItem,
    updateObservation: onUpdateObservation
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};
