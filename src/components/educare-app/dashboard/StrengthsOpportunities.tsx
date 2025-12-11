import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Sparkles, Target } from 'lucide-react';

interface StrengthItem {
  domain: string;
  description: string;
  score: number;
}

interface StrengthsOpportunitiesProps {
  strengths?: StrengthItem[];
  opportunities?: StrengthItem[];
}

const defaultStrengths: StrengthItem[] = [];
const defaultOpportunities: StrengthItem[] = [];

const StrengthsOpportunities: React.FC<StrengthsOpportunitiesProps> = ({
  strengths = defaultStrengths,
  opportunities = defaultOpportunities,
}) => {
  const hasData = strengths.length > 0 || opportunities.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-purple-600" />
          Pontos Fortes e Oportunidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium text-sm">Pontos Fortes</h4>
              </div>
              {strengths.length > 0 ? (
                <div className="space-y-2">
                  {strengths.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                          {item.domain}
                        </Badge>
                        <span className="text-xs font-medium text-green-600">{item.score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete mais respostas na jornada para identificar os pontos fortes.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <h4 className="font-medium text-sm">Oportunidades de Desenvolvimento</h4>
              </div>
              {opportunities.length > 0 ? (
                <div className="space-y-2">
                  {opportunities.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                          {item.domain}
                        </Badge>
                        <span className="text-xs font-medium text-amber-600">{item.score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Continue a jornada para identificar áreas de oportunidade.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              Continue acompanhando o desenvolvimento para ver a análise de pontos fortes e oportunidades.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrengthsOpportunities;
