import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  UserPlus, 
  Users, 
  Bot,
  Calendar,
  Trash2,
  Copy
} from 'lucide-react';
import { useTeamWhatsAppGroup } from '@/hooks/useTeamWhatsAppGroup';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAIAssistant } from '@/hooks/useAIAssistant';

interface WhatsAppTeamChatProps {
  childId: string;
  childName: string;
}

export function WhatsAppTeamChat({ childId, childName }: WhatsAppTeamChatProps) {
  const {
    group,
    participants,
    messages,
    isLoading,
    createGroup,
    sendMessage,
    inviteParticipant,
    removeParticipant,
  } = useTeamWhatsAppGroup(childId);

  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendPrompt: sendToAI } = useAIAssistant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateGroup = async () => {
    setIsCreatingGroup(true);
    const groupName = `Equipe Terapêutica - ${childName}`;
    await createGroup(groupName);
    setIsCreatingGroup(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleInviteParticipant = async () => {
    if (!inviteEmail.trim()) return;

    const success = await inviteParticipant(inviteEmail);
    if (success) {
      setInviteEmail('');
      setIsInviteDialogOpen(false);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!group || messages.length === 0) return;

    const recentMessages = messages.slice(-20).map(msg => 
      `${msg.sender_name} (${msg.sender_role}): ${msg.message_content}`
    ).join('\n');

    const prompt = `Analise as seguintes mensagens recentes do grupo de apoio terapêutico da criança ${childName} e forneça:

1. **Resumo das principais discussões**
2. **Insights sobre o desenvolvimento da criança**
3. **Recomendações para a equipe**
4. **Próximos passos sugeridos**

Mensagens:
${recentMessages}

Mantenha o resumo conciso, empático e focado em ações práticas.`;

    try {
      const response = await sendToAI(prompt, {
        systemMessage: `Você é um assistente especializado em desenvolvimento infantil que monitora conversas de grupos de apoio terapêutico. 
        Sua função é analisar as mensagens do grupo e fornecer resumos, insights e recomendações úteis para pais e profissionais.
        Foque em identificar padrões de desenvolvimento, preocupações dos pais, marcos importantes e sugestões de intervenção.
        Seja empático, claro e sempre baseie suas recomendações em evidências científicas.`,
        assistantType: 'titibot'
      });
      if (response?.response) {
        await sendMessage(response.response, 'ai_summary');
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar resumo",
        description: "Não foi possível gerar o resumo automático.",
        variant: "destructive",
      });
    }
  };

  const copyInviteCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      toast({
        title: "Código copiado",
        description: "Código de convite copiado para a área de transferência!",
      });
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary';
      case 'parent': return 'bg-blue-500';
      case 'professional': return 'bg-green-500';
      case 'ai_assistant': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'parent': return 'Responsável';
      case 'professional': return 'Profissional';
      case 'ai_assistant': return 'Assistente AI';
      default: return 'Membro';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!group) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Grupo da Equipe Terapêutica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Crie um grupo para se comunicar com a equipe terapêutica de {childName}. 
            Este será um espaço privado para discussões sobre o desenvolvimento e 
            acompanhamento terapêutico.
          </p>
          <Button 
            onClick={handleCreateGroup} 
            disabled={isCreatingGroup}
            className="w-full"
          >
            {isCreatingGroup ? 'Criando...' : 'Criar Grupo da Equipe'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header do Grupo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {group.group_name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length} participantes
              </Badge>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Convidar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar Profissional</DialogTitle>
                    <DialogDescription>
                      Digite o email do profissional que você quer adicionar ao grupo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="email@exemplo.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInviteParticipant()}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={group.invite_code}
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={copyInviteCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Código de convite: compartilhe este código com profissionais para acesso rápido.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={handleInviteParticipant} className="flex-1">
                        Convidar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsInviteDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Participantes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Participantes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getRoleColor(participant.role)}>
                      {getAvatarInitials(
                        participant.profile 
                          ? `${participant.profile.first_name} ${participant.profile.last_name}`
                          : 'UN'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {participant.profile 
                        ? `${participant.profile.first_name} ${participant.profile.last_name}`
                        : 'Usuário'
                      }
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {getRoleLabel(participant.role)}
                    </Badge>
                  </div>
                </div>
                {participant.role !== 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(participant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="h-96">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Conversas</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateAISummary}
              disabled={messages.length === 0}
            >
              <Bot className="h-4 w-4 mr-1" />
              Resumo AI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 h-full flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={getRoleColor(message.sender_role)}>
                        {message.sender_role === 'ai_assistant' ? 'AI' : getAvatarInitials(message.sender_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{message.sender_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.sent_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                    {message.message_type === 'ai_summary' && (
                      <Badge variant="secondary" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        Resumo AI
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${
                    message.message_type === 'ai_summary' 
                      ? 'bg-purple-50 border border-purple-200' 
                      : 'bg-muted'
                  }`}>
                    {message.message_content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <Separator className="my-3" />
          
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}