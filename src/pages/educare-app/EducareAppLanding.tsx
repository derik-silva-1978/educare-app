import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Check, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import EducareMenuBar from '@/components/educare-app/EducareMenuBar';
import LandingHeroSection from '@/components/educare-app/landing/LandingHeroSection';
import LandingProblemSection from '@/components/educare-app/landing/LandingProblemSection';
import LandingHowItWorks from '@/components/educare-app/landing/LandingHowItWorks';
import LandingAboutSection from '@/components/educare-app/landing/LandingAboutSection';
import LandingFAQSection from '@/components/educare-app/landing/LandingFAQSection';
import LandingFooter from '@/components/educare-app/landing/LandingFooter';
import { WhatsAppLandingPopup } from '@/components/whatsapp';

const EducareAppLanding: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Educare+ | Plataforma Inteligente para Desenvolvimento Infantil</title>
        <meta
          name="description"
          content="Acompanhe o desenvolvimento do seu filho com IA baseada em protocolos da OMS e SBP. Avaliações, orientações personalizadas e suporte especializado via WhatsApp."
        />
        <meta property="og:title" content="Educare+ | IA para Desenvolvimento Infantil" />
        <meta property="og:description" content="Plataforma que une tecnologia e ciência para acompanhar o desenvolvimento do seu filho com segurança e carinho." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://educareapp.com.br" />
        <meta property="og:locale" content="pt_BR" />
      </Helmet>

      <EducareMenuBar />
      <LandingHeroSection />
      <LandingProblemSection />
      <LandingHowItWorks />

      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50/50 to-green-50/30 dark:from-blue-950/50 dark:via-purple-950/30 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full mb-4">
                Planos Acessíveis
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Comece Gratuitamente
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acesse todas as funcionalidades básicas sem custo. Upgrade quando precisar de mais recursos.
              </p>
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Gratuito</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Grátis</p>
                <p className="text-muted-foreground text-sm">30 dias</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                {['1 perfil de criança', 'Jornada TitiNauta com Assistente IA (Web e WhatsApp)', 'Acesso ao Blog', 'Avaliações básicas', 'Suporte via chat'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/educare-app/auth?action=register">Começar Agora</Link>
              </Button>
            </motion.div>

            <motion.div
              className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Básico</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 19,90</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">R$ 199,90/ano - Economize 17%</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                {['1 perfil de criança', 'Jornada TitiNauta com Assistente IA (somente na web)', 'Relatórios Básicos', 'Acesso à Educare+ Academy', 'Acesso ao Blog', 'Notificações de progresso'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link to="/educare-app/auth?action=register">Assinar Básico</Link>
              </Button>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white relative hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                {['1 perfil de criança', 'Jornada TitiNauta com Assistente IA (Web e WhatsApp)', 'Relatórios Detalhados e Compartilhamento com Profissionais', 'Acesso à Educare+ Academy', 'Grupos de Pais e Mães com apoio exclusivo', 'Lives e Mentorias Coletivas'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-50" asChild>
                <Link to="/educare-app/auth?action=register">Assinar Premium</Link>
              </Button>
            </motion.div>

            <motion.div
              className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">Plano Empresarial</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">R$ 199,00</p>
                <p className="text-muted-foreground text-sm">por mês</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">R$ 1.999,00/ano - Economize 17%</p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-foreground">
                {['Cadastrar até 05 Crianças', 'Jornada TitiNauta com Assistente IA (Web e WhatsApp)', 'Painel de Acompanhamento da Jornada do Desenvolvimento', 'Geração de Relatórios auxiliados pelos assistentes virtuais', 'Acesso Completo ao Educare Academy', 'Mentorias coletivas Mensais', 'Suporte prioritário'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link to="/contact">Entrar em Contato</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <LandingAboutSection />
      <LandingFAQSection />
      <LandingFooter />
      <WhatsAppLandingPopup />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducareAppLanding;
