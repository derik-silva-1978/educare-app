
import { Activity, BookOpen, Lightbulb, ShoppingBag, GraduationCap } from 'lucide-react';
import InitiativeCard from './InitiativeCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Features = () => {
  const initiatives = [
    {
      title: "Educare App",
      description: "Plataforma completa para rastreamento do desenvolvimento infantil com avaliações interativas e sugestões personalizadas para cada fase do crescimento.",
      icon: <Activity className="h-6 w-6 text-white" />,
      color: "bg-[#91D8F7]",
      link: "/educare-app",
      delay: 0.2,
      cta: "Experimente Grátis"
    },
    {
      title: "Smart PEI",
      description: "Ferramenta inovadora para criação e gestão de Planos Educacionais Individualizados com acompanhamento detalhado, colaborativo e baseado em evidências.",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      color: "bg-[#52658C]",
      link: "/smart-pei",
      delay: 0.4,
      cta: "Começar Agora"
    },
    {
      title: "Educare+ Tech",
      description: "Ambiente prático para aprendizado em tecnologia e automação com projetos interativos e kits de robótica adaptados para diferentes níveis de habilidade.",
      icon: <Lightbulb className="h-6 w-6 text-white" />,
      color: "bg-[#EF4D65]",
      link: "/educare-tech",
      delay: 0.6,
      cta: "Conheça os Kits"
    },
    {
      title: "Cursos Educacionais",
      description: "Programas de capacitação para educadores, famílias e profissionais, com certificação reconhecida e metodologias baseadas nas mais recentes pesquisas.",
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      color: "bg-[#6C63FF]",
      link: "/courses",
      delay: 0.8,
      cta: "Ver Catálogo"
    },
    {
      title: "Loja Educare+",
      description: "Produtos educacionais cuidadosamente selecionados, incluindo materiais didáticos, kits de atividades, jogos pedagógicos e recursos para necessidades especiais.",
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      color: "bg-[#F9A826]",
      link: "/store",
      delay: 1.0,
      cta: "Comprar Agora"
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-educare-50/30" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute -top-10 right-[15%] w-32 h-32 opacity-10 animate-float-slow rotate-12 pointer-events-none">
        <img src="/images/educare-pattern-1.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-20 left-[5%] w-24 h-24 opacity-10 animate-float-medium -rotate-12 pointer-events-none">
        <img src="/images/educare-pattern-2.svg" alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-educare-100 text-educare-800 mb-4 inline-block">
            Nossas Soluções
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Um Ecossistema Completo para Educação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça as cinco soluções educacionais que compõem o Sistema Educare+, 
            cada uma criada para atender necessidades específicas do processo de aprendizagem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {initiatives.map((initiative, index) => (
            <InitiativeCard
              key={initiative.title}
              title={initiative.title}
              description={initiative.description}
              icon={initiative.icon}
              color={initiative.color}
              link={initiative.link}
              delay={initiative.delay}
              cta={initiative.cta}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" className="rounded-full px-8 py-6 bg-educare-600 hover:bg-educare-700 shadow-lg">
            <Link to="/payment">
              Central de Pagamentos Unificada
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Adquira qualquer produto Educare+ em um único checkout
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
