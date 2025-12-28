import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useProfessionalChildren } from '@/hooks/useProfessionalChildren';
import { useProfessionalTeamChats } from '@/hooks/useProfessionalTeamChats';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { ProfessionalTeamChat } from '@/components/educare-app/chat/ProfessionalTeamChat';
import { ProfessionalChatInterface } from '@/components/educare-app/chat/ProfessionalChatInterface';
import ChildIndicatorsPanel from '@/components/educare-app/professional/ChildIndicatorsPanel';
import { 
  Users, UserPlus, ClipboardList, FileText, 
  Clock, CheckCircle, XCircle, Loader2, MessageCircle, Mail, RefreshCw, BarChart2,
  Sparkles, BookOpen, GraduationCap, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface SelectedChild {
  id: string;
  name: string;
  birthDate: string;
}

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedChild, setSelectedChild] = useState<SelectedChild | null>(null);
  const [showIndicatorsSheet, setShowIndicatorsSheet] = useState(false);
  
  // Hook para convites de chat
  const {
    receivedInvites,
    pendingCount: chatInvitesPendingCount,
    isLoading: chatInvitesLoading,
    error: chatInvitesError,
    acceptInvite: acceptChatInvite,
    declineInvite: declineChatInvite,
    refresh: refreshChatInvites
  } = useTeamInvites();

  const { childrenAccess, isLoading } = useProfessionalChildren();
  const { teamChats, isLoading: teamChatsLoading, hasTeamChats } = useProfessionalTeamChats();
  const { user } = useAuth();
  
  const assignedChildren = childrenAccess.filter(child => child.status === 'approved');
  const pendingInvitations = childrenAccess.filter(child => child.status === 'pending');

  // Automaticamente ativar a aba "Chats Ativos" quando há chats disponíveis
  React.useEffect(() => {
    if (hasTeamChats && !teamChatsLoading && activeTab === 'assigned' && assignedChildren.length === 0) {
      console.log('🔄 Ativando automaticamente a aba "Chats Ativos" pois há chats disponíveis');
      setActiveTab('active-chats');
    }
  }, [hasTeamChats, teamChatsLoading, activeTab, assignedChildren.length]);


  
  return (
    <>
      <Helmet>
        <title>Dashboard Profissional | Educare</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Profissional</h1>
          <Button onClick={() => navigate('/educare-app/settings')} variant="outline">
            Atualizar Perfil
          </Button>
        </div>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">Bem-vindo, {user?.name || 'Profissional'}</h2>
              <p className="text-indigo-700">
                Como profissional, você pode acessar dados de crianças cujos responsáveis te convidaram para acompanhamento.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-2 rounded-full mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Crianças</h3>
                    <span className="text-2xl font-bold text-blue-600">{assignedChildren.length}</span>
                    <p className="text-xs text-slate-600 mt-1">Sob seu acompanhamento</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-amber-100 p-2 rounded-full mb-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium">Convites</h3>
                    <span className="text-2xl font-bold text-amber-600">{pendingInvitations.length}</span>
                    <p className="text-xs text-slate-600 mt-1">Aguardando resposta</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-green-100 p-2 rounded-full mb-2">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium">Convites de Chat</h3>
                    <span className="text-2xl font-bold text-green-600">{chatInvitesPendingCount}</span>
                    <p className="text-xs text-slate-600 mt-1">Pendentes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group hover:shadow-md transition-all cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigate('/educare-app/professional/titinauta')}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">TitiNauta Especialista</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Assistente com conhecimento especializado
                  </p>
                  <div className="flex items-center text-purple-600 text-sm font-medium">
                    Acessar <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500" onClick={() => navigate('/educare-app/professional/resources')}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Recursos e Qualificação</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Materiais, notícias e conteúdos
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Acessar <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all cursor-pointer border-l-4 border-l-green-500" onClick={() => navigate('/educare-app/trainings')}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Treinamentos</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cursos e capacitações
                  </p>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    Acessar <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assigned">Crianças Atribuídas</TabsTrigger>
            <TabsTrigger value="invitations">Convites</TabsTrigger>
            <TabsTrigger value="chat-invites">Convites de Chat</TabsTrigger>
            <TabsTrigger value="active-chats">Chats Ativos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assigned" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : assignedChildren.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedChildren.map((child) => (
                  <Card key={child.childId} className="overflow-hidden">
                    <CardHeader className="bg-blue-50 pb-2">
                      <CardTitle className="text-md font-medium">{child.childName}</CardTitle>
                      <CardDescription>
                        <Badge className="bg-green-600">Acompanhamento Ativo</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Associado em:</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(child.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="space-x-2 flex justify-end flex-wrap gap-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setSelectedChild({
                                id: child.childId,
                                name: child.childName,
                                birthDate: child.birthDate
                              });
                              setShowIndicatorsSheet(true);
                            }}
                          >
                            <BarChart2 className="h-4 w-4 mr-1" />
                            Indicadores
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/educare-app/professional/child/${child.childId}/analysis`)}
                          >
                            <ClipboardList className="h-4 w-4 mr-1" />
                            Análises
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/educare-app/professional/child/${child.childId}/messages`)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Mensagens
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma criança atribuída</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Você ainda não foi adicionado ao acompanhamento de nenhuma criança.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="invitations" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingInvitations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingInvitations.map((invite) => (
                  <Card key={invite.childId}>
                    <CardHeader className="bg-amber-50 pb-2">
                      <CardTitle className="text-md font-medium">{invite.childName}</CardTitle>
                      <CardDescription>
                        <Badge className="bg-amber-500">Convite Pendente</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recebido em:</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aceitar
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline" 
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-lg font-medium mb-2">Nenhum convite pendente</h3>
                  <p className="text-sm text-slate-500">
                    Você não possui convites pendentes de responsáveis.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat-invites" className="space-y-4 mt-4">
            {chatInvitesLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : receivedInvites.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Convites de Chat Recebidos</h3>
                  <Button 
                    onClick={refreshChatInvites} 
                    variant="outline" 
                    size="sm"
                    disabled={chatInvitesLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${chatInvitesLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
                
                {receivedInvites.map((invite) => (
                  <Card key={invite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium">{invite.team_name}</h4>
                            <Badge 
                              variant={invite.status === 'invited' ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {invite.status === 'invited' ? 'Pendente' : 
                                invite.status === 'active' ? 'Aceito' : 'Recusado'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">
                            <strong>Convidado por:</strong> {invite.invited_by_name}
                          </p>
                          
                          {invite.team_description && (
                            <p className="text-sm text-slate-600 mb-3 p-2 bg-slate-50 rounded">
                              <strong>Descrição:</strong> {invite.team_description}
                            </p>
                          )}
                          
                          <p className="text-xs text-slate-500">
                            Enviado em {new Date(invite.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {invite.status === 'invited' && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => acceptChatInvite(invite.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={chatInvitesLoading}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aceitar
                            </Button>
                            <Button
                              onClick={() => declineChatInvite(invite.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              disabled={chatInvitesLoading}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Recusar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-lg font-medium mb-2">Nenhum convite de chat</h3>
                  <p className="text-sm text-slate-500">
                    Você não possui convites de chat pendentes.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="active-chats" className="space-y-4 mt-4">
            {teamChatsLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasTeamChats ? (
              <ProfessionalChatInterface teamChats={teamChats} />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                  <h3 className="text-lg font-medium mb-2">Nenhum chat ativo</h3>
                  <p className="text-sm text-slate-500">
                    Você ainda não participa de nenhum grupo de chat. Aceite os convites na aba "Convites de Chat" para começar a participar das conversas da equipe terapêutica.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={showIndicatorsSheet} onOpenChange={setShowIndicatorsSheet}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-600" />
              Indicadores de Desenvolvimento
            </SheetTitle>
            <SheetDescription>
              Acompanhe os marcos e o progresso da criança
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {selectedChild && (
              <ChildIndicatorsPanel
                child={{
                  id: selectedChild.id,
                  name: selectedChild.name,
                  birthDate: selectedChild.birthDate,
                }}
                onClose={() => setShowIndicatorsSheet(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfessionalDashboard;
