
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Star } from 'lucide-react';

const ActivitiesPage: React.FC = () => {
  // Placeholder activities data
  const activities = [
    {
      id: 1,
      title: 'Leitura com a criança',
      description: 'Atividade de leitura para desenvolvimento da linguagem',
      duration: '15-30 min',
      ageRange: '2-5 anos',
      difficulty: 'Fácil'
    },
    {
      id: 2,
      title: 'Jogos de coordenação motora',
      description: 'Exercícios para desenvolver coordenação e equilíbrio',
      duration: '20-40 min',
      ageRange: '3-6 anos',
      difficulty: 'Médio'
    },
    {
      id: 3,
      title: 'Atividades sensoriais',
      description: 'Exploração de texturas e materiais diversos',
      duration: '10-25 min',
      ageRange: '1-4 anos',
      difficulty: 'Fácil'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Atividades | Educare</title>
      </Helmet>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Atividades</h1>
          <p className="text-gray-600 mt-2">
            Atividades e exercícios para estimular o desenvolvimento infantil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {activity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Duração: {activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Idade: {activity.ageRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>Dificuldade: {activity.difficulty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Mais atividades em breve!
              </h3>
              <p className="text-blue-600">
                Estamos preparando mais conteúdo personalizado para o desenvolvimento da sua criança.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ActivitiesPage;
