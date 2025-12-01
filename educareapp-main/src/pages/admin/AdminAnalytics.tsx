
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { BarChart, AreaChart, LineChart, PieChart } from '@/components/ui/charts';
import { 
  Activity, 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar,
  FileBarChart,
} from 'lucide-react';

// Mock data for charts - in a real app, this would come from the API
const userRegistrationData = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 27 },
  { name: 'May', value: 32 },
  { name: 'Jun', value: 24 },
];

const platformActivityData = [
  { name: 'Jan', users: 12, quizzes: 24, content: 6 },
  { name: 'Feb', users: 19, quizzes: 37, content: 10 },
  { name: 'Mar', users: 15, quizzes: 30, content: 8 },
  { name: 'Apr', users: 27, quizzes: 48, content: 12 },
  { name: 'May', users: 32, quizzes: 59, content: 18 },
  { name: 'Jun', users: 24, quizzes: 42, content: 15 },
];

const userRolesData = [
  { name: 'Admin', value: 4 },
  { name: 'Parent', value: 65 },
  { name: 'Teacher', value: 18 },
  { name: 'Therapist', value: 12 },
  { name: 'Specialist', value: 8 },
];

const AdminAnalytics: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Analytics | Admin Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Análise e Relatórios</h1>
          <div className="text-sm text-gray-500">
            Dados atualizados: <span className="font-medium">{new Date().toLocaleString('pt-BR')}</span>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">243</div>
                <span className="ml-2 text-green-500 text-sm">+12%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quizzes Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <div className="text-2xl font-bold">1,842</div>
                <span className="ml-2 text-green-500 text-sm">+8%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-amber-500 mr-2" />
                <div className="text-2xl font-bold">76%</div>
                <span className="ml-2 text-amber-500 text-sm">+2%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Materiais Acessados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileBarChart className="h-8 w-8 text-purple-500 mr-2" />
                <div className="text-2xl font-bold">3,219</div>
                <span className="ml-2 text-green-500 text-sm">+15%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividade da Plataforma</CardTitle>
                <CardDescription>Usuários ativos, quizzes completados e conteúdo acessado por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AreaChart
                  data={platformActivityData}
                  categories={['users', 'quizzes', 'content']}
                  colors={['blue', 'green', 'purple']}
                  valueFormatter={(value: number) => `${value}`}
                  showLegend={true}
                  showAnimation={true}
                  showXAxis={true}
                  showYAxis={true}
                  showTooltip={true}
                />
              </CardContent>
            </Card>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastros de Usuários</CardTitle>
                  <CardDescription>Novos usuários por mês</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart
                    data={userRegistrationData}
                    categories={['value']}
                    colors={['amber']}
                    valueFormatter={(value: number) => `${value} usuários`}
                    showLegend={false}
                    showAnimation={true}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Funções</CardTitle>
                  <CardDescription>Usuários por tipo de função</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <PieChart
                    data={userRolesData}
                    category="value"
                    index="name"
                    colors={['amber', 'green', 'blue', 'purple', 'red']}
                    valueFormatter={(value: number) => `${value} usuários`}
                    showAnimation={true}
                    showTooltip={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Usuários</CardTitle>
                <CardDescription>Informações detalhadas sobre atividade de usuários</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <div className="text-center pt-20 text-gray-500">
                  <p className="mb-2 text-lg">Conteúdo de análise detalhada de usuários será implementado aqui</p>
                  <p>Estatísticas de engajamento, retenção e comportamento de usuário</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Conteúdo</CardTitle>
                <CardDescription>Desempenho e engajamento de conteúdo</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <div className="text-center pt-20 text-gray-500">
                  <p className="mb-2 text-lg">Conteúdo de análise de materiais será implementado aqui</p>
                  <p>Estatísticas de acesso, conclusão e avaliação de conteúdo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>Geração e download de relatórios</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <div className="text-center pt-20 text-gray-500">
                  <p className="mb-2 text-lg">Sistema de geração de relatórios será implementado aqui</p>
                  <p>Opções para criar relatórios personalizados e baixar em diferentes formatos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminAnalytics;
