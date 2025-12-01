import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Search, UserPlus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { useTeamManagement } from '@/hooks/useTeamManagement';
import { UserForInvite } from '@/services/teamService';

interface InviteMemberModalProps {
  teamId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  teamId,
  isOpen,
  onClose,
}) => {
  const { searchUsers, inviteMember } = useTeamManagement();
  
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'professional' | 'user'>('all');
  const [users, setUsers] = useState<UserForInvite[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [memberRole, setMemberRole] = useState<'admin' | 'member' | 'viewer' | 'professional'>('member');

  // Função para buscar usuários
  const handleSearchUsers = useCallback(async () => {
    if (!teamId) return;

    setSearchLoading(true);
    try {
      const foundUsers = await searchUsers(teamId, {
        search: searchTerm,
        role: roleFilter,
      });
      setUsers(foundUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  }, [teamId, searchTerm, roleFilter, searchUsers]);

  // Buscar usuários quando modal abrir ou filtros mudarem
  useEffect(() => {
    if (isOpen && teamId) {
      handleSearchUsers();
    }
  }, [isOpen, teamId, handleSearchUsers]);

  // Função para resetar modal
  const resetModal = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setUsers([]);
    setSelectedUsers(new Set());
    setMemberRole('member');
  };

  // Função para fechar modal
  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  // Função para selecionar/deselecionar usuário
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Função para enviar convites
  const handleSendInvites = async () => {
    if (!teamId || selectedUsers.size === 0) return;

    setLoading(true);
    try {
      const promises = Array.from(selectedUsers).map(userId =>
        inviteMember(teamId, {
          userId,
          role: memberRole,
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        resetModal();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
    } finally {
      setLoading(false);
    }
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

  // Função para obter cor do badge do role
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do role
  const getRoleText = (role: string) => {
    switch (role) {
      case 'professional': return 'Profissional';
      case 'user': return 'Usuário/Pai';
      default: return role;
    }
  };

  if (!teamId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convidar Membros</DialogTitle>
          <DialogDescription>
            Busque e convide profissionais e usuários para participar da equipe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Filtros de Busca */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buscar Usuários</CardTitle>
              <CardDescription>
                Use os filtros abaixo para encontrar usuários para convidar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar por nome ou email</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Digite nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="roleFilter">Filtrar por tipo</Label>
                  <Select 
                    value={roleFilter} 
                    onValueChange={(value: 'all' | 'professional' | 'user') => setRoleFilter(value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="professional">Profissionais</SelectItem>
                      <SelectItem value="user">Usuários/Pais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração do Convite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuração do Convite</CardTitle>
              <CardDescription>
                Defina o papel que os membros convidados terão na equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="memberRole">Papel na Equipe</Label>
                <Select 
                  value={memberRole} 
                  onValueChange={(value: 'admin' | 'member' | 'viewer' | 'professional') => setMemberRole(value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-500">
                  {memberRole === 'admin' && 'Pode gerenciar a equipe e seus membros'}
                  {memberRole === 'member' && 'Pode participar ativamente da equipe'}
                  {memberRole === 'viewer' && 'Pode apenas visualizar informações da equipe'}
                  {memberRole === 'professional' && 'Profissional com acesso especializado'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Disponíveis
                {selectedUsers.size > 0 && (
                  <Badge variant="secondary">
                    {selectedUsers.size} selecionado{selectedUsers.size > 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Clique nos usuários para selecioná-los para o convite
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchLoading ? (
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
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || roleFilter !== 'all'
                      ? 'Tente ajustar os filtros de busca.'
                      : 'Todos os usuários já são membros desta equipe.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUsers.has(user.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-gray-200">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleText(user.role)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.profile?.profession && (
                          <p className="text-xs text-gray-400">
                            {user.profile.profession}
                            {user.profile.city && ` • ${user.profile.city}`}
                          </p>
                        )}
                      </div>
                      {selectedUsers.has(user.id) && (
                        <div className="text-blue-600">
                          <UserPlus className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSendInvites}
            disabled={loading || selectedUsers.size === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar {selectedUsers.size > 0 ? `${selectedUsers.size} ` : ''}Convite{selectedUsers.size > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
