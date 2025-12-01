
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Play, Download, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Mock course data - in real app, fetch based on courseId
  const course = {
    id: courseId,
    title: 'Desenvolvimento Infantil: 0-2 Anos',
    description: 'Um curso completo sobre os marcos fundamentais do desenvolvimento nos primeiros anos de vida. Aprenda a identificar, acompanhar e estimular o desenvolvimento saudável das crianças.',
    instructor: 'Dra. Maria Santos',
    rating: 4.8,
    students: 1234,
    duration: '8 horas',
    lessons: 24,
    category: 'Desenvolvimento Infantil',
    level: 'Iniciante',
    price: 'R$ 199,00',
    features: [
      'Acesso vitalício ao conteúdo',
      'Certificado de conclusão',
      '24 vídeo-aulas',
      'Material complementar para download',
      'Suporte do instrutor',
      'Acesso via mobile e desktop'
    ],
    curriculum: [
      {
        module: 'Módulo 1: Fundamentos do Desenvolvimento',
        lessons: [
          'Introdução ao desenvolvimento infantil',
          'Fatores que influenciam o desenvolvimento',
          'Teorias do desenvolvimento'
        ]
      },
      {
        module: 'Módulo 2: Desenvolvimento Motor',
        lessons: [
          'Marcos motores 0-6 meses',
          'Marcos motores 6-12 meses',
          'Marcos motores 12-24 meses'
        ]
      },
      {
        module: 'Módulo 3: Desenvolvimento Cognitivo',
        lessons: [
          'Desenvolvimento da linguagem',
          'Desenvolvimento social',
          'Sinais de alerta'
        ]
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge variant="secondary" className="mb-4">{course.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-gray-500 ml-1">({course.students} alunos)</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Play className="h-4 w-4 text-gray-400 mr-1" />
              <span>{course.lessons} aulas</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Instrutor: <span className="font-medium text-gray-900">{course.instructor}</span>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="text-center">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{course.price}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => navigate(`/educare-app/aprendizado/enrollment/${courseId}`)}
              >
                Inscrever-se Agora
              </Button>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 mb-2">Este curso inclui:</p>
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="curriculum">Conteúdo</TabsTrigger>
          <TabsTrigger value="instructor">Instrutor</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {course.curriculum.map((module, moduleIndex) => (
                  <div key={moduleIndex}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{module.module}</h3>
                    <div className="space-y-2 ml-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center text-gray-600">
                          <Play className="h-4 w-4 mr-2" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructor">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Instrutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  MS
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{course.instructor}</h3>
                  <p className="text-gray-600 mb-4">
                    Doutora em Psicologia do Desenvolvimento com mais de 15 anos de experiência em pesquisa e prática clínica. 
                    Especialista em desenvolvimento infantil e autora de diversos artigos científicos na área.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>🎓 15+ anos de experiência</span>
                    <span>👥 5.234 alunos</span>
                    <span>⭐ 4.9 avaliação</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações dos Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="font-medium">Ana Silva</span>
                    <span className="text-gray-500 text-sm">há 2 dias</span>
                  </div>
                  <p className="text-gray-600">
                    Excelente curso! Muito didático e com informações fundamentais. Recomendo para todos os pais e profissionais da área.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="font-medium">Carlos Santos</span>
                    <span className="text-gray-500 text-sm">há 1 semana</span>
                  </div>
                  <p className="text-gray-600">
                    Conteúdo muito bem estruturado. A professora explica de forma clara e objetiva. Valeu muito a pena!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
