import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Baby, 
  Syringe, 
  Moon, 
  CalendarCheck, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    doctorName?: string;
    specialty?: string;
    status?: string;
  }>;
}

interface HealthMetricsCardsProps {
  healthData?: HealthData;
  isLoading?: boolean;
}

const HealthMetricsCards: React.FC<HealthMetricsCardsProps> = ({ 
  healthData,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const latestBiometrics = healthData?.biometrics?.[0];
  const recentSleepLogs = healthData?.sleepLogs?.slice(0, 7) || [];
  const pendingVaccines = healthData?.vaccines?.filter(v => v.status === 'pending') || [];
  const takenVaccines = healthData?.vaccines?.filter(v => v.status === 'taken') || [];
  const upcomingAppointments = healthData?.appointments?.filter(a => 
    a.status === 'scheduled' && a.appointmentDate && new Date(a.appointmentDate) >= new Date()
  ) || [];

  const avgSleepHours = recentSleepLogs.length > 0
    ? Math.round(recentSleepLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0) / recentSleepLogs.length / 60 * 10) / 10
    : null;

  const sleepQualityScore = recentSleepLogs.length > 0
    ? Math.round(recentSleepLogs.filter(log => log.quality === 'excellent' || log.quality === 'good').length / recentSleepLogs.length * 100)
    : null;

  const nextVaccine = pendingVaccines.length > 0 
    ? pendingVaccines.sort((a, b) => {
        if (!a.scheduledAt || !b.scheduledAt) return 0;
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      })[0]
    : null;

  const nextAppointment = upcomingAppointments.length > 0
    ? upcomingAppointments.sort((a, b) => {
        if (!a.appointmentDate || !b.appointmentDate) return 0;
        return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
      })[0]
    : null;

  const daysUntilNextVaccine = nextVaccine?.scheduledAt 
    ? differenceInDays(parseISO(nextVaccine.scheduledAt), new Date())
    : null;

  const daysUntilNextAppointment = nextAppointment?.appointmentDate
    ? differenceInDays(parseISO(nextAppointment.appointmentDate), new Date())
    : null;

  const metricsData = [
    {
      title: 'Crescimento',
      value: latestBiometrics 
        ? `${latestBiometrics.weight}kg / ${latestBiometrics.height}cm`
        : 'Sem dados',
      icon: TrendingUp,
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
      valueColor: 'text-blue-900',
      borderColor: 'border-blue-200',
      subtitle: latestBiometrics?.recordedAt 
        ? `Última medição: ${format(parseISO(latestBiometrics.recordedAt), "dd/MM", { locale: ptBR })}`
        : 'Registre as medidas',
      status: latestBiometrics ? 'ok' : 'empty'
    },
    {
      title: 'Sono (7 dias)',
      value: avgSleepHours ? `${avgSleepHours}h/noite` : 'Sem dados',
      icon: Moon,
      gradient: 'from-indigo-50 to-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-700',
      valueColor: 'text-indigo-900',
      borderColor: 'border-indigo-200',
      subtitle: sleepQualityScore !== null 
        ? `${sleepQualityScore}% noites com boa qualidade`
        : 'Registre o sono',
      status: avgSleepHours ? (avgSleepHours >= 10 ? 'excellent' : avgSleepHours >= 8 ? 'good' : 'warning') : 'empty'
    },
    {
      title: 'Vacinas',
      value: `${takenVaccines.length} aplicadas`,
      icon: Syringe,
      gradient: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7
        ? 'from-amber-50 to-amber-100'
        : 'from-green-50 to-green-100',
      iconColor: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7
        ? 'text-amber-600'
        : 'text-green-600',
      textColor: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7
        ? 'text-amber-700'
        : 'text-green-700',
      valueColor: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7
        ? 'text-amber-900'
        : 'text-green-900',
      borderColor: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7
        ? 'border-amber-200'
        : 'border-green-200',
      subtitle: nextVaccine 
        ? daysUntilNextVaccine !== null 
          ? daysUntilNextVaccine <= 0
            ? `${nextVaccine.vaccineName} - HOJE!`
            : `Próxima: ${nextVaccine.vaccineName} em ${daysUntilNextVaccine} dias`
          : `${pendingVaccines.length} pendente${pendingVaccines.length > 1 ? 's' : ''} - agende a data`
        : 'Calendário em dia',
      status: pendingVaccines.length > 0 && daysUntilNextVaccine !== null && daysUntilNextVaccine <= 7 ? 'warning' : 'ok'
    },
    {
      title: 'Consultas',
      value: upcomingAppointments.length > 0 
        ? `${upcomingAppointments.length} agendada${upcomingAppointments.length > 1 ? 's' : ''}`
        : 'Nenhuma',
      icon: CalendarCheck,
      gradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
      valueColor: 'text-purple-900',
      borderColor: 'border-purple-200',
      subtitle: nextAppointment 
        ? daysUntilNextAppointment !== null
          ? `${nextAppointment.specialty || 'Consulta'} em ${daysUntilNextAppointment} dias`
          : `${nextAppointment.specialty || 'Consulta'} agendada`
        : 'Agende uma consulta',
      status: upcomingAppointments.length > 0 ? 'ok' : 'empty'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'ok':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-amber-500" />;
      case 'empty':
        return <Clock className="h-3 w-3 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => (
        <Card 
          key={index} 
          className={`bg-gradient-to-br ${metric.gradient} ${metric.borderColor} hover:shadow-md transition-all duration-200`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className={`${metric.textColor} text-sm font-medium`}>
                  {metric.title}
                </p>
                <p className={`text-lg font-bold ${metric.valueColor} mt-1 truncate`}>
                  {metric.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.gradient.replace('from-', 'bg-').split(' ')[0]}`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {getStatusIcon(metric.status)}
              <span className="truncate">{metric.subtitle}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HealthMetricsCards;
