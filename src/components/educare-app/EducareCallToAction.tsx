
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const EducareCallToAction: React.FC = () => {
  const navigate = useNavigate();
  
  const benefits = [
    'Acompanhamento personalizado do desenvolvimento infantil',
    'Atividades educativas adequadas para cada fase',
    'Detecção precoce de possíveis atrasos',
    'Suporte de especialistas em desenvolvimento infantil'
  ];
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-pink-50/20 z-0"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-pink-200/20 blur-3xl"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Acompanhe o desenvolvimento
            <br className="hidden sm:block" /> do seu filho de forma inteligente
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Junte-se a milhares de famílias que estão usando o Educare para potencializar
            o desenvolvimento de seus filhos.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full"
              onClick={() => navigate('/educare-app/auth?action=register')}
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-6 rounded-full"
              onClick={() => navigate('/educare-app/demo')}
            >
              Ver Demonstração
            </Button>
          </motion.div>
          
          {/* Benefits list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start text-left"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducareCallToAction;
