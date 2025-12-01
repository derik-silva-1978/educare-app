
import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Share2, Zap, ChevronRight, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EducareTechLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Educare+ Tech: Soluções Tecnológicas para Educação Inclusiva
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Ferramentas digitais inovadoras para potencializar o aprendizado de todos os estudantes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/educare-tech/solutions">Ver Soluções</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Agendar Demonstração</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossas Tecnologias</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Boxes className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Plataformas Adaptativas</h3>
              <p className="text-gray-600">
                Sistemas que se ajustam automaticamente às necessidades individuais de cada estudante.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Puzzle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recursos Acessíveis</h3>
              <p className="text-gray-600">
                Materiais didáticos digitais projetados para diversos estilos de aprendizagem e necessidades.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sistemas Colaborativos</h3>
              <p className="text-gray-600">
                Ferramentas que promovem a interação e o trabalho em equipe entre estudantes com diferentes habilidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Soluções Em Destaque</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-purple-100"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Solução Tech {i}</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Uma plataforma completa para adaptar conteúdos educacionais às diversas necessidades de aprendizagem.
                  </p>
                  <Link to={`/educare-tech/solution/${i}`} className="text-primary flex items-center text-sm font-medium">
                    Conhecer solução <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/educare-tech/solutions">Ver Todas as Soluções</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Casos de Sucesso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-gray-200 h-48 md:h-auto rounded-lg"></div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Escola Municipal {i}</h3>
                  <p className="text-gray-600 mb-4">
                    "Com a implementação da plataforma Educare+ Tech, conseguimos aumentar em 40% o engajamento dos estudantes com necessidades especiais e melhorar seus resultados acadêmicos."
                  </p>
                  <Link to={`/case-studies/${i}`} className="text-primary flex items-center text-sm font-medium">
                    Ler caso completo <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-purple-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios das Nossas Tecnologias</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="h-6 w-6" />, title: "Engajamento", text: "Aumente a participação de todos os estudantes nas atividades escolares" },
              { icon: <Boxes className="h-6 w-6" />, title: "Personalização", text: "Ofereça experiências educacionais adaptadas às necessidades individuais" },
              { icon: <Share2 className="h-6 w-6" />, title: "Inclusão", text: "Crie um ambiente onde todos podem participar e aprender juntos" },
              { icon: <Puzzle className="h-6 w-6" />, title: "Monitoramento", text: "Acompanhe o progresso de cada estudante com métricas detalhadas" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">
                  {item.text}
                </p>
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
              Transforme sua instituição com tecnologia inclusiva
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Agende uma demonstração gratuita e descubra como nossas soluções podem atender às necessidades da sua escola.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Agendar Demonstração</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducareTechLandingPage;
