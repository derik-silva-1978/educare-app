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
import EnhancedMetricsCards from './EnhancedMetricsCards';
import EnhancedEmptyState from './EnhancedEmptyState';
import ChildSelector from './ChildSelector';
import PlatformQuickAccess from './PlatformQuickAccess';
import SocialMediaAccess from './SocialMediaAccess';
import DomainProgressChart from './DomainProgressChart';
import StrengthsOpportunities from './StrengthsOpportunities';
import AIInsightsCard from './AIInsightsCard';
import ParentalResourcesCarousel from './ParentalResourcesCarousel';
import MilestonesTimeline from './MilestonesTimeline';

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isParent = user?.role === 'parent' || (user?.role as string) === 'user';
  const isProfessional = user?.role === 'professional';

  const { metrics, rawData, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return <DashboardLoadingState message="Carregando seu dashboard..." />;
  }

  if (error) {
    console.error('Dashboard error:', error);
  }

  const children = rawData?.children || [];
  const totalChildren = metrics.totalChildren;
  const selectedChild = totalChildren > 0 ? (children[0] as any) : null;

  const getChildAge = () => {
    if (!selectedChild) return undefined;
    const birthDate = selectedChild?.birthDate || selectedChild?.birthdate;
    if (!birthDate) return undefined;
    try {
      return getDetailedAgeDisplay(birthDate);
    } catch {
      return undefined;
    }
  };

  return (
    <SelectedChildProvider>
      <DashboardErrorBoundary>
        <div className="space-y-6">
          <EnhancedDashboardHeader />

          <SocialMediaAccess />

          {isParent && totalChildren > 0 && (
            <ChildSelector children={children as any} />
          )}

          <EnhancedMetricsCards 
            metrics={metrics}
            userRole={isParent ? 'parent' : (user?.role || 'parent')}
            individualMode={isParent}
          />

          {isParent && totalChildren > 0 && selectedChild && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <DomainProgressChart 
                  childName={selectedChild?.firstName || selectedChild?.first_name}
                />
                <StrengthsOpportunities />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <MilestonesTimeline childAge={getChildAge()} />
                </div>
                <div className="space-y-6">
                  <AIInsightsCard />
                  <ParentalResourcesCarousel />
                </div>
              </div>
            </>
          )}

          {isParent && totalChildren === 0 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <MilestonesTimeline />
              </div>
              <div className="space-y-6">
                <AIInsightsCard />
                <ParentalResourcesCarousel />
              </div>
            </div>
          )}

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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {children.slice(0, 3).map((child: any) => {
                    const childWithProgress = isParent && metrics.childrenWithProgress 
                      ? metrics.childrenWithProgress.find(c => c.id === child.id) || child
                      : child;
                    
                    return (
                      <div 
                        key={child.id} 
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/educare-app/child/${child.id}`)}
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{child.firstName || child.first_name} {child.lastName || child.last_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {child.birthDate || child.birthdate ? getDetailedAgeDisplay(child.birthDate || child.birthdate) : 'Idade não informada'}
                            </p>
                          </div>
                          {isParent && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-medium">{childWithProgress.calculatedProgress || childWithProgress.journey_progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${childWithProgress.calculatedProgress || childWithProgress.journey_progress || 0}%` }}
                                />
                              </div>
                              {childWithProgress.sessionCount > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {childWithProgress.sessionCount} sessões • {childWithProgress.reportCount} relatórios
                                </div>
                              )}
                              {childWithProgress.hasActiveSession && (
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  Sessão ativa
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <PlatformQuickAccess />

          {totalChildren === 0 && <EnhancedEmptyState />}
        </div>
      </DashboardErrorBoundary>
    </SelectedChildProvider>
  );
};

export default UnifiedDashboard;
