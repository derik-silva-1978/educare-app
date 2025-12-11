import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { milestonesService } from '@/services/milestonesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Baby, Loader2 } from 'lucide-react';

const getCategoryBadgeColor = (category: string | undefined): string => {
  if (!category) return 'bg-gray-100 text-gray-800';
  
  const colors: Record<string, string> = {
    'motor': 'bg-green-100 text-green-800',
    'cognitivo': 'bg-yellow-100 text-yellow-800',
    'linguagem': 'bg-blue-100 text-blue-800',
    'social': 'bg-purple-100 text-purple-800',
    'emocional': 'bg-pink-100 text-pink-800',
    'sensorial': 'bg-indigo-100 text-indigo-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const BabyMilestonesCard: React.FC = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['milestones-chart'],
    queryFn: () => milestonesService.getMilestonesChart()
  });

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const overallCoverage = Math.round(
    chartData.reduce((sum, item) => sum + item.coverage, 0) / chartData.length
  );

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5" />
          Marcos do Desenvolvimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Cobertura Geral</span>
            <span className="text-sm font-bold text-primary">{overallCoverage}%</span>
          </div>
          <Progress value={overallCoverage} className="h-2" />
        </div>

        <div className="space-y-3 mt-4">
          {chartData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(item.category)}>
                    {item.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.mapped}/{item.total}
                  </span>
                </div>
                <span className="text-xs font-medium">{item.coverage}%</span>
              </div>
              <Progress value={item.coverage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyMilestonesCard;
