
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  UserPlus, 
  Stethoscope, 
  Calendar,
  Bell,
  Search,
  Hash,
  Heart,
  Baby,
  Lightbulb,
  HelpCircle,
  LogIn,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { WhatsAppTeamChat } from '../team-chat/WhatsAppTeamChat';
import { useTeamWhatsAppGroup } from '@/hooks/useTeamWhatsAppGroup';
import { GroupCreationTest } from './GroupCreationTest';

interface CommunityTabProps {
  childId: string;
  childName: string;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({
  childId,
  childName
}) => {
  const [activeView, setActiveView] = useState('overview');
  const { 
    group, 
    participants, 
    messages, 
    isLoading, 
    error, 
    isAuthenticated 
  } = useTeamWhatsAppGroup(childId);

  // Dados reais do grupo da equipe terapêutica
  const teamGroup = group ? {
    id: group.id,
    name: group.group_name,
    description: 'Comunicação direta com profissionais de saúde',
    memberCount: participants.length,
    icon: <Stethoscope className="h-5 w-5" />,
    type: 'professional',
    unreadCount: 0, // TODO: implementar contagem de não lidas
    isActive: true
  } : null;

  // Mock data para grupos da comunidade (futuro)
  const communityGroups = [
    ...(teamGroup ? [teamGroup] : []),
    {
      id: 'general-moms',
      name: 'Comunidade de Mães',
      description: 'Grupo geral para troca de experiências',
      memberCount: 234,
      icon: <Users className="h-5 w-5" />,
      type: 'community',
      unreadCount: 12,
      isActive: false
    },
    {
      id: 'age-specific',
      name: 'Mães de 0-2 anos',
      description: 'Grupo específico para sua faixa etária',
      memberCount: 67,
      icon: <Baby className="h-5 w-5" />,
      type: 'community',
      unreadCount: 5,
      isActive: false
    }
  ];

  const channels = [
    { id: 1, name: 'geral', description: 'Conversas gerais', icon: <Hash className="h-4 w-4" />, unread: 3 },
    { id: 2, name: 'marcos-desenvolvimento', description: 'Marcos do desenvolvimento', icon: <Lightbulb className="h-4 w-4" />, unread: 0 },
    { id: 3, name: 'alimentacao', description: 'Dicas de alimentação', icon: <Heart className="h-4 w-4" />, unread: 1 },
    { id: 4, name: 'duvidas', description: 'Tire suas dúvidas', icon: <HelpCircle className="h-4 w-4" />, unread: 0 }
  ];

  // Mensagens recentes do grupo real
  const recentMessages = messages.slice(-3).map(msg => ({
    id: msg.id,
    author: msg.sender_name,
    message: msg.message_content,
    timestamp: new Date(msg.sent_at).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    channel: group?.group_name || 'Equipe Profissional',
    isProfessional: msg.sender_role === 'professional'
  }));

  // Fallback para mensagens mockadas se não houver mensagens reais
  const fallbackMessages = [
    {
      id: 'mock-1',
      author: 'Sistema',
      message: 'Grupo criado! Convide profissionais para começar as conversas.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      channel: 'Equipe Profissional',
      isProfessional: false
    }
  ];

  const displayMessages = recentMessages.length > 0 ? recentMessages : fallbackMessages;

  // Estado de carregamento da autenticação
  if (isAuthenticated === null || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {isAuthenticated === null ? "Verificando autenticação..." : "Carregando dados do grupo..."}
          </p>
        </div>
      </div>
    );
  }

  // Estado não autenticado
  if (isAuthenticated === false) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar o grupo terapêutico e se comunicar com a equipe de {childName}.
            </p>
            <Button onClick={() => window.location.href = '/educare-app/auth'}>
              <LogIn className="mr-2 h-4 w-4" />
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Comunidade</h2>
          <p className="text-muted-foreground">
            Conecte-se com profissionais e outras mães para compartilhar experiências
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="team-chat">Chat Equipe</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Mensagem de erro se houver */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="font-medium text-destructive">Erro de Conexão</h4>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-700">Grupos Ativos</p>
                    <p className="text-2xl font-bold text-cyan-900">
                      {group ? 1 : 0}
                      {group && (
                        <span className="text-sm ml-2 text-cyan-600">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Online
                        </span>
                      )}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Mensagens Não Lidas</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {communityGroups.reduce((acc, group) => acc + group.unreadCount, 0)}
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-purple-700">Profissionais</p>
                     <p className="text-2xl font-bold text-purple-900">{participants.length}</p>
                   </div>
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Mensagens Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    message.isProfessional ? 'bg-blue-500' : 'bg-cyan-500'
                  }`}>
                    {message.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.author}</span>
                      {message.isProfessional && (
                        <Badge variant="secondary" className="text-xs">Profissional</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">#{message.channel}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Ver Todas as Mensagens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        group.type === 'professional' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'
                      }`}>
                        {group.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                    </div>
                    {group.unreadCount > 0 && (
                      <Badge className="bg-red-500">{group.unreadCount}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
                    </span>
                    <Button 
                      size="sm" 
                      variant={group.isActive ? "default" : "outline"}
                      onClick={() => group.isActive && setActiveView('team-chat')}
                      disabled={!group.isActive}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {group.isActive ? 'Acessar' : 'Em breve'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-medium mb-2">Descubra Novos Grupos</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Explore grupos específicos para suas necessidades e interesses
              </p>
              <Button variant="outline">
                Explorar Grupos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-chat" className="space-y-4">
          {/* Componente de Teste para verificar funcionalidade */}
          <GroupCreationTest childId={childId} childName={childName} />
          
          <WhatsAppTeamChat childId={childId} childName={childName} />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canais Disponíveis</CardTitle>
              <CardDescription>
                Escolha um canal para participar das conversas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((channel) => (
                <div 
                  key={channel.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {channel.icon}
                    <div>
                      <p className="font-medium">#{channel.name}</p>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  {channel.unread > 0 && (
                    <Badge className="bg-red-500">{channel.unread}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageCircle className="h-12 w-12 text-cyan-600 mb-3" />
              <h3 className="font-medium mb-2 text-cyan-900">Sistema de Mensagens em Desenvolvimento</h3>
              <p className="text-sm text-cyan-700 text-center mb-4">
                Em breve você poderá conversar em tempo real com outros membros da comunidade
              </p>
              <div className="flex gap-2">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Consulta
                </Button>
                <Button variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-100">
                  Falar com Profissional
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
