
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/loading';

interface SimpleRouteGuardProps {
  children: React.ReactNode;
  requireChildId?: boolean;
  allowProfessional?: boolean;
}

const SimpleRouteGuard: React.FC<SimpleRouteGuardProps> = ({
  children,
  requireChildId = false,
  allowProfessional = true
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/educare-app/auth" replace />;
  }

  return <>{children}</>;
};

export default SimpleRouteGuard;
