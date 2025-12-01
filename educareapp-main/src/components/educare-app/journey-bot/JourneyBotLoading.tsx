
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyBotLoadingProps {
  childName?: string;
  message?: string;
}

const JourneyBotLoading: React.FC<JourneyBotLoadingProps> = ({ childName, message }) => {
  const displayMessage = message || (childName 
    ? `Carregando perguntas personalizadas para ${childName}`
    : 'Preparando sua jornada de desenvolvimento');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Bot className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            TitiBOT está se preparando...
          </h3>
          
          <p className="text-blue-600 mb-4">
            {displayMessage}
          </p>
          
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JourneyBotLoading;
