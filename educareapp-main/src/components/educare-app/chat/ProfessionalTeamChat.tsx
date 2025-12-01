import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useProfessionalTeamChat } from '@/hooks/useProfessionalTeamChat';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { 
  Send, 
  Users, 
  MessageCircle, 
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfessionalTeamChatProps {
  teamId: string;
  childId?: string;
  childName?: string;
}

export const ProfessionalTeamChat: React.FC<ProfessionalTeamChatProps> = ({
  teamId,
  childId,
  childName
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    sender_name: string;
    message_content: string;
    sender_role: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useCustomAuth();
  
  const {
    group,
    participants,
    messages,
    isLoading,
    error,
    sendMessage,
    refresh
  } = useProfessionalTeamChat(teamId, childId);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    // Incluir referência da mensagem sendo respondida
    const messageData = {
      content: newMessage.trim(),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        sender_name: replyingTo.sender_name,
        content: replyingTo.message_content
      } : null
    };
    
    const success = await sendMessage(messageData.content);
    
    if (success) {
      setNewMessage('');
      setReplyingTo(null); // Limpar referência após envio
    }
    
    setIsSending(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'parent':
        return 'bg-green-100 text-green-800';
      case 'ai_assistant':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'professional':
        return 'Profissional';
      case 'parent':
        return 'Responsável';
      case 'ai_assistant':
        return 'IA';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Carregando chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!group) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Chat não encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col max-h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {childName ? `Chat - ${childName}` : group.group_name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Equipe terapêutica
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {participants.length}
            </Badge>
            <Button onClick={refresh} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Lista de Participantes */}
      <div className="px-6 py-3 bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <Badge 
              key={participant.id} 
              variant="secondary" 
              className="text-xs"
            >
              {participant.first_name} {participant.last_name}
              {participant.role === 'admin' && ' (Admin)'}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Área de Mensagens */}
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-[400px] px-6 py-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
                <p className="text-sm text-muted-foreground">
                  Seja o primeiro a enviar uma mensagem!
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                
                return (
                  <div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {message.sender_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 space-y-1 max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                        <span className="font-medium text-sm">
                          {isOwnMessage ? 'Você' : message.sender_name}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(message.sender_role)}`}
                        >
                          {getRoleLabel(message.sender_role)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.sent_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                      </div>
                      
                      <div className={`rounded-lg text-sm shadow-sm ${
                        isOwnMessage 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200 ml-auto' 
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {/* Referência da Mensagem Original (detectada por @menção) */}
                        {message.message_content.includes('@') && message.message_content.includes(':') && (
                          <div className={`p-2 mb-2 border-l-2 ${
                            isOwnMessage 
                              ? 'bg-blue-50 border-blue-300 text-blue-700' 
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          } text-xs`}>
                            <div className="font-medium mb-1">
                              {message.message_content.split(':')[0].replace('@', '')}
                            </div>
                            <div className="opacity-75 line-clamp-2">
                              {/* Exibir conteúdo da mensagem original baseado na referência armazenada */}
                              {(() => {
                                // Extrair o nome da pessoa sendo respondida
                                const replyToName = message.message_content.split(':')[0].replace('@', '').trim();
                                
                                // Buscar mensagens anteriores do remetente específico
                                const candidateMessages = messages
                                  .filter(m => {
                                    // Comparar nomes de forma mais flexível
                                    const senderFirstName = m.sender_name.split(' ')[0].toLowerCase();
                                    const replyFirstName = replyToName.split(' ')[0].toLowerCase();
                                    return senderFirstName === replyFirstName && 
                                           new Date(m.sent_at) < new Date(message.sent_at) &&
                                           m.id !== message.id;
                                  })
                                  .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
                                
                                // Pegar a mensagem mais recente do remetente
                                const originalMessage = candidateMessages[0];
                                
                                if (originalMessage) {
                                  return originalMessage.message_content.length > 100 
                                    ? originalMessage.message_content.substring(0, 100) + '...' 
                                    : originalMessage.message_content;
                                }
                                
                                return 'Mensagem original não encontrada';
                              })()
                              }
                            </div>
                        </div>
                        )}
                        
                        <div className="p-3">
                          {message.message_content}
                        </div>
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      }`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setReplyingTo({
                            id: message.id,
                            sender_name: message.sender_name,
                            message_content: message.message_content,
                            sender_role: message.sender_role
                          })}
                          className="h-6 px-2 text-xs"
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Formulário de Envio */}
      <div className="p-4">
        {/* Referência da Mensagem sendo Respondida */}
        {replyingTo && (
          <div className="mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-blue-600">
                  Respondendo a {replyingTo.sender_name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {getRoleLabel(replyingTo.sender_role)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {replyingTo.message_content}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
            size="sm"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};
