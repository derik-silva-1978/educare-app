
import React, { useState, useEffect, useCallback } from 'react';
import { TitibotContext, titibotPositions } from './context/TitibotContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface TitibotProviderProps {
  children: React.ReactNode;
}

export const TitibotProvider: React.FC<TitibotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useLocalStorage('titibot-enabled', true);
  const [isSubscribed, setIsSubscribed] = useLocalStorage('titibot-subscribed', true);
  const [isPremium, setIsPremium] = useLocalStorage('titibot-premium', false);
  const [position, setPosition] = useLocalStorage<'bottom-right' | 'bottom-left' | 'right-side'>(
    'titibot-position', 
    'bottom-right'
  );
  const { toast } = useToast();
  
  // Mock features object since useSmartPEI is causing issues
  const features = {
    titibot: true,
    subscription: {
      titibot: true
    },
    premium: {
      titibot: isPremium
    }
  };
  
  useEffect(() => {
    // Check if titibot is enabled in the features
    if (features?.titibot === false) {
      setIsEnabled(false);
    }
    
    // Check if user has subscription for titibot
    if (features?.subscription?.titibot === false) {
      setIsSubscribed(false);
    }
    
    // Check if user has premium titibot
    if (features?.premium?.titibot === true) {
      setIsPremium(true);
    }
  }, [features, setIsEnabled, setIsSubscribed, setIsPremium]);
  
  const openTitibot = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const closeTitibot = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const toggleTitibot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const enableTitibot = useCallback(() => {
    setIsEnabled(true);
    toast({
      title: "Titibot Ativado",
      description: "O assistente virtual foi ativado com sucesso",
    });
  }, [setIsEnabled, toast]);
  
  const disableTitibot = useCallback(() => {
    setIsEnabled(false);
    setIsOpen(false);
    toast({
      title: "Titibot Desativado",
      description: "O assistente virtual foi desativado",
    });
  }, [setIsEnabled, toast]);
  
  const subscribeTitibot = useCallback(() => {
    setIsSubscribed(true);
    toast({
      title: "Sugestões Ativadas",
      description: "Você receberá sugestões contextuais do Titibot",
    });
  }, [setIsSubscribed, toast]);
  
  const unsubscribeTitibot = useCallback(() => {
    setIsSubscribed(false);
    toast({
      title: "Sugestões Desativadas",
      description: "Você não receberá mais sugestões contextuais",
    });
  }, [setIsSubscribed, toast]);
  
  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    toast({
      title: "Titibot Turbo Ativado",
      description: "Você agora tem acesso ao assistente com respostas avançadas",
      variant: "default",
    });
  }, [setIsPremium, toast]);
  
  const downgradeFromPremium = useCallback(() => {
    setIsPremium(false);
    toast({
      title: "Titibot Turbo Desativado",
      description: "Você voltou para a versão básica do assistente",
    });
  }, [setIsPremium, toast]);
  
  const resetHints = useCallback(() => {
    // Reset any hint states or user preferences
    localStorage.removeItem('titibot-hints-shown');
    toast({
      title: "Dicas Resetadas",
      description: "As dicas do Titibot foram resetadas",
    });
  }, [toast]);
  
  return (
    <TitibotContext.Provider
      value={{
        isOpen,
        isEnabled,
        isSubscribed,
        isPremium,
        position,
        openTitibot,
        closeTitibot,
        toggleTitibot,
        enableTitibot,
        disableTitibot,
        subscribeTitibot,
        unsubscribeTitibot,
        upgradeToPremium,
        downgradeFromPremium,
        resetHints,
        setPosition,
      }}
    >
      {children}
    </TitibotContext.Provider>
  );
};

// Re-export the useTitibot hook for convenience
export { useTitibot } from './context/TitibotContext';
