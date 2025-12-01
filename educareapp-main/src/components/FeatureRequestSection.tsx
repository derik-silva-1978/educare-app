
import React from 'react';
import { ArrowRight, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureRequestSection = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 inline-block mb-4">
            Smart PEI Community
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ajude a Melhorar o Smart PEI</h2>
          <p className="text-lg text-muted-foreground">
            Sua experiência é valiosa! Compartilhe suas ideias para aprimorar o Smart PEI e vote nas sugestões que você gostaria de ver implementadas em próximas atualizações.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <ThumbsUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-3">Vote nas Melhorias</h3>
            <p className="text-muted-foreground mb-4">
              Dê seu apoio às funcionalidades que você gostaria de ver implementadas no Smart PEI para torná-lo ainda mais eficiente.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-3">Sugira Novas Funcionalidades</h3>
            <p className="text-muted-foreground mb-4">
              Compartilhe suas ideias para tornar o Smart PEI ainda mais útil e eficiente para professores e equipes pedagógicas.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-3">Acompanhe o Desenvolvimento</h3>
            <p className="text-muted-foreground mb-4">
              Veja quais sugestões da comunidade estão sendo analisadas, planejadas ou já em desenvolvimento para próximas versões.
            </p>
          </motion.div>
        </div>
        
        <div className="text-center">
          <Button 
            asChild
            size="lg" 
            className="rounded-full px-8 py-6 bg-gradient-to-r from-educare-600 to-educare-700 hover:from-educare-700 hover:to-educare-800 shadow-md"
          >
            <Link to="/smart-pei/feature-requests">
              Ver Solicitações para o Smart PEI
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureRequestSection;
