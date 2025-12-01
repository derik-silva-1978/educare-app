import { useState, useCallback, useEffect } from 'react';
import { teamService, Team, TeamMember, CreateTeamData, UpdateTeamData, InviteMemberData, UpdateMemberData, UserForInvite, SearchUsersParams } from '@/services/teamService';
import { toast } from '@/hooks/use-toast';

export interface UseTeamManagementReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  total: number;
  
  // Ações de equipes
  fetchTeams: () => Promise<void>;
  createTeam: (data: CreateTeamData) => Promise<boolean>;
  updateTeam: (id: string, data: UpdateTeamData) => Promise<boolean>;
  deleteTeam: (id: string) => Promise<boolean>;
  getTeam: (id: string) => Promise<Team | null>;
  
  // Ações de membros
  fetchMembers: (teamId: string) => Promise<TeamMember[]>;
  inviteMember: (teamId: string, data: InviteMemberData) => Promise<boolean>;
  updateMember: (teamId: string, memberId: string, data: UpdateMemberData) => Promise<boolean>;
  removeMember: (teamId: string, memberId: string) => Promise<boolean>;
  
  // Busca de usuários
  searchUsers: (teamId: string, params?: SearchUsersParams) => Promise<UserForInvite[]>;
  
  // Utilitários
  refreshData: () => Promise<void>;
}

export const useTeamManagement = (): UseTeamManagementReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Função para buscar equipes
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await teamService.listTeams();
      
      if (response.success && response.data) {
        setTeams(response.data.teams || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.error || 'Erro ao buscar equipes');
        setTeams([]);
        setTotal(0);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMsg);
      setTeams([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar equipe
  const createTeam = useCallback(async (data: CreateTeamData): Promise<boolean> => {
    try {
      const response = await teamService.createTeam(data);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Equipe criada com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após criação
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao criar equipe",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para atualizar equipe
  const updateTeam = useCallback(async (id: string, data: UpdateTeamData): Promise<boolean> => {
    try {
      const response = await teamService.updateTeam(id, data);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Equipe atualizada com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após edição
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar equipe",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para deletar equipe
  const deleteTeam = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await teamService.deleteTeam(id);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Equipe removida com sucesso",
          variant: "default",
        });
        
        // Atualizar lista após exclusão
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao remover equipe",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para obter detalhes de uma equipe
  const getTeam = useCallback(async (id: string): Promise<Team | null> => {
    try {
      const response = await teamService.getTeam(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao buscar equipe",
          variant: "destructive",
        });
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return null;
    }
  }, []);

  // Função para buscar membros de uma equipe
  const fetchMembers = useCallback(async (teamId: string): Promise<TeamMember[]> => {
    try {
      const response = await teamService.listMembers(teamId);
      
      if (response.success && response.data) {
        return response.data.members || [];
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao buscar membros",
          variant: "destructive",
        });
        return [];
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return [];
    }
  }, []);

  // Função para convidar membro
  const inviteMember = useCallback(async (teamId: string, data: InviteMemberData): Promise<boolean> => {
    try {
      const response = await teamService.inviteMember(teamId, data);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Convite enviado com sucesso",
          variant: "default",
        });
        
        // Atualizar lista de equipes para refletir novos membros
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao enviar convite",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para atualizar membro
  const updateMember = useCallback(async (teamId: string, memberId: string, data: UpdateMemberData): Promise<boolean> => {
    try {
      const response = await teamService.updateMember(teamId, memberId, data);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Membro atualizado com sucesso",
          variant: "default",
        });
        
        // Atualizar lista de equipes
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao atualizar membro",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para remover membro
  const removeMember = useCallback(async (teamId: string, memberId: string): Promise<boolean> => {
    try {
      const response = await teamService.removeMember(teamId, memberId);
      
      if (response.success) {
        toast({
          title: "Sucesso",
          description: "Membro removido com sucesso",
          variant: "default",
        });
        
        // Atualizar lista de equipes
        await fetchTeams();
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao remover membro",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTeams]);

  // Função para buscar usuários para convite
  const searchUsers = useCallback(async (teamId: string, params: SearchUsersParams = {}): Promise<UserForInvite[]> => {
    try {
      const response = await teamService.searchUsersForInvite(teamId, params);
      
      if (response.success && response.data) {
        return response.data.users || [];
      } else {
        toast({
          title: "Erro",
          description: response.error || "Erro ao buscar usuários",
          variant: "destructive",
        });
        return [];
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      return [];
    }
  }, []);

  // Função para atualizar dados
  const refreshData = useCallback(async () => {
    await fetchTeams();
  }, [fetchTeams]);

  // Carregar equipes na inicialização
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading,
    error,
    total,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    fetchMembers,
    inviteMember,
    updateMember,
    removeMember,
    searchUsers,
    refreshData,
  };
};

export default useTeamManagement;
