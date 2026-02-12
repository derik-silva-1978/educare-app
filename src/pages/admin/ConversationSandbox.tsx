import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getStoredAuthToken } from '@/utils/authStorage';
import {
  Map, Play, Send, RefreshCw, Save, X, Plus, Trash2, ChevronUp, ChevronDown,
  Bot, Loader2, CheckCircle, XCircle, Eye,
  UserPlus, Star, MessageCircle, Sparkles, ChevronRight, Info,
  ArrowRight, Zap, Settings2, Hash, Volume2, FileText, HelpCircle, Layers
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
  stateLabel?: string;
}

const AGENT_META: Record<string, { name: string; color: string; desc: string }> = {
  baby: { name: 'TitiNauta (Bebe)', color: '#8b5cf6', desc: 'Assistente para desenvolvimento infantil' },
  mother: { name: 'TitiNauta Materna', color: '#f43f5e', desc: 'Assistente para saude materna' },
  professional: { name: 'TitiNauta Especialista', color: '#14b8a6', desc: 'Assistente para profissionais' },
  quiz_baby: { name: 'Gerador Quiz Bebe', color: '#f59e0b', desc: 'Gera quizzes de desenvolvimento' },
  quiz_mother: { name: 'Gerador Quiz Mae', color: '#ec4899', desc: 'Gera quizzes de saude materna' },
  content_generator: { name: 'Gerador de Conteudo', color: '#6366f1', desc: 'Gera conteudo educacional' },
  nlp_biometric: { name: 'Parser Biometrico', color: '#06b6d4', desc: 'Interpreta dados biometricos' },
  nlp_sleep: { name: 'Parser de Sono', color: '#8b5cf6', desc: 'Interpreta registros de sono' },
  nlp_vaccine: { name: 'Parser de Vacinas', color: '#22c55e', desc: 'Interpreta dados de vacinacao' },
  nlp_appointment: { name: 'Parser de Consultas', color: '#3b82f6', desc: 'Interpreta agendamentos' },
};

const ALL_STATES = [
  'ENTRY', 'ONBOARDING', 'CONTEXT_SELECTION', 'FREE_CONVERSATION',
  'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW', 'SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'
];

const STATE_ICON_MAP: Record<string, React.ReactNode> = {
  ENTRY: <Zap className="h-4 w-4" />,
  ONBOARDING: <UserPlus className="h-4 w-4" />,
  CONTEXT_SELECTION: <Layers className="h-4 w-4" />,
  FREE_CONVERSATION: <MessageCircle className="h-4 w-4" />,
  CONTENT_FLOW: <FileText className="h-4 w-4" />,
  QUIZ_FLOW: <HelpCircle className="h-4 w-4" />,
  LOG_FLOW: <Hash className="h-4 w-4" />,
  SUPPORT: <Settings2 className="h-4 w-4" />,
  FEEDBACK: <Star className="h-4 w-4" />,
  PAUSE: <Volume2 className="h-4 w-4" />,
  EXIT: <X className="h-4 w-4" />,
};

const STATE_CATEGORY: Record<string, string> = {
  ENTRY: 'Inicio',
  ONBOARDING: 'Inicio',
  CONTEXT_SELECTION: 'Navegacao',
  FREE_CONVERSATION: 'Conversa',
  CONTENT_FLOW: 'Conversa',
  QUIZ_FLOW: 'Conversa',
  LOG_FLOW: 'Conversa',
  SUPPORT: 'Suporte',
  FEEDBACK: 'Suporte',
  PAUSE: 'Controle',
  EXIT: 'Controle',
};

const CATEGORY_COLORS: Record<string, string> = {
  Inicio: '#3b82f6',
  Navegacao: '#8b5cf6',
  Conversa: '#10b981',
  Suporte: '#f59e0b',
  Controle: '#6b7280',
};

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

const ConversationSandbox: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const { toast } = useToast();
  const isOwner = hasRole('owner');

  const [configs, setConfigs] = useState<StateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<StateConfig>>({});
  const [saving, setSaving] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

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
      toast({ title: 'Erro ao carregar configuracoes', variant: 'destructive' });
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
        toast({ title: 'Salvo com sucesso', description: `${selectedState} atualizado.` });
        await fetchConfigs();
      } else {
        toast({ title: 'Erro ao salvar', description: data.error || data.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }, [selectedState, editData, toast, fetchConfigs]);

  if (!isOwner) return <Navigate to="/educare-app/welcome" replace />;

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando mapa conversacional...</p>
        </div>
      </div>
    );
  }

  const selectedConfig = selectedState ? configMap[selectedState] : null;
  const activeStates = configs.filter(c => c.is_active).length;
  const totalAgents = new Set(configs.flatMap(c => c.agent_module_types || [])).size;
  const totalButtons = configs.reduce((sum, c) => sum + (c.buttons?.length || 0), 0);

  return (
    <>
      <Helmet><title>Jornada Conversacional | Educare+</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
        <div className="container mx-auto py-4 px-4 max-w-[1600px]">

          <header className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Map className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Jornada Conversacional</h1>
                  <p className="text-xs text-muted-foreground">
                    Mapa de estados do WhatsApp &middot; Edite mensagens, botoes e transicoes em tempo real
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showSimulator ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSimulator(!showSimulator)}
                  className="gap-1.5"
                >
                  <Play className="h-3.5 w-3.5" />
                  {showSimulator ? 'Ocultar Simulador' : 'Abrir Simulador'}
                </Button>
                <Button variant="outline" size="sm" onClick={fetchConfigs} disabled={loading}>
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Estados Ativos" value={`${activeStates}/${configs.length}`} icon={<Layers className="h-4 w-4" />} color="blue" />
              <MetricCard label="Agentes IA" value={String(totalAgents)} icon={<Bot className="h-4 w-4" />} color="violet" />
              <MetricCard label="Botoes Interativos" value={String(totalButtons)} icon={<Sparkles className="h-4 w-4" />} color="amber" />
              <MetricCard label="Fluxo n8n" value="76 nos" icon={<Zap className="h-4 w-4" />} color="green" />
            </div>
          </header>

          <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 220px)' }}>
            <div className={`transition-all duration-300 ${selectedState ? (showSimulator ? 'w-[30%]' : 'w-[45%]') : (showSimulator ? 'w-[55%]' : 'w-full')}`}>
              <StateMapPanel
                configs={configs}
                configMap={configMap}
                selectedState={selectedState}
                hoveredState={hoveredState}
                onSelect={selectState}
                onHover={setHoveredState}
              />
            </div>

            {selectedState && selectedConfig && (
              <div className={`transition-all duration-300 ${showSimulator ? 'w-[35%]' : 'w-[55%]'}`}>
                <EditorPanel
                  config={selectedConfig}
                  editData={editData}
                  setEditData={setEditData}
                  onSave={saveChanges}
                  onDiscard={discardChanges}
                  onClose={() => setSelectedState(null)}
                  saving={saving}
                  allStates={ALL_STATES}
                  configMap={configMap}
                />
              </div>
            )}

            {showSimulator && (
              <div className={`transition-all duration-300 ${selectedState ? 'w-[35%]' : 'w-[45%]'}`}>
                <SimulatorPanel configMap={configMap} configs={configs} mapSelectedState={selectedState} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
  };
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border ${colorClasses[color] || colorClasses.blue}`}>
      {icon}
      <div>
        <p className="text-xs opacity-70 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold leading-none">{value}</p>
      </div>
    </div>
  );
};


const StateMapPanel: React.FC<{
  configs: StateConfig[];
  configMap: Record<string, StateConfig>;
  selectedState: string | null;
  hoveredState: string | null;
  onSelect: (s: string) => void;
  onHover: (s: string | null) => void;
}> = ({ configs, configMap, selectedState, hoveredState, onSelect, onHover }) => {

  const categories = useMemo(() => {
    const cats: Record<string, string[]> = {};
    ALL_STATES.forEach(s => {
      const cat = STATE_CATEGORY[s] || 'Outro';
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(s);
    });
    return cats;
  }, []);

  const hoveredTransitions = useMemo(() => {
    if (!hoveredState) return new Set<string>();
    const cfg = configMap[hoveredState];
    return new Set(cfg?.transitions || []);
  }, [hoveredState, configMap]);

  const selectedTransitions = useMemo(() => {
    if (!selectedState) return new Set<string>();
    const cfg = configMap[selectedState];
    return new Set(cfg?.transitions || []);
  }, [selectedState, configMap]);

  return (
    <Card className="h-full border-0 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-sm">Mapa de Estados</span>
          <Badge variant="secondary" className="text-[10px] ml-1">{configs.length} estados</Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[280px] text-xs">
              <p className="font-semibold mb-1">Como usar o mapa:</p>
              <ul className="space-y-0.5 list-disc pl-3">
                <li>Clique num estado para abrir o editor</li>
                <li>Passe o mouse para ver as transicoes</li>
                <li>Setas indicam para onde o estado pode ir</li>
                <li>Estados em cinza estao desativados</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ScrollArea className="h-[calc(100%-48px)]">
        <div className="p-3 space-y-4">
          <div className="flex flex-wrap gap-1.5 mb-1">
            {Object.entries(CATEGORY_COLORS).map(([cat, clr]) => (
              <div key={cat} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: clr, opacity: 0.7 }} />
                <span>{cat}</span>
              </div>
            ))}
          </div>

          {Object.entries(categories).map(([category, states]) => (
            <div key={category}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] || '#888' }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{category}</span>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(states.length, 2)}, 1fr)` }}>
                {states.map(stateKey => {
                  const cfg = configMap[stateKey];
                  const isSelected = selectedState === stateKey;
                  const isHovered = hoveredState === stateKey;
                  const isTransitionTarget = hoveredTransitions.has(stateKey) || selectedTransitions.has(stateKey);
                  const agentCount = cfg?.agent_module_types?.length || 0;
                  const btnCount = cfg?.buttons?.length || 0;
                  const transCount = cfg?.transitions?.length || 0;
                  const catColor = CATEGORY_COLORS[STATE_CATEGORY[stateKey] || 'Outro'] || '#888';

                  return (
                    <div
                      key={stateKey}
                      className={`
                        relative cursor-pointer rounded-lg border p-2.5 transition-all duration-200
                        ${isSelected
                          ? 'ring-2 ring-blue-500 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                          : isTransitionTarget
                            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm'
                            : isHovered
                              ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                        ${!cfg?.is_active ? 'opacity-50' : ''}
                      `}
                      onClick={() => onSelect(stateKey)}
                      onMouseEnter={() => onHover(stateKey)}
                      onMouseLeave={() => onHover(null)}
                    >
                      {isTransitionTarget && !isSelected && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2">
                          <ArrowRight className="h-3 w-3 text-emerald-500" />
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                          {STATE_ICON_MAP[stateKey] || <Zap className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-semibold text-xs truncate">{cfg?.display_name || stateKey}</span>
                            {cfg?.is_active ? (
                              <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1.5">
                            {cfg?.description || 'Sem descricao'}
                          </p>
                          <div className="flex items-center gap-1 flex-wrap">
                            {agentCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                <Bot className="h-2.5 w-2.5" />{agentCount}
                              </span>
                            )}
                            {btnCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                <Sparkles className="h-2.5 w-2.5" />{btnCount}
                              </span>
                            )}
                            {transCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                <ArrowRight className="h-2.5 w-2.5" />{transCount}
                              </span>
                            )}
                            <span className="text-[9px] text-muted-foreground">v{cfg?.version || 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};


const EditorPanel: React.FC<{
  config: StateConfig;
  editData: Partial<StateConfig>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<StateConfig>>>;
  onSave: () => void;
  onDiscard: () => void;
  onClose: () => void;
  saving: boolean;
  allStates: string[];
  configMap: Record<string, StateConfig>;
}> = ({ config, editData, setEditData, onSave, onDiscard, onClose, saving, allStates, configMap }) => {
  const buttons = (editData.buttons || []) as Array<{ id: string; text: string }>;
  const transitions = (editData.transitions || []) as string[];
  const agents = (editData.agent_module_types || []) as string[];
  const onboardingConfig = editData.onboarding_config;
  const isOnboarding = config.state === 'ONBOARDING';

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    message: true, buttons: true, transitions: false, agents: false, onboarding: false
  });

  const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

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
  const catColor = CATEGORY_COLORS[STATE_CATEGORY[config.state] || 'Outro'] || '#888';

  return (
    <Card className="h-full border-0 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col">
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
              {STATE_ICON_MAP[config.state] || <Zap className="h-4 w-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{config.display_name}</span>
                <Badge variant="outline" className="text-[9px] h-4">v{config.version}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Clique nas secoes abaixo para editar &middot; Ultima att: {config.updated_at
                  ? new Date(config.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={onSave} disabled={saving} className="h-7 text-xs gap-1">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={onDiscard} className="h-7 text-xs">Descartar</Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7"><X className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">

          <CollapsibleSection
            title="Mensagem do TitiNauta"
            icon={<MessageCircle className="h-3.5 w-3.5" />}
            hint="A mensagem enviada ao usuario neste estado"
            isOpen={openSections.message}
            onToggle={() => toggleSection('message')}
            badge={editData.message_template ? `${editData.message_template.length} chars` : undefined}
          >
            <Textarea
              value={editData.message_template || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, message_template: e.target.value }))}
              rows={4}
              className="font-mono text-xs resize-none"
              placeholder="Ex: Ola {baby_name}! Como posso ajudar hoje?"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Use *negrito*, _italico_, ~riscado~ e {'{'+'baby_name}'} para personalizar
            </p>
            {editData.message_template && (
              <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-[#202C33] border text-xs">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                  <Eye className="h-3 w-3" /> Preview WhatsApp
                </div>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatWhatsApp(editData.message_template) }} />
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Botoes Interativos"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            hint="Botoes que aparecem na mensagem WhatsApp (max 3)"
            isOpen={openSections.buttons}
            onToggle={() => toggleSection('buttons')}
            badge={buttons.length > 0 ? `${buttons.length} botoes` : undefined}
          >
            <div className="space-y-1.5">
              {buttons.map((btn, i) => (
                <div key={i} className="flex items-center gap-1.5 group">
                  <Input
                    value={btn.id}
                    onChange={(e) => {
                      const nb = [...buttons];
                      nb[i] = { ...nb[i], id: e.target.value };
                      updateButtons(nb);
                    }}
                    placeholder="ID"
                    className="w-20 text-[11px] h-7"
                  />
                  <Input
                    value={btn.text}
                    onChange={(e) => {
                      const nb = [...buttons];
                      nb[i] = { ...nb[i], text: e.target.value };
                      updateButtons(nb);
                    }}
                    placeholder="Texto do botao"
                    className="flex-1 text-xs h-7"
                  />
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => moveButton(i, -1)} disabled={i === 0} className="h-6 w-6">
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveButton(i, 1)} disabled={i === buttons.length - 1} className="h-6 w-6">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => updateButtons(buttons.filter((_, j) => j !== i))} className="h-6 w-6">
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {buttons.length < 3 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateButtons([...buttons, { id: `btn_${Date.now()}`, text: '' }])}
                  className="w-full h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Adicionar Botao
                </Button>
              )}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Transicoes Permitidas"
            icon={<ArrowRight className="h-3.5 w-3.5" />}
            hint="Para quais estados este estado pode navegar"
            isOpen={openSections.transitions}
            onToggle={() => toggleSection('transitions')}
            badge={transitions.length > 0 ? `${transitions.length} destinos` : undefined}
          >
            <div className="grid grid-cols-2 gap-1">
              {allStates.filter(s => s !== config.state).map(s => {
                const sCfg = configMap[s];
                const isChecked = transitions.includes(s);
                return (
                  <label
                    key={s}
                    className={`flex items-center gap-1.5 text-xs cursor-pointer p-1.5 rounded transition-colors ${
                      isChecked ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => updateTransitions(s, !!checked)}
                    />
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[STATE_CATEGORY[s] || ''] || '#888' }} />
                    <span className="truncate text-[11px]">{sCfg?.display_name || s}</span>
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Agentes IA Vinculados"
            icon={<Bot className="h-3.5 w-3.5" />}
            hint="Quais modelos de IA respondem neste estado"
            isOpen={openSections.agents}
            onToggle={() => toggleSection('agents')}
            badge={agents.length > 0 ? `${agents.length} agentes` : undefined}
          >
            {agents.length > 0 && (
              <div className="space-y-1 mb-2">
                {agents.map(a => {
                  const meta = AGENT_META[a];
                  return (
                    <div key={a} className="flex items-center gap-2 p-1.5 rounded-md bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/40 dark:border-violet-800/30">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta?.color || '#888' }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium">{meta?.name || a}</span>
                        <p className="text-[9px] text-muted-foreground">{meta?.desc || ''}</p>
                      </div>
                      <button onClick={() => removeAgent(a)} className="text-red-400 hover:text-red-500 shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {availableAgents.length > 0 && (
              <Select onValueChange={addAgent}>
                <SelectTrigger className="text-xs h-7">
                  <SelectValue placeholder="Vincular agente..." />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map(a => (
                    <SelectItem key={a} value={a}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: AGENT_META[a]?.color }} />
                        <span className="text-xs">{AGENT_META[a]?.name || a}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CollapsibleSection>

          {isOnboarding && onboardingConfig && (
            <CollapsibleSection
              title="Configuracao de Onboarding"
              icon={<UserPlus className="h-3.5 w-3.5" />}
              hint="Passos de coleta de dados do bebe (nome, genero, nascimento)"
              isOpen={openSections.onboarding}
              onToggle={() => toggleSection('onboarding')}
              badge={onboardingConfig.steps ? `${onboardingConfig.steps.length} passos` : undefined}
            >
              {onboardingConfig.steps && Array.isArray(onboardingConfig.steps) ? (
                <div className="space-y-2">
                  {onboardingConfig.steps.map((step: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant="outline" className="text-[9px] h-4">{step.sub_state || step.name}</Badge>
                        {step.validation_type && (
                          <Badge variant="secondary" className="text-[9px] h-4">{step.validation_type}</Badge>
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
                        className="text-[11px] font-mono resize-none"
                      />
                      {step.buttons && Array.isArray(step.buttons) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.buttons.map((b: any, bi: number) => (
                            <Badge key={bi} variant="outline" className="text-[9px]">{b.text || b}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Sem configuracao de onboarding definida</p>
              )}
            </CollapsibleSection>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};


const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  hint: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}> = ({ title, icon, hint, isOpen, onToggle, badge, children }) => (
  <div className={`rounded-lg border transition-colors ${isOpen ? 'bg-muted/20 border-slate-200 dark:border-slate-700' : 'border-transparent hover:bg-muted/10'}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 p-2.5 text-left"
    >
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold">{title}</span>
          {badge && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{badge}</span>}
        </div>
        {!isOpen && <p className="text-[10px] text-muted-foreground truncate">{hint}</p>}
      </div>
      <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
    </button>
    {isOpen && <div className="px-2.5 pb-2.5">{children}</div>}
  </div>
);


const SimulatorPanel: React.FC<{
  configMap: Record<string, StateConfig>;
  configs: StateConfig[];
  mapSelectedState: string | null;
}> = ({ configMap, configs, mapSelectedState }) => {
  const { toast } = useToast();
  const [phone, setPhone] = useState('5511999999999');
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<'child' | 'mother' | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      if (context === 'child') return 'TitiNauta (Bebe)';
      if (context === 'mother') return 'TitiNauta Materna';
    }
    if (state === 'QUIZ_FLOW') {
      return context === 'mother' ? 'Quiz Mae' : 'Quiz Bebe';
    }
    const first = cfg.agent_module_types[0];
    return AGENT_META[first]?.name || first;
  }, [configMap, context]);

  const transitionTo = useCallback((newState: string) => {
    setCurrentState(newState);
    const cfg = configMap[newState];
    if (cfg) {
      addMessage(cfg.message_template || `Estado: ${cfg.display_name}`, 'bot', {
        buttons: cfg.buttons?.length > 0 ? cfg.buttons : undefined,
        agentLabel: getAgentLabel(newState) || undefined,
        stateLabel: cfg.display_name,
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
          stateLabel: cfg.display_name,
        });
      }
      toast({ title: 'Conversa iniciada' });
    } catch {
      toast({ title: 'Erro ao iniciar', variant: 'destructive' });
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
        addMessage(reply, 'bot', {
          agentLabel: getAgentLabel('ONBOARDING') || undefined,
          stateLabel: configMap['ONBOARDING']?.display_name,
        });
        if (newState && newState !== currentState) setCurrentState(newState);
      } catch {
        addMessage('Erro ao processar mensagem', 'bot');
      } finally {
        setLoading(false);
      }
    } else {
      addMessage('Mensagem recebida. Use os botoes ou transicoes para navegar.', 'bot', {
        agentLabel: currentState ? getAgentLabel(currentState) || undefined : undefined,
        stateLabel: currentState ? configMap[currentState]?.display_name : undefined,
      });
    }
  }, [message, phone, currentState, addMessage, getAgentLabel, configMap]);

  const handleButtonClick = useCallback((btnId: string, btnText: string) => {
    addMessage(btnText, 'user');
    if (btnId.includes('baby') || btnId.includes('bebe') || btnId.includes('child')) setContext('child');
    else if (btnId.includes('mother') || btnId.includes('mae') || btnId.includes('materna')) setContext('mother');

    const cfg = currentState ? configMap[currentState] : null;
    if (cfg?.transitions?.length) {
      const matchedState = cfg.transitions.find(t => t.toLowerCase().includes(btnId.toLowerCase()));
      if (matchedState) { transitionTo(matchedState); return; }
    }
    addMessage(`Botao "${btnText}" clicado.`, 'bot');
  }, [addMessage, currentState, configMap, transitionTo]);

  const currentCfg = currentState ? configMap[currentState] : null;
  const currentTransitions = currentCfg?.transitions || [];

  return (
    <Card className="h-full border-0 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] p-2.5 flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white text-xs font-semibold">TitiNauta Simulador</p>
          <div className="flex items-center gap-1.5">
            {currentState && currentCfg ? (
              <span className="text-[10px] text-white/80">{currentCfg.display_name}</span>
            ) : (
              <span className="text-[10px] text-white/60">Clique em Iniciar</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={initConversation} disabled={loading} className="h-7 w-7 text-white hover:bg-white/10">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="px-2.5 py-2 border-b bg-muted/30 shrink-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="5511999999999"
            className="flex-1 h-7 text-xs"
          />
          <Button size="sm" onClick={initConversation} disabled={loading} className="h-7 text-xs gap-1 bg-[#075E54] hover:bg-[#064E47]">
            <Play className="h-3 w-3" /> Iniciar
          </Button>
        </div>
        {mapSelectedState && mapSelectedState !== currentState && currentState && (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-6 text-[10px] gap-1 border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
            onClick={() => {
              addMessage(`Navegar para ${configMap[mapSelectedState]?.display_name || mapSelectedState}`, 'user');
              transitionTo(mapSelectedState);
            }}
          >
            <ArrowRight className="h-2.5 w-2.5" />
            Ir para {configMap[mapSelectedState]?.display_name || mapSelectedState} (selecionado no mapa)
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#E5DDD5] dark:bg-[#0B141A] p-3"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      >
        <div className="space-y-2.5">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/80 dark:bg-slate-800 mx-auto flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground/60">Simulador WhatsApp</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">Digite um telefone e clique em Iniciar</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id}>
              <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-foreground rounded-tr-none'
                    : 'bg-white dark:bg-[#202C33] text-foreground rounded-tl-none'
                }`}>
                  {m.stateLabel && m.sender === 'bot' && (
                    <p className="text-[9px] font-medium text-blue-500 dark:text-blue-400 mb-0.5 flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" />{m.stateLabel}
                      {m.agentLabel && <span className="text-violet-500"> &middot; {m.agentLabel}</span>}
                    </p>
                  )}
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatWhatsApp(m.text) }} />
                  <p className="text-[9px] text-muted-foreground mt-0.5 text-right">
                    {m.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {m.buttons && m.buttons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 ml-1">
                  {m.buttons.map((btn) => (
                    <Button
                      key={btn.id}
                      size="sm"
                      variant="outline"
                      className="text-[10px] bg-white dark:bg-[#202C33] h-6 px-2"
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
      </div>

      {currentTransitions.length > 0 && (
        <div className="px-2.5 py-1.5 border-t bg-muted/20 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[9px] text-muted-foreground shrink-0">Ir para:</span>
            {currentTransitions.map(t => {
              const tCfg = configMap[t];
              return (
                <Button
                  key={t}
                  size="sm"
                  variant="ghost"
                  className="text-[10px] h-5 px-1.5 shrink-0"
                  onClick={() => {
                    addMessage(`Ir para ${tCfg?.display_name || t}`, 'user');
                    transitionTo(t);
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: CATEGORY_COLORS[STATE_CATEGORY[t] || ''] || '#888' }} />
                  {tCfg?.display_name || t}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-2 bg-[#F0F0F0] dark:bg-[#1F2C34] flex gap-1.5 shrink-0">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 h-8 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading || !message.trim()} size="icon" className="h-8 w-8 bg-[#075E54] hover:bg-[#064E47]">
          <Send className="h-3.5 w-3.5 text-white" />
        </Button>
      </div>
    </Card>
  );
};

export default ConversationSandbox;
