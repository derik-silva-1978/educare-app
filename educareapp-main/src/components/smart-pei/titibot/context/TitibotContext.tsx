
import React, { useContext } from 'react';

export type TitibotPosition = 'bottom-right' | 'bottom-left' | 'right-side';

export const titibotPositions: Record<TitibotPosition, string> = {
  'bottom-right': 'bottom-right',
  'bottom-left': 'bottom-left',
  'right-side': 'right-side'
};

export interface TitibotContextType {
  isOpen: boolean;
  isEnabled: boolean;
  isSubscribed: boolean;
  isPremium: boolean;
  position: TitibotPosition;
  openTitibot: () => void;
  closeTitibot: () => void;
  toggleTitibot: () => void;
  enableTitibot: () => void;
  disableTitibot: () => void;
  subscribeTitibot: () => void;
  unsubscribeTitibot: () => void;
  upgradeToPremium: () => void;
  downgradeFromPremium: () => void;
  resetHints: () => void;
  setPosition: (position: TitibotPosition) => void;
}

export const TitibotContext = React.createContext<TitibotContextType>({
  isOpen: false,
  isEnabled: false,
  isSubscribed: false,
  isPremium: false,
  position: 'bottom-right',
  openTitibot: () => {},
  closeTitibot: () => {},
  toggleTitibot: () => {},
  enableTitibot: () => {},
  disableTitibot: () => {},
  subscribeTitibot: () => {},
  unsubscribeTitibot: () => {},
  upgradeToPremium: () => {},
  downgradeFromPremium: () => {},
  resetHints: () => {},
  setPosition: () => {},
});

export const useTitibot = () => useContext(TitibotContext);
