import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  Brain, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Acompanhe o Desenvolvimento',
    description: 'Monitore cada marco do desenvolvimento infantil com avaliações baseadas em evidências científicas e recomendações personalizadas.',
    icon: <Baby className="w-16 h-16" />,
    gradient: 'from-blue-500 to-cyan-400',
    accentColor: 'text-blue-100'
  },
  {
    id: 2,
    title: 'TitiNauta - Seu Assistente IA',
    description: 'Converse com nosso assistente inteligente que guia você através da jornada de desenvolvimento do seu filho, respondendo dúvidas em tempo real.',
    icon: <Brain className="w-16 h-16" />,
    gradient: 'from-purple-500 to-pink-500',
    accentColor: 'text-purple-100'
  },
  {
    id: 3,
    title: 'Saúde Integral',
    description: 'Registre vacinas, consultas médicas e acompanhe a saúde materna durante a gestação com ferramentas especializadas.',
    icon: <Heart className="w-16 h-16" />,
    gradient: 'from-rose-500 to-orange-400',
    accentColor: 'text-rose-100'
  },
  {
    id: 4,
    title: 'Conecte-se com Profissionais',
    description: 'Compartilhe dados com pediatras, psicólogos e educadores para um cuidado colaborativo e integrado.',
    icon: <MessageCircle className="w-16 h-16" />,
    gradient: 'from-emerald-500 to-teal-400',
    accentColor: 'text-emerald-100'
  },
  {
    id: 5,
    title: 'Relatórios e Insights',
    description: 'Visualize o progresso com gráficos interativos e receba orientações personalizadas baseadas nas avaliações realizadas.',
    icon: <TrendingUp className="w-16 h-16" />,
    gradient: 'from-indigo-500 to-blue-500',
    accentColor: 'text-indigo-100'
  }
];

const SLIDE_DURATION = 8000;

const AuthSlideshow: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 opacity-10"
            >
              <Sparkles className="w-32 h-32 text-white" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                x: [0, -10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-20 left-10 opacity-10"
            >
              <Sparkles className="w-24 h-24 text-white" />
            </motion.div>
          </div>

          <div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-white">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="p-4 sm:p-6 bg-white/20 backdrop-blur-sm rounded-3xl">
                {slide.icon}
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl sm:text-2xl lg:text-4xl font-bold text-center mb-4 max-w-lg px-4"
            >
              {slide.title}
            </motion.h2>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-sm sm:text-base lg:text-lg text-center max-w-md px-4 ${slide.accentColor}`}
            >
              {slide.description}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-2 mt-8"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-8 h-2 bg-white' 
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </motion.div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4"
              >
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-white/70"
              >
                {currentSlide + 1} / {slides.length}
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              key={`progress-${currentSlide}`}
              initial={{ width: '0%' }}
              animate={{ width: isPaused ? undefined : '100%' }}
              transition={{ 
                duration: SLIDE_DURATION / 1000, 
                ease: 'linear'
              }}
              className="h-full bg-white/60"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthSlideshow;
