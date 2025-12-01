import React, { useState } from 'react';
import { Plus, Users, Settings, UserPlus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useTeamManagement, Team } from '@/hooks/useTeamManagement';
import { formatDate } from '@/utils/dateUtils';
import CreateTeamModal from '@/components/admin/CreateTeamModal';
import EditTeamModal from '@/components/admin/EditTeamModal';
import InviteMemberModal from '@/components/admin/InviteMemberModal';
import TeamDetailsModal from '@/components/admin/TeamDetailsModal';

const TeamsManagement: React.FC = () => {
  const {
    teams,
    loading,
    error,
    total,
    refreshData,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useTeamManagement();

  // Estados locais para filtros e modais
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Estados para modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inviteTeamId, setInviteTeamId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filtrar equipes localmente
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.owner?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || team.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && team.isActive) ||
                         (statusFilter === 'inactive' && !team.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Função para abrir modal de criação
  const handleCreateTeam = () => {
    setIsCreateModalOpen(true);
  };

  // Função para fechar modal de criação
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Função para salvar nova equipe
  const handleSaveNewTeam = async (teamData: any) => {
    const success = await createTeam(teamData);
    if (success) {
      handleCloseCreateModal();
    }
    return success;
  };

  // Função para abrir modal de edição
  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsEditModalOpen(true);
  };

  // Função para fechar modal de edição
  const handleCloseEditModal = () => {
    setEditingTeam(null);
    setIsEditModalOpen(false);
  };

  // Função para salvar edição
  const handleSaveEdit = async (updatedData: any) => {
    if (!editingTeam) return false;
    
    const success = await updateTeam(editingTeam.id, updatedData);
    if (success) {
      handleCloseEditModal();
    }
    return success;
  };

  // Função para abrir modal de convite
  const handleInvite = (teamId: string) => {
    setInviteTeamId(teamId);
    setIsInviteModalOpen(true);
  };

  // Função para fechar modal de convite
  const handleCloseInviteModal = () => {
    setInviteTeamId(null);
    setIsInviteModalOpen(false);
  };

  // Função para visualizar detalhes
  const handleViewDetails = (team: Team) => {
    setViewingTeam(team);
    setIsDetailsModalOpen(true);
  };

  // Função para fechar modal de detalhes
  const handleCloseDetailsModal = () => {
    setViewingTeam(null);
    setIsDetailsModalOpen(false);
  };

  // Função para confirmar exclusão
  const handleDelete = async () => {
    if (!deleteId) return;
    
    const success = await deleteTeam(deleteId);
    if (success) {
      setDeleteId(null);
    }
  };

  // Função para atualizar dados
  const handleRefresh = async () => {
    await refreshData();
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Equipes</h1>
            <p className="text-gray-600 mt-1">
              Gerencie equipes e convide profissionais e usuários
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              Atualizar
            </Button>
            <Button onClick={handleCreateTeam} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Equipe
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">
                {filteredTeams.length} visíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.filter(t => t.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Em funcionamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.reduce((acc, team) => acc + team.memberCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Membros ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.reduce((acc, team) => acc + team.pendingInvites, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando resposta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar equipes específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome, descrição ou proprietário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="educational">Educacional</SelectItem>
                  <SelectItem value="family">Família</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Equipes */}
        <Card>
          <CardHeader>
            <CardTitle>Equipes ({filteredTeams.length})</CardTitle>
            <CardDescription>
              Lista de todas as equipes cadastradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma equipe encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando sua primeira equipe.'}
                </p>
                {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
                  <div className="mt-6">
                    <Button onClick={handleCreateTeam} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Equipe
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Membros</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criada em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{team.name}</div>
                            {team.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {team.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(team.type)}>
                            {getTypeText(team.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{team.owner?.name}</div>
                            <div className="text-sm text-gray-500">{team.owner?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{team.activeMemberCount}</span>
                            <span className="text-gray-500">ativos</span>
                            {team.pendingInvites > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{team.pendingInvites} pendentes
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={team.isActive ? 'default' : 'secondary'}>
                            {team.isActive ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(team.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(team)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(team)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleInvite(team.id)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Convidar Membros
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeleteId(team.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
                Todos os membros serão removidos da equipe.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modais */}
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSave={handleSaveNewTeam}
        />

        <EditTeamModal
          team={editingTeam}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />

        <InviteMemberModal
          teamId={inviteTeamId}
          isOpen={isInviteModalOpen}
          onClose={handleCloseInviteModal}
        />

        <TeamDetailsModal
          team={viewingTeam}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      </div>
    </>
  );
};

export default TeamsManagement;
