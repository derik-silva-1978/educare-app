import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Settings, UserPlus, Crown, Eye, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { useTeamManagement } from '@/hooks/useTeamManagement';
import { Team, TeamMember } from '@/services/teamService';
import { formatDate } from '@/utils/dateUtils';

interface TeamDetailsModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  team,
  isOpen,
  onClose,
}) => {
  const { fetchMembers } = useTeamManagement();
  
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Função para buscar membros
  const handleFetchMembers = useCallback(async () => {
    if (!team) return;

    setLoading(true);
    try {
      const teamMembers = await fetchMembers(team.id);
      setMembers(teamMembers);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [team, fetchMembers]);

  // Buscar membros quando modal abrir
  useEffect(() => {
    if (isOpen && team) {
      handleFetchMembers();
    }
  }, [isOpen, team, handleFetchMembers]);

  // Função para fechar modal
  const handleClose = () => {
    setMembers([]);
    onClose();
  };

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Função para obter cor do badge do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'educational': return 'bg-green-100 text-green-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do tipo
  const getTypeText = (type: string) => {
    switch (type) {
      case 'professional': return 'Profissional';
      case 'educational': return 'Educacional';
      case 'family': return 'Família';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  // Função para obter cor do badge do role
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do role
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'professional': return 'Profissional';
      case 'member': return 'Membro';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  // Função para obter ícone do role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'professional': return <User className="h-4 w-4" />;
      case 'member': return <Users className="h-4 w-4" />;
      case 'viewer': return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Função para obter cor do badge do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'removed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'invited': return 'Convidado';
      case 'inactive': return 'Inativo';
      case 'removed': return 'Removido';
      default: return status;
    }
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team.name}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos da equipe e seus membros
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="members">Membros ({members.length})</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Aba Visão Geral */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>Nome:</strong>
                      <div className="text-gray-600">{team.name}</div>
                    </div>
                    {team.description && (
                      <div>
                        <strong>Descrição:</strong>
                        <div className="text-gray-600">{team.description}</div>
                      </div>
                    )}
                    <div>
                      <strong>Tipo:</strong>
                      <div className="mt-1">
                        <Badge className={getTypeColor(team.type)}>
                          {getTypeText(team.type)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <strong>Status:</strong>
                      <div className="mt-1">
                        <Badge variant={team.isActive ? 'default' : 'secondary'}>
                          {team.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Proprietário */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Proprietário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100">
                          {team.owner ? getInitials(team.owner.name) : 'NA'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{team.owner?.name}</div>
                        <div className="text-sm text-gray-500">{team.owner?.email}</div>
                        {team.owner?.profile?.profession && (
                          <div className="text-xs text-gray-400">
                            {team.owner.profile.profession}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{team.memberCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{team.activeMemberCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{team.pendingInvites}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Criada em</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{formatDate(team.createdAt)}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba Membros */}
            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Membros da Equipe</CardTitle>
                  <CardDescription>
                    Lista completa de todos os membros e seus status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Esta equipe ainda não possui membros.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Membro</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Convidado em</TableHead>
                            <TableHead>Entrou em</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-gray-200">
                                      {member.user ? getInitials(member.user.name) : 'NA'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.user?.name}</div>
                                    <div className="text-sm text-gray-500">{member.user?.email}</div>
                                    {member.user?.profile?.profession && (
                                      <div className="text-xs text-gray-400">
                                        {member.user.profile.profession}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleColor(member.role)}>
                                  <div className="flex items-center gap-1">
                                    {getRoleIcon(member.role)}
                                    {getRoleText(member.role)}
                                  </div>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(member.status)}>
                                  {getStatusText(member.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatDate(member.invitedAt)}
                              </TableCell>
                              <TableCell>
                                {member.joinedAt ? formatDate(member.joinedAt) : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Configurações */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações da Equipe
                  </CardTitle>
                  <CardDescription>
                    Informações técnicas e configurações avançadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>ID da Equipe:</strong>
                      <div className="text-sm text-gray-600 font-mono">{team.id}</div>
                    </div>
                    <div>
                      <strong>ID do Proprietário:</strong>
                      <div className="text-sm text-gray-600 font-mono">{team.ownerId}</div>
                    </div>
                    <div>
                      <strong>Criada em:</strong>
                      <div className="text-sm text-gray-600">
                        {new Date(team.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <strong>Última atualização:</strong>
                      <div className="text-sm text-gray-600">
                        {new Date(team.updatedAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  {team.logoUrl && (
                    <div>
                      <strong>URL do Logo:</strong>
                      <div className="text-sm text-gray-600 break-all">{team.logoUrl}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsModal;
