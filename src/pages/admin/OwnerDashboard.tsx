import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate, Link } from 'react-router-dom';
import { dashboardService, type DashboardMetrics, type SubscriptionPlanMetrics } from '@/services/dashboardService';
import { subscriptionPlansService, type SubscriptionPlan } from '@/services/subscriptionPlansService';
import { subscriptionStatsService, type SubscriptionStats, type DashboardStats } from '@/services/subscriptionStatsService';
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
  const [realPlans, setRealPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Carregar dados reais de assinaturas e estatísticas
        const [subscriptionStats, dashboardStats] = await Promise.all([
          subscriptionStatsService.getSubscriptionStatsByPlan(),
          subscriptionStatsService.getDashboardStats()
        ]);
        
        console.log('loadDashboardData - Estatísticas de assinatura:', subscriptionStats);
        console.log('loadDashboardData - Estatísticas do dashboard:', dashboardStats);
        
        // Armazenar dados detalhados das assinaturas para uso na interface
        setSubscriptionStats(subscriptionStats);
        
        // Converter estatísticas reais para formato do dashboard
        const planMetricsData: SubscriptionPlanMetrics[] = subscriptionStats.map(stat => ({
          planName: stat.planName,
          subscriberCount: stat.subscriberCount,
          revenue: stat.revenue, // Receita real baseada em assinantes reais
          growthPercentage: stat.growthPercentage
        }));
        
        setPlanMetrics(planMetricsData);
        
        // Usar métricas reais do dashboard
        const realMetrics: DashboardMetrics = {
          totalUsers: dashboardStats.totalUsers,
          activeSubscriptions: dashboardStats.activeSubscriptions,
          monthlyRevenue: dashboardStats.monthlyRevenue,
          churnRate: dashboardStats.churnRate,
          systemHealth: dashboardStats.systemHealth,
          newUsersToday: dashboardStats.newUsersToday,
          conversionRate: dashboardStats.conversionRate,
          uptime: dashboardStats.uptime
        };
        
        setMetrics(realMetrics);
        
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Fallback com dados básicos
        setMetrics({
          totalUsers: 0,
          activeSubscriptions: 0,
          monthlyRevenue: 0,
          churnRate: 0,
          systemHealth: 0,
          newUsersToday: 0,
          conversionRate: 0,
          uptime: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (hasRole('owner')) {
      loadDashboardData();
    }
  }, [hasRole]); // Removido toast das dependências

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <Crown className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mr-3" />
              Owner Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Gestão Global da Plataforma EducareApp</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
              <Crown className="h-3 w-3 mr-1" />
              Proprietário
            </Badge>
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Sistema Saudável</span>
            </div>
            <Link
              to="/educare-app/owner/plans"
              className="hidden md:flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
            >
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Planos</span>
            </Link>
            
            <Link
              to="/educare-app/owner/subscriptions"
              className="hidden md:flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
            >
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium">Assinaturas</span>
            </Link>
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
                planMetrics.map((plan, index) => {
                  // Buscar dados detalhados do serviço de estatísticas
                  const detailedStats = subscriptionStats?.find(stat => stat.planName === plan.planName);
                  const trialCount = detailedStats?.trialSubscriptions || 0;
                  const activeCount = detailedStats?.activeSubscriptions || 0;
                  const unitPrice = detailedStats?.price || 0;
                  const trialRevenue = trialCount * unitPrice;
                  const activeRevenue = activeCount * unitPrice;
                  const conversionRate = (trialCount + activeCount) > 0 ? (activeCount / (trialCount + activeCount)) * 100 : 0;
                  
                  return (
                    <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{plan.planName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Total: {plan.subscriberCount} assinantes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">
                            R$ {plan.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">Receita Total</p>
                        </div>
                      </div>
                      
                      {/* Detalhamento Trial vs Efetivos */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                        {/* Coluna Trial */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-orange-600">🔄 Trial</span>
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              {trialCount} usuários
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-orange-600">
                              R$ {trialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">Receita Potencial</p>
                          </div>
                        </div>
                        
                        {/* Coluna Efetivos */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">💰 Efetivos</span>
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              {activeCount} usuários
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              R$ {activeRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-muted-foreground">Receita Real</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Taxa de Conversão */}
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(conversionRate, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                              {conversionRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
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
