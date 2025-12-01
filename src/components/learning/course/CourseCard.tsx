
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    rating: number;
    students: number;
    duration: string;
    category: string;
    level: string;
    price: string;
    image?: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/educare-app/aprendizado/courses/${course.id}`)}
    >
      <CardHeader className="p-0">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          <div className="text-white text-6xl opacity-50">📚</div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {course.category}
            </Badge>
            <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
            <p className="text-gray-600 text-sm mt-2">{course.description}</p>
          </div>

          <div className="text-sm text-gray-500">
            Por {course.instructor}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-400 mr-1" />
                <span>{course.students}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-lg font-bold text-blue-600">{course.price}</span>
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/educare-app/aprendizado/enrollment/${course.id}`);
              }}
            >
              Inscrever-se
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
