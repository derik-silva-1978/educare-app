
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Check, Smartphone, Activity, Bell, Heart, Baby, Award, Users, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EducareMenuBar from '@/components/educare-app/EducareMenuBar';
import HeroSection from '@/components/educare-app/landing/HeroSection';
import PlatformAreasSection from '@/components/educare-app/landing/PlatformAreasSection';
import FinalCTASection from '@/components/educare-app/landing/FinalCTASection';
import { WhatsAppLandingPopup } from '@/components/whatsapp';

const EducareAppLanding: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userTypes = [
    {
      title: 'Para Pais',
      description: 'Acompanhe o desenvolvimento do seu filho com ferramentas simples e intuitivas.',
      icon: <Heart className="w-6 h-6" />,
      benefits: ['Avaliações fáceis de usar', 'Relatórios compreensíveis', 'Atividades personalizadas', 'Suporte especializado']
    },
    {
      title: 'Para Educadores',
      description: 'Recursos profissionais para apoiar o desenvolvimento infantil em sala de aula.',
      icon: <Users className="w-6 h-6" />,
      benefits: ['Avaliações padronizadas', 'Relatórios detalhados', 'Planos de atividades', 'Formação continuada']
    },
    {
      title: 'Para Profissionais',
      description: 'Ferramentas especializadas para psicólogos, terapeutas e outros profissionais.',
      icon: <Brain className="w-6 h-6" />,
      benefits: ['Análises aprofundadas', 'Laudos profissionais', 'Colaboração em equipe', 'Evidências científicas']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Educare+ | Plataforma Completa para Desenvolvimento Infantil</title>
        <meta 
          name="description" 
          content="A plataforma completa que integra avaliação, acompanhamento e recursos para o desenvolvimento infantil. Conecte pais, educadores e profissionais em uma única solução." 
        />
        <meta property="og:title" content="Educare+ | Plataforma Completa para Desenvolvimento Infantil" />
        <meta property="og:description" content="A plataforma completa que integra avaliação, acompanhamento e recursos para o desenvolvimento infantil." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://educare.tech/educare-app" />
      </Helmet>
      
      <EducareMenuBar />
      <HeroSection />
      <PlatformAreasSection />

      {/* User Types Section */}
      <section className="py-20 bg-secondary/50 dark:bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Para Cada Necessidade</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Soluções personalizadas para diferentes perfis de usuário
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div 
                key={index}
                className="bg-card p-8 rounded-2xl shadow-sm border border-border"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{type.title}</h3>
                <p className="text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Funcionalidades Principais</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnologia avançada para apoiar cada etapa do desenvolvimento infantil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Baby className="w-6 h-6" />,
                title: "TitiNauta Bot",
                description: "Avaliação inteligente do desenvolvimento infantil através de conversas interativas com IA."
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Relatórios Detalhados",
                description: "Análises profundas do progresso com gráficos e insights personalizados."
              },
              {
                icon: <Activity className="w-6 h-6" />,
                title: "Atividades Personalizadas",
                description: "Sugestões de atividades adaptadas para cada criança e área de desenvolvimento."
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Lembretes Inteligentes",
                description: "Notificações sobre marcos importantes e consultas programadas."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Colaboração Profissional",
                description: "Conecte pais, educadores e terapeutas em uma única plataforma."
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Acesso Multiplataforma",
                description: "Disponível em qualquer dispositivo, a qualquer hora e lugar."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-secondary/50 dark:bg-secondary/20 p-6 rounded-xl border border-border"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Comece Gratuitamente</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acesse todas as funcionalidades básicas sem custo. Upgrade quando precisar de mais recursos.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Plan */}
            <motion.div 
              className="bg-card p-6 rounded-2xl shadow-sm border border-border"
              whileHover={{ y: -5 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Gratuito</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Grátis</p>
                <p className="text-muted-foreground text-sm">30 dias</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 perfil de criança</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jornada TitiNauta com Assistente IA (Web e WhatsApp)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso ao Blog</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Avaliações básicas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Suporte via chat</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/educare-app/auth?action=register">Começar Agora</Link>
              </Button>
            </motion.div>

            {/* Basic Plan */}
            <motion.div 
              className="bg-card p-6 rounded-2xl shadow-sm border border-border"
              whileHover={{ y: -5 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Básico</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 19,90</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">R$ 199,90/ano - Economize 17%</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 perfil de criança</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jornada TitiNauta com Assistente IA (somente na web)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Relatórios Básicos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso à Educare+ Academy</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso ao Blog</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Notificações de progresso</span>
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link to="/educare-app/auth?action=register">Assinar Básico</Link>
              </Button>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white relative"
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                Mais Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Plano Premium</h3>
                <p className="text-2xl font-bold">R$ 29,00</p>
                <p className="text-blue-100 text-sm">por mês</p>
                <p className="text-xs text-yellow-400 font-medium mt-1">R$ 299,00/ano - Economize 17%</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 perfil de criança</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jornada TitiNauta com Assistente IA (Web e WhatsApp)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Relatórios Detalhados e Compartilhamento com Profissionais</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso à Educare+ Academy</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Grupos de Pais e Mães com apoio exclusivo</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Lives e Mentorias Coletivas</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-50" asChild>
                <Link to="/educare-app/auth?action=register">Assinar Premium</Link>
              </Button>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div 
              className="bg-card p-6 rounded-2xl shadow-sm border border-border"
              whileHover={{ y: -5 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Empresarial</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 199,00</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">R$ 1.999,00/ano - Economize 17%</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Cadastrar até 05 Crianças</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jornada TitiNauta com Assistente IA (Web e WhatsApp)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Painel de Acompanhamento da Jornada do Desenvolvimento</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Geração de Relatórios auxiliados pelos assistentes virtuais</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso Completo ao Educare Academy</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Mentorias coletivas Mensais</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link to="/contact">Entrar em Contato</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FinalCTASection />
      <WhatsAppLandingPopup />
    </div>
  );
};

export default EducareAppLanding;
