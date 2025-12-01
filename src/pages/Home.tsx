
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToAction from '@/components/CallToAction';
import { ArrowUp } from 'lucide-react';
import { motion, useScroll, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();

  // Show scroll-to-top button when scrolled past a certain point
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      if (value > 0.2) {
        controls.start({ opacity: 1, y: 0 });
      } else {
        controls.start({ opacity: 0, y: 20 });
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, controls]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Educare+ | Soluções Educacionais Completas</title>
        <meta name="description" content="Educare+ oferece soluções educacionais completas para transformar a experiência de aprendizado de crianças e conectar famílias e escolas." />
      </Helmet>

      {/* Main Content */}
      <HeroSection />
      <Features />
      <TestimonialsSection />
      <CallToAction />

      {/* Scroll to top button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
        <Button 
          onClick={scrollToTop} 
          size="icon" 
          className="h-12 w-12 rounded-full bg-educare-600 hover:bg-educare-700 shadow-md"
        >
          <ArrowUp className="h-6 w-6" />
          <span className="sr-only">Voltar ao topo</span>
        </Button>
      </motion.div>
    </>
  );
};

export default Home;
