import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, Check, Circle, Clock, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Milestone {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  domain: string;
  status: 'achieved' | 'current' | 'upcoming';
  source?: string;
}

interface MilestonesTimelineProps {
  milestones?: Milestone[];
  childAge?: string;
}

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Sorriso Social',
    description: 'Bebê responde com sorrisos quando interage com adultos.',
    ageRange: '2-3 meses',
    domain: 'Social',
    status: 'achieved',
    source: 'Ministério da Saúde',
  },
  {
    id: '2',
    title: 'Sustenta a Cabeça',
    description: 'Consegue manter a cabeça firme quando está no colo.',
    ageRange: '3-4 meses',
    domain: 'Motor',
    status: 'achieved',
    source: 'Ministério da Saúde',
  },
  {
    id: '3',
    title: 'Primeiras Palavras',
    description: 'Fala "mama" ou "papa" com significado.',
    ageRange: '9-12 meses',
    domain: 'Linguagem',
    status: 'current',
    source: 'Ministério da Saúde',
  },
  {
    id: '4',
    title: 'Primeiros Passos',
    description: 'Caminha com apoio ou independentemente.',
    ageRange: '12-15 meses',
    domain: 'Motor',
    status: 'upcoming',
    source: 'Ministério da Saúde',
  },
];

const getStatusIcon = (status: Milestone['status']) => {
  switch (status) {
    case 'achieved':
      return <Check className="h-4 w-4 text-white" />;
    case 'current':
      return <Circle className="h-4 w-4 text-white animate-pulse" />;
    case 'upcoming':
      return <Clock className="h-4 w-4 text-white" />;
  }
};

const getStatusStyles = (status: Milestone['status']) => {
  switch (status) {
    case 'achieved':
      return {
        dot: 'bg-green-500',
        line: 'bg-green-500',
        card: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      };
    case 'current':
      return {
        dot: 'bg-blue-500',
        line: 'bg-gray-200 dark:bg-gray-700',
        card: 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      };
    case 'upcoming':
      return {
        dot: 'bg-gray-400 dark:bg-gray-600',
        line: 'bg-gray-200 dark:bg-gray-700',
        card: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
  }
};

const getDomainColor = (domain: string) => {
  switch (domain.toLowerCase()) {
    case 'motor':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'linguagem':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'cognitivo':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'social':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'sensorial':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({
  milestones = defaultMilestones,
  childAge,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flag className="h-5 w-5 text-amber-600" />
            Marcos do Desenvolvimento
            {childAge && (
              <span className="text-sm font-normal text-muted-foreground">
                - {childAge}
              </span>
            )}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="text-xs gap-1">
                <Info className="h-3 w-3" />
                Ministério da Saúde
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Marcos baseados nas recomendações da Caderneta de Saúde da Criança do Ministério da Saúde.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {milestones.map((milestone, index) => {
            const styles = getStatusStyles(milestone.status);
            const isLast = index === milestones.length - 1;

            return (
              <div key={milestone.id} className="flex gap-4 pb-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full ${styles.dot} flex items-center justify-center shadow-sm`}>
                    {getStatusIcon(milestone.status)}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 mt-2 ${styles.line}`} />
                  )}
                </div>
                <div className={`flex-1 p-3 rounded-lg border ${styles.card} mb-2`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className={getDomainColor(milestone.domain)}>
                        {milestone.domain}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {milestone.ageRange}
                      </span>
                    </div>
                    {milestone.status === 'achieved' && (
                      <Badge className="bg-green-500 text-white text-xs">
                        Alcançado
                      </Badge>
                    )}
                    {milestone.status === 'current' && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{milestone.title}</h4>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestonesTimeline;
