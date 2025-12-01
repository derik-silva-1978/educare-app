
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Book, Calendar, Lightbulb, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EducareMenuBar from '@/components/educare-app/EducareMenuBar';
import EducareFeatureCard from '@/components/educare-app/EducareFeatureCard';
import EducareCallToAction from '@/components/educare-app/EducareCallToAction';
import EducareFooter from '@/components/educare-app/EducareFooter';

const EducareAppHome: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: "Acompanhamento Personalizado",
      description: "Receba orientações específicas para cada fase do desenvolvimento infantil baseadas nas melhores práticas científicas.",
      icon: BarChart3,
      color: "#91D8F7",
    },
    {
      title: "Atividades Educativas",
      description: "Acesse uma biblioteca de atividades e brincadeiras que estimulam o desenvolvimento cognitivo, motor e social.",
      icon: Book,
      color: "#EF4D65",
    },
    {
      title: "Comunidade de Pais",
      description: "Conecte-se com outros pais e compartilhe experiências em um ambiente seguro e colaborativo.",
      icon: Users,
      color: "#F9B8B5",
    },
    {
      title: "Avaliação de Marcos",
      description: "Monitore os principais marcos do desenvolvimento do seu filho e identifique áreas que precisam de atenção.",
      icon: Calendar,
      color: "#91D8F7",
    },
    {
      title: "Conteúdo Especializado",
      description: "Artigos e vídeos elaborados por especialistas em desenvolvimento infantil e neurociência.",
      icon: Lightbulb,
      color: "#EF4D65",
    },
    {
      title: "Suporte Profissional",
      description: "Possibilidade de conectar com profissionais de saúde e educação para orientações personalizadas.",
      icon: MessageSquare,
      color: "#F9B8B5",
    }
  ];
  
  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <Helmet>
        <title>Educare - Desenvolvimento infantil inteligente</title>
        <meta 
          name="description" 
          content="Educare - Plataforma para acompanhamento do desenvolvimento infantil" 
        />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <EducareMenuBar />
        
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:py-32 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50/30 z-0"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-100/40 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-pink-100/30 blur-3xl"></div>
          
          {/* Floating decorative elements */}
          <motion.div 
            className="absolute top-1/3 right-[10%] w-16 h-16 md:w-24 md:h-24 opacity-30 pointer-events-none"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <img src="/images/astronaut-floating.svg" alt="" className="w-full h-full object-contain" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-[20%] left-[5%] w-12 h-12 md:w-16 md:h-16 opacity-20 pointer-events-none"
            animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          >
            <img src="/images/astronaut-logo.svg" alt="" className="w-full h-full object-contain" />
          </motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="text-center lg:text-left"
              >
                <motion.h1 
                  className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6"
                  variants={fadeInUp}
                >
                  Acompanhe o desenvolvimento
                  <br className="hidden md:block" /> do seu filho
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-8"
                  variants={fadeInUp}
                >
                  O Educare é uma plataforma inteligente que ajuda pais e profissionais 
                  a monitorar e estimular o desenvolvimento infantil.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  variants={fadeInUp}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full px-8"
                    onClick={() => navigate('/educare-app/auth?action=register')}
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full px-8"
                    onClick={() => {
                      const featuresSection = document.getElementById('features');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Conheça Mais
                  </Button>
                </motion.div>
                
                {/* Trust indicators */}
                <motion.div 
                  className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
                  variants={fadeInUp}
                >
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">+10.000 usuários</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">4.9/5 estrelas</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <span className="text-gray-700 font-medium text-sm">Baseado em ciência</span>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-xl relative"
              >
                <img 
                  src="/images/educare-hero.jpg" 
                  alt="Crianças desenvolvendo atividades" 
                  className="w-full h-auto rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/800x600/91D8F7/ffffff?text=Educare";
                  }}
                />
                
                {/* Hero image decorative elements */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-md">
                  <motion.div 
                    className="flex items-center"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Avaliação científica</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Por que escolher o Educare?
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Combinamos neurociência, educação e tecnologia para criar um ambiente de desenvolvimento ideal para crianças.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <EducareFeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                O que as famílias dizem
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Veja como o Educare tem ajudado famílias a acompanhar o desenvolvimento de seus filhos.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "O Educare ajudou a identificar pequenos atrasos no desenvolvimento do meu filho que passaram despercebidos. Agora estamos trabalhando com atividades específicas.",
                  name: "Ana Luiza",
                  role: "Mãe de 2 filhos",
                  image: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "Como pai de primeira viagem, me sentia perdido. O Educare me deu confiança para entender cada fase do desenvolvimento da minha filha.",
                  name: "Carlos Silva",
                  role: "Pai de 1 filha",
                  image: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "A abordagem científica e ao mesmo tempo acessível do Educare é incrível. As atividades são divertidas e educativas.",
                  name: "Mariana Costa",
                  role: "Mãe de 3 filhos",
                  image: "https://randomuser.me/api/portraits/women/68.jpg"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={testimonial.name}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/100/91D8F7/ffffff?text=User";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic text-gray-600">"{testimonial.quote}"</p>
                  
                  {/* Star rating */}
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <EducareCallToAction />
        
        {/* Footer */}
        <EducareFooter />
      </div>
    </>
  );
};

export default EducareAppHome;
