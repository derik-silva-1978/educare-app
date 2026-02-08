import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Bot, Heart, Stethoscope, MessageCircle, Brain, HeartPulse,
  FilePen, ListChecks, BookOpen, Image, Ruler, Moon,
  Calendar, Syringe, Sparkles, Settings2, Cpu, Save,
  History, Check, AlertCircle, Loader2, RefreshCw, Eye,
  ChevronLeft, ChevronDown, ChevronRight, Star, Play, Send,
  ArrowRight, Clock, Zap, DollarSign, Award, MessageSquare,
  FileText, Gauge, CheckCircle, XCircle, Trash2, Plus,
  Megaphone, Layers, Wrench
} from 'lucide-react';
import { assistantPromptService, type AssistantPrompt, type CreatePromptData } from '@/services/api/assistantPromptService';
import { llmConfigService, type LLMConfig, type LLMProviderInfo, type ProviderType, type ModuleType } from '@/services/api/llmConfigService';
import {
  agentControlService,
  type AgentSummary,
  type AgentDetail,
  type ModelRanking,
  type PlaygroundResponse,
  type DashboardResponse
} from '@/services/api/agentControlService';

type ViewMode = 'dashboard' | 'detail';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  baby: <Bot className="h-5 w-5" />,
  mother: <Heart className="h-5 w-5" />,
  professional: <Stethoscope className="h-5 w-5" />,
  landing_chat: <MessageCircle className="h-5 w-5" />,
  quiz_baby: <Brain className="h-5 w-5" />,
  quiz_mother: <HeartPulse className="h-5 w-5" />,
  content_generator: <FilePen className="h-5 w-5" />,
  curation_baby_quiz: <ListChecks className="h-5 w-5" />,
  curation_mother_quiz: <ListChecks className="h-5 w-5" />,
  curation_baby_content: <BookOpen className="h-5 w-5" />,
  curation_mother_content: <BookOpen className="h-5 w-5" />,
  media_metadata: <Image className="h-5 w-5" />,
  nlp_biometric: <Ruler className="h-5 w-5" />,
  nlp_sleep: <Moon className="h-5 w-5" />,
  nlp_appointment: <Calendar className="h-5 w-5" />,
  nlp_vaccine: <Syringe className="h-5 w-5" />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  assistants: <Bot className="h-5 w-5" />,
  sales: <Megaphone className="h-5 w-5" />,
  generators: <Sparkles className="h-5 w-5" />,
  curation: <Layers className="h-5 w-5" />,
  utilities: <Wrench className="h-5 w-5" />,
};

const StarRating: React.FC<{ value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' }> = ({ value, onChange, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`${iconSize} ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
          />
        </button>
      ))}
    </div>
  );
};

const RatingBadge: React.FC<{ label: string; value: string; type: 'cost' | 'speed' | 'quality' }> = ({ label, value, type }) => {
  const colors: Record<string, Record<string, string>> = {
    cost: { low: 'text-green-600 bg-green-50 dark:bg-green-950/30', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30', high: 'text-red-600 bg-red-50 dark:bg-red-950/30' },
    speed: { slow: 'text-red-600 bg-red-50 dark:bg-red-950/30', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30', fast: 'text-green-600 bg-green-50 dark:bg-green-950/30' },
    quality: { low: 'text-red-600 bg-red-50 dark:bg-red-950/30', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30', high: 'text-green-600 bg-green-50 dark:bg-green-950/30' }
  };
  const labels: Record<string, Record<string, string>> = {
    cost: { low: 'Baixo', medium: 'Médio', high: 'Alto' },
    speed: { slow: 'Lento', medium: 'Médio', fast: 'Rápido' },
    quality: { low: 'Baixa', medium: 'Média', high: 'Alta' }
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[type][value] || ''}`}>
      {type === 'cost' && <DollarSign className="h-3 w-3" />}
      {type === 'speed' && <Zap className="h-3 w-3" />}
      {type === 'quality' && <Award className="h-3 w-3" />}
      {label}: {labels[type][value] || value}
    </span>
  );
};

const PromptManagement: React.FC = () => {
  const { user, hasRole } = useCustomAuth();
  const { toast } = useToast();
  const isOwner = hasRole('owner');

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<ModuleType>('baby');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [agentDetail, setAgentDetail] = useState<AgentDetail | null>(null);

  const [detailTab, setDetailTab] = useState<string>('prompt');

  const [promptName, setPromptName] = useState('');
  const [promptDescription, setPromptDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  const [llmConfig, setLlmConfig] = useState<LLMConfig | null>(null);
  const [savingLLM, setSavingLLM] = useState(false);

  const [rankingDialogOpen, setRankingDialogOpen] = useState(false);
  const [rankingProvider, setRankingProvider] = useState('');
  const [rankingModel, setRankingModel] = useState('');
  const [rankingStars, setRankingStars] = useState(3);
  const [rankingNotes, setRankingNotes] = useState('');
  const [rankingCost, setRankingCost] = useState<'low' | 'medium' | 'high'>('medium');
  const [rankingSpeed, setRankingSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [rankingQuality, setRankingQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [savingRanking, setSavingRanking] = useState(false);

  const [playgroundMessage, setPlaygroundMessage] = useState('');
  const [playgroundResult, setPlaygroundResult] = useState<PlaygroundResponse | null>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundUseCustom, setPlaygroundUseCustom] = useState(false);
  const [playgroundProvider, setPlaygroundProvider] = useState<ProviderType>('openai');
  const [playgroundModel, setPlaygroundModel] = useState('gpt-4o-mini');

  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [promptHistory, setPromptHistory] = useState<AssistantPrompt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<AssistantPrompt | null>(null);

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentControlService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({ title: 'Erro ao carregar', description: 'Não foi possível carregar o painel de agentes.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadAgentDetail = useCallback(async (moduleType: ModuleType) => {
    try {
      setLoading(true);
      const data = await agentControlService.getAgentDetail(moduleType);
      setAgentDetail(data);

      if (data.activePrompt) {
        setPromptName(data.activePrompt.name);
        setPromptDescription(data.activePrompt.description || '');
        setSystemPrompt(data.activePrompt.system_prompt);
      } else {
        setPromptName('');
        setPromptDescription('');
        setSystemPrompt('');
      }

      setLlmConfig(data.llmConfig as LLMConfig);
    } catch (error) {
      console.error('Erro ao carregar detalhe do agente:', error);
      toast({ title: 'Erro ao carregar', description: 'Não foi possível carregar os detalhes do agente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const openAgentDetail = (moduleType: ModuleType) => {
    setSelectedAgent(moduleType);
    setViewMode('detail');
    setDetailTab('prompt');
    loadAgentDetail(moduleType);
  };

  const backToDashboard = () => {
    setViewMode('dashboard');
    setPlaygroundResult(null);
    setPlaygroundMessage('');
    loadDashboard();
  };

  const handleSavePrompt = async () => {
    if (!promptName.trim() || !systemPrompt.trim()) {
      toast({ title: 'Campos obrigatórios', description: 'Nome e prompt do sistema são obrigatórios.', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      const data: CreatePromptData = {
        module_type: selectedAgent,
        name: promptName.trim(),
        description: promptDescription.trim() || undefined,
        system_prompt: systemPrompt.trim()
      };
      const result = await assistantPromptService.createPrompt(data);
      toast({
        title: 'Prompt publicado',
        description: `Versão v${result.version} criada e ativada para ${agentDetail?.meta.name || selectedAgent}.`
      });
      await loadAgentDetail(selectedAgent);
    } catch (error) {
      toast({ title: 'Erro ao salvar', description: error instanceof Error ? error.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLLMConfig = async () => {
    if (!llmConfig) return;
    try {
      setSavingLLM(true);
      await llmConfigService.updateConfig(selectedAgent, {
        provider: llmConfig.provider,
        model_name: llmConfig.model_name,
        temperature: llmConfig.temperature,
        max_tokens: llmConfig.max_tokens
      });
      toast({
        title: 'Modelo salvo',
        description: `${llmConfig.model_name} configurado para ${agentDetail?.meta.name || selectedAgent}.`
      });
    } catch (error) {
      toast({ title: 'Erro ao salvar', description: error instanceof Error ? error.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setSavingLLM(false);
    }
  };

  const handleRunPlayground = async () => {
    if (!playgroundMessage.trim()) {
      toast({ title: 'Mensagem vazia', description: 'Digite uma mensagem para testar.', variant: 'destructive' });
      return;
    }
    try {
      setPlaygroundLoading(true);
      setPlaygroundResult(null);
      const result = await agentControlService.runPlayground({
        module_type: selectedAgent,
        user_message: playgroundMessage.trim(),
        system_prompt: systemPrompt.trim() || undefined,
        ...(playgroundUseCustom ? { provider: playgroundProvider, model_name: playgroundModel } : {})
      });
      setPlaygroundResult(result);
    } catch (error) {
      toast({ title: 'Erro no playground', description: error instanceof Error ? error.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleSaveRanking = async () => {
    if (!rankingProvider || !rankingModel) {
      toast({ title: 'Campos obrigatórios', description: 'Selecione provedor e modelo.', variant: 'destructive' });
      return;
    }
    try {
      setSavingRanking(true);
      await agentControlService.upsertRanking(selectedAgent, {
        provider: rankingProvider,
        model_name: rankingModel,
        stars: rankingStars,
        notes: rankingNotes || undefined,
        cost_rating: rankingCost,
        speed_rating: rankingSpeed,
        quality_rating: rankingQuality
      });
      toast({ title: 'Ranking salvo', description: 'Avaliação do modelo salva com sucesso.' });
      setRankingDialogOpen(false);
      await loadAgentDetail(selectedAgent);
    } catch (error) {
      toast({ title: 'Erro ao salvar ranking', description: error instanceof Error ? error.message : 'Erro desconhecido.', variant: 'destructive' });
    } finally {
      setSavingRanking(false);
    }
  };

  const handleDeleteRanking = async (id: string) => {
    try {
      await agentControlService.deleteRanking(id);
      toast({ title: 'Ranking removido' });
      await loadAgentDetail(selectedAgent);
    } catch (error) {
      toast({ title: 'Erro ao remover', description: error instanceof Error ? error.message : 'Erro desconhecido.', variant: 'destructive' });
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryDialogOpen(true);
      const history = await assistantPromptService.getPromptHistory(selectedAgent);
      setPromptHistory(history);
    } catch (error) {
      toast({ title: 'Erro ao carregar histórico', variant: 'destructive' });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleActivateVersion = async (prompt: AssistantPrompt) => {
    try {
      setSaving(true);
      await assistantPromptService.activatePrompt(prompt.id);
      setHistoryDialogOpen(false);
      toast({ title: 'Versão ativada', description: `Versão v${prompt.version} foi ativada com sucesso.` });
      await loadAgentDetail(selectedAgent);
    } catch (error) {
      toast({ title: 'Erro ao ativar versão', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const getModelsForProvider = (provider: ProviderType): { id: string; name: string; description: string }[] => {
    const providerInfo = (agentDetail?.providers || dashboardData?.providers || []).find(p => p.id === provider);
    return providerInfo?.models || [];
  };

  if (!isOwner) {
    return <Navigate to="/educare-app/welcome" replace />;
  }

  if (loading && !dashboardData && viewMode === 'dashboard') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (viewMode === 'dashboard') {
    const categories = dashboardData?.categories || {};
    const sortedCategories = Object.entries(categories).sort(([, a], [, b]) => a.order - b.order);

    return (
      <>
        <Helmet>
          <title>Central de Agentes IA | Educare+</title>
        </Helmet>

        <div className="container mx-auto py-6 px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Central de Agentes IA</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie todos os {dashboardData?.agents?.length || 0} agentes de IA da plataforma — prompts, modelos e configurações
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Card className="border-dashed">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Bot className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData?.agents?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Agentes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData?.agents?.filter(a => a.prompt).length || 0}</p>
                  <p className="text-xs text-muted-foreground">Configurados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData?.agents?.reduce((sum, a) => sum + (a.stats?.totalVersions || 0), 0) || 0}</p>
                  <p className="text-xs text-muted-foreground">Versões</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Cpu className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData?.providers?.filter(p => p.available).length || 0}</p>
                  <p className="text-xs text-muted-foreground">Provedores</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {dashboardData && dashboardData.providers.length > 0 && (
            <Card className="mb-6 border-dashed">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Provedores de IA Disponíveis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dashboardData.providers.map(provider => (
                    <TooltipProvider key={provider.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant={provider.available ? 'default' : 'secondary'}
                            className={`gap-1.5 ${provider.available ? 'bg-emerald-600 hover:bg-emerald-700' : 'opacity-50'}`}
                          >
                            {provider.available ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {provider.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {provider.available ? `${provider.models.length} modelos disponíveis` : provider.reason || 'Chave não configurada'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {sortedCategories.map(([catKey, catMeta]) => {
            const categoryAgents = (dashboardData?.agents || []).filter(a => a.meta.category === catKey);
            const isCollapsed = collapsedCategories.has(catKey);

            return (
              <div key={catKey} className="mb-6">
                <button
                  onClick={() => toggleCategory(catKey)}
                  className="w-full flex items-center gap-3 mb-3 group"
                >
                  <div className="p-1.5 rounded-lg bg-muted">
                    {CATEGORY_ICONS[catKey] || <Bot className="h-5 w-5" />}
                  </div>
                  <div className="text-left flex-1">
                    <h2 className="text-sm font-semibold">{catMeta.name}</h2>
                    <p className="text-xs text-muted-foreground">{catMeta.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{categoryAgents.length}</Badge>
                  {isCollapsed ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {!isCollapsed && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryAgents.map(agent => (
                      <Card
                        key={agent.module_type}
                        className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
                        onClick={() => openAgentDetail(agent.module_type)}
                      >
                        <div className="h-1" style={{ backgroundColor: agent.meta.color }} />
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: agent.meta.color + '15' }}>
                              <span style={{ color: agent.meta.color }}>
                                {AGENT_ICONS[agent.module_type] || <Bot className="h-5 w-5" />}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm truncate">{agent.meta.name}</h3>
                                {agent.prompt ? (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">v{agent.prompt.version}</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 text-amber-600">Novo</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{agent.meta.description}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Cpu className="h-3 w-3" />
                                <span className="truncate">{agent.llm.model_name}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {sortedCategories.length === 0 && (dashboardData?.agents || []).length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(dashboardData?.agents || []).map(agent => (
                <Card
                  key={agent.module_type}
                  className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
                  onClick={() => openAgentDetail(agent.module_type)}
                >
                  <div className="h-1" style={{ backgroundColor: agent.meta.color }} />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: agent.meta.color + '15' }}>
                        <span style={{ color: agent.meta.color }}>
                          {AGENT_ICONS[agent.module_type] || <Bot className="h-5 w-5" />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{agent.meta.name}</h3>
                          {agent.prompt ? (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">v{agent.prompt.version}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 text-amber-600">Novo</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{agent.meta.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Cpu className="h-3 w-3" />
                          <span className="truncate">{agent.llm.model_name}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-6 border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Variáveis disponíveis nos prompts:
                  <code className="mx-1 text-primary">{'{{child_name}}'}</code>
                  <code className="mx-1 text-primary">{'{{child_age}}'}</code>
                  <code className="mx-1 text-primary">{'{{user_name}}'}</code>
                  <code className="mx-1 text-primary">{'{{current_date}}'}</code>
                  <code className="mx-1 text-primary">{'{{professional_specialty}}'}</code>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const meta = agentDetail?.meta;
  const agentColor = meta?.color || '#8b5cf6';

  return (
    <>
      <Helmet>
        <title>{meta?.name || 'Agente'} | Central de Agentes IA</title>
      </Helmet>

      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={backToDashboard} className="mb-4 gap-1 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao Painel
          </Button>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: agentColor + '15' }}>
              <span style={{ color: agentColor }}>
                {AGENT_ICONS[selectedAgent] || <Bot className="h-5 w-5" />}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{meta?.name || 'Carregando...'}</h1>
              <p className="text-sm text-muted-foreground">{meta?.description}</p>
            </div>
            {agentDetail?.activePrompt && (
              <Badge variant="outline" className="ml-auto" style={{ backgroundColor: agentColor + '15', color: agentColor }}>
                <Check className="h-3 w-3 mr-1" />
                v{agentDetail.activePrompt.version} publicada
              </Badge>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={detailTab} onValueChange={setDetailTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="prompt" className="gap-1.5 text-xs sm:text-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Prompt</span>
              </TabsTrigger>
              <TabsTrigger value="model" className="gap-1.5 text-xs sm:text-sm">
                <Cpu className="h-4 w-4" />
                <span className="hidden sm:inline">Modelo</span>
              </TabsTrigger>
              <TabsTrigger value="ranking" className="gap-1.5 text-xs sm:text-sm">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Ranking</span>
              </TabsTrigger>
              <TabsTrigger value="params" className="gap-1.5 text-xs sm:text-sm">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Parâmetros</span>
              </TabsTrigger>
              <TabsTrigger value="playground" className="gap-1.5 text-xs sm:text-sm">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Playground</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Prompt do Sistema
                      </CardTitle>
                      <CardDescription>
                        Instruções que definem o comportamento e personalidade do assistente
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadHistory} className="gap-1.5">
                      <History className="h-4 w-4" />
                      Histórico
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nome do Prompt</Label>
                      <Input
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        placeholder="Ex: Prompt Principal v1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição (opcional)</Label>
                      <Input
                        value={promptDescription}
                        onChange={(e) => setPromptDescription(e.target.value)}
                        placeholder="Breve descrição das alterações"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Prompt do Sistema</Label>
                      <span className="text-xs text-muted-foreground">
                        {systemPrompt.length} caracteres
                      </span>
                    </div>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Digite as instruções do sistema aqui..."
                      className="min-h-[350px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      {agentDetail?.activePrompt ? (
                        <span>
                          Última publicação: {format(new Date(agentDetail.activePrompt.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          {agentDetail.activePrompt.updater && ` por ${agentDetail.activePrompt.updater.name}`}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          Nenhum prompt configurado ainda
                        </span>
                      )}
                    </div>
                    <Button onClick={handleSavePrompt} disabled={saving} className="gap-2">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Publicar Nova Versão
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 border-dashed">
                <CardContent className="py-4">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Variáveis dinâmicas disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {['{{child_name}}', '{{child_age}}', '{{child_week}}', '{{user_name}}', '{{current_date}}', '{{professional_specialty}}'].map(v => (
                      <code key={v} className="text-xs px-2 py-1 bg-muted rounded text-primary">{v}</code>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="model">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Modelo de IA
                  </CardTitle>
                  <CardDescription>
                    Selecione o provedor e modelo que este agente usará para gerar respostas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {llmConfig && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Provedor de IA</Label>
                          <Select
                            value={llmConfig.provider}
                            onValueChange={(value: ProviderType) => {
                              const models = getModelsForProvider(value);
                              setLlmConfig({
                                ...llmConfig,
                                provider: value,
                                model_name: models[0]?.id || 'gpt-4o-mini'
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(agentDetail?.providers || []).map(provider => (
                                <SelectItem key={provider.id} value={provider.id} disabled={!provider.available}>
                                  <div className="flex items-center gap-2">
                                    {provider.available ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                    {provider.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Select
                            value={llmConfig.model_name}
                            onValueChange={(value) => setLlmConfig({ ...llmConfig, model_name: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getModelsForProvider(llmConfig.provider).map(model => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div className="flex flex-col">
                                    <span>{model.name}</span>
                                    <span className="text-xs text-muted-foreground">{model.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSaveLLMConfig} disabled={savingLLM} className="gap-2">
                          {savingLLM ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Salvar Modelo
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ranking">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Ranking de Modelos
                      </CardTitle>
                      <CardDescription>
                        Avalie modelos que você testou para este agente com notas de 1 a 5 estrelas
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setRankingProvider(llmConfig?.provider || 'openai');
                        setRankingModel(llmConfig?.model_name || 'gpt-4o-mini');
                        setRankingStars(3);
                        setRankingNotes('');
                        setRankingCost('medium');
                        setRankingSpeed('medium');
                        setRankingQuality('medium');
                        setRankingDialogOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      Avaliar Modelo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(agentDetail?.rankings || []).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Nenhuma avaliação ainda</p>
                      <p className="text-sm mt-1">Avalie os modelos que você testou para manter um registro de qualidade</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(agentDetail?.rankings || []).map((ranking) => {
                        const providerInfo = (agentDetail?.providers || []).find(p => p.id === ranking.provider);
                        return (
                          <div key={ranking.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{providerInfo?.name || ranking.provider}</span>
                                <span className="text-muted-foreground text-sm">/ {ranking.model_name}</span>
                              </div>
                              <StarRating value={ranking.stars} size="sm" />
                              <div className="flex flex-wrap gap-2 mt-2">
                                <RatingBadge label="Custo" value={ranking.cost_rating} type="cost" />
                                <RatingBadge label="Velocidade" value={ranking.speed_rating} type="speed" />
                                <RatingBadge label="Qualidade" value={ranking.quality_rating} type="quality" />
                              </div>
                              {ranking.notes && (
                                <p className="text-xs text-muted-foreground mt-2 italic">{ranking.notes}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteRanking(ranking.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="params">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Parâmetros do Modelo
                  </CardTitle>
                  <CardDescription>
                    Ajuste fino do comportamento do modelo de IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {llmConfig && (
                    <>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <Gauge className="h-4 w-4 text-muted-foreground" />
                              Temperatura
                            </Label>
                            <span className="text-sm font-mono font-medium">{llmConfig.temperature.toFixed(1)}</span>
                          </div>
                          <Slider
                            value={[llmConfig.temperature]}
                            onValueChange={([value]) => setLlmConfig({ ...llmConfig, temperature: value })}
                            min={0}
                            max={2}
                            step={0.1}
                          />
                          <p className="text-xs text-muted-foreground">
                            0.0 = respostas precisas e consistentes. 2.0 = respostas mais criativas e variadas.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            Máximo de Tokens
                          </Label>
                          <Input
                            type="number"
                            value={llmConfig.max_tokens}
                            onChange={(e) => setLlmConfig({ ...llmConfig, max_tokens: parseInt(e.target.value) || 1500 })}
                            min={100}
                            max={16000}
                          />
                          <p className="text-xs text-muted-foreground">
                            Limite máximo de tokens na resposta (100-16000). Mais tokens = respostas mais longas e mais custo.
                          </p>
                        </div>
                      </div>

                      {llmConfig.provider === 'custom' && (
                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                          <div className="space-y-2">
                            <Label>URL Base da API</Label>
                            <Input
                              value={llmConfig.additional_params?.base_url || ''}
                              onChange={(e) => setLlmConfig({
                                ...llmConfig,
                                additional_params: { ...llmConfig.additional_params, base_url: e.target.value }
                              })}
                              placeholder="https://api.exemplo.com/v1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Nome do Modelo</Label>
                            <Input
                              value={llmConfig.model_name}
                              onChange={(e) => setLlmConfig({ ...llmConfig, model_name: e.target.value })}
                              placeholder="model-name"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveLLMConfig} disabled={savingLLM} className="gap-2">
                          {savingLLM ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          Salvar Parâmetros
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playground">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Playground
                  </CardTitle>
                  <CardDescription>
                    Teste o prompt atual com o modelo configurado antes de publicar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="playground-custom"
                        checked={playgroundUseCustom}
                        onChange={(e) => setPlaygroundUseCustom(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="playground-custom" className="text-sm cursor-pointer">Usar modelo diferente para teste</Label>
                    </div>
                    {playgroundUseCustom && (
                      <div className="flex items-center gap-2 ml-auto">
                        <Select value={playgroundProvider} onValueChange={(v: ProviderType) => {
                          setPlaygroundProvider(v);
                          const models = getModelsForProvider(v);
                          setPlaygroundModel(models[0]?.id || '');
                        }}>
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(agentDetail?.providers || []).filter(p => p.available).map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={playgroundModel} onValueChange={setPlaygroundModel}>
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getModelsForProvider(playgroundProvider).map(m => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      value={playgroundMessage}
                      onChange={(e) => setPlaygroundMessage(e.target.value)}
                      placeholder="Digite uma pergunta para testar o assistente..."
                      className="min-h-[80px] flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleRunPlayground();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Ctrl+Enter para enviar. Usa o prompt da aba "Prompt" como contexto.
                    </p>
                    <Button onClick={handleRunPlayground} disabled={playgroundLoading} className="gap-2">
                      {playgroundLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Testar
                    </Button>
                  </div>

                  {playgroundResult && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="gap-1">
                          <Cpu className="h-3 w-3" />
                          {playgroundResult.provider} / {playgroundResult.model}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {(playgroundResult.elapsed_ms / 1000).toFixed(1)}s
                        </Badge>
                        {playgroundResult.usage && (
                          <Badge variant="outline" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {playgroundResult.usage.total_tokens || '?'} tokens
                          </Badge>
                        )}
                      </div>

                      <div className="rounded-lg bg-muted/50 border p-4">
                        <p className="text-sm whitespace-pre-wrap">{playgroundResult.response}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Versões - {meta?.name}
            </DialogTitle>
            <DialogDescription>
              Visualize e restaure versões anteriores do prompt
            </DialogDescription>
          </DialogHeader>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : promptHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma versão encontrada
            </div>
          ) : (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3">
                {promptHistory.map((prompt) => (
                  <div
                    key={prompt.id}
                    className={`p-4 border rounded-lg ${prompt.is_active ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{prompt.name}</span>
                        <Badge variant={prompt.is_active ? 'default' : 'secondary'}>v{prompt.version}</Badge>
                        {prompt.is_active && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Ativa
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setPreviewPrompt(prompt); setPreviewDialogOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!prompt.is_active && (
                          <Button variant="outline" size="sm" onClick={() => handleActivateVersion(prompt)} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RefreshCw className="h-4 w-4 mr-1" />Ativar</>}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prompt.description && <p className="mb-1">{prompt.description}</p>}
                      <p>Criado em {format(new Date(prompt.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}{prompt.creator && ` por ${prompt.creator.name}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewPrompt?.name} (v{previewPrompt?.version})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg font-mono">
              {previewPrompt?.system_prompt}
            </pre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rankingDialogOpen} onOpenChange={setRankingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Avaliar Modelo
            </DialogTitle>
            <DialogDescription>
              Registre sua avaliação para este modelo com {meta?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Provedor</Label>
                <Select value={rankingProvider} onValueChange={(v) => {
                  setRankingProvider(v);
                  const models = getModelsForProvider(v as ProviderType);
                  setRankingModel(models[0]?.id || '');
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(agentDetail?.providers || []).map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select value={rankingModel} onValueChange={setRankingModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {getModelsForProvider(rankingProvider as ProviderType).map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Avaliação Geral</Label>
              <StarRating value={rankingStars} onChange={setRankingStars} />
            </div>

            <div className="grid gap-3 grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">Custo</Label>
                <Select value={rankingCost} onValueChange={(v) => setRankingCost(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Velocidade</Label>
                <Select value={rankingSpeed} onValueChange={(v) => setRankingSpeed(v as 'slow' | 'medium' | 'fast')}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Lento</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="fast">Rápido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Qualidade</Label>
                <Select value={rankingQuality} onValueChange={(v) => setRankingQuality(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea
                value={rankingNotes}
                onChange={(e) => setRankingNotes(e.target.value)}
                placeholder="Anotações sobre a performance, qualidade das respostas, etc."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRankingDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRanking} disabled={savingRanking} className="gap-2">
              {savingRanking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              Salvar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptManagement;
