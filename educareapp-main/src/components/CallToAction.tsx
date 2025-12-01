
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-educare-600 to-educare-800 text-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/10 to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-educare-500/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-educare-400/20 blur-3xl"></div>
      
      <motion.div 
        className="container mx-auto px-4 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Pronto para transformar a educação?
        </motion.h2>
        
        <motion.p 
          className="text-xl max-w-2xl mx-auto mb-10 text-white/90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Junte-se a milhares de educadores, pais e instituições que já estão usando o Educare+ para criar experiências educacionais significativas.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white text-educare-700 hover:bg-white/90 px-8 py-6"
          >
            <Link to="/auth/register">
              Comece Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="rounded-full border-white/40 text-white hover:bg-white/10 px-8 py-6"
          >
            <Link to="/contact">
              Fale com um Consultor
            </Link>
          </Button>
        </motion.div>
        
        <p className="mt-6 text-white/70 text-sm">
          Sem necessidade de cartão de crédito. 14 dias de teste grátis.
        </p>
      </motion.div>
    </section>
  );
};

export default CallToAction;
