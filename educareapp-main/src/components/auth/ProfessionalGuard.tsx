
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Loader2 } from 'lucide-react';
import { useProfessionalChildren } from '@/hooks/useProfessionalChildren';

interface ProfessionalGuardProps {
  children: React.ReactNode;
}

const ProfessionalGuard: React.FC<ProfessionalGuardProps> = ({ children }) => {
  const { user, hasRole, isLoading } = useAuth();
  const { childId } = useParams<{ childId: string }>();
  const { hasAccess, isLoading: isCheckingAccess } = useProfessionalChildren(childId);
  
  if (isLoading || isCheckingAccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Verificando permissões...</span>
      </div>
    );
  }

  // If not a professional, proceed normally
  if (!hasRole('professional')) {
    return <>{children}</>;
  }
  
  // Professional must have access to this specific child
  if (!hasAccess && childId) {
    return <Navigate to="/educare-app/professional/dashboard" />;
  }

  return <>{children}</>;
};

export default ProfessionalGuard;
