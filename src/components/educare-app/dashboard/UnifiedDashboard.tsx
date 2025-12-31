import React from 'react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { getDetailedAgeDisplay } from '@/utils/educare-app/calculateAge';
import { useDashboardMetrics } from '@/hooks/educare-app/useDashboardMetrics';
import { useBabyHealthSummary } from '@/hooks/educare-app/useBabyHealthSummary';
import { SelectedChildProvider, useSelectedChild } from '@/contexts/SelectedChildContext';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DashboardLoadingState from './DashboardLoadingState';
import EnhancedDashboardHeader from './EnhancedDashboardHeader';
import ChildrenTopBar from './ChildrenTopBar';
import HealthMetricsCards from './HealthMetricsCards';
import HealthInsights from './HealthInsights';
import SocialMediaAccess from './SocialMediaAccess';
import DomainProgressChart from './DomainProgressChart';
import ParentalResourcesCarousel from './ParentalResourcesCarousel';
import MilestonesTimeline from './MilestonesTimeline';
import { BabyHealthDashboard } from './baby-health';

const UnifiedDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedChildId } = useSelectedChild();
  const role = user?.role as string;
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  const isParent = role === 'parent' || role === 'user';
  const hasFullAccess = isOwner || isAdmin;

  const { metrics, rawData, isLoading, error } = useDashboardMetrics();
  const { data: healthData, isLoading: healthLoading } = useBabyHealthSummary(selectedChildId);

  if (isLoading) {
    return <DashboardLoadingState message="Carregando seu dashboard..." />;
  }

  if (error) {
    console.error('Dashboard error:', error);
  }

  const children = rawData?.children || [];
  const totalChildren = metrics.totalChildren;
  const selectedChild = children.find((c: any) => c.id === selectedChildId) || (totalChildren > 0 ? children[0] : null);

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

  const getChildAgeMonths = (): number | undefined => {
    if (!selectedChild) return undefined;
    const birthDate = selectedChild?.birthDate || selectedChild?.birthdate;
    if (!birthDate) return undefined;
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                     (today.getMonth() - birth.getMonth());
      return Math.max(0, months);
    } catch {
      return undefined;
    }
  };

  const transformHealthDataForCards = () => {
    if (!healthData) return undefined;
    
    return {
      child: healthData.child ? {
        ageInWeeks: healthData.child.ageInWeeks,
        ageInMonths: healthData.child.ageInMonths,
        ageDisplay: healthData.child.ageDisplay
      } : undefined,
      biometrics: healthData.biometrics?.map(b => ({
        weight: b.weight?.toString(),
        height: b.height?.toString(),
        recordedAt: b.recordedAt
      })),
      sleepLogs: healthData.sleepLogs?.map(s => ({
        durationMinutes: s.durationMinutes || undefined,
        quality: s.quality
      })),
      vaccines: [
        ...(healthData.vaccines?.taken || []).map(v => ({
          status: 'taken' as const,
          vaccineName: v.vaccine,
          scheduledAt: v.takenAt
        })),
        ...(healthData.vaccines?.pending || []).map(v => ({
          status: 'pending' as const,
          vaccineName: v.vaccine,
          scheduledAt: undefined
        }))
      ],
      appointments: healthData.appointments?.map(a => ({
        appointmentDate: a.appointmentDate,
        doctorName: a.doctorName,
        specialty: a.specialty,
        status: a.status
      }))
    };
  };

  const healthCardsData = transformHealthDataForCards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <EnhancedDashboardHeader childAgeMonths={getChildAgeMonths()} />
        <SocialMediaAccess />
      </div>

      {(hasFullAccess || isParent) && totalChildren > 0 && (
        <ChildrenTopBar 
          childList={children} 
        />
      )}

      {(hasFullAccess || (isParent && totalChildren > 0)) && (
        <HealthMetricsCards 
          healthData={healthCardsData}
          isLoading={healthLoading}
        />
      )}

      {(hasFullAccess || (isParent && totalChildren > 0)) && (
        <BabyHealthDashboard childId={selectedChild?.id} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DomainProgressChart 
          childName={selectedChild?.firstName || selectedChild?.first_name}
        />
        <HealthInsights healthData={healthCardsData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MilestonesTimeline childAge={getChildAge()} />
        </div>
        <div className="space-y-6">
          <ParentalResourcesCarousel />
        </div>
      </div>
    </div>
  );
};

const UnifiedDashboard: React.FC = () => {
  return (
    <SelectedChildProvider>
      <DashboardErrorBoundary>
        <UnifiedDashboardContent />
      </DashboardErrorBoundary>
    </SelectedChildProvider>
  );
};

export default UnifiedDashboard;
