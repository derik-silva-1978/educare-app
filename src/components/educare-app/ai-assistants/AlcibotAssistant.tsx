
import React, { useState, useEffect } from 'react';
import { Heart, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import useAccessibility from '@/hooks/useAccessibility';
import { useAIAssistant } from '@/hooks/useAIAssistant';

interface AlcibotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlcibotAssistant: React.FC<AlcibotAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<string[]>([
    'AlciBot: Olá! Sou sua assistente de saúde materna. Como posso ajudar você hoje?'
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
  const { announce } = useAccessibility();
  const { sendPrompt, isLoading: isAILoading } = useAIAssistant();

  useEffect(() => {
    if (isOpen) {
      announce('Assistente AlciBot aberto');
    } else {
      announce('Assistente AlciBot fechado');
    }
  }, [isOpen, announce]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = `Você: ${input}`;
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      // Create a specialized system message for AlciBot
      const systemMessage = `Você é AlciBot, uma assistente especializada em saúde materna que acompanha gestantes e mães no pós-parto.
Seu tom é calmo, empático e acolhedor. Você fornece orientações baseadas em evidências científicas.
${pregnancyWeek ? `A gestante está na semana ${pregnancyWeek} de gravidez.` : ''}`;
      
      const response = await sendPrompt(input, {
        systemMessage,
        model: "gpt-4o-mini",
        temperature: 0.7
      });

      if (response) {
        setMessages(prevMessages => [...prevMessages, `AlciBot: ${response.response}`]);
      }
    } catch (error) {
      console.error('Error getting AlciBot response:', error);
      setMessages(prevMessages => [...prevMessages, 'AlciBot: Desculpe, ocorreu um erro ao processar sua mensagem.']);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleSetPregnancyWeek = (week: number) => {
    setPregnancyWeek(week);
    setMessages(prevMessages => [
      ...prevMessages, 
      `AlciBot: Obrigada por informar! Vou adaptar minhas orientações para a semana ${week} de gestação.`
    ]);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Card className="relative w-full max-w-2xl transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <CardHeader className="ai-assistant-header py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-white" />
                  <CardTitle className="ai-assistant-header-title text-xl">AlciBot - Assistente de Saúde Materna</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar assistente" className="text-white hover:bg-rose-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-rose-50">
                  <TabsTrigger value="chat" className="ai-assistant-tab data-[state=active]:ai-assistant-tab-active">Chat</TabsTrigger>
                  <TabsTrigger value="pregnancy" className="ai-assistant-tab data-[state=active]:ai-assistant-tab-active">Gravidez</TabsTrigger>
                  <TabsTrigger value="resources" className="ai-assistant-tab data-[state=active]:ai-assistant-tab-active">Recursos</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="p-4 space-y-4">
                  <ScrollArea className="h-[300px] sm:h-[400px] rounded-md border border-rose-300 p-2">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`text-sm p-3 rounded-md ${message.startsWith('AlciBot:') 
                          ? 'ai-assistant-message-bot' 
                          : 'ai-assistant-message-user'}`}
                        >
                          {message}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center text-sm pl-2 ai-assistant-message-bot">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-rose-700" />
                          AlciBot está digitando...
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex items-center space-x-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="ai-assistant-input flex-1 text-slate-900"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !input.trim()}
                      className="ai-assistant-button"
                    >
                      Enviar
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="pregnancy" className="p-4 space-y-4">
                  <div className="bg-rose-50 p-3 rounded-lg border-2 border-rose-300">
                    <h3 className="font-medium text-rose-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-rose-700" />
                      Selecione a semana da gravidez
                    </h3>
                    <p className="text-xs text-rose-800 mb-3">
                      Isso ajudará a personalizar as informações e orientações para o seu momento atual.
                    </p>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: 40 }, (_, i) => i + 1).map(week => (
                        <Button
                          key={week}
                          variant={pregnancyWeek === week ? "default" : "outline"}
                          size="sm"
                          className={pregnancyWeek === week 
                            ? "bg-rose-700 hover:bg-rose-800 text-white" 
                            : "text-rose-800 border-rose-300"}
                          onClick={() => handleSetPregnancyWeek(week)}
                        >
                          {week}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {pregnancyWeek && (
                    <Card className="border-2 border-rose-300">
                      <CardHeader className="pb-2 bg-rose-100">
                        <CardTitle className="text-sm text-rose-900">Semana {pregnancyWeek} de Gravidez</CardTitle>
                        <CardDescription className="text-rose-800">Principais informações e cuidados</CardDescription>
                      </CardHeader>
                      <CardContent className="bg-white">
                        <p className="text-sm text-slate-800">
                          Pergunte ao AlciBot sobre as mudanças no seu corpo e desenvolvimento do bebê nesta semana.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="resources" className="p-4 space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900">Recursos para Saúde Materna</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Card className="border-2 border-rose-300">
                        <CardHeader className="pb-2 bg-rose-100">
                          <CardTitle className="text-sm text-rose-900">Checklist Pré-Natal</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-slate-800">
                          Acompanhe os exames e consultas recomendados em cada trimestre.
                        </CardContent>
                        <CardFooter className="bg-white">
                          <Button size="sm" variant="outline" className="w-full border-rose-400 text-rose-800 hover:bg-rose-50">Ver Checklist</Button>
                        </CardFooter>
                      </Card>
                      <Card className="border-2 border-rose-300">
                        <CardHeader className="pb-2 bg-rose-100">
                          <CardTitle className="text-sm text-rose-900">Plano de Parto</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-slate-800">
                          Organize suas preferências para o momento do parto.
                        </CardContent>
                        <CardFooter className="bg-white">
                          <Button size="sm" variant="outline" className="w-full border-rose-400 text-rose-800 hover:bg-rose-50">Criar Plano</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="ai-assistant-footer border-t flex justify-between py-3">
              <Button onClick={onClose} variant="ghost" size="sm" className="text-slate-800">
                Fechar
              </Button>
              <p className="text-xs text-slate-700">
                AlciBot v1.0 - Assistente de IA para saúde materna
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlcibotAssistant;
