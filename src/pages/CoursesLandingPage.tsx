
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CoursesLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Cursos de Capacitação em Educação Inclusiva
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Aprimore seus conhecimentos e habilidades para criar ambientes educacionais verdadeiramente inclusivos
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/courses/catalog">Ver Cursos Disponíveis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Fale com um Consultor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossos cursos?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Conteúdo de Qualidade</h3>
              <p className="text-gray-600">
                Desenvolvido por especialistas com vasta experiência em educação inclusiva e necessidades especiais.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidade Ativa</h3>
              <p className="text-gray-600">
                Conecte-se com outros educadores, compartilhe experiências e aprenda com casos reais.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Certificação Reconhecida</h3>
              <p className="text-gray-600">
                Obtenha certificados valorizados por instituições educacionais em todo o país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Cursos Em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-primary/20"></div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">40 horas</span>
                    <div className="ml-auto flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fundamentos da Educação Inclusiva {i}</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Um curso completo sobre os princípios e práticas da educação inclusiva moderna.
                  </p>
                  <Link to={`/courses/details/${i}`} className="text-primary flex items-center text-sm font-medium">
                    Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/courses/catalog">Ver Todos os Cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Dizem Nossos Alunos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Nome do Aluno {i}</h4>
                    <p className="text-sm text-gray-500">Professor de Ensino Fundamental</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Os cursos da Educare+ transformaram minha abordagem em sala de aula. Agora me sinto muito mais preparado para atender às necessidades de todos os meus alunos."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para transformar sua prática pedagógica?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Inscreva-se agora e comece sua jornada para se tornar um educador inclusivo de excelência.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/courses/catalog">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesLandingPage;
