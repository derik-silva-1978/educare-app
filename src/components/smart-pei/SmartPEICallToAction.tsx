
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SmartPEICallToAction: React.FC = () => {
  const benefits = [
    "Crie PEIs com maior eficiência e precisão",
    "Acompanhe o progresso dos alunos em tempo real",
    "Colabore com toda a equipe pedagógica",
    "Gere relatórios personalizados com um clique"
  ];

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-r from-educare-900/90 to-educare-700/90">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/pattern-bg.png')] bg-repeat"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Transforme a experiência educacional com o Smart PEI
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Junte-se a milhares de educadores e instituições que já estão utilizando o Smart PEI para criar Planos de Ensino Individualizado mais eficientes e impactantes.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 sm:mb-10">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-start text-left"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white/90 mr-2 flex-shrink-0 mt-1" />
                <p className="text-sm sm:text-base text-white/90">{benefit}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button asChild size="sm" className="rounded-full px-4 sm:px-8 py-2 sm:py-6 bg-white text-educare-800 hover:bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl font-bold text-sm sm:text-base">
              <Link to="/auth?action=register">
                Comece gratuitamente
                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full px-4 sm:px-8 py-2 sm:py-6 border-white text-white bg-transparent hover:bg-white/20 transition-all duration-300 shadow-lg text-sm sm:text-base">
              <Link to="/auth?action=demo">Agendar demonstração</Link>
            </Button>
          </div>
          
          <p className="text-white mt-4 sm:mt-6 text-xs sm:text-sm font-medium">
            Experimente gratuitamente por 07 dias. Sem compromisso.
          </p>
          
          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
            <motion.div 
              className="bg-educare-800/30 backdrop-blur-sm border border-white/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-white font-medium text-xs sm:text-sm">+5.000 PEIs criados mensalmente</span>
            </motion.div>
            <motion.div 
              className="bg-educare-800/30 backdrop-blur-sm border border-white/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-white font-medium text-xs sm:text-sm">+500 instituições parceiras</span>
            </motion.div>
            <motion.div 
              className="bg-educare-800/30 backdrop-blur-sm border border-white/10 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-white font-medium text-xs sm:text-sm">Suporte especializado</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SmartPEICallToAction;
