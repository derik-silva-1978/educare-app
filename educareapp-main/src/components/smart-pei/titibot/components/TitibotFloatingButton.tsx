
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, Zap } from 'lucide-react';
import { useTitibot } from '../TitibotProvider';
import TitibotPremiumIndicator from './TitibotPremiumIndicator';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useScreenReader } from '@/hooks/accessibility/useScreenReader';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TitibotFloatingButton: React.FC = () => {
  const { 
    isOpen, 
    isEnabled, 
    isSubscribed,
    isPremium,
    toggleTitibot,
    position
  } = useTitibot();
  
  const { isAuthenticated } = useAuth();
  const { announce } = useScreenReader();
  
  // Only show the Titibot for authenticated users
  if (!isAuthenticated || !isEnabled || !isSubscribed) {
    return null;
  }

  const handleToggle = () => {
    toggleTitibot();
    announce(isOpen ? "Titibot fechado" : "Titibot aberto");
  };

  // Determine position classes based on the selected position
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'right-side':
        return 'right-6 top-1/2 -translate-y-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`titibot-launcher-container fixed z-50 ${getPositionClasses()}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Button
          className={cn(
            "titibot-launcher h-14 w-14 rounded-full shadow-xl flex items-center justify-center", 
            "transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isPremium ? 
              "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600" : 
              "bg-primary hover:bg-primary/90"
          )}
          onClick={handleToggle}
          aria-label={isOpen ? "Fechar Titibot" : "Abrir Titibot"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                {isPremium ? (
                  <div className="relative">
                    <Bot className="h-6 w-6" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Zap className="h-3 w-3 text-white" />
                    </motion.div>
                  </div>
                ) : (
                  <Bot className="h-6 w-6" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <span className="sr-only">
            {isOpen ? "Fechar Titibot" : "Abrir Titibot"}
          </span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <TitibotPremiumIndicator 
          isPremium={isPremium} 
        />
      </motion.div>
    </div>
  );
};

export default TitibotFloatingButton;
