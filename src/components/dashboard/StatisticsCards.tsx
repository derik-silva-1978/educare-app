
import { Card, CardContent } from '@/components/ui/card';
import { Users, Lightbulb, BookOpen } from 'lucide-react';

const StatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600 mr-4">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold">3</div>
              <div className="text-muted-foreground text-sm">perfis disponíveis</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600 mr-4">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold">5</div>
              <div className="text-muted-foreground text-sm">projetos disponíveis</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-educare-100 flex items-center justify-center text-educare-600 mr-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold">2</div>
              <div className="text-muted-foreground text-sm">modelos disponíveis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
