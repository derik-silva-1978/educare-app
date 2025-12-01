import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyBotProgressManagerProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  childName: string;
  sessionStarted: string;
  dimension?: string;
}

const JourneyBotProgressManager: React.FC<JourneyBotProgressManagerProps> = ({
  currentQuestionIndex,
  totalQuestions,
  childName,
  sessionStarted,
  dimension
}) => {
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const questionsRemaining = totalQuestions - (currentQuestionIndex + 1);
  const estimatedTimeRemaining = questionsRemaining * 1.5; // 1.5 minutes per question estimate

  const getSessionDuration = () => {
    const start = new Date(sessionStarted);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Progress Card */}
      <Card className="border-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Navegação de {childName}
                </h3>
                <p className="text-sm text-gray-600">
                  Pergunta {currentQuestionIndex + 1} de {totalQuestions}
                </p>
              </div>
              
              {dimension && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dimension}
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-blue-100" 
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Concluídas</span>
                </div>
                <p className="text-lg font-bold text-green-700">
                  {currentQuestionIndex}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Restantes</span>
                </div>
                <p className="text-lg font-bold text-blue-700">
                  {questionsRemaining}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Tempo</span>
                </div>
                <p className="text-lg font-bold text-purple-700">
                  {getSessionDuration()}min
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encouragement Message */}
      {progress > 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-green-800 font-medium">
                  🎉 Ótimo progresso! Você está a mais da metade!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Continue assim, {childName} está aprendendo muito!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JourneyBotProgressManager;
