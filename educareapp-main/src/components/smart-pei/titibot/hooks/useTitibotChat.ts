
import { useState, useCallback, KeyboardEvent } from 'react';
import { useTitibot } from '../TitibotProvider';
import useTitibotService from '@/hooks/useTitibotService';
import { useToast } from '@/hooks/use-toast';

// Define the message type
export interface TitibotMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const useTitibotChat = () => {
  const { isPremium } = useTitibot();
  const titibotService = useTitibotService(isPremium);
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<TitibotMessage[]>([
    {
      id: '1',
      content: isPremium 
        ? 'Olá! Eu sou o Titibot Turbo, seu assistente avançado para o Smart PEI. Como posso ajudar hoje?' 
        : 'Olá! Eu sou o Titibot, seu assistente para o Smart PEI. Como posso ajudar?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendPrompt = useCallback(async (promptText: string) => {
    if (!promptText.trim()) return;
    
    // Add user message
    const userMessage: TitibotMessage = {
      id: Date.now().toString(),
      content: promptText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Add a temporary loading message that will be replaced
    const tempId = Date.now() + 1;
    const loadingMessage: TitibotMessage = {
      id: tempId.toString(),
      content: "...",
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Get response from service based on premium status
      const response = await titibotService.sendMessage(promptText, isPremium);
      
      // Replace the loading message with the actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId.toString() 
            ? {
                id: tempId.toString(),
                content: response,
                isUser: false,
                timestamp: new Date(),
              }
            : msg
        )
      );
      
      // Show toast for premium users
      if (isPremium) {
        toast({
          title: "Resposta Turbo Entregue",
          description: "Resposta gerada com prioridade máxima",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error getting response from Titibot service:", error);
      
      // Replace the loading message with an error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId.toString() 
            ? {
                id: tempId.toString(),
                content: "Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?",
                isUser: false,
                timestamp: new Date(),
              }
            : msg
        )
      );
      
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    // Clear input after sending
    setInputMessage('');
  }, [isPremium, titibotService, toast]);

  const handleSend = useCallback(() => {
    if (!inputMessage.trim()) return;
    sendPrompt(inputMessage);
  }, [inputMessage, sendPrompt]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    handleSend,
    handleKeyDown,
    isLoading,
    sendPrompt
  };
};
