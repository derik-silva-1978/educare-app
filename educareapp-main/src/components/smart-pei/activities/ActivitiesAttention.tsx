import React from 'react';
import { Activity } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface ActivitiesAttentionProps {
  activities: Activity[];
  isLoading: boolean;
}

export const ActivitiesAttention: React.FC<ActivitiesAttentionProps> = ({
  activities,
  isLoading
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
        <p className="text-muted-foreground">Nenhuma atividade atrasada.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity) => (
        <Card key={activity.id} className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{activity.title}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {activity.startDate && format(new Date(activity.startDate), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                {activity.studentName && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Estudante: {activity.studentName}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Atrasada
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => navigate(`/smart-pei/activities/${activity.id}`)}
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {activities.length > 5 && (
        <Button 
          variant="ghost" 
          className="w-full text-sm"
          onClick={() => navigate('/smart-pei/activities?filter=attention')}
        >
          Ver todas as {activities.length} atividades atrasadas
        </Button>
      )}
    </div>
  );
};

export default ActivitiesAttention;
