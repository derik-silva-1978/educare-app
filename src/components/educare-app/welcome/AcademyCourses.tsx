import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, ArrowRight, Loader2, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getCourseContent, ContentItem } from '@/services/contentService';

const getLevelColor = (level?: string) => {
  switch (level) {
    case 'iniciante':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'intermediário':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'avançado':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const AcademyCourses: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['welcome-courses'],
    queryFn: getCourseContent,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card className="relative">
      <div className="absolute top-3 right-3 z-10">
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 flex items-center gap-1.5">
          <Construction className="h-3 w-3" />
          Em Desenvolvimento
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Academia Educare+
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/academia')}
            className="mr-28"
          >
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum curso disponível</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((item: ContentItem) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/educare-app/academia/course/${item.id}`)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.level && (
                      <Badge variant="secondary" className={getLevelColor(item.level)}>
                        {item.level}
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.summary || item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    {item.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademyCourses;
