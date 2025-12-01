
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AnimatedBotAvatarProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
}

const AnimatedBotAvatar: React.FC<AnimatedBotAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  isActive = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'celebrating':
        return {
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1.2, 1.1, 1],
          transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
        };
      case 'thinking':
        return {
          rotate: [0, 5, -5, 0],
          transition: { duration: 2, repeat: Infinity }
        };
      case 'happy':
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity }
        };
      default:
        return {};
    }
  };

  const getBgColor = () => {
    switch (mood) {
      case 'celebrating':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'thinking':
        return 'bg-gradient-to-br from-purple-400 to-blue-500';
      case 'happy':
        return 'bg-gradient-to-br from-blue-400 to-cyan-500';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${getBgColor()} rounded-full flex items-center justify-center text-white shadow-lg`}
      animate={isActive ? getMoodAnimation() : {}}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Bot size={iconSizes[size]} />
    </motion.div>
  );
};

export { AnimatedBotAvatar };
