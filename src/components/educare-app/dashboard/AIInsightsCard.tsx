import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Insight {
  id: string;
  type: 'tip' | 'activity' | 'milestone' | 'alert';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
}

interface AIInsightsCardProps {
  insights?: Insight[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const defaultInsights: Insight[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Dica do TitiNauta',
    description: 'Converse com seu filho durante as atividades diárias. Narrar o que você está fazendo ajuda no desenvolvimento da linguagem.',
    action: 'Ver mais dicas',
    actionUrl: '/educare-app/titinauta',
  },
  {
    id: '2',
    type: 'activity',
    title: 'Atividade Sugerida',
    description: 'Brincar de empilhar blocos ajuda a desenvolver coordenação motora e noção espacial.',
    action: 'Ver atividades',
    actionUrl: '/educare-app/activities',
  },
];

const getTypeStyles = (type: Insight['type']) => {
  switch (type) {
    case 'tip':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      };
    case 'activity':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      };
    case 'milestone':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      };
    case 'alert':
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      };
  }
};

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insights = defaultInsights,
  isLoading = false,
  onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Insights do TitiNauta
          </CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const styles = getTypeStyles(insight.type);
          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg ${styles.bg} border ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.action && insight.actionUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => navigate(insight.actionUrl!)}
                    >
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/educare-app/titinauta')}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Conversar com TitiNauta
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
