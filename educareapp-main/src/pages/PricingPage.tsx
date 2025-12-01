
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const PricingPage: React.FC = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Planos e Preços | Educare+</title>
        <meta name="description" content="Conheça os planos e preços do Educare+ e escolha o que melhor se adapta às suas necessidades." />
      </Helmet>
      <Navbar />
      <motion.main 
        className="pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PricingSection />
      </motion.main>
      <Footer />
    </React.Fragment>
  );
};

export default PricingPage;
