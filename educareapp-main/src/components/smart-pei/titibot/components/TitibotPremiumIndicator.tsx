
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TitibotPremiumIndicatorProps {
  isPremium: boolean;
}

export const TitibotPremiumIndicator: React.FC<TitibotPremiumIndicatorProps> = ({ 
  isPremium 
}) => {
  if (!isPremium) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Badge 
        variant="outline" 
        className={cn(
          "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
          "flex items-center gap-1 ml-2 shadow-sm"
        )}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [-5, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Zap className="h-3 w-3" />
        </motion.div>
        <span>Turbo</span>
      </Badge>
    </motion.div>
  );
};

export default TitibotPremiumIndicator;
