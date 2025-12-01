
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Award, Play, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AprendizadoLanding: React.FC = () => {
  const navigate = useNavigate();

  const featuredCourses = [
    {
      id: '1',
      title: 'Desenvolvimento Infantil: 0-2 Anos',
      description: 'Compreenda os marcos fundamentais do desenvolvimento.',
      instructor: 'Dra. Maria Santos',
      rating: 4.8,
      students: 1234,
      duration: '8 horas',
      price: 'R$ 199,00'
    },
    {
      id: '2',
      title: 'Tecnologia na Educação Infantil',
      description: 'Ferramentas digitais seguras e educativas.',
      instructor: 'Prof. João Silva',
      rating: 4.6,
      students: 856,
      duration: '6 horas',
      price: 'R$ 149,00'
    },
    {
      id: '3',
      title: 'Arte e Criatividade na Primeira Infância',
      description: 'Atividades artísticas estimulantes para crianças.',
      instructor: 'Ana Carolina',
      rating: 4.9,
      students: 2156,
      duration: '5 horas',
      price: 'R$ 129,00'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Educare+
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <h1 className="text-xl font-bold text-blue-600">Aprendizado</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/educare-app/aprendizado/dashboard')}
                className="text-gray-600 hover:text-blue-600"
              >
                Meu Dashboard
              </Button>
              <Button
                onClick={() => navigate('/educare-app/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plataforma de 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Aprendizado</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Desenvolva suas competências em educação infantil com cursos especializados, 
            ministrados por especialistas renomados na área.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => navigate('/educare-app/aprendizado/courses')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explorar Cursos
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/educare-app/aprendizado/dashboard')}
              className="px-8 py-4"
            >
              <Play className="h-5 w-5 mr-2" />
              Continuar Aprendendo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cursos Especializados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Alunos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça nossos cursos mais populares e bem avaliados por profissionais da educação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card 
                key={course.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/educare-app/aprendizado/courses/${course.id}`)}
              >
                <CardHeader className="p-0">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white opacity-50" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    Por {course.instructor}
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
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

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{course.price}</span>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline"
              onClick={() => navigate('/educare-app/aprendizado/courses')}
              className="px-8 py-3"
            >
              Ver Todos os Cursos
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorias de Cursos</h2>
            <p className="text-gray-600">Encontre cursos especializados em diferentes áreas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Desenvolvimento Infantil', count: 12, color: 'from-red-500 to-pink-500' },
              { name: 'Tecnologia Educacional', count: 8, color: 'from-blue-500 to-cyan-500' },
              { name: 'Arte & Criatividade', count: 15, color: 'from-purple-500 to-indigo-500' },
              { name: 'Psicologia Infantil', count: 10, color: 'from-yellow-500 to-orange-500' },
              { name: 'Educação Familiar', count: 7, color: 'from-green-500 to-teal-500' },
              { name: 'Educação Especial', count: 9, color: 'from-gray-500 to-slate-500' },
            ].map((category, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(`/educare-app/aprendizado/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} cursos disponíveis</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua carreira?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já estão desenvolvendo suas competências 
            com nossos cursos especializados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/educare-app/aprendizado/courses')}
              className="px-8 py-4"
            >
              Começar Agora
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/educare-app/auth')}
              className="px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AprendizadoLanding;
