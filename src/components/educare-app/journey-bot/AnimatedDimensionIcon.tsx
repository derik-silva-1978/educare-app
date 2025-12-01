
import React from 'react';
import { motion } from 'framer-motion';
import { JourneyBotDimension, DimensionIcons, DimensionColors } from '@/types/journey-bot';

interface AnimatedDimensionIconProps {
  dimension: JourneyBotDimension;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
}

const AnimatedDimensionIcon: React.FC<AnimatedDimensionIconProps> = ({
  dimension,
  size = 'md',
  isActive = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-24 h-24 text-6xl'
  };

  const icon = DimensionIcons[dimension];
  const colorClass = DimensionColors[dimension];

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white shadow-lg`}
      animate={isActive ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="select-none">{icon}</span>
    </motion.div>
  );
};

export { AnimatedDimensionIcon };
