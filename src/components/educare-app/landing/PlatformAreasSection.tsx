
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Activity, BookOpen, ShoppingBag, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const PlatformAreasSection: React.FC = () => {
  const { user } = useAuth();

  const platformAreas = [
    {
      title: 'Meu Dashboard',
      description: 'Acompanhe o desenvolvimento das crianças com avaliações interativas e relatórios detalhados.',
      icon: <Activity className="w-8 h-8" />,
      href: user ? '/educare-app/dashboard' : '/educare-app/auth?action=register',
      color: 'from-blue-500 to-blue-600',
      features: ['Avaliações TitiNauta Bot', 'Relatórios de Progresso', 'Gestão de Perfis']
    },
    {
      title: 'Blog Educare+',
      description: 'Artigos especializados sobre desenvolvimento infantil, dicas para pais e novidades educacionais.',
      icon: <BookOpen className="w-8 h-8" />,
      href: '/blog',
      color: 'from-green-500 to-green-600',
      features: ['Artigos Especializados', 'Dicas para Pais', 'Novidades da Plataforma']
    },
    {
      title: 'Academia Educare+',
      description: 'Cursos e recursos educacionais para pais, educadores e profissionais da área.',
      icon: <GraduationCap className="w-8 h-8" />,
      href: '/educare-app/academia',
      color: 'from-purple-500 to-purple-600',
      features: ['Cursos Online', 'Certificações', 'Recursos Didáticos']
    },
    {
      title: 'Loja Educare+',
      description: 'Materiais educacionais, jogos e recursos especializados para apoiar o desenvolvimento.',
      icon: <ShoppingBag className="w-8 h-8" />,
      href: '/educare-app/loja',
      color: 'from-orange-500 to-orange-600',
      features: ['Materiais Didáticos', 'Jogos Educativos', 'Recursos Especializados']
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Explore Todas as Áreas da Plataforma</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma integrada com tudo o que você precisa para apoiar o desenvolvimento infantil
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {platformAreas.map((area, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`h-2 bg-gradient-to-r ${area.color}`}></div>
              <div className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{area.title}</h3>
                <p className="text-muted-foreground mb-6">{area.description}</p>
                <ul className="space-y-2 mb-8">
                  {area.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full bg-gradient-to-r ${area.color} hover:opacity-90`} asChild>
                  <Link to={area.href}>
                    Acessar {area.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformAreasSection;
