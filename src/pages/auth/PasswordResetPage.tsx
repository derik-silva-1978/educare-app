
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PasswordResetForm from '@/components/smart-pei/auth/PasswordResetForm';
import { motion } from 'framer-motion';

const PasswordResetPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Redefinir Senha | Smart PEI</title>
        <meta 
          name="description" 
          content="Redefina sua senha para acessar o Smart PEI - Sistema de Planos de Ensino Individualizados" 
        />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart PEI</h1>
            <p className="text-gray-600">Plataforma Inteligente para Planos de Ensino Individualizados</p>
          </div>
          
          <PasswordResetForm />
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Ao utilizar o Smart PEI, você concorda com nossos{' '}
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Política de Privacidade
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default PasswordResetPage;
