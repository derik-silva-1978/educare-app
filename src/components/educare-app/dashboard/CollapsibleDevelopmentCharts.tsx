import React from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart } from '@/components/charts/BarChart';
import { 
  Activity, 
  Brain, 
  Users, 
  MessageSquare, 
  Hand, 
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DimensionProgress {
  answered: number;
  total: number;
  percentage: number;
}

interface CollapsibleDevelopmentChartsProps {
  dimensionProgress: Record<string, DimensionProgress>;
  overallProgress: number;
  isOpen: boolean;
  onToggle: () => void;
}

const CollapsibleDevelopmentCharts: React.FC<CollapsibleDevelopmentChartsProps> = ({
  dimensionProgress,
  overallProgress,
  isOpen,
  onToggle
}) => {
  const dimensionIcons = {
    motor_grosso: Activity,
    motor_fino: Hand,
    linguagem: MessageSquare,
    cognitivo: Brain,
    social_emocional: Users,
    autocuidado: User
  };

  const dimensionNames = {
    motor_grosso: 'Motor Grosso',
    motor_fino: 'Motor Fino',
    linguagem: 'Linguagem',
    cognitivo: 'Cognitivo',
    social_emocional: 'Social/Emocional',
    autocuidado: 'Autocuidado'
  };

  const dimensionColors = {
    motor_grosso: 'hsl(var(--chart-1))',
    motor_fino: 'hsl(var(--chart-2))',
    linguagem: 'hsl(var(--chart-3))',
    cognitivo: 'hsl(var(--chart-4))',
    social_emocional: 'hsl(var(--chart-5))',
    autocuidado: 'hsl(var(--primary))'
  };

  // Prepare data for bar chart
  const chartData = Object.entries(dimensionProgress).map(([dimension, progress]) => ({
    name: dimensionNames[dimension] || dimension,
    valor: progress.percentage
  }));

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bom';
    return 'Atenção';
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Marcos de Desenvolvimento</h3>
                <p className="text-sm text-muted-foreground">
                  Progresso geral: {overallProgress}% • {Object.keys(dimensionProgress).length} dimensões
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-sm font-medium ${getStatusColor(overallProgress)}`}>
                {getStatusText(overallProgress)}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progresso Geral</span>
                <span className={getStatusColor(overallProgress)}>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {/* Bar Chart */}
            {chartData.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Progresso por Dimensão</h4>
                <div className="h-48 w-full">
                  <BarChart 
                    data={chartData} 
                    color="hsl(var(--primary))" 
                  />
                </div>
              </div>
            )}

            {/* Detailed Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(dimensionProgress).map(([dimension, progress]) => {
                const Icon = dimensionIcons[dimension] || Activity;
                const color = dimensionColors[dimension] || 'hsl(var(--primary))';
                
                return (
                  <div 
                    key={dimension} 
                    className="p-3 border rounded-lg space-y-2 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <Icon 
                        className="h-4 w-4" 
                        style={{ color }} 
                      />
                      <span className="font-medium text-sm">
                        {dimensionNames[dimension]}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{progress.answered}/{progress.total} marcos</span>
                        <span className={getStatusColor(progress.percentage)}>
                          {progress.percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={progress.percentage} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Insights */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Resumo</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  • Progresso baseado na faixa etária da criança
                </p>
                <p>
                  • {Object.values(dimensionProgress).reduce((sum, p) => sum + p.answered, 0)} marcos atingidos de {Object.values(dimensionProgress).reduce((sum, p) => sum + p.total, 0)} disponíveis
                </p>
                <p>
                  • Acompanhe regularmente através das avaliações
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleDevelopmentCharts;