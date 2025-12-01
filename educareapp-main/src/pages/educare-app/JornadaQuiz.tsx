import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Users, ArrowRight, Star, Home } from 'lucide-react';
import { useSupabaseChildren } from '@/hooks/useSupabaseChildren';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Spinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';
import SimpleRouteGuard from '@/components/auth/SimpleRouteGuard';

const JornadaQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children, isLoading, isError } = useSupabaseChildren();

  const handleChildSelect = (childId: string) => {
    // Navigate directly to the journey page for the selected child
    navigate(`/educare-app/journey/${childId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Carregando crianças..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c1445] to-[#1a237e] px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar a lista de crianças.
            </p>
            <Button onClick={() => navigate('/educare-app/dashboard')}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SimpleRouteGuard requireChildId={false} allowProfessional={false}>
      <Helmet>
        <title>Selecionar Criança | Jornada Educare</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0c1445] to-[#1a237e] px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/educare-app/dashboard')}
            className="text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🌟 Jornada do Desenvolvimento
            </h1>
            <p className="text-xl text-white/80 mb-2">
              Selecione uma criança para começar
            </p>
            <p className="text-white/60">
              Acompanhe o crescimento e desenvolvimento através de atividades interativas
            </p>
          </motion.div>

          {children.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma criança encontrada</h3>
                <p className="text-gray-600 mb-4">
                  Você precisa adicionar uma criança antes de iniciar o quiz.
                </p>
                <Button onClick={() => navigate('/educare-app/children')}>
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Crianças
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/95 backdrop-blur-sm border-white/20"
                    onClick={() => handleChildSelect(child.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👶</span>
                      </div>
                      <CardTitle className="text-xl">
                        {child.first_name} {child.last_name}
                      </CardTitle>
                      <p className="text-gray-600">
                        {child.birthdate ? 
                          `${Math.floor((new Date().getTime() - new Date(child.birthdate).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses` :
                          'Idade não informada'
                        }
                      </p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-4">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            Progresso: {child.journey_progress || 0}%
                          </span>
                        </div>
                      </div>
                      <Button className="w-full">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Iniciar Jornada
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Precisa de ajuda?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  A jornada do desenvolvimento é uma ferramenta interativa para acompanhar o crescimento da criança.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/educare-app/dashboard')}
                  className="border-white/30 text-white hover:bg-white/20"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SimpleRouteGuard>
  );
};

export default JornadaQuiz;
