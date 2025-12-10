import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle } from 'lucide-react';
import ragService from '@/services/api/ragService';
import RAGProgressBar from './RAGProgressBar';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RAGChatProps {
  babyId?: string;
  module_type?: 'baby' | 'mother' | 'professional';
}

const RAGChat: React.FC<RAGChatProps> = ({ babyId, module_type = 'baby' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'retrieving' | 'processing' | 'generating'>('idle');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setError('');

    try {
      const response = await ragService.askQuestion(question, babyId, {
        module_type,
        onProgress: (newStatus) => setStatus(newStatus)
      });

      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Falha ao obter resposta');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pergunta';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setStatus('idle');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          TitiNauta Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-96">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Faça uma pergunta para começar...
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Bar */}
        <RAGProgressBar
          isLoading={isLoading}
          status={status}
          message="Consultando base de conhecimento..."
          error={error}
        />

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Faça uma pergunta..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            disabled={isLoading}
          />
          <Button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RAGChat;
