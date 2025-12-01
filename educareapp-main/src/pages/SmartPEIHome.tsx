
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Book, PenLine, GraduationCap, Users } from 'lucide-react';

const SmartPEIHome: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Smart PEI - Sistema Inteligente de Planos de Ensino Individualizado</title>
        <meta name="description" content="Crie e gerencie planos de ensino individualizados de forma inteligente com o Smart PEI." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-sky-800 to-sky-600 text-white">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Smart PEI
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Sistema Inteligente para Planos de Ensino Individualizados
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-white text-sky-800 hover:bg-sky-100"
                  >
                    <Link to="/auth?action=login&app=smart-pei">Entrar</Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    <Link to="/auth?action=register&app=smart-pei">Criar Conta</Link>
                  </Button>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.img 
                  src="/images/smart-pei-dashboard.png" 
                  alt="Smart PEI Dashboard" 
                  className="rounded-lg shadow-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades Principais</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <PenLine className="h-8 w-8 text-sky-600" />,
                  title: "Avaliações Personalizadas",
                  description: "Crie avaliações personalizadas baseadas em habilidades e competências específicas."
                },
                {
                  icon: <Book className="h-8 w-8 text-sky-600" />,
                  title: "Planos de Ensino",
                  description: "Desenvolva planos de ensino individualizados com objetivos e estratégias específicas."
                },
                {
                  icon: <CheckCircle2 className="h-8 w-8 text-sky-600" />,
                  title: "Acompanhamento de Progresso",
                  description: "Monitore o progresso dos estudantes com visualizações claras e intuitivas."
                },
                {
                  icon: <Users className="h-8 w-8 text-sky-600" />,
                  title: "Colaboração em Equipe",
                  description: "Trabalhe em conjunto com outros profissionais e familiares no desenvolvimento do estudante."
                },
                {
                  icon: <GraduationCap className="h-8 w-8 text-sky-600" />,
                  title: "Relatórios Detalhados",
                  description: "Gere relatórios detalhados sobre o desenvolvimento e aprendizado do aluno."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a usar o Smart PEI hoje</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Transforme a maneira como você cria e gerencia planos de ensino individualizados com nossa plataforma intuitiva.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Link to="/auth?action=register&app=smart-pei">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default SmartPEIHome;
