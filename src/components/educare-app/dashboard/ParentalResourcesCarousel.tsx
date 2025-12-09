import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'artigo' | 'video' | 'curso' | 'atividade';
  duration?: string;
  url?: string;
  isExternal?: boolean;
}

interface ParentalResourcesCarouselProps {
  resources?: Resource[];
}

const defaultResources: Resource[] = [
  {
    id: '1',
    title: 'Como estimular a fala do seu bebê',
    description: 'Técnicas simples para o dia a dia que ajudam no desenvolvimento da linguagem.',
    type: 'artigo',
    duration: '5 min leitura',
    url: '/educare-app/material-apoio',
  },
  {
    id: '2',
    title: 'Brincadeiras para desenvolvimento motor',
    description: 'Atividades práticas para fazer em casa com materiais simples.',
    type: 'atividade',
    duration: '15 min',
    url: '/educare-app/activities',
  },
  {
    id: '3',
    title: 'Primeiros Passos - Curso para Pais',
    description: 'Entenda as principais fases do desenvolvimento infantil.',
    type: 'curso',
    duration: '2h 30min',
    url: '/educare-app/learning',
  },
];

const getTypeIcon = (type: Resource['type']) => {
  switch (type) {
    case 'artigo':
      return <BookOpen className="h-4 w-4" />;
    case 'video':
      return <ExternalLink className="h-4 w-4" />;
    case 'curso':
      return <GraduationCap className="h-4 w-4" />;
    case 'atividade':
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeColor = (type: Resource['type']) => {
  switch (type) {
    case 'artigo':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'video':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    case 'curso':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    case 'atividade':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  }
};

const ParentalResourcesCarousel: React.FC<ParentalResourcesCarouselProps> = ({
  resources = defaultResources,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-green-600" />
            Recursos para Pais
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/material-apoio')}
          >
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => resource.url && navigate(resource.url)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className={getTypeColor(resource.type)}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(resource.type)}
                        {resource.type}
                      </span>
                    </Badge>
                    {resource.duration && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {resource.duration}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentalResourcesCarousel;
