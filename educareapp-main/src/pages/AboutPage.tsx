
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Sobre Nós | Educare+</title>
        <meta name="description" content="Conheça mais sobre o Educare+ e nossa missão de tornar a educação mais inclusiva e acessível para todos." />
      </Helmet>
      <Navbar />
      <motion.main 
        className="pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AboutSection />
      </motion.main>
      <Footer />
    </React.Fragment>
  );
};

export default AboutPage;
