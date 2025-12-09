
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white bg-opacity-20 shadow-xl shadow-educare-600/10 ring-1 ring-educare-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/2 right-[5%] w-32 h-32 md:w-48 md:h-48 opacity-30 animate-float-slow pointer-events-none">
        <img src="/images/astronaut-floating.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-[10%] left-[8%] w-20 h-20 md:w-32 md:h-32 opacity-25 animate-float-medium -rotate-12 pointer-events-none">
        <img src="/images/astronaut-logo.svg" alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="flex h-2 w-2 rounded-full bg-educare-500 mr-2"></span>
            Educação transformadora e acessível
          </motion.div>
          
          <div className="relative inline-block">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Acompanhe o Desenvolvimento <br className="hidden sm:block" />
            do Seu Filho com IA
          </motion.h1>
            <motion.div 
              className="absolute -top-12 -right-12 w-16 h-16 md:w-20 md:h-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <img src="/images/astronaut-logo.svg" alt="Educare+ Astronaut" className="w-full h-full object-contain animate-float" />
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xl md:text-2xl mt-6 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Plataforma completa com TitiNauta (assistente inteligente), comunicação WhatsApp com especialistas, 
            relatórios detalhados e Academia Educare+ para famílias e profissionais.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 bg-gradient-to-r from-educare-600 to-educare-700 hover:from-educare-700 hover:to-educare-800 shadow-lg transition-all group">
              <Link to="/pricing">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 border-educare-300 hover:bg-educare-50/50">
              <Link to="/educare-app">Experimentar TitiNauta</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="bg-gradient-to-r from-educare-50/70 to-educare-100/70 px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-educare-800 font-medium text-sm">+5.000 famílias</span>
            </div>
            <div className="bg-gradient-to-r from-educare-50/70 to-educare-100/70 px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-educare-800 font-medium text-sm">+300 profissionais</span>
            </div>
            <div className="bg-gradient-to-r from-educare-50/70 to-educare-100/70 px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-educare-800 font-medium text-sm">TitiNauta IA</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-educare-600 to-educare-400 aspect-video rounded-2xl overflow-hidden flex items-center justify-center relative">
            <div className="text-white text-center p-8 z-10">
              <h3 className="text-xl md:text-2xl font-medium mb-2">TitiNauta em Ação</h3>
              <p className="text-white/80">Veja como o TitiNauta acompanha o desenvolvimento infantil</p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="mt-6 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                  Assistir vídeo
                </Button>
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 w-24 h-24 opacity-70">
              <img src="/images/astronaut-logo.svg" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
