
import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getDetailedAgeDisplay } from '@/utils/educare-app/calculateAge';
import { useDashboardMetrics } from '@/hooks/educare-app/useDashboardMetrics';
import { SelectedChildProvider } from '@/contexts/SelectedChildContext';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DashboardLoadingState from './DashboardLoadingState';
import EnhancedDashboardHeader from './EnhancedDashboardHeader';
import PlatformQuickAccess from './PlatformQuickAccess';
import EnhancedMetricsCards from './EnhancedMetricsCards';
import EnhancedEmptyState from './EnhancedEmptyState';
import SocialMediaAccess from './SocialMediaAccess';
import DevelopmentMilestonesTracker from './DevelopmentMilestonesTracker';
import ChildSelector from './ChildSelector';

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Tratar 'user' como 'parent' para compatibilidade
  const isParent = user?.role === 'parent' || (user?.role as string) === 'user';
  const isProfessional = user?.role === 'professional';

  // Use the new dashboard metrics hook
  const { metrics, rawData, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return <DashboardLoadingState message="Carregando seu dashboard..." />;
  }

  if (error) {
    console.error('Dashboard error:', error);
  }

  // Extract data for display
  const children = rawData?.children || [];
  const professionalData = rawData?.professionalRelations || [];
  const totalChildren = metrics.totalChildren;


  return (
    <SelectedChildProvider>
      <DashboardErrorBoundary>
        <div className="space-y-8">
          {/* Enhanced Header with Landing Page Link */}
          <EnhancedDashboardHeader />

          {/* Social Media Access */}
          <SocialMediaAccess />

          {/* Child Selector - Always visible for parents with children */}
          {isParent && totalChildren > 0 && (
            <ChildSelector children={children as any} />
          )}

          {/* Enhanced Key Metrics - Always individual for parents */}
          <EnhancedMetricsCards 
            metrics={metrics}
            userRole={isParent ? 'parent' : (user?.role || 'parent')}
            individualMode={isParent}
          />

        {/* Development Milestones Tracker */}
        {isParent && <DevelopmentMilestonesTracker />}

        {/* Children/Patients Overview */}
        {totalChildren > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isParent ? 'Suas Crianças' : 'Seus Pacientes'}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(isParent ? '/educare-app/children' : '/educare-app/professional/dashboard')}
                >
                  Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isParent ? children : children).slice(0, 3).map((child: any) => {
                  // Get updated progress from metrics if available
                  const childWithProgress = isParent && metrics.childrenWithProgress 
                    ? metrics.childrenWithProgress.find(c => c.id === child.id) || child
                    : child;
                  
                  return (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{child.firstName || child.first_name} {child.lastName || child.last_name}</h4>
                        <p className="text-sm text-gray-600">
                          {child.birthDate || child.birthdate ? getDetailedAgeDisplay(child.birthDate || child.birthdate) : 'Idade não informada'}
                        </p>
                        {isParent && childWithProgress.sessionCount > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {childWithProgress.sessionCount} sessões • {childWithProgress.reportCount} relatórios
                          </div>
                        )}
                      </div>
                      {isParent && (
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Progresso: {childWithProgress.calculatedProgress || childWithProgress.journey_progress || 0}%
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${childWithProgress.calculatedProgress || childWithProgress.journey_progress || 0}%` }}
                            />
                          </div>
                          {childWithProgress.hasActiveSession && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Sessão ativa
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}


        {/* Platform Quick Access */}
        <PlatformQuickAccess />

          {/* Enhanced Empty State for New Users */}
          {totalChildren === 0 && <EnhancedEmptyState />}
        </div>
      </DashboardErrorBoundary>
    </SelectedChildProvider>
  );
};

export default UnifiedDashboard;
