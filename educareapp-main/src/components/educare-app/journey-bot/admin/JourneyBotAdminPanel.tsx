
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bot, FileText, BarChart3, Settings, Upload, Database, Play, ExternalLink } from 'lucide-react';
import JourneyBotImportTab from './JourneyBotImportTab';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';

interface QuestionStats {
  total: number;
  byDimension: Record<string, number>;
  byAgeRange: Record<string, number>;
}

export const JourneyBotAdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Query for question statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['journey-bot-stats'],
    queryFn: async () => {
      const { data: questions, error } = await supabase
        .from('journey_bot_questions')
        .select('dimension, age_min_months, age_max_months')
        .eq('active', true);

      if (error) throw error;

      const stats: QuestionStats = {
        total: questions?.length || 0,
        byDimension: {},
        byAgeRange: {}
      };

      questions?.forEach(q => {
        // Count by dimension
        stats.byDimension[q.dimension] = (stats.byDimension[q.dimension] || 0) + 1;

        // Count by age range
        const ageRange = `${q.age_min_months}-${q.age_max_months}m`;
        stats.byAgeRange[ageRange] = (stats.byAgeRange[ageRange] || 0) + 1;
      });

      return stats;
    },
    enabled: !!user
  });

  // Query for recent sessions
  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recent-journey-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_bot_sessions')
        .select(`
          *,
          educare_children (name),
          educare_profiles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const dimensionLabels = {
    motor: 'Motor',
    language: 'Linguagem',
    social: 'Social',
    sensory: 'Sensorial'
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p>Você precisa estar autenticado para acessar o painel administrativo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo - Titi Nauta</h1>
            <p className="text-gray-600">Gerencie perguntas e configurações do TitiBOT</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/educare-app/journey-bot')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Testar Titi Nauta
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Banco de Dados
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Perguntas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Perguntas ativas</p>
              </CardContent>
            </Card>

            {Object.entries(stats?.byDimension || {}).map(([dimension, count]) => (
              <Card key={dimension}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                  </CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">perguntas</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Distribuição por faixa etária */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Faixa Etária</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats?.byAgeRange || {}).map(([range, count]) => (
                  <Badge key={range} variant="secondary">
                    {range}: {count} perguntas
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sessões recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Sessões Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {(session as any).educare_children?.name || 'Criança'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status === 'completed' ? 'Concluída' : 'Em andamento'}
                          </Badge>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {session.answered_questions}/{session.total_questions} respostas
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  Nenhuma sessão encontrada ainda.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Links rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Links Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => navigate('/educare-app/journey-bot')}
                >
                  <Play className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Testar Titi Nauta</div>
                    <div className="text-sm text-gray-600">Experimente a funcionalidade</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start"
                  onClick={() => setActiveTab('import')}
                >
                  <Upload className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Importar Perguntas</div>
                    <div className="text-sm text-gray-600">Adicione mais perguntas via CSV</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <JourneyBotImportTab />
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Base de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Funcionalidades de gerenciamento da base de dados estarão disponíveis em breve.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Visualizar Perguntas
                </Button>
                <Button variant="outline" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perguntas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Titi Nauta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Configurações avançadas estarão disponíveis em breve.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" disabled>
                  <Bot className="h-4 w-4 mr-2" />
                  Configurar TitiBOT
                </Button>
                <Button variant="outline" disabled>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneyBotAdminPanel;
