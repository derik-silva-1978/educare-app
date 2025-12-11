import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, Target, Moon, Syringe, Activity, Heart } from 'lucide-react';

interface HealthData {
  child?: {
    ageInWeeks?: number;
    ageInMonths?: number;
    ageDisplay?: string;
  };
  biometrics?: Array<{
    weight?: string;
    height?: string;
    recordedAt?: string;
  }>;
  sleepLogs?: Array<{
    durationMinutes?: number;
    quality?: string;
  }>;
  vaccines?: Array<{
    status?: string;
    vaccineName?: string;
    scheduledAt?: string;
  }>;
  appointments?: Array<{
    appointmentDate?: string;
    status?: string;
  }>;
}

interface InsightItem {
  domain: string;
  description: string;
  icon: React.ElementType;
  type: 'strength' | 'opportunity';
}

interface HealthInsightsProps {
  healthData?: HealthData;
}

const HealthInsights: React.FC<HealthInsightsProps> = ({ healthData }) => {
  const generateInsights = (): { strengths: InsightItem[]; opportunities: InsightItem[] } => {
    const strengths: InsightItem[] = [];
    const opportunities: InsightItem[] = [];

    if (!healthData) {
      return { strengths, opportunities };
    }

    const biometrics = healthData.biometrics || [];
    const sleepLogs = healthData.sleepLogs || [];
    const vaccines = healthData.vaccines || [];
    const takenVaccines = vaccines.filter(v => v.status === 'taken');
    const pendingVaccines = vaccines.filter(v => v.status === 'pending');

    if (biometrics.length >= 3) {
      const weights = biometrics.slice(0, 3).map(b => parseFloat(b.weight || '0'));
      const isGrowing = weights[0] > weights[1] && weights[1] > weights[2];
      
      if (isGrowing) {
        strengths.push({
          domain: 'Crescimento',
          description: 'Ganho de peso consistente nos últimos registros. O desenvolvimento físico está adequado.',
          icon: TrendingUp,
          type: 'strength'
        });
      }
    } else if (biometrics.length < 2) {
      opportunities.push({
        domain: 'Acompanhamento',
        description: 'Registre as medidas do bebê regularmente para acompanhar o crescimento.',
        icon: Activity,
        type: 'opportunity'
      });
    }

    if (sleepLogs.length >= 7) {
      const recentLogs = sleepLogs.slice(0, 7);
      const avgDuration = recentLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0) / recentLogs.length;
      const goodQualityCount = recentLogs.filter(log => log.quality === 'excellent' || log.quality === 'good').length;
      const qualityPercentage = (goodQualityCount / recentLogs.length) * 100;

      if (avgDuration >= 600) {
        strengths.push({
          domain: 'Sono',
          description: `Média de ${Math.round(avgDuration / 60)}h por noite. Padrão de sono saudável estabelecido.`,
          icon: Moon,
          type: 'strength'
        });
      } else if (avgDuration < 480) {
        opportunities.push({
          domain: 'Sono',
          description: 'A média de sono está abaixo do recomendado. Considere ajustar a rotina noturna.',
          icon: Moon,
          type: 'opportunity'
        });
      }

      if (qualityPercentage >= 70) {
        strengths.push({
          domain: 'Qualidade do Sono',
          description: `${Math.round(qualityPercentage)}% das noites com boa qualidade. Excelente padrão!`,
          icon: Heart,
          type: 'strength'
        });
      }
    } else if (sleepLogs.length < 3) {
      opportunities.push({
        domain: 'Registro de Sono',
        description: 'Registre o sono diariamente via WhatsApp para análises mais precisas.',
        icon: Moon,
        type: 'opportunity'
      });
    }

    if (takenVaccines.length > 0) {
      const totalExpectedBasic = 10;
      const completionRate = Math.min((takenVaccines.length / totalExpectedBasic) * 100, 100);
      
      if (completionRate >= 80) {
        strengths.push({
          domain: 'Vacinação',
          description: `${takenVaccines.length} vacinas aplicadas. Calendário vacinal bem acompanhado!`,
          icon: Syringe,
          type: 'strength'
        });
      } else if (completionRate >= 50) {
        strengths.push({
          domain: 'Vacinação',
          description: `${takenVaccines.length} vacinas aplicadas. Continue mantendo o calendário em dia.`,
          icon: Syringe,
          type: 'strength'
        });
      }
    }

    if (pendingVaccines.length > 0) {
      const overdueVaccines = pendingVaccines.filter(v => {
        if (!v.scheduledAt) return false;
        return new Date(v.scheduledAt) < new Date();
      });

      if (overdueVaccines.length > 0) {
        opportunities.push({
          domain: 'Vacinas Pendentes',
          description: `${overdueVaccines.length} vacina(s) com data passada. Agende uma visita ao posto de saúde.`,
          icon: Syringe,
          type: 'opportunity'
        });
      }
    }

    if (strengths.length === 0 && opportunities.length === 0) {
      opportunities.push({
        domain: 'Primeiros Passos',
        description: 'Comece registrando peso, altura e sono do bebê para receber insights personalizados.',
        icon: Sparkles,
        type: 'opportunity'
      });
    }

    return { strengths: strengths.slice(0, 3), opportunities: opportunities.slice(0, 3) };
  };

  const { strengths, opportunities } = generateInsights();
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
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="h-4 w-4 text-green-600" />
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                          {item.domain}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Continue registrando dados para identificar os pontos fortes.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <h4 className="font-medium text-sm">Oportunidades de Melhoria</h4>
              </div>
              {opportunities.length > 0 ? (
                <div className="space-y-2">
                  {opportunities.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="h-4 w-4 text-amber-600" />
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                          {item.domain}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Excelente! Não identificamos oportunidades de melhoria no momento.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              Registre dados de saúde do bebê para ver análises personalizadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInsights;
