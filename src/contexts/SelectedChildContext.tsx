import React, { createContext, useContext, useState, useEffect } from 'react';

type JourneyType = 'child' | 'mother';

interface SelectedChildContextType {
  selectedChildId: string | null;
  setSelectedChildId: (childId: string | null) => void;
  journeyType: JourneyType;
  setJourneyType: (type: JourneyType) => void;
  isMotherJourney: boolean;
}

const SelectedChildContext = createContext<SelectedChildContextType | undefined>(undefined);

export const useSelectedChild = () => {
  const context = useContext(SelectedChildContext);
  if (!context) {
    throw new Error('useSelectedChild must be used within a SelectedChildProvider');
  }
  return context;
};

interface SelectedChildProviderProps {
  children: React.ReactNode;
}

export const SelectedChildProvider: React.FC<SelectedChildProviderProps> = ({ children }) => {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [journeyType, setJourneyType] = useState<JourneyType>('child');

  const isMotherJourney = journeyType === 'mother';

  return (
    <SelectedChildContext.Provider value={{ 
      selectedChildId, 
      setSelectedChildId,
      journeyType,
      setJourneyType,
      isMotherJourney
    }}>
      {children}
    </SelectedChildContext.Provider>
  );
};