import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Baby, Calendar, Sparkles, AlertTriangle, Scale, Moon, Syringe, Stethoscope } from 'lucide-react';
import { BabyHealthSummary } from '@/hooks/educare-app/useBabyHealthSummary';

interface DailySummaryCardProps {
  data: BabyHealthSummary;
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ data }) => {
  if (!data.hasChild || !data.child || !data.summary) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Baby className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Cadastre seu bebe</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Adicione os dados do seu bebe para acompanhar o desenvolvimento, vacinas e muito mais.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { child, summary, vaccines, appointments } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Baby className="h-4 w-4" />
            {child.firstName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{child.ageDisplay}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {child.ageInWeeks} semanas de vida
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${summary.nextLeap ? 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-100 dark:border-purple-900' : 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Sparkles className="h-4 w-4" />
            Salto de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.nextLeap ? (
            <>
              <p className="text-lg font-semibold text-purple-900 dark:text-purple-100 leading-tight">
                {summary.nextLeap.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  Em {summary.nextLeapWeeksAway} semanas
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Todos os saltos concluidos!</p>
          )}
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${summary.pendingVaccinesCount > 0 ? 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900' : 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-100 dark:border-green-900'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-medium flex items-center gap-2 ${summary.pendingVaccinesCount > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-green-700 dark:text-green-300'}`}>
            {summary.pendingVaccinesCount > 0 ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Syringe className="h-4 w-4" />
            )}
            Vacinas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.pendingVaccinesCount > 0 ? (
            <>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {summary.pendingVaccinesCount} pendente{summary.pendingVaccinesCount > 1 ? 's' : ''}
              </p>
              {vaccines.nextVaccine && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 truncate">
                  Proxima: {vaccines.nextVaccine.vaccine}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">Em dia!</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Todas as vacinas aplicadas
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-100 dark:border-teal-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-teal-700 dark:text-teal-300">
            <Stethoscope className="h-4 w-4" />
            Proxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <>
              <p className="text-lg font-semibold text-teal-900 dark:text-teal-100 truncate">
                {appointments[0].specialty || appointments[0].doctorName}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                {new Date(appointments[0].appointmentDate).toLocaleDateString('pt-BR')}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-teal-900 dark:text-teal-100">Nenhuma</p>
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                Agende pelo WhatsApp
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySummaryCard;
