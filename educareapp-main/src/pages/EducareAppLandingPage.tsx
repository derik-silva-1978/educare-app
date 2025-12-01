
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Check, Smartphone, Activity, Bell, Heart, Baby, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const EducareAppLandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Educare App - Acompanhamento do Desenvolvimento Infantil</title>
        <meta 
          name="description" 
          content="Acompanhe o desenvolvimento infantil através de avaliações interativas e receba sugestões personalizadas" 
        />
      </Helmet>
      
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/60 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                Desenvolvimento Infantil
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Acompanhe cada etapa do crescimento
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                O Educare App é uma plataforma completa que permite acompanhar o desenvolvimento infantil 
                através de avaliações interativas e sugestões personalizadas.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/educare-app/dashboard">
                      Entrar no Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/auth?action=register">
                      Criar Conta Gratuita <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="lg" className="rounded-full" asChild>
                  <Link to="#features">
                    Saiba Mais <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/5] relative max-w-md mx-auto">
                <img 
                  src="/images/educare-app-preview.png" 
                  alt="Educare App Preview" 
                  className="object-cover rounded-3xl shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x800/91D8F7/ffffff?text=Educare+App';
                  }}
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Progresso diário</p>
                      <p className="text-lg font-semibold">+28%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para acompanhar o desenvolvimento infantil em um único aplicativo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfil da Criança</h3>
              <p className="text-muted-foreground">
                Cadastre perfis para cada criança e acompanhe seu desenvolvimento específico por idade.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avaliações Interativas</h3>
              <p className="text-muted-foreground">
                Avalie o desenvolvimento através de questionários interativos adaptados à idade da criança.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atividades Personalizadas</h3>
              <p className="text-muted-foreground">
                Receba recomendações de atividades adaptadas para estimular cada etapa do desenvolvimento.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lembretes Importantes</h3>
              <p className="text-muted-foreground">
                Receba notificações sobre marcos importantes e consultas médicas programadas.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard de Progresso</h3>
              <p className="text-muted-foreground">
                Visualize o progresso da criança em diferentes áreas do desenvolvimento através de gráficos intuitivos.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acesso Multiplataforma</h3>
              <p className="text-muted-foreground">
                Acesse o Educare App de qualquer dispositivo através do navegador ou aplicativo móvel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section id="how-it-works" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um processo simples para acompanhar o desenvolvimento infantil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Crie um Perfil</h3>
              <p className="text-muted-foreground">
                Cadastre-se gratuitamente e adicione um perfil para cada criança com informações básicas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Faça Avaliações</h3>
              <p className="text-muted-foreground">
                Complete avaliações interativas adaptadas à idade da criança para medir seu desenvolvimento.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe Progresso</h3>
              <p className="text-muted-foreground">
                Receba atividades personalizadas e acompanhe o progresso da criança ao longo do tempo.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planos Disponíveis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua família ou instituição
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Plano Básico</h3>
                <p className="text-gray-500 text-sm">Para famílias</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">Gratuito</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>1 perfil de criança</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Avaliações básicas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Recomendações de atividades</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/auth?action=register">Começar Agora</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 relative"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Plano Família</h3>
                <p className="text-gray-500 text-sm">Para famílias com múltiplas crianças</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">R$19,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Até 5 perfis de crianças</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Avaliações avançadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Atividades personalizadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/auth?action=register">Assinar Agora</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Plano Instituição</h3>
                <p className="text-gray-500 text-sm">Para escolas e clínicas</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">R$99,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Perfis ilimitados</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Todas as avaliações</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Atividades personalizadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Integração com sistemas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Suporte dedicado</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/contact">Entrar em Contato</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Crie uma conta gratuita hoje e comece a acompanhar o desenvolvimento infantil de forma fácil e divertida.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/educare-app/dashboard">
                  Acessar Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth?action=register">
                  Criar Conta Gratuita <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/contact">
                Fale Conosco
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducareAppLandingPage;
