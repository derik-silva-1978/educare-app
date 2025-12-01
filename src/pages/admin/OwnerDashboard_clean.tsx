import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { dashboardService, type DashboardMetrics, type SubscriptionPlanMetrics } from '@/services/dashboardService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  TrendingDown,
  CheckCircle
} from 'lucide-react';

const OwnerDashboard: React.FC = () => {
  const { user, hasRole } = useCustomAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [planMetrics, setPlanMetrics] = useState<SubscriptionPlanMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardMetrics, subscriptionPlanMetrics] = await Promise.all([
          dashboardService.getDashboardMetrics(),
          dashboardService.getSubscriptionPlanMetrics()
        ]);
        
        setMetrics(dashboardMetrics);
        setPlanMetrics(subscriptionPlanMetrics);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (hasRole('owner')) {
      loadDashboardData();
    }
  }, [hasRole, toast]);

  // Redirect if not owner
  if (!hasRole('owner')) {
    return <Navigate to="/educare-app/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Owner Dashboard - EducareApp</title>
        <meta name="description" content="Painel de controle do proprietário da plataforma EducareApp" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Crown className="h-8 w-8 text-orange-500 mr-3" />
              Owner Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Gestão Global da Plataforma EducareApp</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Crown className="h-3 w-3 mr-1" />
              Proprietário
            </Badge>
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Sistema Saudável</span>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total de Usuários */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics?.totalUsers?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-green-600">+{metrics?.newUsersToday || 0} novos hoje</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Assinaturas Ativas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assinaturas Ativas</p>
                  <p className="text-3xl font-bold text-green-600">{metrics?.activeSubscriptions?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-green-600">{metrics?.conversionRate?.toFixed(1) || '0'}% conversão</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Receita Mensal */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    R$ {metrics?.monthlyRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </p>
                  <p className="text-xs text-green-600">Receita ativa</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          {/* Taxa de Churn */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Churn</p>
                  <p className="text-3xl font-bold text-orange-600">{metrics?.churnRate?.toFixed(1) || '0'}%</p>
                  <p className="text-xs text-muted-foreground">Último mês</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          {/* Sistema */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sistema</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics?.systemHealth?.toFixed(0) || '0'}%</p>
                  <p className="text-xs text-green-600">Uptime {metrics?.uptime?.toFixed(1) || '0'}%</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planos de Assinatura */}
        <Card>
          <CardHeader>
            <CardTitle>Planos de Assinatura</CardTitle>
            <CardDescription>Performance dos planos por receita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planMetrics.length > 0 ? (
                planMetrics.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{plan.planName}</h4>
                      <p className="text-sm text-muted-foreground">{plan.subscriberCount} assinantes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        R$ {plan.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs ${
                        plan.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {plan.growthPercentage >= 0 ? '+' : ''}{plan.growthPercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum plano encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OwnerDashboard;
