
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Heart, Syringe, Pill, Activity } from 'lucide-react';

interface HealthMetricsDisplayProps {
  latestGrowthData?: {
    height?: number;
    weight?: number;
    temperature?: number;
    measurements?: any;
  };
  totalRecords: number;
  vaccinationCount: number;
  medicationCount: number;
}

export const HealthMetricsDisplay: React.FC<HealthMetricsDisplayProps> = ({
  latestGrowthData,
  totalRecords,
  vaccinationCount,
  medicationCount
}) => {
  const metrics = [
    {
      title: 'Medições de Crescimento',
      value: latestGrowthData?.height || latestGrowthData?.measurements?.height || '--',
      unit: 'cm',
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Peso Atual',
      value: latestGrowthData?.weight || latestGrowthData?.measurements?.weight || '--',
      unit: 'kg',
      icon: Heart,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Vacinas Aplicadas',
      value: vaccinationCount,
      unit: 'doses',
      icon: Syringe,
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Medicamentos',
      value: medicationCount,
      unit: 'registros',
      icon: Pill,
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={`${metric.bgColor} ${metric.borderColor} border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-white/70 ${metric.iconColor}`}>
              <metric.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-slate-800">
                {metric.value}
              </div>
              <Badge variant="secondary" className="text-xs bg-white/60">
                {metric.unit}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Summary Card */}
      <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Activity className="h-5 w-5 text-slate-600" />
            Resumo da Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant="outline" className="bg-white/70 border-slate-300">
              Total de registros: {totalRecords}
            </Badge>
            {latestGrowthData?.temperature && (
              <Badge variant="outline" className="bg-white/70 border-slate-300">
                Última temperatura: {latestGrowthData.temperature}°C
              </Badge>
            )}
            <Badge variant="outline" className="bg-white/70 border-slate-300">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
