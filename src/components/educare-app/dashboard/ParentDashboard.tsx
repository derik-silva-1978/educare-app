
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { getDetailedAgeDisplay } from '@/utils/educare-app/calculateAge';
import DashboardSummary from './DashboardSummary';
import KPICards from './KPICards';
import JourneySummary from './JourneySummary';
import JourneyBotCard from './JourneyBotCard';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DashboardLoadingState from './DashboardLoadingState';
import ProfessionalsList from './ProfessionalsList';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch children data with proper error handling
  const { data: children = [], isLoading, error } = useQuery({
    queryKey: ['user-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('educare_children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <DashboardLoadingState message="Carregando informações das crianças..." />;
  }

  if (error) {
    console.error('Error in ParentDashboard:', error);
  }

  // Calculate KPI metrics based on children data
  const kpiMetrics = {
    inProgress: children.filter(child => child.journey_progress && child.journey_progress > 0 && child.journey_progress < 100).length,
    completed: children.filter(child => child.journey_progress === 100).length,
    pending: children.filter(child => !child.journey_progress || child.journey_progress === 0).length,
  };

  // Get the first child for journey summary (or null if no children)
  const firstChild = children.length > 0 ? children[0] : null;

  return (
    <DashboardErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Educare! 👋
          </h1>
          <p className="text-gray-600">
            Acompanhe o desenvolvimento das suas crianças de forma inteligente
          </p>
        </div>

        {/* KPI Cards */}
        <DashboardErrorBoundary>
          <KPICards 
            inProgress={kpiMetrics.inProgress}
            completed={kpiMetrics.completed}
            pending={kpiMetrics.pending}
          />
        </DashboardErrorBoundary>

        {/* Enhanced Children Overview */}
        {children.length > 0 && (
          <DashboardErrorBoundary>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Suas Crianças</h3>
              <div className="grid gap-4">
                {children.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{child.first_name} {child.last_name}</h4>
                      <p className="text-sm text-gray-600">
                        {child.birthdate ? getDetailedAgeDisplay(child.birthdate) : 'Idade não informada'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Progresso: {child.journey_progress || 0}%
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${child.journey_progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardErrorBoundary>
        )}

        {/* Journey Bot Card */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardErrorBoundary>
              <DashboardSummary userRole="parent" />
            </DashboardErrorBoundary>
          </div>
          <div>
            <DashboardErrorBoundary>
              <JourneyBotCard 
                hasChildren={children.length > 0}
                childrenCount={children.length}
              />
            </DashboardErrorBoundary>
          </div>
        </div>

        {/* Professionals List */}
        <DashboardErrorBoundary>
          <ProfessionalsList className="" />
        </DashboardErrorBoundary>

        {/* Journey Summary */}
        {children.length > 0 && (
          <DashboardErrorBoundary>
            <JourneySummary 
              childId={firstChild?.id || null}
              journeyProgress={firstChild?.journey_progress || null}
            />
          </DashboardErrorBoundary>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};

export default ParentDashboard;
