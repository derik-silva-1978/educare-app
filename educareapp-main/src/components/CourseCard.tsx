
import React from 'react';
import { Book, ArrowRight, Clock, Award, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  students: number;
  imageUrl?: string;
  category: string;
  badge?: string;
  app: string;
  color: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border/50 overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Book className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className={`absolute top-0 right-0 ${course.color} text-white text-xs font-medium px-3 py-1 m-2 rounded-full`}>
          {course.app}
        </div>
        {course.badge && (
          <div className="absolute top-0 left-0 m-2">
            <Badge variant="secondary" className="font-medium bg-background/80 backdrop-blur-sm">
              {course.badge}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{course.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <CardDescription className="line-clamp-3 mb-4">
          {course.description}
        </CardDescription>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{course.students} alunos</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Button asChild variant="ghost" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5 transition-colors">
          <Link to="/auth?action=course">
            Ver detalhes
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
