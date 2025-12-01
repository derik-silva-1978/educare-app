
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import JourneyBotSessionManager from '@/components/educare-app/journey-bot/JourneyBotSessionManager';
import DashboardLoadingState from '@/components/educare-app/dashboard/DashboardLoadingState';
import DashboardErrorBoundary from '@/components/educare-app/dashboard/DashboardErrorBoundary';

const JornadaQuizPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { user } = useAuth();

  // Fetch child data from database
  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', childId],
    queryFn: async () => {
      if (!childId || !user?.id) return null;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error fetching child:', error);
        throw error;
      }
    },
    enabled: !!childId && !!user?.id,
  });

  const handleBack = () => {
    window.history.back();
  };

  if (!user || !childId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Por favor, faça login para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <DashboardLoadingState message="Carregando informações da criança..." />
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Criança não encontrada</h2>
          <p className="text-gray-600">Não foi possível encontrar os dados da criança.</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Calculate age in years from birthdate
  const birthDate = new Date(child.birthdate);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
    ? ageInYears - 1 
    : ageInYears;

  const childData = {
    id: child.id,
    name: `${child.first_name} ${child.last_name}`,
    age: adjustedAge
  };

  return (
    <>
      <Helmet>
        <title>Jornada Bot - Quiz de Desenvolvimento</title>
        <meta name="description" content="Quiz interativo para avaliar o desenvolvimento da criança" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <DashboardErrorBoundary>
          <JourneyBotSessionManager
            child={childData}
            onBack={handleBack}
          />
        </DashboardErrorBoundary>
      </div>
    </>
  );
};

export default JornadaQuizPage;
