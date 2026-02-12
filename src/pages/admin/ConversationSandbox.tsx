import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getStoredAuthToken } from '@/utils/authStorage';
import {
  Map, Play, Send, Phone, RefreshCw, Save, X, Plus, Trash2, ChevronUp, ChevronDown,
  ArrowDown, Bot, Link2, Loader2, CheckCircle, XCircle, Eye, Baby, Heart,
  UserPlus, Star, MessageCircle, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface StateConfig {
  id: string;
  state: string;
  display_name: string;
  description: string;
  message_template: string;
  buttons: Array<{ id: string; text: string }>;
  transitions: string[];
  agent_module_types: string[];
  onboarding_config: any | null;
  color: string;
  icon: string;
  is_active: boolean;
  version: number;
  updated_by: string | null;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  buttons?: Array<{ id: string; text: string }>;
  agentLabel?: string;
}

const AGENT_META: Record<string, { name: string; color: string }> = {
  baby: { name: 'TitiNauta (Bebê)', color: '#8b5cf6' },
  mother: { name: 'TitiNauta Materna', color: '#f43f5e' },
  professional: { name: 'TitiNauta Especialista', color: '#14b8a6' },
  quiz_baby: { name: 'Gerador Quiz Bebê', color: '#f59e0b' },
  quiz_mother: { name: 'Gerador Quiz Mãe', color: '#ec4899' },
  content_generator: { name: 'Gerador de Conteúdo', color: '#6366f1' },
  nlp_biometric: { name: 'Parser Biométrico', color: '#06b6d4' },
  nlp_sleep: { name: 'Parser de Sono', color: '#8b5cf6' },
  nlp_vaccine: { name: 'Parser de Vacinas', color: '#22c55e' },
  nlp_appointment: { name: 'Parser de Consultas', color: '#3b82f6' },
};

const ALL_STATES = [
  'ENTRY', 'ONBOARDING', 'CONTEXT_SELECTION', 'FREE_CONVERSATION',
  'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'
];

const STATE_ROWS = [
  ['ENTRY'],
  ['ONBOARDING'],
  ['CONTEXT_SELECTION'],
  ['FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW'],
  ['SUPPORT', 'FEEDBACK'],
  ['PAUSE', 'EXIT'],
];

const buildUrl = (endpoint: string) => {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return API_URL ? `${API_URL}/${clean}` : `/${clean}`;
};

const getHeaders = () => {
  const token = getStoredAuthToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

const formatWhatsApp = (text: string) => {
  if (!text) return '';
  let formatted = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
  formatted = formatted.replace(/~(.*?)~/g, '<del>$1</del>');
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
};

const getAgentForState = (state: string, agents: string[]): string | null => {
  if (agents.length === 0) return null;
  const first = agents[0];
  return AGENT_META[first]?.name || first;
};

const ConversationSandbox: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const { toast } = useToast();
  const isOwner = hasRole('owner');

  const [configs, setConfigs] = useState<StateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<StateConfig>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const configMap = useMemo(() => {
    const map: Record<string, StateConfig> = {};
    configs.forEach(c => { map[c.state] = c; });
    return map;
  }, [configs]);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(buildUrl('/api/conversation/state-config'), { headers: getHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setConfigs(data.data);
      } else if (Array.isArray(data)) {
        setConfigs(data);
      }
    } catch {
      toast({ title: 'Erro ao carregar configurações', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const selectState = useCallback((state: string) => {
    setSelectedState(state);
    const cfg = configMap[state];
    if (cfg) {
      setEditData({
        message_template: cfg.message_template,
        buttons: cfg.buttons ? JSON.parse(JSON.stringify(cfg.buttons)) : [],
        transitions: [...(cfg.transitions || [])],
        agent_module_types: [...(cfg.agent_module_types || [])],
        onboarding_config: cfg.onboarding_config ? JSON.parse(JSON.stringify(cfg.onboarding_config)) : null,
      });
    }
  }, [configMap]);

  const discardChanges = useCallback(() => {
    if (selectedState) selectState(selectedState);
  }, [selectedState, selectState]);

  const saveChanges = useCallback(async () => {
    if (!selectedState) return;
    try {
      setSaving(true);
      const res = await fetch(buildUrl(`/api/conversation/state-config/${selectedState}`), {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast({ title: 'Configuração salva', description: `Estado ${selectedState} atualizado com sucesso.` });
        await fetchConfigs();
      } else {
        toast({ title: 'Erro ao salvar', description: data.error || data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro ao salvar configuração', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }, [selectedState, editData, toast, fetchConfigs]);

  if (!isOwner) return <Navigate to="/educare-app/welcome" replace />;

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedConfig = selectedState ? configMap[selectedState] : null;

  return (
    <>
      <Helmet><title>Jornada Conversacional | Educare+</title></Helmet>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
            <Map className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Jornada Conversacional</h1>
            <p className="text-sm text-muted-foreground">
              Editor da máquina de estados e simulador de conversas — {configs.length} estados configurados
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchConfigs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="editor"><Map className="h-4 w-4 mr-1.5" /> Jornada Conversacional</TabsTrigger>
            <TabsTrigger value="simulator"><MessageCircle className="h-4 w-4 mr-1.5" /> Simulador</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className={selectedState ? 'lg:col-span-3' : 'lg:col-span-5'}>
                <StateMapView
                  configs={configs}
                  configMap={configMap}
                  selectedState={selectedState}
                  onSelect={selectState}
                />
              </div>
              {selectedState && selectedConfig && (
                <div className="lg:col-span-2">
                  <EditPanel
                    config={selectedConfig}
                    editData={editData}
                    setEditData={setEditData}
                    onSave={saveChanges}
                    onDiscard={discardChanges}
                    onClose={() => setSelectedState(null)}
                    saving={saving}
                    allStates={ALL_STATES}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="simulator">
            <SimulatorTab configMap={configMap} configs={configs} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const StateMapView: React.FC<{
  configs: StateConfig[];
  configMap: Record<string, StateConfig>;
  selectedState: string | null;
  onSelect: (s: string) => void;
}> = ({ configMap, selectedState, onSelect }) => {
  return (
    <div className="space-y-3">
      {STATE_ROWS.map((row, ri) => (
        <React.Fragment key={ri}>
          <div className="flex flex-wrap justify-center gap-3">
            {row.map((stateKey) => {
              const cfg = configMap[stateKey];
              const isSelected = selectedState === stateKey;
              const color = cfg?.color || '#6b7280';
              const agentCount = cfg?.agent_module_types?.length || 0;

              return (
                <Card
                  key={stateKey}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg w-full sm:w-auto sm:min-w-[200px] sm:max-w-[240px] border-l-4 ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
                  style={{ borderLeftColor: color }}
                  onClick={() => onSelect(stateKey)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm" style={{ color }}>
                        {cfg?.display_name || stateKey}
                      </span>
                      {cfg?.is_active !== undefined && (
                        cfg.is_active ?
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" /> :
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {cfg?.description || stateKey}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {agentCount > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Bot className="h-3 w-3 mr-0.5" />{agentCount}
                        </Badge>
                      )}
                      {cfg?.version !== undefined && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">v{cfg.version}</Badge>
                      )}
                      {cfg?.buttons && cfg.buttons.length > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {cfg.buttons.length} btn
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {ri < STATE_ROWS.length - 1 && (
            <div className="flex justify-center">
              <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const EditPanel: React.FC<{
  config: StateConfig;
  editData: Partial<StateConfig>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<StateConfig>>>;
  onSave: () => void;
  onDiscard: () => void;
  onClose: () => void;
  saving: boolean;
  allStates: string[];
}> = ({ config, editData, setEditData, onSave, onDiscard, onClose, saving, allStates }) => {
  const buttons = (editData.buttons || []) as Array<{ id: string; text: string }>;
  const transitions = (editData.transitions || []) as string[];
  const agents = (editData.agent_module_types || []) as string[];
  const onboardingConfig = editData.onboarding_config;
  const isOnboarding = config.state === 'ONBOARDING';

  const updateButtons = (newButtons: Array<{ id: string; text: string }>) => {
    setEditData(prev => ({ ...prev, buttons: newButtons }));
  };

  const updateTransitions = (state: string, checked: boolean) => {
    setEditData(prev => {
      const current = [...(prev.transitions || [])];
      if (checked && !current.includes(state)) current.push(state);
      else if (!checked) {
        const idx = current.indexOf(state);
        if (idx >= 0) current.splice(idx, 1);
      }
      return { ...prev, transitions: current };
    });
  };

  const addAgent = (module: string) => {
    if (!agents.includes(module)) {
      setEditData(prev => ({ ...prev, agent_module_types: [...(prev.agent_module_types || []), module] }));
    }
  };

  const removeAgent = (module: string) => {
    setEditData(prev => ({
      ...prev,
      agent_module_types: (prev.agent_module_types || []).filter(a => a !== module),
    }));
  };

  const moveButton = (index: number, direction: -1 | 1) => {
    const newButtons = [...buttons];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newButtons.length) return;
    [newButtons[index], newButtons[newIndex]] = [newButtons[newIndex], newButtons[index]];
    updateButtons(newButtons);
  };

  const availableAgents = Object.keys(AGENT_META).filter(a => !agents.includes(a));

  return (
    <Card className="border-l-4 sticky top-4" style={{ borderLeftColor: config.color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
            <span className="font-bold text-lg">{config.display_name}</span>
            <Badge variant="outline" className="text-xs">v{config.version}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-5 pr-2">
            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" /> Mensagem do TitiNauta
              </h3>
              <Textarea
                value={editData.message_template || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, message_template: e.target.value }))}
                rows={5}
                className="font-mono text-sm"
              />
              {editData.message_template && (
                <div className="mt-2 p-3 rounded-lg bg-white dark:bg-[#202C33] border text-sm">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Eye className="h-3 w-3" /> Preview WhatsApp
                  </div>
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatWhatsApp(editData.message_template) }}
                  />
                </div>
              )}
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Botões Interativos
              </h3>
              <div className="space-y-2">
                {buttons.map((btn, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={btn.id}
                      onChange={(e) => {
                        const nb = [...buttons];
                        nb[i] = { ...nb[i], id: e.target.value };
                        updateButtons(nb);
                      }}
                      placeholder="ID"
                      className="w-24 text-xs"
                    />
                    <Input
                      value={btn.text}
                      onChange={(e) => {
                        const nb = [...buttons];
                        nb[i] = { ...nb[i], text: e.target.value };
                        updateButtons(nb);
                      }}
                      placeholder="Texto do botão"
                      className="flex-1 text-sm"
                    />
                    <Button size="icon" variant="ghost" onClick={() => moveButton(i, -1)} disabled={i === 0}>
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveButton(i, 1)} disabled={i === buttons.length - 1}>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => updateButtons(buttons.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateButtons([...buttons, { id: `btn_${Date.now()}`, text: '' }])}
                  className="w-full"
                >
                  <Plus className="h-3 w-3 mr-1" /> Adicionar Botão
                </Button>
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold mb-2">Transições Permitidas</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {allStates.filter(s => s !== config.state).map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-muted/50">
                    <Checkbox
                      checked={transitions.includes(s)}
                      onCheckedChange={(checked) => updateTransitions(s, !!checked)}
                    />
                    <span className="text-xs">{s}</span>
                  </label>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Bot className="h-4 w-4" /> Agentes IA Vinculados
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {agents.map(a => {
                  const meta = AGENT_META[a];
                  return (
                    <TooltipProvider key={a}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="gap-1 pr-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color || '#888' }} />
                            <span className="text-xs">{meta?.name || a}</span>
                            <a
                              href="/app/owner/prompt-management"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-0.5 hover:text-primary"
                            >
                              <Link2 className="h-3 w-3" />
                            </a>
                            <button onClick={() => removeAgent(a)} className="ml-0.5 hover:text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{meta?.name || a}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
              {availableAgents.length > 0 && (
                <Select onValueChange={addAgent}>
                  <SelectTrigger className="text-sm h-8">
                    <SelectValue placeholder="Vincular agente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map(a => (
                      <SelectItem key={a} value={a}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: AGENT_META[a]?.color }} />
                          {AGENT_META[a]?.name || a}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </section>

            {isOnboarding && onboardingConfig && (
              <>
                <Separator />
                <section>
                  <h3 className="text-sm font-semibold mb-2">Configuração de Onboarding</h3>
                  {onboardingConfig.steps && Array.isArray(onboardingConfig.steps) ? (
                    <div className="space-y-3">
                      {onboardingConfig.steps.map((step: any, idx: number) => (
                        <div key={idx} className="p-2 rounded-lg border bg-muted/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">{step.sub_state || step.name}</Badge>
                            {step.validation_type && (
                              <Badge variant="secondary" className="text-[10px]">{step.validation_type}</Badge>
                            )}
                          </div>
                          <Textarea
                            value={step.message || ''}
                            onChange={(e) => {
                              const newSteps = [...onboardingConfig.steps];
                              newSteps[idx] = { ...newSteps[idx], message: e.target.value };
                              setEditData(prev => ({
                                ...prev,
                                onboarding_config: { ...onboardingConfig, steps: newSteps },
                              }));
                            }}
                            rows={2}
                            className="text-xs font-mono"
                          />
                          {step.buttons && Array.isArray(step.buttons) && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {step.buttons.map((b: any, bi: number) => (
                                <Badge key={bi} variant="outline" className="text-[10px]">{b.text || b}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem configuração de onboarding definida</p>
                  )}
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Última atualização: {config.updated_at
              ? new Date(config.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '—'}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onDiscard}>Descartar</Button>
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SimulatorTab: React.FC<{
  configMap: Record<string, StateConfig>;
  configs: StateConfig[];
}> = ({ configMap, configs }) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState('5511999999999');
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<'child' | 'mother' | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', extra?: Partial<ChatMessage>) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      text, sender, timestamp: new Date(),
      ...extra,
    }]);
  }, []);

  const getAgentLabel = useCallback((state: string): string | null => {
    const cfg = configMap[state];
    if (!cfg?.agent_module_types?.length) return null;
    if (state === 'FREE_CONVERSATION') {
      if (context === 'child') return '🤖 TitiNauta (Bebê)';
      if (context === 'mother') return '🤖 TitiNauta Materna';
    }
    if (state === 'QUIZ_FLOW') {
      return context === 'mother' ? '🤖 Quiz Mãe' : '🤖 Quiz Bebê';
    }
    const agent = getAgentForState(state, cfg.agent_module_types);
    return agent ? `🤖 ${agent}` : null;
  }, [configMap, context]);

  const transitionTo = useCallback((newState: string) => {
    setCurrentState(newState);
    const cfg = configMap[newState];
    if (cfg) {
      const agentLabel = getAgentLabel(newState) || undefined;
      addMessage(cfg.message_template || `Estado: ${cfg.display_name}`, 'bot', {
        buttons: cfg.buttons?.length > 0 ? cfg.buttons : undefined,
        agentLabel,
      });
    }
  }, [configMap, addMessage, getAgentLabel]);

  const initConversation = useCallback(async () => {
    if (!phone) return;
    try {
      setLoading(true);
      await fetch(buildUrl('/api/conversation/state'), {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ phone, state: 'ENTRY' }),
      });
      setCurrentState('ENTRY');
      setMessages([]);
      setContext(null);
      const cfg = configMap['ENTRY'];
      if (cfg) {
        addMessage(cfg.message_template || 'Bem-vindo ao TitiNauta!', 'bot', {
          buttons: cfg.buttons?.length > 0 ? cfg.buttons : undefined,
          agentLabel: getAgentLabel('ENTRY') || undefined,
        });
      }
      toast({ title: 'Conversa iniciada' });
    } catch {
      toast({ title: 'Erro ao iniciar conversa', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [phone, configMap, toast, addMessage, getAgentLabel]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || !phone) return;
    const msg = message.trim();
    setMessage('');
    addMessage(msg, 'user');

    if (currentState === 'ONBOARDING') {
      try {
        setLoading(true);
        const res = await fetch(buildUrl('/api/conversation/onboarding'), {
          method: 'POST', headers: getHeaders(),
          body: JSON.stringify({ phone, message: msg }),
        });
        const data = await res.json();
        const reply = data.data?.reply || data.reply || data.message || JSON.stringify(data);
        const newState = data.data?.state || data.state;
        addMessage(reply, 'bot', { agentLabel: getAgentLabel('ONBOARDING') || undefined });
        if (newState && newState !== currentState) setCurrentState(newState);
      } catch {
        addMessage('Erro ao processar mensagem', 'bot');
      } finally {
        setLoading(false);
      }
    } else {
      addMessage('Mensagem recebida. Use os botões ou transições para navegar.', 'bot', {
        agentLabel: currentState ? getAgentLabel(currentState) || undefined : undefined,
      });
    }
  }, [message, phone, currentState, addMessage, getAgentLabel]);

  const handleButtonClick = useCallback((btnId: string, btnText: string) => {
    addMessage(btnText, 'user');

    if (btnId.includes('baby') || btnId.includes('bebe') || btnId.includes('child')) {
      setContext('child');
    } else if (btnId.includes('mother') || btnId.includes('mae') || btnId.includes('mãe') || btnId.includes('materna')) {
      setContext('mother');
    }

    const cfg = currentState ? configMap[currentState] : null;
    if (cfg?.transitions?.length) {
      const matchedState = cfg.transitions.find(t => t.toLowerCase().includes(btnId.toLowerCase()));
      if (matchedState) {
        transitionTo(matchedState);
        return;
      }
    }

    addMessage(`Botão "${btnText}" clicado.`, 'bot');
  }, [addMessage, currentState, configMap, transitionTo]);

  const quickAction = useCallback((action: string) => {
    const actionMap: Record<string, string> = {
      onboarding: 'ONBOARDING',
      baby: 'CONTEXT_SELECTION',
      mother: 'CONTEXT_SELECTION',
      feedback: 'FEEDBACK',
    };
    const targetState = actionMap[action];
    if (!targetState) return;

    if (action === 'baby') setContext('child');
    if (action === 'mother') setContext('mother');

    const labels: Record<string, string> = {
      onboarding: 'Quero iniciar o cadastro',
      baby: 'Quero falar sobre meu bebê',
      mother: 'Quero falar sobre saúde materna',
      feedback: 'Quero enviar feedback',
    };

    addMessage(labels[action], 'user');
    transitionTo(targetState);
  }, [addMessage, transitionTo]);

  const currentCfg = currentState ? configMap[currentState] : null;
  const currentTransitions = currentCfg?.transitions || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="bg-[#075E54] dark:bg-[#1F2C34] p-3 flex items-center gap-3">
            <Phone className="h-5 w-5 text-white" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{phone || 'Nenhum número'}</p>
              {currentState && (
                <Badge variant="secondary" className="text-[10px] mt-0.5">{currentState}</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={initConversation} disabled={loading} className="text-white hover:bg-white/10">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <ScrollArea className="h-[450px] bg-[#E5DDD5] dark:bg-[#0B141A] p-4">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Clique em "Iniciar Conversa" para começar a simulação
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id}>
                  <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${
                      m.sender === 'user'
                        ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-foreground'
                        : 'bg-white dark:bg-[#202C33] text-foreground'
                    }`}>
                      {m.agentLabel && (
                        <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mb-0.5">{m.agentLabel}</p>
                      )}
                      <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatWhatsApp(m.text) }}
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">
                        {m.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {m.buttons && m.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 ml-2">
                      {m.buttons.map((btn) => (
                        <Button
                          key={btn.id}
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white dark:bg-[#202C33] h-7"
                          onClick={() => handleButtonClick(btn.id, btn.text)}
                        >
                          {btn.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 bg-[#F0F0F0] dark:bg-[#1F2C34] flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading || !message.trim()} size="icon" className="bg-[#075E54] hover:bg-[#064E47]">
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Número de Telefone</h3>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5511999999999" />
            <Button size="sm" onClick={initConversation} disabled={loading} className="w-full">
              <Play className="h-3 w-3 mr-1" /> Iniciar Conversa
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Estado Atual</h3>
            {currentState && currentCfg ? (
              <div className="p-3 rounded-lg border-l-4" style={{ borderLeftColor: currentCfg.color, backgroundColor: `${currentCfg.color}10` }}>
                <span className="font-semibold text-sm" style={{ color: currentCfg.color }}>{currentCfg.display_name}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{currentCfg.description}</p>
                {currentCfg.agent_module_types?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {currentCfg.agent_module_types.map(a => (
                      <Badge key={a} variant="secondary" className="text-[10px]">
                        <Bot className="h-3 w-3 mr-0.5" />{AGENT_META[a]?.name || a}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum estado carregado</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-semibold">Ações Rápidas</h3>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('onboarding')}>
              <UserPlus className="h-3 w-3 mr-2" /> Onboarding
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('baby')}>
              <Baby className="h-3 w-3 mr-2" /> Contexto Bebê
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('mother')}>
              <Heart className="h-3 w-3 mr-2" /> Contexto Mãe
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('feedback')}>
              <Star className="h-3 w-3 mr-2" /> Feedback
            </Button>
          </CardContent>
        </Card>

        {currentTransitions.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-semibold">Transições Disponíveis</h3>
              <div className="space-y-1">
                {currentTransitions.map(t => {
                  const tCfg = configMap[t];
                  return (
                    <Button
                      key={t}
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start text-xs h-7"
                      onClick={() => {
                        addMessage(`Ir para ${tCfg?.display_name || t}`, 'user');
                        transitionTo(t);
                      }}
                    >
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tCfg?.color || '#888' }} />
                      {tCfg?.display_name || t}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConversationSandbox;
