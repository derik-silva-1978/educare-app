
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToEducare = () => {
    navigate('/educare-app/auth');
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Este componente foi desativado durante a migração para o novo aplicativo Educare.</p>
        <Button className="mt-4" onClick={handleNavigateToEducare}>
          Ir para o Educare Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
