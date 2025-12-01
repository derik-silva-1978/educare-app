import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Award, Calendar, Activity, Target } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useIndividualChildMetrics } from '@/hooks/educare-app/useIndividualChildMetrics';
import { useSelectedChild } from '@/contexts/SelectedChildContext';

interface MetricsCardsProps {
  metrics: {
    totalChildren: number;
    childrenInProgress: number;
    completedJourneys: number;
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    totalReports: number;
    averageProgress: number;
    // Individual child metrics
    completedModules?: number;
    totalModules?: number;
    moduleProgress?: number;
    currentModule?: any;
    nextModule?: any;
  };
  userRole: string;
  individualMode?: boolean;
}

const EnhancedMetricsCards: React.FC<MetricsCardsProps> = ({
  metrics,
  userRole,
  individualMode = false
}) => {
  const isParent = userRole === 'parent';
  const isProfessional = userRole === 'professional';
  const { selectedChildId } = useSelectedChild();
  const { metrics: childMetrics, childMetrics: childData } = useIndividualChildMetrics();

  // If in individual mode and no child selected, show empty state
  if (individualMode && !selectedChildId) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg font-medium">📊 Métricas Individuais</p>
        <p className="text-sm mt-2">Selecione uma criança acima para visualizar seu progresso detalhado</p>
      </div>
    );
  }

  // Individual child metrics
  if (individualMode && isParent) {
    const child = childData?.child;
    
    const individualMetricsData = [
      {
        title: 'Módulos Finalizados',
        value: `${childMetrics.completedModules}/${childMetrics.totalModules}`,
        icon: Award,
        color: 'purple',
        gradient: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700',
        valueColor: 'text-purple-900',
        borderColor: 'border-purple-200',
        trend: `${childMetrics.moduleProgress}%`,
        description: 'Módulos completados',
        numericValue: childMetrics.completedModules
      },
      {
        title: 'Progresso Atual',
        value: `${child?.journey_progress || 0}%`,
        icon: TrendingUp,
        color: 'blue',
        gradient: 'from-blue-50 to-blue-100',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700',
        valueColor: 'text-blue-900',
        borderColor: 'border-blue-200',
        trend: child?.journey_progress >= 75 ? 'Excelente' : child?.journey_progress >= 50 ? 'Bom' : 'Em progresso',
        description: 'Progresso no módulo em andamento',
        numericValue: child?.journey_progress || 0
      },
      {
        title: 'Próximo Marco',
        value: childMetrics.currentModule ? 
          `Módulo ${childMetrics.currentModule.age_min_months}-${childMetrics.currentModule.age_max_months}m` : 
          'Concluído',
        icon: Target,
        color: 'green',
        gradient: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
        valueColor: 'text-green-900',
        borderColor: 'border-green-200',
        trend: childMetrics.nextModule ? 'Disponível' : 'Último módulo',
        description: 'Faixa etária atual',
        numericValue: childMetrics.currentModule ? 1 : 0
      },
      {
        title: 'Sessões Ativas',
        value: childMetrics.activeSessions,
        icon: Activity,
        color: 'indigo',
        gradient: 'from-indigo-50 to-indigo-100',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700',
        valueColor: 'text-indigo-900',
        borderColor: 'border-indigo-200',
        trend: childMetrics.activeSessions > 0 ? 'Ativa' : 'Inativa',
        description: 'Em andamento',
        numericValue: childMetrics.activeSessions
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {individualMetricsData.map((metric, index) => (
          <Card key={index} className={`bg-gradient-to-br ${metric.gradient} ${metric.borderColor} hover:shadow-md transition-shadow duration-200`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`${metric.textColor} text-sm font-medium`}>
                    {metric.title}
                  </p>
                  <p className={`text-3xl font-bold ${metric.valueColor}`}>{metric.value}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.iconColor}`} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{metric.description}</span>
                <div className="flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">{metric.trend}</span>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-3">
                <div className="w-full bg-white/50 rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r ${
                      metric.color === 'blue' ? 'from-blue-400 to-blue-600' : 
                      metric.color === 'green' ? 'from-green-400 to-green-600' : 
                      metric.color === 'purple' ? 'from-purple-400 to-purple-600' :
                      'from-indigo-400 to-indigo-600'
                    } h-1.5 rounded-full transition-all duration-500`}
                    style={{ 
                      width: metric.title === 'Módulos Finalizados' ? `${childMetrics.moduleProgress}%` :
                             metric.title === 'Progresso Atual' ? `${child?.journey_progress || 0}%` :
                             metric.title === 'Sessões Ativas' ? `${childMetrics.activeSessions > 0 ? 100 : 0}%` :
                             '100%'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: isParent ? 'Crianças' : 'Pacientes',
      value: metrics.totalChildren,
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900',
      borderColor: 'border-blue-200',
      trend: metrics.totalChildren > 0 ? '+100%' : '0%',
      description: 'Total registrado'
    },
    ...(isParent ? [
      {
        title: 'Em Progresso',
        value: metrics.childrenInProgress,
        icon: TrendingUp,
        color: 'green',
        gradient: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
        valueColor: 'text-green-900',
        borderColor: 'border-green-200',
        trend: metrics.totalChildren > 0 ? `${Math.round((metrics.childrenInProgress / metrics.totalChildren) * 100)}%` : '0%',
        description: 'Avaliações ativas'
      },
      {
        title: 'Módulos Concluídos',
        value: metrics.completedJourneys,
        icon: Award,
        color: 'purple',
        gradient: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700',
        valueColor: 'text-purple-900',
        borderColor: 'border-purple-200',
        trend: metrics.totalChildren > 0 ? `${Math.round((metrics.completedJourneys / metrics.totalChildren) * 100)}%` : '0%',
        description: 'Módulos finalizados'
      }
    ] : [
      {
        title: 'Sessões Ativas',
        value: metrics.activeSessions,
        icon: Activity,
        color: 'green',
        gradient: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
        valueColor: 'text-green-900',
        borderColor: 'border-green-200',
        trend: metrics.totalSessions > 0 ? `${Math.round((metrics.activeSessions / metrics.totalSessions) * 100)}%` : '0%',
        description: 'Em andamento'
      },
      {
        title: 'Relatórios',
        value: metrics.totalReports,
        icon: Calendar,
        color: 'purple',
        gradient: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700',
        valueColor: 'text-purple-900',
        borderColor: 'border-purple-200',
        trend: metrics.totalReports > 0 ? '+100%' : '0%',
        description: 'Gerados'
      }
    ])
  ];

  // Add progress overview card for parents
  if (isParent && metrics.totalChildren > 0) {
    metricsData.push({
      title: 'Progresso Médio',
      value: metrics.averageProgress,
      icon: TrendingUp,
      color: 'indigo',
      gradient: 'from-indigo-50 to-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-700',
      valueColor: 'text-indigo-900',
      borderColor: 'border-indigo-200',
      trend: `${metrics.averageProgress}%`,
      description: 'Todas as crianças'
    });
  }

  return (
    <div className={`grid grid-cols-1 ${metricsData.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-3 md:gap-4`}>
      {metricsData.map((metric, index) => (
        <Card key={index} className={`bg-gradient-to-br ${metric.gradient} ${metric.borderColor} hover:shadow-sm transition-all duration-200 hover:scale-[1.02]`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="min-w-0 flex-1">
                <p className={`${metric.textColor} text-xs md:text-sm font-medium leading-tight`}>
                  {metric.title}
                </p>
                <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${metric.valueColor} mt-1`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-6 w-6 md:h-8 md:w-8 ${metric.iconColor} flex-shrink-0`} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground leading-relaxed">{metric.description}</span>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{metric.trend}</span>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-2 md:mt-3">
              <div className="w-full bg-white/50 rounded-full h-1.5">
                <div
                  className={`bg-gradient-to-r ${metric.color === 'blue' ? 'from-blue-400 to-blue-600' : 
                    metric.color === 'green' ? 'from-green-400 to-green-600' : 'from-purple-400 to-purple-600'} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min((metric.value / Math.max(metrics.totalChildren || 1, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedMetricsCards;