import React, { createContext, useContext, useState, useEffect } from 'react';

interface SelectedChildContextType {
  selectedChildId: string | null;
  setSelectedChildId: (childId: string | null) => void;
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

  return (
    <SelectedChildContext.Provider value={{ selectedChildId, setSelectedChildId }}>
      {children}
    </SelectedChildContext.Provider>
  );
};