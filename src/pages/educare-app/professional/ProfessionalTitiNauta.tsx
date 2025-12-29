import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, Send, Loader2, Baby, Stethoscope, 
  Brain, Heart, BookOpen, AlertCircle, Mic
} from 'lucide-react';
import ragService from '@/services/api/ragService';
import RAGProgressBar from '@/components/educare-app/RAGProgressBar';
import AudioRecorder from '@/components/educare-app/professional/AudioRecorder';
import ProfessionalSuggestedTopics from '@/components/educare-app/professional/ProfessionalSuggestedTopics';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickTopics = [
  { id: 'marcos', label: 'Marcos do Desenvolvimento', icon: Baby, query: 'Quais são os principais marcos de desenvolvimento infantil por faixa etária?' },
  { id: 'intervencoes', label: 'Intervenções Precoces', icon: Stethoscope, query: 'Quais são as melhores práticas para intervenção precoce em atrasos de desenvolvimento?' },
  { id: 'avaliacao', label: 'Instrumentos de Avaliação', icon: Brain, query: 'Quais instrumentos de avaliação são recomendados para triagem do desenvolvimento infantil?' },
  { id: 'orientacao', label: 'Orientação Familiar', icon: Heart, query: 'Como orientar famílias sobre estimulação do desenvolvimento em casa?' },
  { id: 'protocolos', label: 'Protocolos Clínicos', icon: BookOpen, query: 'Quais são os protocolos clínicos para acompanhamento do desenvolvimento nos primeiros 1000 dias?' },
  { id: 'sinais', label: 'Sinais de Alerta', icon: AlertCircle, query: 'Quais são os principais sinais de alerta para atrasos no desenvolvimento infantil?' },
];

type RAGStatus = 'idle' | 'retrieving' | 'processing' | 'generating' | 'error';

const ProfessionalTitiNauta: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState<RAGStatus>('idle');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await ragService.askQuestion(messageText, undefined, {
        module_type: 'professional',
        onProgress: (status) => setRagStatus(status)
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
      const errorMsg = err instanceof Error ? err.message : 'Erro ao processar pergunta';
      setError(errorMsg);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Desculpe, ocorreu um erro: ${errorMsg}. Tente novamente.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setRagStatus('idle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickTopic = (query: string) => {
    sendMessage(query);
  };

  return (
    <>
      <Helmet>
        <title>TitiNauta Especialista | Educare+</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              TitiNauta Especialista
            </h1>
            <p className="text-muted-foreground mt-1">
              Assistente com conhecimento especializado para profissionais de saúde
            </p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Base: Profissional
          </Badge>
        </div>

        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20">
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Tópicos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <Button
                  key={topic.id}
                  variant="ghost"
                  size="sm"
                  className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 transition-all duration-200"
                  onClick={() => handleQuickTopic(topic.query)}
                  disabled={isLoading}
                  aria-label={`Perguntar sobre ${topic.label}`}
                >
                  <topic.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {topic.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <ProfessionalSuggestedTopics 
          onQuestionClick={(question) => {
            setInput(question);
          }}
        />

        <Card className="flex flex-col h-[400px] sm:h-[500px]">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Conversa</CardTitle>
              {isLoading && <RAGProgressBar status={ragStatus} isLoading={isLoading} />}
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 text-purple-300" />
                <p>Faça uma pergunta sobre desenvolvimento infantil, protocolos clínicos ou intervenções.</p>
                <p className="text-sm mt-2">O TitiNauta usa a base de conhecimento especializada para profissionais.</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-purple-600">
                  <Mic className="h-4 w-4" />
                  <span>Use o microfone para fazer perguntas por voz</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <AudioRecorder 
                onTranscription={(text) => setInput(text)}
                disabled={isLoading}
              />
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite ou fale sua pergunta..."
                className="min-h-[60px] resize-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProfessionalTitiNauta;
