import React, { useState, useEffect } from 'react';
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
import { 
  Bot, 
  UserCog, 
  Save, 
  History, 
  Check, 
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { assistantPromptService, type AssistantPrompt, type CreatePromptData } from '@/services/api/assistantPromptService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PromptManagement: React.FC = () => {
  const { user, hasRole } = useCustomAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'baby' | 'professional'>('baby');
  
  const [babyPrompt, setBabyPrompt] = useState<AssistantPrompt | null>(null);
  const [professionalPrompt, setProfessionalPrompt] = useState<AssistantPrompt | null>(null);
  
  const [babyName, setBabyName] = useState('');
  const [babyDescription, setBabyDescription] = useState('');
  const [babySystemPrompt, setBabySystemPrompt] = useState('');
  
  const [professionalName, setProfessionalName] = useState('');
  const [professionalDescription, setProfessionalDescription] = useState('');
  const [professionalSystemPrompt, setProfessionalSystemPrompt] = useState('');
  
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyModule, setHistoryModule] = useState<'baby' | 'professional'>('baby');
  const [promptHistory, setPromptHistory] = useState<AssistantPrompt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPrompt, setPreviewPrompt] = useState<AssistantPrompt | null>(null);

  const isOwner = hasRole('owner');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      
      const [babyData, professionalData] = await Promise.all([
        assistantPromptService.getActivePromptByModule('baby'),
        assistantPromptService.getActivePromptByModule('professional')
      ]);
      
      setBabyPrompt(babyData);
      setProfessionalPrompt(professionalData);
      
      if (babyData) {
        setBabyName(babyData.name);
        setBabyDescription(babyData.description || '');
        setBabySystemPrompt(babyData.system_prompt);
      }
      
      if (professionalData) {
        setProfessionalName(professionalData.name);
        setProfessionalDescription(professionalData.description || '');
        setProfessionalSystemPrompt(professionalData.system_prompt);
      }
      
    } catch (error) {
      console.error('Erro ao carregar prompts:', error);
      toast({
        title: 'Erro ao carregar prompts',
        description: 'Não foi possível carregar os prompts dos assistentes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = async (moduleType: 'baby' | 'professional') => {
    const name = moduleType === 'baby' ? babyName : professionalName;
    const description = moduleType === 'baby' ? babyDescription : professionalDescription;
    const systemPrompt = moduleType === 'baby' ? babySystemPrompt : professionalSystemPrompt;
    
    if (!name.trim() || !systemPrompt.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e prompt do sistema são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const data: CreatePromptData = {
        module_type: moduleType,
        name: name.trim(),
        description: description.trim() || undefined,
        system_prompt: systemPrompt.trim()
      };
      
      const result = await assistantPromptService.createPrompt(data);
      
      if (moduleType === 'baby') {
        setBabyPrompt(result);
      } else {
        setProfessionalPrompt(result);
      }
      
      toast({
        title: 'Prompt salvo com sucesso',
        description: `Nova versão v${result.version} criada para ${moduleType === 'baby' ? 'TitiNauta' : 'TitiNauta Especialista'}.`
      });
      
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar o prompt.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const loadHistory = async (moduleType: 'baby' | 'professional') => {
    try {
      setLoadingHistory(true);
      setHistoryModule(moduleType);
      setHistoryDialogOpen(true);
      
      const history = await assistantPromptService.getPromptHistory(moduleType);
      setPromptHistory(history);
      
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: 'Erro ao carregar histórico',
        description: 'Não foi possível carregar o histórico de versões.',
        variant: 'destructive'
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleActivateVersion = async (prompt: AssistantPrompt) => {
    try {
      setSaving(true);
      
      await assistantPromptService.activatePrompt(prompt.id);
      
      if (prompt.module_type === 'baby') {
        setBabyPrompt(prompt);
        setBabyName(prompt.name);
        setBabyDescription(prompt.description || '');
        setBabySystemPrompt(prompt.system_prompt);
      } else {
        setProfessionalPrompt(prompt);
        setProfessionalName(prompt.name);
        setProfessionalDescription(prompt.description || '');
        setProfessionalSystemPrompt(prompt.system_prompt);
      }
      
      setHistoryDialogOpen(false);
      
      toast({
        title: 'Versão ativada',
        description: `Versão v${prompt.version} foi ativada com sucesso.`
      });
      
    } catch (error) {
      console.error('Erro ao ativar versão:', error);
      toast({
        title: 'Erro ao ativar versão',
        description: 'Não foi possível ativar esta versão.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewPrompt = (prompt: AssistantPrompt) => {
    setPreviewPrompt(prompt);
    setPreviewDialogOpen(true);
  };

  if (!isOwner) {
    return <Navigate to="/educare-app/welcome" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderPromptEditor = (
    moduleType: 'baby' | 'professional',
    name: string,
    setName: (v: string) => void,
    description: string,
    setDescription: (v: string) => void,
    systemPrompt: string,
    setSystemPrompt: (v: string) => void,
    currentPrompt: AssistantPrompt | null
  ) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {moduleType === 'baby' ? (
            <Bot className="h-6 w-6 text-violet-500" />
          ) : (
            <UserCog className="h-6 w-6 text-teal-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold">
              {moduleType === 'baby' ? 'TitiNauta' : 'TitiNauta Especialista'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {moduleType === 'baby' 
                ? 'Assistente para pais e responsáveis'
                : 'Assistente para profissionais de saúde'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentPrompt && (
            <Badge variant="outline" className="gap-1">
              <Check className="h-3 w-3" />
              v{currentPrompt.version} ativa
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadHistory(moduleType)}
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${moduleType}-name`}>Nome do Prompt</Label>
            <Input
              id={`${moduleType}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Prompt Principal v1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${moduleType}-description`}>Descrição (opcional)</Label>
            <Input
              id={`${moduleType}-description`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição das alterações"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${moduleType}-system-prompt`}>
            Prompt do Sistema
            <span className="text-muted-foreground ml-2 text-xs">
              (Instruções que definem o comportamento do assistente)
            </span>
          </Label>
          <Textarea
            id={`${moduleType}-system-prompt`}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Digite as instruções do sistema aqui..."
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {currentPrompt ? (
              <span>
                Última atualização: {format(new Date(currentPrompt.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Nenhum prompt configurado ainda
              </span>
            )}
          </div>
          
          <Button 
            onClick={() => handleSavePrompt(moduleType)}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Nova Versão
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Prompts | Educare+</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Gerenciamento de Prompts</h1>
          </div>
          <p className="text-muted-foreground">
            Configure os prompts do sistema para cada assistente de IA. Alterações criam novas versões
            e podem ser revertidas a qualquer momento.
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'baby' | 'professional')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="baby" className="gap-2">
                  <Bot className="h-4 w-4" />
                  TitiNauta
                </TabsTrigger>
                <TabsTrigger value="professional" className="gap-2">
                  <UserCog className="h-4 w-4" />
                  TitiNauta Especialista
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="baby">
                {renderPromptEditor(
                  'baby',
                  babyName,
                  setBabyName,
                  babyDescription,
                  setBabyDescription,
                  babySystemPrompt,
                  setBabySystemPrompt,
                  babyPrompt
                )}
              </TabsContent>
              
              <TabsContent value="professional">
                {renderPromptEditor(
                  'professional',
                  professionalName,
                  setProfessionalName,
                  professionalDescription,
                  setProfessionalDescription,
                  professionalSystemPrompt,
                  setProfessionalSystemPrompt,
                  professionalPrompt
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Variáveis Disponíveis</CardTitle>
            <CardDescription>
              Use estas variáveis no seu prompt para personalização dinâmica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{child_name}}'}</code>
                <span className="text-muted-foreground">- Nome da criança</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{child_age}}'}</code>
                <span className="text-muted-foreground">- Idade da criança</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{child_week}}'}</code>
                <span className="text-muted-foreground">- Semana de desenvolvimento</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{user_name}}'}</code>
                <span className="text-muted-foreground">- Nome do usuário</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{current_date}}'}</code>
                <span className="text-muted-foreground">- Data atual</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-primary">{'{{professional_specialty}}'}</code>
                <span className="text-muted-foreground">- Especialidade (profissional)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Versões - {historyModule === 'baby' ? 'TitiNauta' : 'TitiNauta Especialista'}
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
                        <Badge variant={prompt.is_active ? 'default' : 'secondary'}>
                          v{prompt.version}
                        </Badge>
                        {prompt.is_active && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Ativa
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewPrompt(prompt)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!prompt.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateVersion(prompt)}
                            disabled={saving}
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Ativar
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {prompt.description && (
                        <p className="mb-1">{prompt.description}</p>
                      )}
                      <p>
                        Criado em {format(new Date(prompt.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {prompt.creator && ` por ${prompt.creator.name}`}
                      </p>
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
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptManagement;
