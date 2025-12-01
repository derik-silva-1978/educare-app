
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status?: 'completed' | 'pending' | 'overdue' | 'upcoming';
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  const getStatusConfig = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          badge: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'overdue':
        return {
          icon: AlertCircle,
          color: 'bg-red-500',
          badge: 'bg-red-100 text-red-700 border-red-200'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-500',
          badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
      default:
        return {
          icon: Calendar,
          color: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-700 border-blue-200'
        };
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const statusConfig = getStatusConfig(item.status);
        const Icon = item.icon || statusConfig.icon;
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex gap-4 relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
            )}
            
            {/* Timeline icon */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white z-10",
              statusConfig.color
            )}>
              <Icon className="h-4 w-4" />
            </div>
            
            {/* Timeline content */}
            <Card className="flex-1 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.status && (
                        <Badge variant="outline" className={statusConfig.badge}>
                          {item.status === 'completed' ? 'Concluído' :
                           item.status === 'pending' ? 'Pendente' :
                           item.status === 'overdue' ? 'Atrasado' : 'Próximo'}
                        </Badge>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                      {item.type && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
