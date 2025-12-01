
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import UnifiedDashboard from '@/components/educare-app/dashboard/UnifiedDashboard';
import DashboardErrorBoundary from '@/components/educare-app/dashboard/DashboardErrorBoundary';

const EducareAppDashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Educare</title>
        <meta name="description" content="Dashboard do seu perfil no Educare" />
      </Helmet>
      
      <DashboardErrorBoundary>
        <div className="max-w-screen-2xl mx-auto p-6">
          <UnifiedDashboard />
        </div>
      </DashboardErrorBoundary>
    </>
  );
};

export default EducareAppDashboard;
