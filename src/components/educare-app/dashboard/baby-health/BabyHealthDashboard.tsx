import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Heart, BookOpen, Loader2 } from 'lucide-react';
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
        <Tabs defaultValue="baby" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="baby" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              <span className="hidden sm:inline">Meu Bebe</span>
              <span className="sm:hidden">Bebe</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Minha Jornada</span>
              <span className="sm:hidden">Jornada</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="baby" className="mt-6 space-y-6">
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
          </TabsContent>

          <TabsContent value="journey" className="mt-6">
            <MotherJourneySection />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const MotherJourneySection: React.FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-muted-foreground mb-2">
            Historico de Perguntas
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Suas ultimas perguntas ao TitiNauta aparecerao aqui para voce relembrar as orientacoes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-muted-foreground mb-2">
            Nivel de Engajamento
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Acompanhe quais modulos voce mais acessa e seu progresso na jornada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BabyHealthDashboard;
