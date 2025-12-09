import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  imageUrl: string;
  category: string;
}

const mockTrainings: Training[] = [
  {
    id: '1',
    title: 'Introdução ao Desenvolvimento Infantil',
    description: 'Aprenda os fundamentos do desenvolvimento nas primeiras idades.',
    duration: '1h 30min',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
    category: 'Básico',
  },
  {
    id: '2',
    title: 'Técnicas Práticas de Estimulação',
    description: 'Domine técnicas comprovadas para estimular o desenvolvimento cognitivo.',
    duration: '2h 15min',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop',
    category: 'Prático',
  },
  {
    id: '3',
    title: 'Comunicação com a Criança',
    description: 'Estratégias eficazes para melhorar a comunicação com seu filho.',
    duration: '1h 45min',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
    category: 'Comunicação',
  },
];

const TrainingSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Treinamentos e Capacitação
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/learning')}
          >
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockTrainings.map((training) => (
            <div
              key={training.id}
              className="group cursor-pointer rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={training.imageUrl}
                  alt={training.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4 space-y-2">
                <Badge variant="outline" className="text-xs">
                  {training.category}
                </Badge>
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {training.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {training.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                  <Clock className="h-3 w-3" />
                  {training.duration}
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                >
                  Saiba mais <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingSection;
