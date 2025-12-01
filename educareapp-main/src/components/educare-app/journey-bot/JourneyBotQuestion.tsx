
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { JourneyBotQuestion as Question, DimensionLabels, castToDimension } from '@/types/journey-bot';
import { AnimatedBotAvatar } from './AnimatedBotAvatar';
import { AnimatedDimensionIcon } from './AnimatedDimensionIcon';
import { AnimatedAnswerButtons } from './AnimatedAnswerButtons';
import { motion } from 'framer-motion';

interface JourneyBotQuestionProps {
  question: Question;
  onAnswer: (answer: 1 | 2 | 3) => void;
  questionNumber: number;
  totalQuestions: number;
  isAnswered?: boolean;
  disabled?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const JourneyBotQuestion: React.FC<JourneyBotQuestionProps> = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  isAnswered = false,
  disabled = false
}) => {
  // Cast dimension to proper type
  const typedDimension = castToDimension(question.dimension);
  
  const dimensionInfo = {
    name: DimensionLabels[typedDimension],
  };

  // Show age range info
  const getAgeRangeText = () => {
    if (question.age_min_weeks && question.age_max_weeks) {
      if (question.age_min_weeks === question.age_max_weeks) {
        return `Semana ${question.age_min_weeks}`;
      }
      return `Semanas ${question.age_min_weeks}-${question.age_max_weeks}`;
    }
    
    if (question.age_min_months === question.age_max_months) {
      return `${question.age_min_months} ${question.age_min_months === 1 ? 'mês' : 'meses'}`;
    }
    return `${question.age_min_months}-${question.age_max_months} meses`;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Bot Avatar e Introdução */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AnimatedBotAvatar mood="happy" size="md" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-semibold text-blue-800">TitiBOT</span>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    <AnimatedDimensionIcon dimension={typedDimension} size="sm" />
                    <span className="ml-1">{dimensionInfo.name}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getAgeRangeText()}
                  </Badge>
                  <span className="text-sm text-gray-500 ml-auto">
                    {questionNumber}/{totalQuestions}
                  </span>
                </div>
                
                <motion.div 
                  className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-gray-800 leading-relaxed">
                    Vamos falar sobre <strong>{dimensionInfo.name.toLowerCase()}</strong>! 
                    Esta pergunta me ajuda a entender melhor o desenvolvimento nesta área.
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pergunta Principal */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-200/30 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatedDimensionIcon 
                  dimension={typedDimension} 
                  size="xl" 
                  isActive={!disabled}
                />
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold mb-6 text-gray-800 max-w-2xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                {question.question_text}
              </motion.h3>
              
              {/* Concern Level Indicator */}
              {question.concern_level && question.concern_level > 1 && (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                    ⭐ Marco importante
                  </Badge>
                </motion.div>
              )}
              
              {/* Opções de Resposta */}
              <motion.div variants={itemVariants}>
                {disabled ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-medium">Processando sua resposta...</span>
                  </div>
                ) : (
                  <AnimatedAnswerButtons onAnswer={onAnswer} disabled={disabled} />
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dica sobre a pergunta */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <motion.div 
              className="flex items-start gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💡
              </motion.div>
              <div className="flex-1">
                <p className="text-blue-800 text-sm">
                  <strong>Dica:</strong> Não existe resposta certa ou errada! 
                  Cada criança se desenvolve no seu próprio ritmo. 
                  Suas respostas me ajudam a dar orientações personalizadas.
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default JourneyBotQuestion;
