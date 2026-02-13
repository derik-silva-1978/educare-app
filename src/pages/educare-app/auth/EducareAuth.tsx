import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { motion } from 'framer-motion';
import EducareLoginForm from '@/components/educare-app/auth/EducareLoginForm';
import EducareRegisterForm from '@/components/educare-app/auth/EducareRegisterForm';
import AuthSlideshow from '@/components/educare-app/auth/AuthSlideshow';
import { Separator } from '@/components/ui/separator';
import GoogleLoginButton from '@/components/educare-app/auth/GoogleLoginButton';
import { usePolicies } from '@/hooks/usePolicies';
import PolicyModal from '@/components/PolicyModal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID);

const EducareAuth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isInitialized } = useAuth();
  const { isOpen, currentPolicy, openPolicy, closeModal } = usePolicies();
  
  const queryParams = new URLSearchParams(location.search);
  const actionParam = queryParams.get('action');
  let redirectParam = queryParams.get('redirect');
  
  if (redirectParam) {
    try {
      const decoded = decodeURIComponent(redirectParam);
      
      if (decoded.includes('educare-app/auth') || 
          decoded.length > 100 || 
          !decoded.startsWith('/educare-app/') ||
          decoded.includes('%')) {
        console.warn('Invalid redirect parameter detected, clearing:', decoded);
        redirectParam = null;
        
        const cleanUrl = `/educare-app/auth${actionParam ? `?action=${actionParam}` : ''}`;
        window.history.replaceState({}, '', cleanUrl);
      } else {
        redirectParam = decoded;
      }
    } catch (error) {
      console.error('Failed to decode redirect URL:', error);
      redirectParam = null;
    }
  }
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    actionParam === 'register' ? 'register' : 'login'
  );

  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      const finalRedirect = redirectParam && redirectParam !== '/educare-app/auth' 
        ? redirectParam 
        : '/educare-app/dashboard';
      
      console.log('User already authenticated, redirecting to:', finalRedirect);
      navigate(finalRedirect, { replace: true });
    }
  }, [user, isLoading, isInitialized, navigate, redirectParam]);

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    
    const newUrl = `/educare-app/auth?action=${tab}`;
    navigate(newUrl, { replace: true });
  };

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Cadastro'} | Educare</title>
        <meta 
          name="description" 
          content={`${activeTab === 'login' ? 'Faça login' : 'Cadastre-se'} no Educare - Plataforma para acompanhamento do desenvolvimento infantil`} 
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
                {activeTab === 'login' 
                  ? 'Bem-vindo de volta! Entre para continuar.' 
                  : 'Crie sua conta e comece a jornada.'}
              </p>
            </div>

            {isGoogleConfigured && (
              <div className="space-y-4">
                <GoogleLoginButton redirectPath={redirectParam} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      ou continue com email
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-center mb-4">
                  {activeTab === 'login' ? 'Entrar' : 'Criar Conta'}
                </h2>
                {activeTab === 'login' ? (
                  <EducareLoginForm redirectPath={redirectParam} />
                ) : (
                  <EducareRegisterForm redirectPath={redirectParam} />
                )}
              </CardContent>
            </Card>

            <div className="text-center text-sm">
              {activeTab === 'login' ? (
                <p className="text-muted-foreground">
                  Novo aqui?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('register')}
                    className="font-medium text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Já tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="font-medium text-primary hover:underline"
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              <p>
                Ao utilizar o Educare, você concorda com nossos{' '}
                <button onClick={() => openPolicy('terms')} className="font-medium text-primary hover:underline">
                  Termos de Uso
                </button>
                ,{' '}
                <button onClick={() => openPolicy('privacy')} className="font-medium text-primary hover:underline">
                  Política de Privacidade
                </button>{' '}
                e{' '}
                <button onClick={() => openPolicy('lgpd')} className="font-medium text-primary hover:underline">
                  Conformidade LGPD
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <PolicyModal isOpen={isOpen} onClose={closeModal} policy={currentPolicy} />
    </>
  );
};

export default EducareAuth;
