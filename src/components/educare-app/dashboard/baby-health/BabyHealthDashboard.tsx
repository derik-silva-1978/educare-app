import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useBabyHealthSummary } from '@/hooks/educare-app/useBabyHealthSummary';
import DailySummaryCard from './DailySummaryCard';
import GrowthChart from './GrowthChart';
import SleepPatternChart from './SleepPatternChart';
import VaccineChecklist from './VaccineChecklist';

interface BabyHealthDashboardProps {
  childId?: string;
}

export const BabyHealthDashboard: React.FC<BabyHealthDashboardProps> = ({ childId }) => {
  const { data, isLoading, error } = useBabyHealthSummary(childId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados de saude...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive">Erro ao carregar dados de saude</p>
          <p className="text-sm text-muted-foreground mt-1">Tente novamente mais tarde</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DailySummaryCard data={data} />
      
      {data.hasChild && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <GrowthChart 
              biometrics={data.biometrics} 
              childName={data.child?.firstName} 
            />
            <SleepPatternChart 
              sleepLogs={data.sleepLogs} 
              avgSleepPerDay={data.summary?.avgSleepPerDay || null}
            />
          </div>
          
          <VaccineChecklist vaccines={data.vaccines} />
        </div>
      )}
    </div>
  );
};

export default BabyHealthDashboard;
