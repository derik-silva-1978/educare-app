
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, AlertTriangleIcon, CalendarIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Activity } from '@/types/activity';

interface ActivitySummaryCardsProps {
  activities: Activity[];
  upcomingActivities: Activity[];
  attentionActivities: Activity[];
  completedActivities: number;
}

export const ActivitySummaryCards: React.FC<ActivitySummaryCardsProps> = ({
  activities,
  upcomingActivities,
  attentionActivities,
  completedActivities
}) => {
  const totalActivities = activities.length;
  const completionPercentage = totalActivities > 0 
    ? Math.round((completedActivities / totalActivities) * 100) 
    : 0;
    
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Resumo de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Progresso geral</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-700 font-medium flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              Próximas Atividades
            </h3>
            <p className="text-2xl font-bold mt-2">{upcomingActivities.length}</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-amber-700 font-medium flex items-center">
              <AlertTriangleIcon className="mr-2 h-4 w-4" />
              Requerem Atenção
            </h3>
            <p className="text-2xl font-bold mt-2">{attentionActivities.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-700 font-medium flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Atividades Completas
            </h3>
            <p className="text-2xl font-bold mt-2">{completedActivities} de {totalActivities}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySummaryCards;
