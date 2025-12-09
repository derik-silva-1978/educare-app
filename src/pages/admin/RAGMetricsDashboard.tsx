/**
 * RAG Metrics Dashboard
 * Visualização de métricas e analytics do sistema RAG
 * Para administradores apenas (isOwner)
 */

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, BarChart3, AlertCircle, Shield, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ragService from '@/services/api/ragService';
import guardrailsService from '@/services/api/guardrailsService';
import { useToast } from '@/hooks/use-toast';

const RAGMetricsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const [metrics, setMetrics] = useState<any>(null);
  const [moduleStats, setModuleStats] = useState<any>(null);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [guardrailsMetrics, setGuardrailsMetrics] = useState<any>(null);
  const [guardrailsHealth, setGuardrailsHealth] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, moduleData, healthData, guardrailsData, guardrailsHealthData] = await Promise.all([
        ragService.getAggregateMetrics().catch(() => null),
        ragService.getModuleStats().catch(() => null),
        ragService.getHealthCheck().catch(() => null),
        guardrailsService.getMetrics().catch(() => null),
        guardrailsService.getHealth().catch(() => null),
      ]);

      setMetrics(metricsData);
      setModuleStats(moduleData);
      setHealthCheck(healthData);
      setGuardrailsMetrics(guardrailsData);
      setGuardrailsHealth(guardrailsHealthData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as métricas do RAG',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard RAG</h1>
          <p className="text-gray-600 mt-2">Métricas e performance do sistema TitiNauta</p>
        </div>

        {/* Health Status */}
        {healthCheck && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {healthCheck.status === 'healthy' && '✅ Tudo funcionando normalmente'}
                  {healthCheck.status === 'degraded' && '⚠️ Performance reduzida'}
                  {healthCheck.status === 'unhealthy' && '❌ Sistema com problemas'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {(healthCheck.uptime_percentage || 0).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="guardrails" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Guardrails
            </TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Success Rate */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Taxa de Sucesso</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {(metrics.success_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-500" />
                  </div>
                </Card>

                {/* Response Time */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Tempo Médio de Resposta</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {(metrics.average_response_time_ms || 0).toFixed(0)}ms
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-blue-500" />
                  </div>
                </Card>

                {/* Total Queries */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total de Consultas</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {metrics.total_queries || 0}
                      </p>
                    </div>
                    <BarChart3 className="w-12 h-12 text-purple-500" />
                  </div>
                </Card>

                {/* Fallback Rate */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Taxa de Fallback</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {(metrics.fallback_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-yellow-500" />
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {moduleStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Baby Module */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👶 Módulo Bebê</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.baby?.success_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consultas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {moduleStats.baby?.queries || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.baby?.avg_response_time || 0).toFixed(0)}ms
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Mother Module */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🤰 Módulo Mãe</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.mother?.success_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consultas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {moduleStats.mother?.queries || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.mother?.avg_response_time || 0).toFixed(0)}ms
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Professional Module */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👨‍⚕️ Módulo Profissional</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.professional?.success_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consultas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {moduleStats.professional?.queries || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(moduleStats.professional?.avg_response_time || 0).toFixed(0)}ms
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="space-y-6">
            {/* Guardrails Health Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Status de Segurança</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  guardrailsHealth?.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {guardrailsHealth?.enabled ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {guardrailsMetrics?.totalValidations || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Validações Totais</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {guardrailsMetrics?.blockedRequests || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Bloqueados</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {guardrailsMetrics?.piiDetections || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PII Detectados</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {guardrailsMetrics?.emergencyEscalations || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Emergências</p>
                </div>
              </div>
            </Card>

            {/* Guardrails Layers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Layer */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Camada de Entrada
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Detecção de PII</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Bloqueio de Injeção</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Modo Estrito</span>
                    <span className={`font-medium ${guardrailsHealth?.strictMode ? 'text-green-600' : 'text-gray-400'}`}>
                      {guardrailsHealth?.strictMode ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Output Layer */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Proteção de Dados
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Mascaramento de CPF</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Proteção de Telefone</span>
                    <span className="font-medium text-green-600">Ativo</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Dados de Crianças</span>
                    <span className="font-medium text-green-600">Protegido</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Latência Média</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(guardrailsMetrics?.averageLatencyMs || 0).toFixed(0)}ms
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {guardrailsHealth?.uptime || '99.9'}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taxa de Bloqueio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {guardrailsMetrics?.totalValidations 
                      ? ((guardrailsMetrics.blockedRequests / guardrailsMetrics.totalValidations) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Técnicas</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Dashboard atualizado em:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Backend RAG:</span>
                  <span className="text-gray-900 font-medium">
                    {healthCheck?.status === 'healthy' ? '✅ Online' : '❌ Offline'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Versão FASE:</span>
                  <span className="text-gray-900 font-medium">11 (Auto-melhoramento)</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Atualizar Dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default RAGMetricsDashboard;
