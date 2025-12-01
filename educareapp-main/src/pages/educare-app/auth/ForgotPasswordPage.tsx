import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '@/components/educare-app/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Recuperação de Senha | Educare</title>
        <meta 
          name="description" 
          content="Recupere sua senha do Educare - Plataforma para acompanhamento do desenvolvimento infantil" 
        />
      </Helmet>
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Educare</h1>
            <p className="text-gray-600">Recuperação de Senha</p>
          </div>
          
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <ForgotPasswordForm />
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Precisa de ajuda? Entre em contato com nosso{' '}
              <a href="/educare-app/support" className="font-medium text-primary hover:text-primary/80">
                Suporte
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
