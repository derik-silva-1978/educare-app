
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LightbulbIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeatureCards: React.FC = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <LightbulbIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
          <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Eficiência</h3>
          <p className="text-xs text-muted-foreground">
            Reduza o tempo de criação de PEI em até 40% com nossos modelos e assistência de IA.
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Colaboração</h3>
          <p className="text-xs text-muted-foreground">
            Conecte toda a equipe pedagógica em um ambiente colaborativo para melhores resultados.
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
          </div>
          <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Análise de Dados</h3>
          <p className="text-xs text-muted-foreground">
            Visualize o progresso do aluno com gráficos e relatórios detalhados em tempo real.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCards;
