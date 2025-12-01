
import React, { useState } from 'react';
import { Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTitibot } from '../TitibotProvider';
import TitibotUpgradeDialog from './TitibotUpgradeDialog';

const TitibotTurboPromo: React.FC = () => {
  const { upgradeToPremium } = useTitibot();
  const [showDialog, setShowDialog] = useState(false);
  
  const handleUpgradeClick = () => {
    setShowDialog(true);
  };
  
  const handleConfirmUpgrade = () => {
    upgradeToPremium();
    setShowDialog(false);
  };
  
  const handleCancelUpgrade = () => {
    setShowDialog(false);
  };

  return (
    <>
      <motion.div 
        className={cn(
          "p-3 border-t border-yellow-100",
          "bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50",
          "relative overflow-hidden"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-yellow-100 rounded-full opacity-30" />
        <div className="absolute right-2 bottom-2 w-6 h-6 bg-amber-100 rounded-full opacity-30" />
        <div className="absolute left-10 top-10 w-4 h-4 bg-yellow-200 rounded-full opacity-20" />
        
        <div className="flex items-start gap-2 relative z-10">
          <div className="mt-0.5">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-yellow-300 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Zap className="h-4 w-4 text-white" />
            </motion.div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium flex items-center gap-1.5 text-amber-900">
              Titibot Turbo
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </h3>
            <p className="text-xs text-amber-800/80 mt-0.5 mb-2 leading-tight">
              Respostas mais rápidas e inteligentes para suas dúvidas.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="sm" 
                className={cn(
                  "w-full text-xs py-1 h-8",
                  "bg-gradient-to-r from-amber-400 to-yellow-500",
                  "border-0 hover:from-amber-500 hover:to-yellow-600",
                  "text-white shadow-sm"
                )}
                onClick={handleUpgradeClick}
              >
                <Shield className="mr-1 h-3.5 w-3.5" />
                Ativar Titibot Turbo
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <TitibotUpgradeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleConfirmUpgrade}
        onCancel={handleCancelUpgrade}
      />
    </>
  );
};

export default TitibotTurboPromo;
