import { useState, useEffect } from 'react';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { teamInviteService } from '@/services/teamInviteService';
import { httpClient } from '@/services/api/httpClient';
import { toast } from '@/hooks/use-toast';

export interface ProfessionalTeamChat {
  childId: string;
  childName: string;
  teamId: string;
  teamName: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export function useProfessionalTeamChats() {
  const [teamChats, setTeamChats] = useState<ProfessionalTeamChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useCustomAuth();

  useEffect(() => {
    async function loadProfessionalTeamChats() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 Buscando equipes onde o profissional é membro ativo...');

        // Usar o novo endpoint para buscar equipes do usuário atual
        const teamsResponse = await httpClient.get('/api/teams/my');
        console.log('✅ Resposta de equipes:', teamsResponse.data);
        
        const teams = teamsResponse.data?.data?.teams || teamsResponse.data?.teams || [];
        console.log('✅ Teams encontradas:', teams.length);

        if (teams.length > 0) {
          const teamChatsData: ProfessionalTeamChat[] = [];

          // Para cada team, buscar informações da criança se existir child_id
          for (const team of teams) {
            try {
              let childName = 'Equipe Terapêutica';
              
              if (team.child_id) {
                try {
                  // Buscar informações da criança
                  const childResponse = await httpClient.get(`/api/children/${team.child_id}`);
                  const child = childResponse.data?.data || childResponse.data;
                  
                  if (child) {
                    childName = child.name || `${child.first_name || ''} ${child.last_name || ''}`.trim() || 'Criança';
                  }
                } catch (childErr) {
                  console.warn('⚠️ Erro ao buscar dados da criança:', team.child_id, childErr);
                  // Continuar mesmo se não conseguir buscar dados da criança
                }
              }

              teamChatsData.push({
                childId: team.child_id || '',
                childName: childName,
                teamId: team.id,
                teamName: team.name || 'Equipe Terapêutica',
                status: 'active',
                joinedAt: team.createdAt || new Date().toISOString()
              });
            } catch (err) {
              console.warn('⚠️ Erro ao processar team:', team.id, err);
              // Continuar com os próximos teams mesmo se um falhar
            }
          }

          console.log('📊 Team chats processados:', teamChatsData);
          setTeamChats(teamChatsData);
        } else {
          console.log('ℹ️ Nenhuma equipe encontrada para o usuário');
          setTeamChats([]);
        }

      } catch (err: unknown) {
        console.error('❌ Erro ao carregar team chats do profissional:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar chats';
        setError(errorMessage);
        
        toast({
          title: "Erro ao carregar chats",
          description: "Não foi possível carregar os chats da equipe terapêutica. Verifique se você pertence a alguma equipe ativa.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfessionalTeamChats();
  }, [user]);



  return {
    teamChats,
    isLoading,
    error,
    hasTeamChats: teamChats.length > 0,
    refresh: () => {
      if (user) {
        setIsLoading(true);
        // Trigger useEffect novamente
        setTeamChats([]);
      }
    }
  };
}
