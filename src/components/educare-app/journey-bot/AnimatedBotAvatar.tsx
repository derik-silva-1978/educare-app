import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface AnimatedBotAvatarProps {
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedBotAvatar: React.FC<AnimatedBotAvatarProps> = ({
  isAnimating = false,
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`${sizeMap[size]} bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg`}
    >
      <MessageCircle className="w-1/2 h-1/2" />
    </motion.div>
  );
};
