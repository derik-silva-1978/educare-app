import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Loader2 } from 'lucide-react';

interface ProfessionalOnlyGuardProps {
  children: React.ReactNode;
}

/**
 * Guard que garante que apenas usuários com role 'professional' 
 * tenham acesso ao conteúdo protegido
 */
const ProfessionalOnlyGuard: React.FC<ProfessionalOnlyGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Verificando permissões...</span>
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/educare-app/auth" replace />;
  }
  
  // Se não for profissional, redireciona para dashboard apropriado
  if (user.role !== 'professional') {
    // Redireciona para dashboard baseado no role
    if (user.role === 'owner') {
      return <Navigate to="/educare-app/owner/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/educare-app/admin/dashboard" replace />;
    } else {
      return <Navigate to="/educare-app/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProfessionalOnlyGuard;
