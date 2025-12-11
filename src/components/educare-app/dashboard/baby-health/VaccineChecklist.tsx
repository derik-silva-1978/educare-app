import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Syringe, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { VaccineData } from '@/hooks/educare-app/useBabyHealthSummary';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VaccineChecklistProps {
  vaccines: {
    taken: VaccineData[];
    pending: VaccineData[];
    upcoming: VaccineData[];
    nextVaccine: VaccineData | null;
  };
}

export const VaccineChecklist: React.FC<VaccineChecklistProps> = ({ vaccines }) => {
  const allVaccines = [
    ...vaccines.pending.map(v => ({ ...v, status: 'pending' as const })),
    ...vaccines.taken.map(v => ({ ...v, status: 'taken' as const })),
  ].sort((a, b) => a.weeks - b.weeks);

  const totalCount = vaccines.taken.length + vaccines.pending.length + vaccines.upcoming.length;
  const takenPercentage = totalCount > 0 ? Math.round((vaccines.taken.length / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-purple-500" />
            Carteira de Vacinacao
          </div>
          <Badge variant="outline" className="font-normal">
            {vaccines.taken.length}/{totalCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vaccines.nextVaccine && (
          <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${
            vaccines.nextVaccine.status === 'pending' 
              ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' 
              : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
          }`}>
            {vaccines.nextVaccine.status === 'pending' ? (
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            ) : (
              <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {vaccines.nextVaccine.status === 'pending' ? 'Vacina pendente:' : 'Proxima vacina:'}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {vaccines.nextVaccine.vaccine} (Dose {vaccines.nextVaccine.dose})
              </p>
            </div>
          </div>
        )}

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${takenPercentage}%` }}
          />
        </div>

        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-2">
            {allVaccines.map((vaccine, index) => (
              <div 
                key={`${vaccine.vaccine}-${vaccine.dose}-${index}`}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  vaccine.status === 'taken' 
                    ? 'bg-green-50 dark:bg-green-950/20' 
                    : 'bg-amber-50 dark:bg-amber-950/20'
                }`}
              >
                {vaccine.status === 'taken' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{vaccine.vaccine}</p>
                  <p className="text-xs text-muted-foreground">
                    Dose {vaccine.dose} - {vaccine.weeks} semanas
                    {vaccine.takenAt && ` - Aplicada em ${format(new Date(vaccine.takenAt), 'dd/MM/yyyy', { locale: ptBR })}`}
                  </p>
                </div>
                <Badge 
                  variant={vaccine.status === 'taken' ? 'default' : 'secondary'}
                  className={vaccine.status === 'taken' ? 'bg-green-500' : 'bg-amber-500 text-white'}
                >
                  {vaccine.status === 'taken' ? 'Aplicada' : 'Pendente'}
                </Badge>
              </div>
            ))}

            {vaccines.upcoming.length > 0 && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Proximas vacinas</p>
                </div>
                {vaccines.upcoming.map((vaccine, index) => (
                  <div 
                    key={`upcoming-${vaccine.vaccine}-${vaccine.dose}-${index}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-muted-foreground">{vaccine.vaccine}</p>
                      <p className="text-xs text-muted-foreground">
                        Dose {vaccine.dose} - a partir de {vaccine.weeks} semanas
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VaccineChecklist;
