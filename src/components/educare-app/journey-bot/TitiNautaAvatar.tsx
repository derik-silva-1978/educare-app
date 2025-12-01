import React from 'react';
import { motion } from 'framer-motion';

interface TitiNautaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'neutral';
  className?: string;
}

const TitiNautaAvatar: React.FC<TitiNautaAvatarProps> = ({
  size = 'md',
  isActive = true,
  mood = 'happy',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'celebrating':
        return {
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.1, 1.2, 1.1, 1],
          transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
        };
      case 'thinking':
        return {
          rotate: [0, 3, -3, 0],
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

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}
      animate={isActive ? getMoodAnimation() : {}}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="#25D366" opacity="0.1" />
        <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#25D366" strokeWidth="2" />
        
        {/* Astronaut helmet */}
        <circle cx="50" cy="42" r="32" fill="#E8F5E8" stroke="#25D366" strokeWidth="2" />
        <circle cx="50" cy="42" r="28" fill="#ffffff" stroke="#25D366" strokeWidth="1" opacity="0.3" />
        
        {/* Helmet reflection */}
        <ellipse cx="45" cy="35" rx="8" ry="12" fill="#ffffff" opacity="0.4" />
        
        {/* Face */}
        <circle cx="44" cy="40" r="3" fill="#25D366" />
        <circle cx="56" cy="40" r="3" fill="#25D366" />
        <circle cx="44" cy="40" r="1" fill="#ffffff" />
        <circle cx="56" cy="40" r="1" fill="#ffffff" />
        
        {/* Smile */}
        <path d="M42,48 Q50,54 58,48" stroke="#25D366" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Heart on chest */}
        <path 
          d="M50,55 C47,52 42,52 42,57 C42,62 50,70 50,70 C50,70 58,62 58,57 C58,52 53,52 50,55 Z" 
          fill="#FF6B6B" 
          opacity="0.8"
        />
        <path 
          d="M50,57 C48,55 45,55 45,58 C45,61 50,66 50,66 C50,66 55,61 55,58 C55,55 52,55 50,57 Z" 
          fill="#ffffff" 
          opacity="0.6"
        />
        
        {/* Antenna */}
        <rect x="48" y="12" width="4" height="8" rx="2" fill="#25D366" />
        <circle cx="50" cy="10" r="3" fill="#FFD700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Body/suit */}
        <ellipse cx="50" cy="75" rx="18" ry="12" fill="#E8F5E8" stroke="#25D366" strokeWidth="2" />
        
        {/* Arms */}
        <ellipse cx="32" cy="65" rx="6" ry="8" fill="#E8F5E8" stroke="#25D366" strokeWidth="1" />
        <ellipse cx="68" cy="65" rx="6" ry="8" fill="#E8F5E8" stroke="#25D366" strokeWidth="1" />
        
        {/* Animated sparkles around */}
        <g opacity="0.6">
          <circle cx="25" cy="25" r="1" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="75" cy="30" r="1" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="80" cy="65" r="1" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle cx="20" cy="70" r="1" fill="#FFD700">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1.2s" />
          </circle>
        </g>
      </svg>
    </motion.div>
  );
};

export { TitiNautaAvatar };