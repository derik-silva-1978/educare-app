
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { JourneyBotQuestion, DimensionLabels, castToDimension } from '@/types/journey-bot';
import { AnimatedBotAvatar } from './AnimatedBotAvatar';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface JourneyBotFeedbackProps {
  question: JourneyBotQuestion;
  answer: 1 | 2 | 3;
  onContinue: () => void;
}

const JourneyBotFeedback: React.FC<JourneyBotFeedbackProps> = ({
  question,
  answer,
  onContinue
}) => {
  // Cast dimension to proper type
  const typedDimension = castToDimension(question.dimension);

  const getFeedbackText = () => {
    switch (answer) {
      case 1:
        return question.feedback_yes;
      case 2:
        return question.feedback_no;
      case 3:
        return question.feedback_unknown;
      default:
        return '';
    }
  };

  const getTips = () => {
    switch (answer) {
      case 1:
        return question.tips_yes || [];
      case 2:
        return question.tips_no || [];
      case 3:
        return question.tips_unknown || [];
      default:
        return [];
    }
  };

  const getAnswerIcon = () => {
    switch (answer) {
      case 1:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 2:
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 3:
        return <HelpCircle className="h-6 w-6 text-gray-500" />;
      default:
        return null;
    }
  };

  const getAnswerText = () => {
    switch (answer) {
      case 1:
        return 'Sim - Consegue fazer';
      case 2:
        return 'Não - Ainda não consegue';
      case 3:
        return 'Não sei - Preciso observar';
      default:
        return '';
    }
  };

  const getBotMood = () => {
    switch (answer) {
      case 1:
        return 'celebrating' as const;
      case 2:
        return 'thinking' as const;
      case 3:
        return 'happy' as const;
      default:
        return 'happy' as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bot Response */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AnimatedBotAvatar mood={getBotMood()} size="md" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-blue-800">TitiBOT</span>
                  <Badge variant="secondary" className="text-xs">
                    {DimensionLabels[typedDimension]}
                  </Badge>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200/30">
                  <div className="flex items-center gap-2 mb-3">
                    {getAnswerIcon()}
                    <span className="font-medium text-gray-700">
                      Sua resposta: {getAnswerText()}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed">
                    {getFeedbackText()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Section */}
      {getTips().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                💡 Dicas personalizadas
              </h3>
              
              <div className="space-y-3">
                {getTips().map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-green-200/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-green-800 text-sm leading-relaxed">
                      {tip}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar jornada
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default JourneyBotFeedback;
