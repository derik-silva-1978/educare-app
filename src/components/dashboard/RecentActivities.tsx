
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Lightbulb, BookOpen } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      title: "Avaliação de Desenvolvimento Concluída",
      description: "Quiz de desenvolvimento motor foi respondido",
      time: "Há 2 horas",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Novo Projeto de Robótica Disponível",
      description: "Aprenda a construir um robô seguidor de linha",
      time: "Há 1 dia",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      title: "PEI Atualizado",
      description: "Novas estratégias adicionadas ao plano educacional",
      time: "Há 3 dias",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded bg-educare-50 flex items-center justify-center text-educare-600">
                  {activity.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
