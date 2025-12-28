import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useProfessionalChildren } from '@/hooks/useProfessionalChildren';
import { useProfessionalTeamChats } from '@/hooks/useProfessionalTeamChats';
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { ProfessionalChatInterface } from '@/components/educare-app/chat/ProfessionalChatInterface';
import ChildIndicatorsPanel from '@/components/educare-app/professional/ChildIndicatorsPanel';
import { IconToolbar } from '@/components/educare-app/welcome';
import { 
  Users, UserPlus, Clock, CheckCircle, XCircle, Loader2, 
  MessageCircle, Mail, RefreshCw, BarChart2, ClipboardList,
  Baby, ArrowLeft
} from 'lucide-react';

interface SelectedChild {
  id: string;
  name: string;
  birthDate: string;
}

const ProfessionalChildrenManagement: React.FC = () => {
  const navigate = useNavigate();
  const [messageCount] = useState(2);
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedChild, setSelectedChild] = useState<SelectedChild | null>(null);
  const [showIndicatorsSheet, setShowIndicatorsSheet] = useState(false);

  const {
    receivedInvites,
    pendingCount: chatInvitesPendingCount,
    isLoading: chatInvitesLoading,
    acceptInvite: acceptChatInvite,
    declineInvite: declineChatInvite,
    refresh: refreshChatInvites
  } = useTeamInvites();

  const { childrenAccess, isLoading } = useProfessionalChildren();
  const { teamChats, isLoading: teamChatsLoading, hasTeamChats } = useProfessionalTeamChats();
  
  const assignedChildren = childrenAccess.filter(child => child.status === 'approved');
  const pendingInvitations = childrenAccess.filter(child => child.status === 'pending');

  React.useEffect(() => {
    if (hasTeamChats && !teamChatsLoading && activeTab === 'assigned' && assignedChildren.length === 0) {
      setActiveTab('active-chats');
    }
  }, [hasTeamChats, teamChatsLoading, activeTab, assignedChildren.length]);

  return (
    <>
      <Helmet>
        <title>Gestão das Crianças | Portal Profissional | Educare+</title>
      </Helmet>

      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/educare-app/professional/welcome')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <IconToolbar messageCount={messageCount} />
          </div>
        </div>

        <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Baby className="h-6 w-6 text-primary" />
                Gestão das Crianças
              </h1>
              <p className="text-muted-foreground mt-1">
                Crianças sob sua orientação profissional, designadas pelo administrador da plataforma
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-primary/20 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Crianças</h3>
                  <span className="text-3xl font-bold text-primary">{assignedChildren.length}</span>
                  <p className="text-xs text-muted-foreground mt-1">Sob sua orientação</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-amber-300/50 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mb-3">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Convites</h3>
                  <span className="text-3xl font-bold text-amber-600">{pendingInvitations.length}</span>
                  <p className="text-xs text-muted-foreground mt-1">Aguardando resposta</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-300/50 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-3">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Convites de Chat</h3>
                  <span className="text-3xl font-bold text-green-600">{chatInvitesPendingCount}</span>
                  <p className="text-xs text-muted-foreground mt-1">Pendentes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-muted/50">
                  <TabsTrigger 
                    value="assigned" 
                    className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Crianças ({assignedChildren.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invitations"
                    className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Convites ({pendingInvitations.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat-invites"
                    className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Chat Convites ({chatInvitesPendingCount})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="active-chats"
                    className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Chats Ativos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="assigned" className="space-y-4 mt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : assignedChildren.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignedChildren.map((child) => (
                        <Card key={child.childId} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="bg-primary/5 pb-2">
                            <CardTitle className="text-md font-medium flex items-center gap-2">
                              <Baby className="h-4 w-4 text-primary" />
                              {child.childName}
                            </CardTitle>
                            <CardDescription>
                              <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium">
                                Acompanhamento Ativo
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Associado em:</span>
                                <span className="font-medium">
                                  {new Date(child.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2 border-t">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="flex-1 font-medium"
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
                                  className="flex-1 font-medium border-primary/50 hover:bg-primary/10"
                                  onClick={() => navigate(`/educare-app/professional/child/${child.childId}/analysis`)}
                                >
                                  <ClipboardList className="h-4 w-4 mr-1" />
                                  Análises
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="font-medium border-primary/50 hover:bg-primary/10"
                                  onClick={() => navigate(`/educare-app/professional/child/${child.childId}/messages`)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhuma criança atribuída</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Você ainda não foi designado para acompanhar nenhuma criança. 
                          O administrador da plataforma fará essa atribuição.
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
                        <Card key={invite.childId} className="hover:shadow-md transition-shadow">
                          <CardHeader className="bg-amber-50 dark:bg-amber-900/20 pb-2">
                            <CardTitle className="text-md font-medium flex items-center gap-2">
                              <Baby className="h-4 w-4 text-amber-600" />
                              {invite.childName}
                            </CardTitle>
                            <CardDescription>
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium">
                                Convite Pendente
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Recebido em:</span>
                                <span className="font-medium">
                                  {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aceitar
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
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
                    <Card className="border-dashed">
                      <CardContent className="text-center py-12">
                        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhum convite pendente</h3>
                        <p className="text-sm text-muted-foreground">
                          Você não possui convites pendentes de responsáveis.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="chat-invites" className="space-y-4 mt-4">
                  {chatInvitesLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : receivedInvites.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Convites de Chat Recebidos</h3>
                        <Button 
                          onClick={refreshChatInvites} 
                          variant="outline" 
                          size="sm"
                          disabled={chatInvitesLoading}
                          className="font-medium"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${chatInvitesLoading ? 'animate-spin' : ''}`} />
                          Atualizar
                        </Button>
                      </div>
                      
                      {receivedInvites.map((invite) => (
                        <Card key={invite.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageCircle className="h-5 w-5 text-primary" />
                                  <h4 className="font-semibold text-foreground">{invite.team_name}</h4>
                                  <Badge 
                                    variant={invite.status === 'invited' ? 'secondary' : 'default'}
                                    className="text-xs font-medium"
                                  >
                                    {invite.status === 'invited' ? 'Pendente' : 
                                      invite.status === 'active' ? 'Aceito' : 'Recusado'}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Convidado por:</strong> {invite.invited_by_name}
                                </p>
                                
                                {invite.team_description && (
                                  <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                                    {invite.team_description}
                                  </p>
                                )}
                                
                                <p className="text-xs text-muted-foreground">
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
                                    className="bg-green-600 hover:bg-green-700 font-medium"
                                    disabled={chatInvitesLoading}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Aceitar
                                  </Button>
                                  <Button
                                    onClick={() => declineChatInvite(invite.id)}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
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
                    <Card className="border-dashed">
                      <CardContent className="text-center py-12">
                        <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhum convite de chat</h3>
                        <p className="text-sm text-muted-foreground">
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
                  ) : teamChats && teamChats.length > 0 ? (
                    <ProfessionalChatInterface teamChats={teamChats} />
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="text-center py-12">
                        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhum chat ativo</h3>
                        <p className="text-sm text-muted-foreground">
                          Você ainda não possui chats ativos com responsáveis.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>

      <Sheet open={showIndicatorsSheet} onOpenChange={setShowIndicatorsSheet}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Painel de Indicadores
            </SheetTitle>
            <SheetDescription>
              {selectedChild ? `Indicadores de desenvolvimento de ${selectedChild.name}` : 'Selecione uma criança'}
            </SheetDescription>
          </SheetHeader>
          {selectedChild && (
            <div className="mt-6">
              <ChildIndicatorsPanel 
                child={{
                  id: selectedChild.id,
                  name: selectedChild.name,
                  birthDate: selectedChild.birthDate
                }}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfessionalChildrenManagement;
