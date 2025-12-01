
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Star, Trophy } from 'lucide-react';

interface GamificationStatsProps {
  streak?: number;
  xp?: number;
  completedQuestions?: number;
  achievements?: number;
  showAnimations?: boolean;
}

const statVariants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: 1
    }
  }
};

const counterVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

export const GamificationStats: React.FC<GamificationStatsProps> = ({
  streak = 0,
  xp = 0,
  completedQuestions = 0,
  achievements = 0,
  showAnimations = false
}) => {
  const stats = [
    {
      icon: Flame,
      value: streak,
      label: 'Sequência',
      color: 'from-orange-400 to-red-500',
      textColor: 'text-orange-100',
      animate: streak > 0
    },
    {
      icon: Zap,
      value: xp,
      label: 'XP',
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-100',
      animate: showAnimations
    },
    {
      icon: Star,
      value: completedQuestions,
      label: 'Perguntas',
      color: 'from-blue-400 to-purple-500',
      textColor: 'text-blue-100',
      animate: showAnimations
    },
    {
      icon: Trophy,
      value: achievements,
      label: 'Conquistas',
      color: 'from-purple-400 to-pink-500',
      textColor: 'text-purple-100',
      animate: achievements > 0
    }
  ];

  return (
    <div className="flex justify-center gap-3 mb-6">
      {stats.map(({ icon: Icon, value, label, color, textColor, animate }, index) => (
        <motion.div
          key={label}
          className={`bg-gradient-to-r ${color} rounded-full px-4 py-2 flex items-center gap-2 
                     shadow-lg backdrop-blur-sm border border-white/20 min-w-[80px]`}
          variants={statVariants}
          animate={animate ? "pulse" : "idle"}
          initial="initial"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={animate ? {
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 0.8,
              repeat: animate ? Infinity : 0,
              repeatDelay: 2
            }}
          >
            <Icon className={`h-4 w-4 ${textColor}`} />
          </motion.div>
          
          <div className="text-center">
            <motion.div
              className={`font-bold text-sm ${textColor}`}
              variants={counterVariants}
              initial="initial"
              animate="animate"
              key={value}
            >
              {value}
            </motion.div>
            <div className={`text-xs ${textColor} opacity-80`}>
              {label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GamificationStats;
