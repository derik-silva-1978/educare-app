import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Calendar, 
  Activity, 
  Brain, 
  Smile, 
  Apple, 
  Moon, 
  Stethoscope,
  Clock,
  TrendingUp,
  Sparkles,
  FileText,
  MessageCircle,
  Loader2,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMotherDashboard } from '@/hooks/educare-app/useMotherHealth';
import type { MaternalDailyHealth, MaternalMentalHealth, MaternalAppointment, MoodSummary } from '@/services/api/maternalHealthService';
import { DailyHealthDialog, SleepLogDialog, MealLogDialog, MoodLogDialog, NewAppointmentDialog } from '@/components/educare-app/maternal/HealthDiaryDialogs';

interface MotherDashboardProps {
  profileData?: {
    name?: string;
    pregnancyWeek?: number;
    dueDate?: string;
  };
}

const moodLabels: Record<number, string> = {
  1: 'Difícil',
  2: 'Regular',
  3: 'Ok',
  4: 'Bom',
  5: 'Ótimo',
};

const getMoodLabel = (score?: number): string => {
  if (!score) return 'Registre';
  const rounded = Math.round(score);
  return moodLabels[rounded] || 'Ok';
};

const getMoodTrendPercentage = (moodSummary?: MoodSummary): string | null => {
  if (!moodSummary) return null;
  const avg7d = moodSummary.period7d?.avgMood;
  const avg30d = moodSummary.period30d?.avgMood;
  if (!avg7d || !avg30d || avg30d === 0) return null;
  const trend = ((avg7d - avg30d) / avg30d) * 100;
  return `${trend >= 0 ? '+' : ''}${Math.round(trend)}%`;
};

const formatAppointmentDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const formatAppointmentTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const healthTips = [
  'Lembre-se de manter-se hidratada durante todo o dia',
  'Pratique exercícios leves como caminhadas ou yoga',
  'Durma pelo menos 7-8 horas por noite',
  'Mantenha uma alimentação equilibrada e nutritiva',
];

const MotherDashboard: React.FC<MotherDashboardProps> = ({ profileData }) => {
  const { data: dashboardData, isLoading, isError } = useMotherDashboard();

  const [showDailyHealthDialog, setShowDailyHealthDialog] = useState(false);
  const [showSleepLogDialog, setShowSleepLogDialog] = useState(false);
  const [showMealLogDialog, setShowMealLogDialog] = useState(false);
  const [showMoodLogDialog, setShowMoodLogDialog] = useState(false);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  const latestHealth: MaternalDailyHealth | undefined = dashboardData?.latestDailyHealth?.[0];
  const latestMood: MaternalMentalHealth | undefined = dashboardData?.recentMood?.[0];
  const appointments: MaternalAppointment[] = dashboardData?.upcomingAppointments || [];
  const moodSummary: MoodSummary | undefined = dashboardData?.moodSummary;

  const sleepValue = latestHealth?.sleepHours;
  const moodValue = latestMood?.moodScore;
  const moodTrend = getMoodTrendPercentage(moodSummary);

  const wellnessMetrics = [
    {
      id: 'sleep',
      name: 'Sono',
      icon: Moon,
      value: sleepValue ?? null,
      displayValue: sleepValue != null ? `${sleepValue}` : null,
      unit: 'horas',
      target: 8,
      color: 'indigo' as const,
      emptyText: 'Registre seu sono',
    },
    {
      id: 'nutrition',
      name: 'Nutrição',
      icon: Apple,
      value: null,
      displayValue: null,
      unit: '%',
      target: 100,
      color: 'green' as const,
      emptyText: 'Registre sua alimentação',
    },
    {
      id: 'exercise',
      name: 'Exercício',
      icon: Activity,
      value: null,
      displayValue: null,
      unit: 'min',
      target: 30,
      color: 'orange' as const,
      emptyText: 'Registre seu exercício',
    },
    {
      id: 'mood',
      name: 'Humor',
      icon: Smile,
      value: moodValue ?? null,
      displayValue: moodValue != null ? `${moodValue}` : null,
      unit: '/5',
      target: 5,
      color: 'pink' as const,
      emptyText: 'Registre seu humor',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando dados de saúde materna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Heart className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Minha Jornada Materna</h2>
          <p className="text-sm text-muted-foreground">Acompanhe sua saúde e bem-estar durante esta fase especial</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {wellnessMetrics.map((metric) => {
          const Icon = metric.icon;
          const hasData = metric.value != null;
          const percentage = hasData && typeof metric.target === 'number' && metric.target > 0
            ? Math.min((metric.value! / metric.target) * 100, 100)
            : 0;

          const colorClasses = {
            indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', progress: 'bg-indigo-500' },
            green: { bg: 'bg-green-50', icon: 'text-green-600', progress: 'bg-green-500' },
            orange: { bg: 'bg-orange-50', icon: 'text-orange-600', progress: 'bg-orange-500' },
            pink: { bg: 'bg-pink-50', icon: 'text-pink-600', progress: 'bg-pink-500' },
          }[metric.color];

          return (
            <Card key={metric.id} className={cn("border-0 shadow-sm", colorClasses.bg)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-lg", colorClasses.bg)}>
                    <Icon className={cn("h-5 w-5", colorClasses.icon)} />
                  </div>
                  {hasData ? (
                    <span className="text-2xl font-bold">
                      {metric.displayValue}
                      <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">{metric.emptyText}</span>
                  )}
                </div>
                <p className="text-sm font-medium mb-2">{metric.name}</p>
                <Progress value={percentage} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">
                  Meta: {metric.target}{metric.unit.replace('/', ' de ')}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-pink-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-600" />
              <CardTitle className="text-lg">Próximas Consultas</CardTitle>
            </div>
            <CardDescription>Acompanhamento médico agendado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Stethoscope className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{appointment.appointmentType}</p>
                      <p className="text-xs text-muted-foreground">{appointment.doctorName || 'Médico não informado'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatAppointmentDate(appointment.appointmentDate)}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatAppointmentTime(appointment.appointmentDate)}
                    </div>
                  </div>
                  <Badge
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                    className={cn(
                      "ml-2",
                      appointment.status === 'confirmed' && "bg-green-100 text-green-700 hover:bg-green-100",
                      appointment.status === 'scheduled' && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                      appointment.status === 'completed' && "bg-gray-100 text-gray-700 hover:bg-gray-100",
                      appointment.status === 'cancelled' && "bg-red-100 text-red-700 hover:bg-red-100"
                    )}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmado' :
                     appointment.status === 'scheduled' ? 'Agendado' :
                     appointment.status === 'completed' ? 'Realizado' : 'Cancelado'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-pink-200 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma consulta agendada</p>
                <p className="text-xs text-muted-foreground mt-1">Agende sua próxima consulta para acompanhar sua saúde</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-2 gap-2" onClick={() => setShowNewAppointmentDialog(true)}>
              <PlusCircle className="h-4 w-4" />
              Agendar Nova Consulta
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Bem-estar Mental</CardTitle>
            </div>
            <CardDescription>Cuidando da sua saúde emocional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Smile className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Humor Hoje</p>
                <p className="text-2xl font-bold text-purple-700">
                  {getMoodLabel(moodSummary?.period7d?.avgMood)}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-center">
                <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Tendência</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {moodTrend ?? '—'}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <p className="font-medium text-sm">Dica do Dia</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {healthTips[Math.floor(Math.random() * healthTips.length)]}
              </p>
            </div>

            <Button variant="outline" className="w-full gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
              <MessageCircle className="h-4 w-4" />
              Falar com TitiNauta Materna
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-600" />
              <CardTitle className="text-lg">Diário de Saúde</CardTitle>
            </div>
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
              Em Desenvolvimento
            </Badge>
          </div>
          <CardDescription>Registre sintomas, consultas e momentos importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-rose-200 hover:bg-rose-50" onClick={() => setShowDailyHealthDialog(true)}>
              <Activity className="h-5 w-5 text-rose-600" />
              <span className="text-xs">Registrar Sintoma</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-rose-200 hover:bg-rose-50" onClick={() => setShowSleepLogDialog(true)}>
              <Moon className="h-5 w-5 text-rose-600" />
              <span className="text-xs">Registrar Sono</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-rose-200 hover:bg-rose-50" onClick={() => setShowMealLogDialog(true)}>
              <Apple className="h-5 w-5 text-rose-600" />
              <span className="text-xs">Registrar Refeição</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-4 gap-2 border-rose-200 hover:bg-rose-50" onClick={() => setShowMoodLogDialog(true)}>
              <Heart className="h-5 w-5 text-rose-600" />
              <span className="text-xs">Registrar Humor</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DailyHealthDialog isOpen={showDailyHealthDialog} onClose={() => setShowDailyHealthDialog(false)} />
      <SleepLogDialog isOpen={showSleepLogDialog} onClose={() => setShowSleepLogDialog(false)} />
      <MealLogDialog isOpen={showMealLogDialog} onClose={() => setShowMealLogDialog(false)} />
      <MoodLogDialog isOpen={showMoodLogDialog} onClose={() => setShowMoodLogDialog(false)} />
      <NewAppointmentDialog isOpen={showNewAppointmentDialog} onClose={() => setShowNewAppointmentDialog(false)} />
    </div>
  );
};

export default MotherDashboard;
