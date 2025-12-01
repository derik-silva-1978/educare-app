
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, BookOpen, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';

const HeroSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-32 md:py-40 overflow-hidden pt-24 md:pt-32">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/60 to-green-50/40 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <Award className="w-4 h-4 mr-2" />
              Plataforma Completa de Desenvolvimento Infantil
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Conectando <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Famílias</span>, 
              <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent"> Educadores</span> e 
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Profissionais</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              A única plataforma que você precisa para acompanhar, avaliar e apoiar o desenvolvimento infantil 
              com ferramentas baseadas em evidências científicas.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link to="/educare-app/dashboard">
                    Acessar Meu Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link to="/educare-app/auth?action=register">
                    Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link to="/blog">
                  Explorar Conteúdo <BookOpen className="ml-2 h-5 w-5" />
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
                alt="Educare+ Platform Preview" 
                className="object-cover rounded-3xl shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x800/91D8F7/ffffff?text=Educare+Platform';
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Crianças avaliadas</p>
                    <p className="text-lg font-semibold">+10.000</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
