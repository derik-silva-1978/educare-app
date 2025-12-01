
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EducareLoginForm from '@/components/educare-app/auth/EducareLoginForm';
import EducareRegisterForm from '@/components/educare-app/auth/EducareRegisterForm';

const EducareAuth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isInitialized } = useAuth();
  
  // Parse action from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const actionParam = queryParams.get('action');
  let redirectParam = queryParams.get('redirect');
  
  // Clean redirect parameter with strict validation
  if (redirectParam) {
    try {
      const decoded = decodeURIComponent(redirectParam);
      
      // Validate redirect URL
      if (decoded.includes('educare-app/auth') || 
          decoded.length > 100 || 
          !decoded.startsWith('/educare-app/') ||
          decoded.includes('%')) {
        console.warn('Invalid redirect parameter detected, clearing:', decoded);
        redirectParam = null;
        
        // Clean the URL immediately
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
  
  // Set the active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    actionParam === 'register' ? 'register' : 'login'
  );

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      const finalRedirect = redirectParam && redirectParam !== '/educare-app/auth' 
        ? redirectParam 
        : '/educare-app/dashboard';
      
      console.log('User already authenticated, redirecting to:', finalRedirect);
      navigate(finalRedirect, { replace: true });
    }
  }, [user, isLoading, isInitialized, navigate, redirectParam]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'login' | 'register');
    
    const newUrl = `/educare-app/auth?action=${tab}`;
    navigate(newUrl, { replace: true });
  };

  // Show loading while checking auth state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (redirect is in progress)
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
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Educare</h1>
            <p className="text-gray-600">Acompanhamento inteligente do desenvolvimento infantil</p>
          </div>
          
          <Card className="overflow-hidden shadow-lg">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full rounded-none grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <CardContent className="p-6">
                <TabsContent value="login">
                  <EducareLoginForm redirectPath={redirectParam} />
                </TabsContent>
                
                <TabsContent value="register">
                  <EducareRegisterForm redirectPath={redirectParam} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Ao utilizar o Educare, você concorda com nossos{' '}
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

export default EducareAuth;
