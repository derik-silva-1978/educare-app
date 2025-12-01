
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Gift } from 'lucide-react';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description?: string;
  dimension?: string;
  earned_at: string;
}

interface JourneyBotAchievementProps {
  achievement: Achievement;
  isNew?: boolean;
}

const JourneyBotAchievement: React.FC<JourneyBotAchievementProps> = ({
  achievement,
  isNew = false
}) => {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'dimension_complete':
        return Trophy;
      case 'streak':
        return Star;
      case 'explorer':
        return Target;
      default:
        return Gift;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'dimension_complete':
        return 'from-yellow-400 to-orange-500';
      case 'streak':
        return 'from-purple-400 to-pink-500';
      case 'explorer':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-green-400 to-emerald-500';
    }
  };

  const IconComponent = getAchievementIcon(achievement.achievement_type);
  const colorClass = getAchievementColor(achievement.achievement_type);

  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : { opacity: 0, y: 20 }}
      animate={isNew ? { scale: 1, rotate: 0 } : { opacity: 1, y: 0 }}
      transition={{ 
        duration: isNew ? 0.8 : 0.3,
        type: isNew ? "spring" : "tween",
        bounce: 0.6
      }}
    >
      <Card className={`border-2 ${isNew ? 'border-yellow-300 shadow-xl' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Achievement Icon */}
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-lg`}>
              <IconComponent className="h-6 w-6" />
            </div>
            
            {/* Achievement Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">
                  {achievement.achievement_name}
                </h4>
                {isNew && (
                  <Badge className="bg-yellow-500 text-white animate-pulse">
                    Novo!
                  </Badge>
                )}
              </div>
              
              {achievement.achievement_description && (
                <p className="text-sm text-gray-600 mb-2">
                  {achievement.achievement_description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {achievement.dimension && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.dimension}
                  </Badge>
                )}
                <span>
                  {new Date(achievement.earned_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JourneyBotAchievement;
