
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  FileBarChart,
  Calendar,
  Activity,
  CheckSquare,
  MessageCircle,
  Baby,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useStatistics } from '@/hooks/useStatistics';
import ChildrenRegistrationChart from '@/components/charts/ChildrenRegistrationChart';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUserManagement();
  const { activities, stats, isLoading: activitiesLoading, error: activitiesError, refreshActivities } = useActivityFeed();
  const { childrenStats, isLoading: statsLoading } = useStatistics();
  
  // Count users by role
  const userCounts = {
    total: users.length,
    parents: users.filter(u => u.role === 'parent').length,
    professionals: users.filter(u => ['teacher', 'therapist', 'specialist', 'psychologist'].includes(u.role)).length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  // Função para obter ícone baseado no tipo de atividade
  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />;
      case 'quiz':
        return <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />;
      case 'team':
        return <Users className="h-5 w-5 text-purple-500 mt-0.5" />;
      case 'chat':
        return <MessageCircle className="h-5 w-5 text-indigo-500 mt-0.5" />;
      case 'child':
        return <Baby className="h-5 w-5 text-pink-500 mt-0.5" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500 mt-0.5" />;
    }
  };

  // Função para formatar tempo relativo
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Data inválida';
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Dashboard Admin | Educare+</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
          <div className="text-sm text-gray-500">
            Bem-vindo, <span className="font-medium text-amber-700">{user?.name || 'Admin'}</span>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{userCounts.total}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pais e Responsáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-500 mr-2" />
                <div className="text-2xl font-bold">{userCounts.parents}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileBarChart className="h-8 w-8 text-purple-500 mr-2" />
                <div className="text-2xl font-bold">{userCounts.professionals}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Administradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-amber-500 mr-2" />
                <div className="text-2xl font-bold">{userCounts.admins}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshActivities}
                  disabled={activitiesLoading}
                >
                  {activitiesLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-500">Carregando atividades...</span>
                  </div>
                ) : activitiesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-2">{activitiesError}</p>
                    <Button variant="outline" size="sm" onClick={refreshActivities}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma atividade recente encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 bg-slate-50 p-3 rounded-md">
                        {getActivityIcon(activity.icon_type)}
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <ChildrenRegistrationChart 
                data={childrenStats} 
                isLoading={statsLoading}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quizzes Completados</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">Gráfico de atividade</p>
                    <p className="text-sm">[Dados de exemplo - implementar gráfico real]</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Dados e estatísticas da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Implementar visualização de dados e analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>Relatórios do sistema</CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Implementar sistema de relatórios</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
