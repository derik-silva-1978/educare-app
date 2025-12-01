
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '@/types/activity';
import { 
  endOfDay, 
  addDays, 
  startOfDay, 
  isAfter, 
  isBefore, 
  isToday, 
  format 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UpcomingActivitiesProps {
  activities: Activity[];
  isLoading: boolean;
}

export const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({
  activities,
  isLoading
}) => {
  const navigate = useNavigate();
  const today = new Date();
  const todayEnd = endOfDay(today);
  const nextWeekStart = addDays(startOfDay(today), 7);
  const limit = 5; // Define the limit constant
  
  const upcomingActivities = activities
    .filter(activity => 
      !activity.status.includes('completed') && 
      !activity.status.includes('cancelled') &&
      isAfter(new Date(activity.startDate), today) && 
      isBefore(new Date(activity.startDate), nextWeekStart)
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
  
  const todayActivities = activities
    .filter(activity => 
      !activity.status.includes('completed') && 
      !activity.status.includes('cancelled') &&
      isToday(new Date(activity.startDate))
    )
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, limit);
  
  const handleViewActivity = (activityId: string) => {
    navigate(`/smart-pei/activities/${activityId}`);
  };
  
  const handleViewAllActivities = () => {
    navigate('/smart-pei/activities');
  };
  
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }
    return format(date, "dd/MM 'às' HH:mm");
  };
  
  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximas Atividades</CardTitle>
          <CardDescription>Atividades programadas para os próximos dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Atividades</CardTitle>
        <CardDescription>Atividades programadas para os próximos dias</CardDescription>
      </CardHeader>
      <CardContent>
        {todayActivities.length === 0 && upcomingActivities.length === 0 ? (
          <div className="text-center p-4">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Não há atividades programadas para os próximos dias.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayActivities.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Hoje
                </h3>
                <div className="space-y-2">
                  {todayActivities.map(activity => (
                    <div 
                      key={activity.id} 
                      className={cn(
                        "p-2 rounded-md border-l-4 cursor-pointer hover:bg-accent/50",
                        `border-l-${getPriorityColor(activity.priority).replace('bg-', '')}`
                      )}
                      onClick={() => handleViewActivity(activity.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{activity.title}</span>
                        <Badge 
                          variant="outline"
                          className={activity.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-gray-50'}
                        >
                          {format(new Date(activity.startDate), 'HH:mm')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {upcomingActivities.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1 mt-3">
                  <Calendar className="h-4 w-4" /> Próximos dias
                </h3>
                <div className="space-y-2">
                  {upcomingActivities.map(activity => (
                    <div 
                      key={activity.id} 
                      className="p-2 rounded-md border-l-4 cursor-pointer hover:bg-accent/50"
                      style={{ borderLeftColor: getPriorityColor(activity.priority).replace('bg-', '') }}
                      onClick={() => handleViewActivity(activity.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{activity.title}</span>
                        <Badge variant="outline" className="bg-gray-50">
                          {format(new Date(activity.startDate), "dd/MM", { locale: ptBR })}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(new Date(activity.startDate))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={handleViewAllActivities}>
                Ver todas
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingActivities;
