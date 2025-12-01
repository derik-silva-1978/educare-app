
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Settings, Database } from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';

const JourneyBotAdminPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeSection, setActiveSection] = useState('questions');

  // Only admins can access this page
  if (!hasRole('admin')) {
    return <Navigate to="/educare-app/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin - Jornada Bot | Educare</title>
      </Helmet>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Bot className="h-8 w-8 text-blue-500" />
            Admin - Jornada Bot
          </h1>
          <p className="text-gray-600 mt-2">
            Gerenciamento de perguntas e configurações do sistema Journey Bot
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Button
              variant={activeSection === 'questions' ? 'default' : 'outline'}
              onClick={() => setActiveSection('questions')}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Perguntas
            </Button>
            <Button
              variant={activeSection === 'settings' ? 'default' : 'outline'}
              onClick={() => setActiveSection('settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Questions Management */}
        {activeSection === 'questions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciar Perguntas</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Pergunta
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Perguntas do Journey Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Interface de Gerenciamento
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Em breve você poderá adicionar, editar e organizar as perguntas do Journey Bot diretamente por aqui.
                  </p>
                  <p className="text-sm text-gray-400">
                    Por enquanto, as perguntas são gerenciadas diretamente no banco de dados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings */}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Configurações do Sistema</h2>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Painel de Configurações
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Configurações avançadas do Journey Bot serão disponibilizadas em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default JourneyBotAdminPage;
