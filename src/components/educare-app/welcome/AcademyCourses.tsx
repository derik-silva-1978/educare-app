import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  progress?: number;
  level: 'iniciante' | 'intermediário' | 'avançado';
  category: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Primeiros Passos no Desenvolvimento Infantil',
    description: 'Entenda as principais fases do desenvolvimento nos primeiros anos de vida.',
    duration: '2h 30min',
    students: 1234,
    progress: 45,
    level: 'iniciante',
    category: 'Desenvolvimento',
  },
  {
    id: '2',
    title: 'Estimulação Cognitiva na Primeira Infância',
    description: 'Aprenda técnicas práticas para estimular o desenvolvimento cognitivo.',
    duration: '3h 15min',
    students: 892,
    level: 'intermediário',
    category: 'Estimulação',
  },
  {
    id: '3',
    title: 'Comunicação e Linguagem: 0-3 anos',
    description: 'Como ajudar seu filho a desenvolver habilidades de comunicação.',
    duration: '1h 45min',
    students: 2156,
    level: 'iniciante',
    category: 'Linguagem',
  },
];

const getLevelColor = (level: Course['level']) => {
  switch (level) {
    case 'iniciante':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'intermediário':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'avançado':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  }
};

const AcademyCourses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Academia Educare+
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
          {mockCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/educare-app/learning/course/${course.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm line-clamp-2">{course.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                
                {course.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademyCourses;
