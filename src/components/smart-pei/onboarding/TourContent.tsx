
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkflowVisualization } from './WorkflowVisualization';
import { SmartPEIOnboarding } from './SmartPEIOnboarding';
import { useNavigate } from 'react-router-dom';
import FeatureCards from './FeatureCards';

interface TourContentProps {
  handleGetStarted: () => void;
}

export const TourContent: React.FC<TourContentProps> = ({ handleGetStarted }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6 overflow-hidden">
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Bem-vindo ao Smart PEI</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Sua plataforma completa para Planos de Ensino Individualizado com recursos de IA,
            colaboração em tempo real e acompanhamento detalhado. Descubra como transformar sua
            abordagem educacional com nossas ferramentas intuitivas.
          </p>
          
          <Button 
            className="mt-4 sm:mt-6"
            size="sm"
            onClick={() => setShowOnboarding(true)}
            aria-label="Iniciar tour guiado do Smart PEI"
          >
            <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
            <span className="text-xs sm:text-sm">Iniciar Tour Guiado</span>
          </Button>
        </motion.div>
        
        <motion.div 
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-center">Fluxo de Trabalho Smart PEI</h3>
          <WorkflowVisualization />
        </motion.div>
        
        <FeatureCards />
        
        <motion.div 
          className="mt-4 sm:mt-6 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            onClick={handleGetStarted}
            size="sm"
            className="relative overflow-hidden group"
            aria-label="Começar a usar o Smart PEI"
          >
            <span className="text-xs sm:text-sm">Começar a usar Smart PEI</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        </motion.div>
        
        <SmartPEIOnboarding 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
        />
      </CardContent>
    </Card>
  );
};

export default TourContent;
