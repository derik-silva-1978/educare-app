
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Educare auth page after a short delay
    const timer = setTimeout(() => {
      navigate('/educare-app/auth', { replace: true });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="auth-screen py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart PEI</h1>
          <p className="text-gray-600 mb-6">Plataforma Inteligente para Planos de Ensino Individualizados</p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <p className="text-amber-800">
              Este componente foi desativado durante a migração para o novo aplicativo Educare.
            </p>
            <p className="text-amber-700 mt-2">
              Você será redirecionado automaticamente para o Educare em alguns segundos...
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
