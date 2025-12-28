import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { 
  ArrowLeft, Brain, MessageSquare, Users, Activity, Eye, Heart,
  Download, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, Baby
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const domainConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  motor: { icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Motor' },
  cognitivo: { icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Cognitivo' },
  cognitive: { icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Cognitivo' },
  linguagem: { icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Linguagem' },
  comunicacao: { icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Comunicação' },
  language: { icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Linguagem' },
  social: { icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Social' },
  emocional: { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Emocional' },
  socioemocional: { icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100', label: 'Socioemocional' },
  sensorial: { icon: Eye, color: 'text-teal-600', bgColor: 'bg-teal-100', label: 'Sensorial' }
};

const defaultDomainConfig = { icon: Brain, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Outro' };
const getDomainConfig = (category: string) => domainConfig[category.toLowerCase()] || { ...defaultDomainConfig, label: category.charAt(0).toUpperCase() + category.slice(1) };

interface Milestone {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetMonth: number;
  status: 'achieved' | 'in_progress' | 'pending';
  source: string;
}

interface ChildMilestonesResponse {
  success: boolean;
  child: {
    id: string;
    name: string;
    birthDate: string;
    ageInMonths: number;
  };
  milestones: Milestone[];
  byCategory: Record<string, Milestone[]>;
  summary: {
    total: number;
    achieved: number;
    inProgress: number;
    pending: number;
  };
}

const ChildAnalysis: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<ChildMilestonesResponse>({
    queryKey: ['childMilestones', childId],
    queryFn: async () => {
      const response = await fetch(`/api/milestones/child/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Erro ao carregar dados');
      return response.json();
    },
    enabled: !!childId && !!token
  });

  const handleExportPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = printRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`analise-${data?.child.name || 'crianca'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Erro ao exportar:', err);
    }
  };

  const getChartData = () => {
    if (!data?.byCategory) return [];
    
    return Object.entries(data.byCategory).map(([category, milestones]) => {
      const config = getDomainConfig(category);
      const achieved = milestones.filter(m => m.status === 'achieved').length;
      const total = milestones.length;
      return {
        category: config.label,
        achieved,
        inProgress: milestones.filter(m => m.status === 'in_progress').length,
        pending: milestones.filter(m => m.status === 'pending').length,
        percentage: total > 0 ? Math.round((achieved / total) * 100) : 0
      };
    });
  };

  const getRadarData = () => {
    if (!data?.byCategory) return [];
    
    return Object.entries(data.byCategory).map(([category, milestones]) => {
      const config = getDomainConfig(category);
      const achieved = milestones.filter(m => m.status === 'achieved').length;
      const total = milestones.length;
      return {
        domain: config.label,
        value: total > 0 ? Math.round((achieved / total) * 100) : 0,
        fullMark: 100
      };
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card className="mt-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-lg font-semibold">Erro ao carregar dados</h2>
            <p className="text-muted-foreground">Não foi possível acessar os dados desta criança.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { child, milestones, byCategory, summary } = data;
  const completionPercentage = summary.total > 0 ? Math.round((summary.achieved / summary.total) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Análise de {child.name} | Educare</title>
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-6" ref={printRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Análise de Desenvolvimento</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Baby className="h-4 w-4" />
                {child.name} • {child.ageInMonths} meses
              </p>
            </div>
          </div>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Atingidos</p>
                  <p className="text-2xl font-bold text-green-600">{summary.achieved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Progresso</p>
                  <p className="text-2xl font-bold text-amber-600">{summary.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-slate-100">
                  <Calendar className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-slate-600">{summary.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Geral</p>
                  <p className="text-2xl font-bold text-indigo-600">{completionPercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Desenvolvimento</CardTitle>
            <CardDescription>
              Progresso baseado nos marcos oficiais da Caderneta da Criança do Ministério da Saúde
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Geral</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="by-domain">Por Domínio</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso por Domínio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 'dataMax']} />
                      <YAxis dataKey="category" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="achieved" name="Atingidos" fill="#22c55e" stackId="a" />
                      <Bar dataKey="inProgress" name="Em Progresso" fill="#f59e0b" stackId="a" />
                      <Bar dataKey="pending" name="Pendentes" fill="#94a3b8" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Perfil de Desenvolvimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="domain" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="% Atingido"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="by-domain" className="space-y-4 mt-6">
            {Object.entries(byCategory).map(([category, categoryMilestones]) => {
              const config = getDomainConfig(category);
              const Icon = config.icon;
              const achieved = categoryMilestones.filter(m => m.status === 'achieved').length;
              const total = categoryMilestones.length;
              const percentage = total > 0 ? Math.round((achieved / total) * 100) : 0;

              return (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{config.label}</CardTitle>
                          <CardDescription>{achieved} de {total} marcos atingidos</CardDescription>
                        </div>
                      </div>
                      <Badge variant={percentage >= 70 ? 'default' : percentage >= 40 ? 'secondary' : 'outline'}>
                        {percentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={percentage} className="h-2 mb-4" />
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categoryMilestones.map((milestone) => (
                        <div 
                          key={milestone.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {milestone.status === 'achieved' && (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                            {milestone.status === 'in_progress' && (
                              <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            )}
                            {milestone.status === 'pending' && (
                              <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{milestone.title}</span>
                          </div>
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                            {milestone.targetMonth}m
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo de Marcos</CardTitle>
                <CardDescription>
                  Marcos organizados por idade esperada (em meses)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...new Set(milestones.map(m => m.targetMonth))].sort((a, b) => a - b).map(month => {
                    const monthMilestones = milestones.filter(m => m.targetMonth === month);
                    const isCurrentPeriod = month >= child.ageInMonths - 1 && month <= child.ageInMonths + 1;
                    
                    return (
                      <div key={month} className={`border-l-4 pl-4 py-2 ${isCurrentPeriod ? 'border-indigo-500 bg-indigo-50 rounded-r-lg' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={isCurrentPeriod ? 'default' : 'outline'}>
                            {month} meses
                          </Badge>
                          {isCurrentPeriod && (
                            <span className="text-xs text-indigo-600 font-medium">Período Atual</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {monthMilestones.map(milestone => {
                            const config = getDomainConfig(milestone.category);
                            return (
                              <div 
                                key={milestone.id}
                                className="flex items-center gap-2 p-2 rounded bg-white border text-sm"
                              >
                                {milestone.status === 'achieved' && (
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                                {milestone.status === 'in_progress' && (
                                  <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                )}
                                {milestone.status === 'pending' && (
                                  <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                )}
                                <span className="truncate flex-1">{milestone.title}</span>
                                <Badge variant="outline" className={`text-xs ${config.color}`}>
                                  {config.label.charAt(0)}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ChildAnalysis;
