import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Loader2 } from 'lucide-react';

interface ProfessionalOnlyGuardProps {
  children: React.ReactNode;
}

/**
 * Guard que garante que apenas usuários com role 'professional' 
 * tenham acesso ao conteúdo protegido. Owner e admin também têm acesso total.
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
  
  // Owner e admin têm acesso total a todas as rotas professional
  const hasAccess = user.role === 'professional' || user.role === 'admin' || user.role === 'owner';
  
  if (!hasAccess) {
    // Redireciona para dashboard apropriado para outros roles
    return <Navigate to="/educare-app/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProfessionalOnlyGuard;
