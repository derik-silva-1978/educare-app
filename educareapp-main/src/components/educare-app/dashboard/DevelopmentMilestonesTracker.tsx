import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useDashboardMetrics } from '@/hooks/educare-app/useDashboardMetrics';
import { useSelectedChild } from '@/contexts/SelectedChildContext';
import CollapsibleDevelopmentCharts from './CollapsibleDevelopmentCharts';

interface DimensionProgress {
  answered: number;
  total: number;
  percentage: number;
}

interface ChildProgress {
  overallProgress: number;
  dimensionProgress: Record<string, DimensionProgress>;
  totalQuestions: number;
  answeredQuestions: number;
}

const DevelopmentMilestonesTracker: React.FC = () => {
  const { user } = useAuth();
  const { metrics, rawData, isLoading } = useDashboardMetrics();
  const { selectedChildId } = useSelectedChild();
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [selectedChildProgress, setSelectedChildProgress] = useState<ChildProgress | null>(null);

  // Calculate age-based progress for selected child only
  useEffect(() => {
    const calculateProgressForSelectedChild = () => {
      if (!rawData?.children || !selectedChildId) {
        setSelectedChildProgress(null);
        return;
      }

      // Encontrar a criança selecionada
      const selectedChild = rawData.children.find(child => child.id === selectedChildId);
      if (!selectedChild) {
        setSelectedChildProgress(null);
        return;
      }

      // Mock dimensions baseadas na idade da criança
      const mockDimensions = ['motor_grosso', 'motor_fino', 'linguagem', 'cognitivo', 'social'];
      
      const childAgeMonths = (selectedChild as any).age || selectedChild.birthDate ? 
        Math.floor((new Date().getTime() - new Date(selectedChild.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 12;
      
      // Simular progresso baseado na idade e dados existentes
      const dimensionProgress: Record<string, DimensionProgress> = {};
      
      mockDimensions.forEach(dimension => {
        // Simular questões baseadas na idade
        const totalQuestions = Math.max(5, Math.floor(childAgeMonths / 3)); // Mais questões para crianças mais velhas
        const answeredQuestions = Math.floor(totalQuestions * (0.6 + Math.random() * 0.3)); // 60-90% de progresso simulado
        
        dimensionProgress[dimension] = {
          answered: answeredQuestions,
          total: totalQuestions,
          percentage: Math.min(100, Math.round((answeredQuestions / totalQuestions) * 100))
        };
      });

      // Calculate overall progress
      const totalAnswered = Object.values(dimensionProgress).reduce((sum, dim) => sum + dim.answered, 0);
      const totalQuestions = Object.values(dimensionProgress).reduce((sum, dim) => sum + dim.total, 0);
      const overallProgress = totalQuestions > 0 ? 
        Math.min(100, Math.round((totalAnswered / totalQuestions) * 100)) : 0;

      setSelectedChildProgress({
        overallProgress,
        dimensionProgress,
        totalQuestions,
        answeredQuestions: totalAnswered
      });
    };

    calculateProgressForSelectedChild();
  }, [rawData, selectedChildId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rawData?.children?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Cadastre uma criança e realize avaliações para visualizar os marcos de desenvolvimento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedChildId || !selectedChildProgress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Selecione uma criança para visualizar os marcos de desenvolvimento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedChild = rawData.children.find(child => child.id === selectedChildId);
  if (!selectedChild) {
    return null;
  }

  // Use progress data from selected child
  const childWithMetrics = metrics.childrenWithProgress?.find(c => c.id === selectedChild.id) || selectedChild;
  const responseCount = (childWithMetrics as any).responseCount || 0;
  const sessionCount = (childWithMetrics as any).sessionCount || 0;

  return (
    <div className="space-y-4">
      {/* Collapsible Development Charts */}
      <CollapsibleDevelopmentCharts
        dimensionProgress={selectedChildProgress.dimensionProgress}
        overallProgress={selectedChildProgress.overallProgress}
        isOpen={isChartsOpen}
        onToggle={() => setIsChartsOpen(!isChartsOpen)}
      />

      {/* Selected Child Summary Card */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{selectedChild.firstName} {selectedChild.lastName}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedChildProgress.answeredQuestions}/{selectedChildProgress.totalQuestions} marcos • {sessionCount} sessões
            </p>
          </div>
          <Badge variant={selectedChildProgress.overallProgress >= 80 ? "default" : selectedChildProgress.overallProgress >= 60 ? "secondary" : "outline"}>
            {selectedChildProgress.overallProgress}%
          </Badge>
        </div>
        
        {/* Progress by dimension for selected child */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(selectedChildProgress.dimensionProgress).map(([dimension, progress]: [string, DimensionProgress]) => {
            const dimensionNames: Record<string, string> = {
              'motor_grosso': 'Motor Grosso',
              'motor_fino': 'Motor Fino', 
              'linguagem': 'Linguagem',
              'cognitivo': 'Cognitivo',
              'social': 'Social'
            };
            
            return (
              <div key={dimension} className="text-center p-2 bg-muted/30 rounded">
                <div className="text-xs font-medium mb-1">
                  {dimensionNames[dimension] || dimension.replace('_', ' ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DevelopmentMilestonesTracker;