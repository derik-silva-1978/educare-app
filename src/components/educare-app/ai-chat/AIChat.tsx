
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  Loader2, 
  ChevronDown, 
  User, 
  Brain,
  Shield,
  Database,
  Sparkles
} from 'lucide-react';
import { useAIAssistant, AIChildContext } from '@/hooks/useAIAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DevelopmentDomain, DomainLabels } from '@/types/assessment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProactiveInsights } from './ProactiveInsights';

export interface AIChatProps {
  assistantType: 'titibot' | 'alcibot';
  title: string;
  initialPrompt?: string;
  childContext?: AIChildContext;
}

export const AIChat: React.FC<AIChatProps> = ({
  assistantType,
  title,
  initialPrompt = '',
  childContext
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; content: string; isDataDriven?: boolean }[]>([]);
  const [isDataSharingEnabled, setIsDataSharingEnabled] = useState<boolean>(!!childContext);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    sendPrompt, 
    isLoading,
    setChildContextData
  } = useAIAssistant();

  // Model selection based on assistant type
  const defaultModel: 'gpt-4o-mini' | 'gpt-4o' = 'gpt-4o-mini';

  // Initial greeting message
  useEffect(() => {
    if (initialPrompt) {
      setMessages([{ role: 'assistant', content: initialPrompt }]);
    }
  }, [initialPrompt]);

  // Listen for suggested questions from external components
  useEffect(() => {
    const handleSuggestedQuestion = (event: Event) => {
      const customEvent = event as CustomEvent<{ question: string }>;
      if (customEvent.detail?.question && textareaRef.current) {
        setInput(customEvent.detail.question);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    };

    window.addEventListener('sendSuggestedQuestion', handleSuggestedQuestion);
    return () => window.removeEventListener('sendSuggestedQuestion', handleSuggestedQuestion);
  }, []);

  // Set child context when available
  useEffect(() => {
    if (childContext) {
      setChildContextData(childContext);
    }
  }, [childContext, setChildContextData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userInput = input;
    setInput('');

    // Focus back on textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Assistant options with domain specialization if selected
    const options = {
      model: defaultModel,
      assistantType,
      domainFocus: selectedDomain,
      includeDomainExpertise: !!selectedDomain
    };

    try {
      // Send prompt to AI service
      const response = await sendPrompt(
        userInput, 
        options,
        undefined,
        isDataSharingEnabled ? childContext : undefined
      );

      if (response) {
        // Add assistant response
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: response.response,
            isDataDriven: response.isDataDriven 
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua solicitação.' }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDomainSelect = (domain: string | null) => {
    setSelectedDomain(domain === selectedDomain ? null : domain);
  };

  const handleDataSharingToggle = () => {
    setIsDataSharingEnabled(prev => !prev);
  };

  const handleInsightClick = (insight: string) => {
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: insight,
      isDataDriven: true
    }]);
  };

  // Get background color based on assistant type
  const getBgColor = () => {
    if (assistantType === 'titibot') {
      return 'bg-blue-50';
    }
    if (assistantType === 'alcibot') {
      return 'bg-rose-50';
    }
    return 'bg-slate-50';
  };
  
  // Get avatar based on assistant type
  const getAvatar = () => {
    if (assistantType === 'titibot') {
      return 'TB';
    }
    if (assistantType === 'alcibot') {
      return 'AB';
    }
    return 'AI';
  };

  // Available development domains for specialists
  const availableDomains: DevelopmentDomain[] = [
    'motor',
    'language',
    'social',
    'cognitive',
    'emotional',
    'communication'
  ];

  // Get header colors based on assistant type
  const getHeaderClasses = () => {
    if (assistantType === 'titibot') {
      return 'bg-slate-800 text-white border-b border-slate-600';
    }
    if (assistantType === 'alcibot') {
      return 'bg-rose-800 text-white border-b border-rose-700';
    }
    return 'bg-slate-800 text-white border-b border-slate-600';
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className={`py-3 px-4 ${getHeaderClasses()}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-white text-slate-800">
              <AvatarFallback>
                {getAvatar()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-base text-white">{title}</CardTitle>
          </div>
          
          {childContext && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch 
                  id="data-sharing" 
                  checked={isDataSharingEnabled}
                  onCheckedChange={handleDataSharingToggle}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-slate-800"
                />
                <Label htmlFor="data-sharing" className="text-xs text-white">
                  Dados personalizados
                </Label>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-slate-100 border-b px-2">
            <TabsList className="h-9 bg-transparent">
              <TabsTrigger value="chat" className="text-xs px-3 py-1.5 text-slate-900">
                <Bot className="h-3.5 w-3.5 mr-1" />
                Chat
              </TabsTrigger>
              {childContext && (
                <TabsTrigger value="specialists" className="text-xs px-3 py-1.5 text-slate-900">
                  <Brain className="h-3.5 w-3.5 mr-1" />
                  Especialistas
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden p-0 m-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary/90 text-white' 
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {message.role === 'user' ? (
                          <>
                            <User className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Você</span>
                          </>
                        ) : (
                          <>
                            <Bot className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">
                              {assistantType === 'titibot' ? 'Titibot' : 'AlciBot'}
                            </span>
                            {message.isDataDriven && (
                              <Badge variant="outline" className="text-[10px] h-4 ml-1 bg-amber-100 text-amber-800 border-amber-300">
                                <Database className="h-2.5 w-2.5 mr-0.5" />
                                Personalizado
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-slate-200 text-slate-900">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {childContext && isDataSharingEnabled && (
              <div className="px-4">
                <ProactiveInsights 
                  childContext={childContext}
                  onInsightClick={handleInsightClick}  
                />
              </div>
            )}
            
            <div className="p-4 border-t bg-slate-100">
              <div className="flex">
                <Textarea
                  ref={textareaRef}
                  placeholder="Digite sua mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-h-[60px] resize-none border-slate-300 text-slate-900"
                />
                <Button
                  className="ml-2 h-auto min-w-[48px] px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  title="Enviar mensagem"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              {selectedDomain && (
                <div className="mt-2 px-3 py-1.5 bg-primary/10 rounded-md border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-slate-900">Modo especialista: <strong>{DomainLabels[selectedDomain as DevelopmentDomain] || selectedDomain}</strong></span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-slate-900"
                    onClick={() => setSelectedDomain(null)}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="specialists" className="flex-1 overflow-auto p-4 m-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-medium text-slate-900">Especialistas por Área de Desenvolvimento</h3>
              </div>
              
              <p className="text-xs text-slate-800">
                Selecione um especialista para obter respostas focadas em uma área específica do desenvolvimento infantil,
                com base nos dados de avaliação de {childContext?.childName}.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {availableDomains.map((domain) => (
                  <Button
                    key={domain}
                    variant={selectedDomain === domain ? "default" : "outline"}
                    className={`justify-start h-auto py-3 ${selectedDomain === domain ? 'bg-primary text-white' : 'text-slate-900 border-slate-300'}`}
                    onClick={() => handleDomainSelect(domain)}
                  >
                    <div className="flex flex-col items-start text-left">
                      <div className="flex items-center">
                        <Shield className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-sm">{DomainLabels[domain]}</span>
                      </div>
                      <span className={`text-xs mt-1 ${selectedDomain === domain ? 'text-white/80' : 'text-slate-700'}`}>
                        Especialista em {DomainLabels[domain].toLowerCase()}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-4 bg-slate-200" />
              
              <div className="rounded-lg border border-slate-300 p-3 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium text-slate-900">Benefícios do Modo Especialista</h4>
                </div>
                <ul className="text-xs space-y-1.5 ml-6 list-disc text-slate-800">
                  <li>Orientações específicas para cada área de desenvolvimento</li>
                  <li>Sugestões personalizadas baseadas nos dados de avaliação</li>
                  <li>Atividades recomendadas por especialistas para cada domínio</li>
                  <li>Orientações alinhadas ao perfil único da criança</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default AIChat;
