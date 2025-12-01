
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Filter, Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ActivitiesTabProps {
  childId: string;
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ childId }) => {
  // This would be API data in a real app
  const activities = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Atividades</h2>
        
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atividades..."
              className="pl-9 w-full sm:w-[240px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* This would map through the activities */}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary/60" />
            <h3 className="text-lg font-medium mb-2">Nenhuma atividade disponível</h3>
            <p className="text-muted-foreground mb-6">
              As atividades serão recomendadas após a realização da primeira avaliação.
            </p>
            <Button>
              Explorar Biblioteca de Atividades
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorias de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-blue-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Desenvolvimento Motor</div>
                <div className="text-xs text-muted-foreground">Coordenação e movimento</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-green-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-green-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Desenvolvimento Linguístico</div>
                <div className="text-xs text-muted-foreground">Comunicação e fala</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-purple-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-purple-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Desenvolvimento Cognitivo</div>
                <div className="text-xs text-muted-foreground">Pensamento e aprendizado</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-amber-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-amber-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Desenvolvimento Social</div>
                <div className="text-xs text-muted-foreground">Interação e comportamento</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-red-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-red-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Desenvolvimento Emocional</div>
                <div className="text-xs text-muted-foreground">Sentimentos e autocontrole</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <Book className="h-5 w-5 text-indigo-700" />
              </div>
              <div className="text-left">
                <div className="font-medium">Brincadeiras Sensoriais</div>
                <div className="text-xs text-muted-foreground">Experiências sensoriais</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesTab;
