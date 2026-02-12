import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getStoredAuthToken } from '@/utils/authStorage';
import {
  LogIn, UserPlus, GitFork, MessageCircle, BookOpen, HelpCircle,
  ClipboardList, LifeBuoy, Star, Pause, LogOut, Send, Phone,
  ChevronDown, ChevronRight, ArrowRight, Settings2, Volume2,
  Image, Activity, CheckCircle, XCircle, Loader2, RefreshCw,
  Map, Play, Baby, Heart
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface StateConfig {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  transitions: string[];
  subStates?: string[];
}

const STATES: Record<string, StateConfig> = {
  ENTRY: {
    name: 'ENTRY', description: 'Ponto de entrada — identifica o usuário',
    color: 'text-blue-500', bgColor: 'bg-blue-500/10 dark:bg-blue-500/20', borderColor: 'border-blue-500/40',
    icon: LogIn, transitions: ['ONBOARDING', 'CONTEXT_SELECTION']
  },
  ONBOARDING: {
    name: 'ONBOARDING', description: 'Coleta nome, gênero e data de nascimento do bebê',
    color: 'text-teal-500', bgColor: 'bg-teal-500/10 dark:bg-teal-500/20', borderColor: 'border-teal-500/40',
    icon: UserPlus, transitions: ['CONTEXT_SELECTION', 'PAUSE', 'EXIT'],
    subStates: ['ASKING_NAME', 'ASKING_GENDER', 'ASKING_BIRTHDATE']
  },
  CONTEXT_SELECTION: {
    name: 'CONTEXT_SELECTION', description: 'Escolha entre Bebê ou Mãe (botões interativos)',
    color: 'text-purple-500', bgColor: 'bg-purple-500/10 dark:bg-purple-500/20', borderColor: 'border-purple-500/40',
    icon: GitFork, transitions: ['FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW']
  },
  FREE_CONVERSATION: {
    name: 'FREE_CONVERSATION', description: 'Conversa livre com TitiNauta (RAG + memória)',
    color: 'text-green-500', bgColor: 'bg-green-500/10 dark:bg-green-500/20', borderColor: 'border-green-500/40',
    icon: MessageCircle, transitions: ['CONTEXT_SELECTION', 'FEEDBACK', 'SUPPORT', 'PAUSE', 'EXIT']
  },
  CONTENT_FLOW: {
    name: 'CONTENT_FLOW', description: 'Exibição de conteúdo da Jornada V2',
    color: 'text-amber-500', bgColor: 'bg-amber-500/10 dark:bg-amber-500/20', borderColor: 'border-amber-500/40',
    icon: BookOpen, transitions: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'QUIZ_FLOW', 'PAUSE']
  },
  QUIZ_FLOW: {
    name: 'QUIZ_FLOW', description: 'Quiz interativo sobre desenvolvimento',
    color: 'text-orange-500', bgColor: 'bg-orange-500/10 dark:bg-orange-500/20', borderColor: 'border-orange-500/40',
    icon: HelpCircle, transitions: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'FEEDBACK', 'PAUSE']
  },
  LOG_FLOW: {
    name: 'LOG_FLOW', description: 'Registro de biometria, sono, vacinas, consultas',
    color: 'text-indigo-500', bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20', borderColor: 'border-indigo-500/40',
    icon: ClipboardList, transitions: ['FREE_CONVERSATION', 'CONTEXT_SELECTION', 'PAUSE']
  },
  SUPPORT: {
    name: 'SUPPORT', description: 'Solicitação de suporte humano',
    color: 'text-red-500', bgColor: 'bg-red-500/10 dark:bg-red-500/20', borderColor: 'border-red-500/40',
    icon: LifeBuoy, transitions: ['CONTEXT_SELECTION', 'FEEDBACK', 'EXIT']
  },
  FEEDBACK: {
    name: 'FEEDBACK', description: 'Coleta de feedback (1-5 estrelas + comentário)',
    color: 'text-pink-500', bgColor: 'bg-pink-500/10 dark:bg-pink-500/20', borderColor: 'border-pink-500/40',
    icon: Star, transitions: ['CONTEXT_SELECTION', 'FREE_CONVERSATION', 'EXIT']
  },
  PAUSE: {
    name: 'PAUSE', description: 'Sessão pausada — retorno ao último estado',
    color: 'text-gray-500', bgColor: 'bg-gray-500/10 dark:bg-gray-500/20', borderColor: 'border-gray-500/40',
    icon: Pause, transitions: ['CONTEXT_SELECTION', 'FREE_CONVERSATION', 'ONBOARDING']
  },
  EXIT: {
    name: 'EXIT', description: 'Encerramento da sessão com resumo',
    color: 'text-slate-700 dark:text-slate-400', bgColor: 'bg-slate-700/10 dark:bg-slate-700/20', borderColor: 'border-slate-700/40',
    icon: LogOut, transitions: ['ENTRY']
  },
};

const STATE_ROWS = [
  ['ENTRY'],
  ['ONBOARDING'],
  ['CONTEXT_SELECTION'],
  ['FREE_CONVERSATION', 'CONTENT_FLOW', 'QUIZ_FLOW', 'LOG_FLOW'],
  ['SUPPORT', 'FEEDBACK', 'PAUSE', 'EXIT'],
];

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

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

const StateMapTab: React.FC = () => {
  const [expandedState, setExpandedState] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Map className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Fluxo de Estados da Conversação</h2>
      </div>

      <div className="space-y-4">
        {STATE_ROWS.map((row, ri) => (
          <div key={ri} className="flex flex-wrap justify-center gap-4">
            {row.map((stateKey) => {
              const s = STATES[stateKey];
              const Icon = s.icon;
              const isExpanded = expandedState === stateKey;
              return (
                <Card
                  key={stateKey}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${s.borderColor} ${s.bgColor} w-full sm:w-auto sm:min-w-[220px] sm:max-w-[280px]`}
                  onClick={() => setExpandedState(isExpanded ? null : stateKey)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${s.bgColor}`}>
                        <Icon className={`h-5 w-5 ${s.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${s.color}`}>{s.name}</span>
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                      </div>
                    </div>

                    {s.subStates && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        {s.subStates.map((sub, i) => (
                          <React.Fragment key={sub}>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{sub}</Badge>
                            {i < s.subStates!.length - 1 && <ArrowRight className="h-3 w-3" />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-medium mb-2">Transições:</p>
                        {s.transitions.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {s.transitions.map((t) => {
                              const target = STATES[t];
                              return (
                                <Badge key={t} variant="secondary" className={`text-[10px] ${target?.color || ''}`}>
                                  <ArrowRight className="h-3 w-3 mr-1" />{t}
                                </Badge>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Retorna ao estado anterior</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}
      </div>

      <Card className="mt-6 border-dashed">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATES).map(([key, s]) => {
              const Icon = s.icon;
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <div className={`w-3 h-3 rounded-full ${s.bgColor} border ${s.borderColor}`} />
                  <span className="text-muted-foreground">{key}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SimulatorTab: React.FC = () => {
  const { toast } = useToast();
  const [phone, setPhone] = useState('5511999999999');
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender, timestamp: new Date() }]);
  };

  const fetchState = useCallback(async () => {
    if (!phone) return;
    try {
      setLoading(true);
      const res = await fetch(buildUrl(`/api/conversation/state?phone=${encodeURIComponent(phone)}`), { headers: getHeaders() });
      const data = await res.json();
      if (data.success && data.data?.state) {
        setCurrentState(data.data.state);
      } else if (data.state) {
        setCurrentState(data.state);
      }
    } catch (e) {
      toast({ title: 'Erro ao buscar estado', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [phone, toast]);

  const fetchOnboardingStatus = useCallback(async () => {
    if (!phone) return;
    try {
      const res = await fetch(buildUrl(`/api/conversation/onboarding/status?phone=${encodeURIComponent(phone)}`), { headers: getHeaders() });
      const data = await res.json();
      setOnboardingStatus(data.data || data);
    } catch {}
  }, [phone]);

  const initializeState = async () => {
    try {
      setLoading(true);
      const res = await fetch(buildUrl('/api/conversation/state'), {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ phone, state: 'ENTRY' })
      });
      const data = await res.json();
      setCurrentState('ENTRY');
      addMessage('Estado inicializado: ENTRY', 'bot');
      toast({ title: 'Estado inicializado' });
    } catch (e) {
      toast({ title: 'Erro ao inicializar', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !phone) return;
    const msg = message.trim();
    setMessage('');
    addMessage(msg, 'user');

    try {
      setLoading(true);
      const res = await fetch(buildUrl('/api/conversation/onboarding'), {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ phone, message: msg })
      });
      const data = await res.json();
      const reply = data.data?.reply || data.reply || data.message || JSON.stringify(data);
      addMessage(reply, 'bot');
      if (data.data?.state || data.state) {
        setCurrentState(data.data?.state || data.state);
      }
    } catch (e) {
      addMessage('Erro ao processar mensagem', 'bot');
    } finally {
      setLoading(false);
    }
  };

  const quickAction = async (action: string) => {
    const actionMap: Record<string, { msg: string; state?: string }> = {
      onboarding: { msg: 'Olá, quero iniciar o cadastro', state: 'ONBOARDING' },
      baby: { msg: 'Quero falar sobre meu bebê' },
      mother: { msg: 'Quero falar sobre saúde materna' },
      feedback: { msg: 'Quero enviar feedback' },
    };
    const a = actionMap[action];
    if (!a) return;

    if (a.state) {
      try {
        setLoading(true);
        await fetch(buildUrl('/api/conversation/state'), {
          method: 'POST', headers: getHeaders(),
          body: JSON.stringify({ phone, state: a.state })
        });
        setCurrentState(a.state);
      } catch {} finally { setLoading(false); }
    }
    addMessage(a.msg, 'user');
    setMessage(a.msg);
  };

  useEffect(() => {
    if (phone.length >= 10) {
      fetchState();
    }
  }, []);

  const stateConfig = currentState ? STATES[currentState] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="bg-[#075E54] dark:bg-[#1F2C34] p-3 flex items-center gap-3">
            <Phone className="h-5 w-5 text-white" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{phone || 'Nenhum número'}</p>
              {stateConfig && (
                <Badge variant="secondary" className={`text-[10px] mt-0.5 ${stateConfig.color}`}>
                  {currentState}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={fetchState} disabled={loading} className="text-white hover:bg-white/10">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <ScrollArea className="h-[400px] bg-[#E5DDD5] dark:bg-[#0B141A] p-4">
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Digite um número e envie uma mensagem para começar
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${
                    m.sender === 'user'
                      ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-foreground'
                      : 'bg-white dark:bg-[#1F2C34] text-foreground'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {m.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Número de Telefone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5511999999999"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={fetchState} disabled={loading} variant="outline" className="flex-1">
                <RefreshCw className="h-3 w-3 mr-1" /> Estado
              </Button>
              <Button size="sm" onClick={initializeState} disabled={loading} className="flex-1">
                <Play className="h-3 w-3 mr-1" /> Iniciar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Estado Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {currentState && stateConfig ? (
              <div className={`p-3 rounded-lg ${stateConfig.bgColor} border ${stateConfig.borderColor}`}>
                <div className="flex items-center gap-2">
                  <stateConfig.icon className={`h-5 w-5 ${stateConfig.color}`} />
                  <span className={`font-semibold text-sm ${stateConfig.color}`}>{currentState}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stateConfig.description}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum estado carregado</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('onboarding')}>
              <UserPlus className="h-3 w-3 mr-2" /> Iniciar Onboarding
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('baby')}>
              <Baby className="h-3 w-3 mr-2" /> Selecionar Bebê
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('mother')}>
              <Heart className="h-3 w-3 mr-2" /> Selecionar Mãe
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => quickAction('feedback')}>
              <Star className="h-3 w-3 mr-2" /> Enviar Feedback
            </Button>
            <Separator />
            <Button size="sm" variant="ghost" className="w-full justify-start text-muted-foreground" onClick={fetchOnboardingStatus}>
              <Activity className="h-3 w-3 mr-2" /> Status Onboarding
            </Button>
            {onboardingStatus && (
              <div className="text-xs bg-muted p-2 rounded-md">
                <pre className="whitespace-pre-wrap">{JSON.stringify(onboardingStatus, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ConfigTab: React.FC = () => {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<any>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(false);
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      setHealthLoading(true);
      const res = await fetch(buildUrl('/api/conversation/health'), { headers: getHeaders() });
      const data = await res.json();
      setHealthData(data.data || data);
    } catch (e) {
      toast({ title: 'Erro ao buscar health check', variant: 'destructive' });
    } finally {
      setHealthLoading(false);
    }
  }, [toast]);

  const testTTS = async () => {
    try {
      setTtsLoading(true);
      const res = await fetch(buildUrl('/api/conversation/tts/test'), {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ text: 'Olá, sou a TitiNauta!' })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'TTS funcionando!' });
      } else {
        toast({ title: 'TTS indisponível', description: data.error || data.message, variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'TTS não configurado', description: 'Endpoint não disponível', variant: 'destructive' });
    } finally {
      setTtsLoading(false);
    }
  };

  const fetchReportPreview = async () => {
    try {
      setReportLoading(true);
      const res = await fetch(buildUrl('/api/conversation/report-image/test?format=ascii'), { headers: getHeaders() });
      const data = await res.json();
      setReportPreview(data.data?.preview || data.preview || JSON.stringify(data, null, 2));
    } catch (e) {
      toast({ title: 'Erro ao carregar preview', variant: 'destructive' });
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Volume2 className="h-5 w-5 text-purple-500" />
            ElevenLabs TTS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-muted">
                {healthData?.tts?.configured ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">{healthData?.tts?.configured ? 'Configurado' : 'Não configurado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-muted">
                {healthData?.tts?.apiKeySet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              </div>
              <div>
                <p className="text-sm font-medium">API Key</p>
                <p className="text-xs text-muted-foreground">{healthData?.tts?.apiKeySet ? 'Configurada' : 'Não configurada'}</p>
              </div>
            </div>
          </div>
          {healthData?.tts?.voice && (
            <div className="text-sm text-muted-foreground">
              Voz selecionada: <Badge variant="secondary">{healthData.tts.voice}</Badge>
            </div>
          )}
          <Button onClick={testTTS} disabled={ttsLoading} variant="outline" size="sm">
            {ttsLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Testar TTS
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Image className="h-5 w-5 text-amber-500" />
            Imagem de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchReportPreview} disabled={reportLoading} variant="outline" size="sm">
            {reportLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Image className="h-4 w-4 mr-2" />}
            Gerar Preview ASCII
          </Button>
          {reportPreview && (
            <ScrollArea className="h-[200px]">
              <pre className="text-xs bg-muted p-3 rounded-lg font-mono whitespace-pre-wrap">{reportPreview}</pre>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-green-500" />
            Health Check
            <Button variant="ghost" size="sm" onClick={fetchHealth} disabled={healthLoading} className="ml-auto">
              <RefreshCw className={`h-4 w-4 ${healthLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading && !healthData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : healthData ? (
            <div className="space-y-3">
              {Object.entries(healthData).map(([key, val]) => {
                if (typeof val === 'object' && val !== null) {
                  return (
                    <div key={key} className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium mb-2 capitalize">{key.replace(/_/g, ' ')}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(val as Record<string, any>).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-2 text-xs">
                            {v === true ? <CheckCircle className="h-3 w-3 text-green-500" /> : v === false ? <XCircle className="h-3 w-3 text-red-500" /> : <div className="h-3 w-3" />}
                            <span className="text-muted-foreground">{k}:</span>
                            <span className="font-medium">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                    <Badge variant={val === true || val === 'ok' || val === 'healthy' ? 'default' : 'secondary'}>
                      {String(val)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Não foi possível carregar os dados</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ConversationSandbox: React.FC = () => {
  const { hasRole } = useCustomAuth();
  const isOwner = hasRole('owner');

  if (!isOwner) {
    return <Navigate to="/educare-app/welcome" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Sandbox Conversacional | Educare+</title>
      </Helmet>

      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sandbox Conversacional</h1>
              <p className="text-sm text-muted-foreground">
                Monitoramento e teste da máquina de estados do WhatsApp
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" /> Mapa de Estados
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2">
              <MessageCircle className="h-4 w-4" /> Simulador
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings2 className="h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <StateMapTab />
          </TabsContent>

          <TabsContent value="simulator">
            <SimulatorTab />
          </TabsContent>

          <TabsContent value="config">
            <ConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ConversationSandbox;
