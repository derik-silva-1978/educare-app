
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyBotErrorStateProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

const JourneyBotErrorState: React.FC<JourneyBotErrorStateProps> = ({
  error,
  onRetry,
  onBack
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Ops! Algo deu errado
          </h3>
          
          <p className="text-red-600 mb-6 leading-relaxed">
            {error}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onRetry}
              className="gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={onBack}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JourneyBotErrorState;
