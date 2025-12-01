
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Award, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const enrolledCourses = [
    {
      id: '1',
      title: 'Desenvolvimento Infantil: 0-2 Anos',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: 'Marcos motores 12-24 meses',
      timeSpent: '5h 30min'
    },
    {
      id: '2',
      title: 'Arte e Criatividade na Primeira Infância',
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      nextLesson: 'Atividades com tintas naturais',
      timeSpent: '2h 15min'
    }
  ];

  const achievements = [
    { name: 'Primeiro Curso', description: 'Completou seu primeiro curso', earned: true },
    { name: 'Estudante Dedicado', description: '10 horas de estudo', earned: true },
    { name: 'Especialista', description: 'Completou 3 cursos', earned: false },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-600">Continue sua jornada de aprendizado</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cursos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tempo de Study</p>
                <p className="text-2xl font-bold text-gray-900">7h 45min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificados</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progresso Médio</p>
                <p className="text-2xl font-bold text-gray-900">47%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">
                      {course.completedLessons} de {course.totalLessons} aulas • {course.timeSpent}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/educare-app/aprendizado/courses/${course.id}`)}
                    className="flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continuar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="w-full" />
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  Próxima aula: <span className="font-medium">{course.nextLesson}</span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Award className={`h-6 w-6 ${
                    achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <h3 className="font-medium ml-2">{achievement.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
