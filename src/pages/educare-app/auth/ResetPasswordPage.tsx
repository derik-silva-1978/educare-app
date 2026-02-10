import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ResetPasswordForm from '@/components/educare-app/auth/ResetPasswordForm';
import AuthSlideshow from '@/components/educare-app/auth/AuthSlideshow';

const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Redefinir Senha | Educare</title>
        <meta 
          name="description" 
          content="Redefina sua senha do Educare - Plataforma para acompanhamento do desenvolvimento infantil" 
        />
      </Helmet>
      
      <main className="min-h-screen bg-background flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative order-first lg:order-first">
          <AuthSlideshow />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background min-h-[60vh] lg:min-h-screen">
          <motion.div 
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">E+</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Educare</h1>
              </div>
              <p className="text-muted-foreground">
                Crie uma nova senha para sua conta.
              </p>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <ResetPasswordForm />
              </CardContent>
            </Card>
            
            <div className="text-center text-xs text-muted-foreground">
              <p>
                Precisa de ajuda? Entre em contato com nosso{' '}
                <a href="/educare-app/support" className="font-medium text-primary hover:text-primary/80 hover:underline">
                  Suporte
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default ResetPasswordPage;
