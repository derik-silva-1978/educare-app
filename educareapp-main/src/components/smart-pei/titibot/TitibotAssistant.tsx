
import React, { useState, useEffect } from 'react';
import { Bot, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useTitibotService } from '@/hooks/useTitibotService';
import useAccessibility from '@/hooks/useAccessibility';

interface TitibotAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TitibotAssistant: React.FC<TitibotAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);
  const { sendMessage } = useTitibotService();
  const { announce } = useAccessibility();

  useEffect(() => {
    if (isOpen) {
      announce('Assistente Titibot aberto');
    } else {
      announce('Assistente Titibot fechado');
    }
  }, [isOpen, announce]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, `Você: ${input}`]);

    try {
      const response = await sendMessage(input);
      setMessages(prevMessages => [...prevMessages, `Titibot: ${response}`]);
    } catch (error) {
      console.error('Error getting Titibot response:', error);
      setMessages(prevMessages => [...prevMessages, 'Titibot: Desculpe, ocorreu um erro.']);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleTrainModel = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsModelTrained(true);
      setIsLoading(false);
      announce('Modelo de IA treinado com sucesso');
    }, 3000);
  };

  const handleToggleAssistant = () => {
    setIsAssistantEnabled(!isAssistantEnabled);
    announce(`Assistente Titibot ${isAssistantEnabled ? 'desativado' : 'ativado'}`);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Card className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <CardHeader className="bg-slate-800 text-white py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-blue-300" />
                <CardTitle className="text-white font-medium">Assistente Titibot</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar assistente" className="text-white hover:bg-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="w-full justify-start px-4 py-2 bg-slate-100">
                  <TabsTrigger value="chat" className="text-slate-800 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">Chat</TabsTrigger>
                  <TabsTrigger value="settings" className="text-slate-800 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">Configurações</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="p-4">
                  <ScrollArea className="h-[300px] sm:h-[400px] rounded-md border border-slate-300">
                    <div className="space-y-2 p-4">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`text-sm p-2 rounded-md ${
                            message.startsWith('Você:') 
                              ? 'bg-blue-100 text-slate-900 ml-auto max-w-[80%]' 
                              : 'bg-slate-100 text-slate-900 max-w-[80%]'
                          }`}
                        >
                          {message}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center text-sm text-slate-900">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Pensando...
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex items-center space-x-2 mt-4">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="flex-1 border-slate-300 text-slate-900"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary-600 text-white"
                    >
                      Enviar
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="assistant-enabled" className="text-slate-900 font-medium">Assistente habilitado</Label>
                      <Switch
                        id="assistant-enabled"
                        checked={isAssistantEnabled}
                        onCheckedChange={handleToggleAssistant}
                      />
                    </div>
                    <Separator className="my-4 bg-slate-200" />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="model-trained" className="text-slate-900 font-medium">Modelo de IA treinado</Label>
                      <Switch id="model-trained" checked={isModelTrained} disabled />
                    </div>
                    {!isModelTrained && (
                      <Button variant="outline" onClick={handleTrainModel} disabled={isLoading} className="mt-2 w-full border-blue-300 text-blue-800 hover:bg-blue-50">
                        {isLoading ? (
                          <>
                            Treinando...
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          'Treinar Modelo de IA'
                        )}
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-slate-50 py-3">
              <Button onClick={onClose} variant="secondary" className="text-slate-900">
                Fechar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
