
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const SmartPEILandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const features = [
    {
      title: "Planos de Ensino Individualizados",
      description: "Crie e gerencie PEIs completos com objetivos específicos, estratégias e monitoramento de progresso.",
      icon: "clipboard-list"
    },
    {
      title: "Avaliações Multidisciplinares",
      description: "Acesse instrumentos de avaliação padronizados para diferentes áreas do desenvolvimento.",
      icon: "check-square"
    },
    {
      title: "Relatórios Personalizados",
      description: "Gere relatórios detalhados para equipes, famílias e instituições com visualizações claras.",
      icon: "file-text"
    },
    {
      title: "Análise de Desenvolvimento",
      description: "Acompanhe o progresso dos alunos com gráficos e indicadores visuais de evolução.",
      icon: "trending-up"
    },
    {
      title: "Trabalho em Equipe",
      description: "Colabore com outros profissionais da equipe multidisciplinar em tempo real.",
      icon: "users"
    },
    {
      title: "Assistente com IA",
      description: "Receba sugestões e recomendações personalizadas baseadas em dados de cada aluno.",
      icon: "zap"
    }
  ];

  const pricingPlans = [
    {
      name: "Individual",
      price: "R$ 49,90",
      period: "por mês",
      description: "Ideal para profissionais autônomos",
      features: [
        "Até 20 alunos",
        "Avaliações básicas",
        "Relatórios simples",
        "Suporte por email"
      ],
      highlighted: false,
      ctaText: "Começar Grátis",
      badge: "14 dias grátis"
    },
    {
      name: "Profissional",
      price: "R$ 129,90",
      period: "por mês",
      description: "Perfeito para clínicas e pequenas equipes",
      features: [
        "Até 100 alunos",
        "Todas as avaliações",
        "Relatórios avançados",
        "Módulo de colaboração",
        "Suporte prioritário"
      ],
      highlighted: true,
      ctaText: "Assinar Agora",
      badge: "Mais Popular"
    },
    {
      name: "Institucional",
      price: "R$ 349,90",
      period: "por mês",
      description: "Para escolas e instituições de ensino",
      features: [
        "Alunos ilimitados",
        "Todas as funcionalidades",
        "Dashboard administrativo",
        "API de integração",
        "Suporte premium 24/7"
      ],
      highlighted: false,
      ctaText: "Falar com Consultor",
      badge: null
    }
  ];
  
  const handleGetStarted = () => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('smartPeiLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/smart-pei/app/dashboard');
    } else {
      navigate('/auth?redirect=smart-pei');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Smart PEI - Plataforma de Educação Inclusiva</title>
        <meta 
          name="description" 
          content="Plataforma completa para criar e gerenciar Planos de Educação Individualizada (PEI)" 
        />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-teal-50/60 to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                Educação Inclusiva
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Revolucione a Educação Inclusiva
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                O Smart PEI é a plataforma que transforma a maneira como educadores e profissionais da educação especial planejam, 
                implementam e monitoram intervenções educacionais para alunos com necessidades específicas.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700" onClick={handleGetStarted}>
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  Agendar Demonstração
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video md:aspect-square relative max-w-md mx-auto">
                <img 
                  src="/images/hero/familia-caminhando.png" 
                  alt="Educare+ Smart PEI Preview" 
                  className="object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Experiência comprovada</p>
                      <p className="text-lg font-semibold">+5.000 PEIs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recursos Poderosos para Educação Inclusiva</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas para criar, implementar e monitorar planos de ensino individualizados com eficiência.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Escolha o Plano Ideal para Você</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temos opções para profissionais autônomos, pequenas equipes e instituições de ensino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.highlighted ? 'border-emerald-500 shadow-lg' : 'border-gray-200'}`}
              >
                {plan.badge && (
                  <span className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3 px-3 py-1 rounded-full text-xs font-medium ${
                    plan.highlighted ? 'bg-emerald-500 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {plan.badge}
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-white text-emerald-600 border border-emerald-600 hover:bg-emerald-50'
                    }`}
                    onClick={handleGetStarted}
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="flex items-center justify-center text-sm">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>Precisa de um plano personalizado? <a href="/contact" className="text-emerald-600 hover:underline">Entre em contato</a></span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que os educadores estão dizendo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profissionais da educação inclusiva transformando o atendimento com o Smart PEI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "O Smart PEI transformou completamente nossa abordagem para educação inclusiva. A facilidade de criar, acompanhar e ajustar os PEIs nos permite ser muito mais eficientes.",
                author: "Maria Silva",
                title: "Coordenadora Pedagógica",
                school: "Escola Modelo Inclusiva"
              },
              {
                quote: "Como psicóloga educacional, o Smart PEI me ajuda a integrar avaliações e intervenções de forma coesa. A visualização do progresso tornou meu trabalho muito mais eficaz.",
                author: "Dr. Carlos Mendes",
                title: "Psicólogo Educacional",
                school: "Instituto de Desenvolvimento Infantil"
              },
              {
                quote: "A possibilidade de gerar relatórios personalizados facilita enormemente a comunicação com as famílias. Consigo mostrar o progresso com gráficos claros.",
                author: "Patrícia Oliveira",
                title: "Professora de Educação Especial",
                school: "Centro Educacional Novos Caminhos"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={testimonial.author}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua abordagem educacional?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Experimente o Smart PEI hoje e descubra como nossa plataforma pode otimizar seu trabalho com educação inclusiva.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700" onClick={handleGetStarted}>
              Começar período de avaliação gratuito
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Agendar demonstração
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Sem necessidade de cartão de crédito. 14 dias de teste gratuito.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SmartPEILandingPage;
