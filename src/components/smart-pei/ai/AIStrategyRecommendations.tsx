
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrategyRecommendation } from '@/utils/ai-service';
import { BookOpen, School, Home, Activity, Calendar, Target, Award, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIStrategyRecommendationsProps {
  strategies: StrategyRecommendation[];
  title?: string;
}

export const AIStrategyRecommendations: React.FC<AIStrategyRecommendationsProps> = ({
  strategies,
  title = "Estratégias Recomendadas"
}) => {
  if (!strategies || strategies.length === 0) {
    return (
      <Card className="ai-strategy-recommendations">
        <CardHeader className="border-b bg-primary/5">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-8">
            Nenhuma estratégia recomendada disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group strategies by context
  const strategyGroups: Record<string, StrategyRecommendation[]> = {
    'school': strategies.filter(s => s.context === 'school'),
    'home': strategies.filter(s => s.context === 'home'),
    'therapy': strategies.filter(s => s.context === 'therapy'),
    'all': strategies.filter(s => s.context === 'all')
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'school':
        return <School className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'therapy':
        return <Activity className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getContextLabel = (context: string) => {
    switch (context) {
      case 'school':
        return 'Escola';
      case 'home':
        return 'Casa';
      case 'therapy':
        return 'Terapia';
      case 'all':
        return 'Todos os Contextos';
      default:
        return context;
    }
  };

  return (
    <Card className="ai-strategy-recommendations">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-6 pt-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
              Todas
            </TabsTrigger>
            {Object.keys(strategyGroups).map(context => (
              strategyGroups[context].length > 0 && (
                <TabsTrigger 
                  key={context}
                  value={context} 
                  className="data-[state=active]:bg-primary/10"
                >
                  <span className="flex items-center">
                    {getContextIcon(context)}
                    <span className="ml-1">{getContextLabel(context)}</span>
                  </span>
                </TabsTrigger>
              )
            ))}
          </TabsList>

          <TabsContent value="all" className="p-6 space-y-6">
            {strategies.map((strategy, index) => (
              <StrategyCard key={index} strategy={strategy} />
            ))}
          </TabsContent>

          {Object.keys(strategyGroups).map(context => (
            <TabsContent key={context} value={context} className="p-6 space-y-6">
              {strategyGroups[context].map((strategy, index) => (
                <StrategyCard key={index} strategy={strategy} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Strategy card component
const StrategyCard: React.FC<{ strategy: StrategyRecommendation }> = ({ strategy }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="border rounded-md p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-lg">{strategy.title}</h3>
        <Badge variant="outline" className={getDifficultyColor(strategy.difficulty)}>
          {strategy.difficulty === 'beginner' ? 'Básico' : 
           strategy.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>

      <div className="space-y-3">
        <div className="flex items-start">
          <Calendar className="h-4 w-4 mr-2 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Frequência Recomendada</p>
            <p className="text-sm text-muted-foreground">{strategy.frequencyRecommendation}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Target className="h-4 w-4 mr-2 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Resultados Esperados</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {strategy.expectedOutcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          </div>
        </div>

        {strategy.materials && strategy.materials.length > 0 && (
          <div className="flex items-start">
            <Package className="h-4 w-4 mr-2 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Materiais Sugeridos</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {strategy.materials.map((material, idx) => (
                  <li key={idx}>{material}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {strategy.evidenceBase && (
          <div className="flex items-start">
            <Award className="h-4 w-4 mr-2 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Base de Evidência</p>
              <p className="text-sm text-muted-foreground">{strategy.evidenceBase}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStrategyRecommendations;
