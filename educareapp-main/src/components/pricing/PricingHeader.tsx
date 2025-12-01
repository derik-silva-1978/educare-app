
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const PricingHeader: React.FC<PricingHeaderProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <motion.div 
      className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-educare-100 text-educare-800 inline-block mb-3 sm:mb-4">
        Planos e Preços
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
        Escolha o plano ideal para você
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
        Oferecemos opções flexíveis para atender às necessidades de profissionais independentes, 
        pais, educadores e instituições de ensino, com diferentes limites de alunos e recursos.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 sm:mt-8">
        <TabsList className="grid w-full max-w-xs sm:max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="plans">Planos Fixos</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora Empresarial</TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
};

export default PricingHeader;
