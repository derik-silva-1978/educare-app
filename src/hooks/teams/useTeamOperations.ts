
import { useState, useEffect } from 'react';
import { LicenseTeam, License, TeamMember, LicenseAllocationParams } from '@/types/license';
import { uuid } from '@/utils/uuid';
import { useToast } from '@/hooks/use-toast';

export const useTeamOperations = () => {
  const [teams, setTeams] = useState<LicenseTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadTeams();
  }, []);
  
  const loadTeams = () => {
    setIsLoading(true);
    try {
      const teamsData = localStorage.getItem('teams');
      if (teamsData) {
        setTeams(JSON.parse(teamsData));
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      toast({
        title: 'Erro ao carregar equipes',
        description: 'Não foi possível carregar os dados das equipes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveTeams = (updatedTeams: LicenseTeam[]) => {
    try {
      localStorage.setItem('teams', JSON.stringify(updatedTeams));
      setTeams(updatedTeams);
    } catch (error) {
      console.error('Error saving teams:', error);
      toast({
        title: 'Erro ao salvar equipes',
        description: 'Não foi possível salvar os dados das equipes.',
        variant: 'destructive'
      });
    }
  };
  
  const createTeam = (params: LicenseAllocationParams): string => {
    const { 
      licenseId, 
      studentId, 
      studentName, 
      teamName, 
      coordinator, 
      parent, 
      professionals = [] 
    } = params;
    
    if (!studentName) {
      toast({
        title: 'Dados incompletos',
        description: 'Informe o nome do aluno para criar a equipe.',
        variant: 'destructive'
      });
      return '';
    }
    
    const now = new Date().toISOString();
    const teamId = uuid();
    
    // Convert coordinator and parent to TeamMember if needed
    const coordMember: TeamMember | undefined = coordinator ? {
      id: coordinator.id || uuid(),
      name: coordinator.name,
      email: coordinator.email,
      role: 'coordinator'
    } : undefined;
    
    const parentMember: TeamMember | undefined = parent ? {
      id: parent.id || uuid(),
      name: parent.name,
      email: parent.email,
      role: 'parent'
    } : undefined;
    
    // Convert professionals array if needed
    const profMembers: TeamMember[] = professionals.map(prof => 
      ({
        id: prof.id || uuid(),
        name: prof.name,
        email: prof.email,
        role: 'professional'
      })
    );
    
    // Combine all members
    const allMembers: TeamMember[] = [];
    if (coordMember) allMembers.push(coordMember);
    if (parentMember) allMembers.push(parentMember);
    allMembers.push(...profMembers);
    
    const newTeam: LicenseTeam = {
      id: teamId,
      name: teamName || `Equipe ${studentName}`,
      description: `Equipe de apoio para ${studentName}`,
      studentId: studentId || uuid(),
      studentName,
      coordinator: coordMember,
      parent: parentMember,
      professionals: profMembers,
      createdAt: now,
      updatedAt: now,
      licenseId,
      members: allMembers,
      licenses: [licenseId]
    };
    
    const updatedTeams = [...teams, newTeam];
    saveTeams(updatedTeams);
    
    toast({
      title: 'Equipe criada',
      description: `Equipe para ${studentName} criada com sucesso.`
    });
    
    return teamId;
  };
  
  const updateTeam = (team: LicenseTeam) => {
    const updatedTeams = teams.map(t => (t.id === team.id ? team : t));
    saveTeams(updatedTeams);
    
    toast({
      title: 'Equipe atualizada',
      description: `Equipe ${team.name} atualizada com sucesso.`
    });
  };
  
  const deleteTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const updatedTeams = teams.filter(t => t.id !== teamId);
    saveTeams(updatedTeams);
    
    toast({
      title: 'Equipe excluída',
      description: `Equipe ${team.name} excluída com sucesso.`
    });
  };
  
  const getTeamById = (id: string): LicenseTeam | undefined => {
    return teams.find(team => team.id === id);
  };
  
  const getTeamsByLicense = (licenseId: string): LicenseTeam[] => {
    return teams.filter(team => team.licenseId === licenseId || team.licenses?.includes(licenseId));
  };
  
  const getTeamsByStudentId = (studentId: string): LicenseTeam[] => {
    return teams.filter(team => team.studentId === studentId);
  };
  
  return {
    teams,
    isLoading,
    loadTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamById,
    getTeamsByLicense,
    getTeamsByStudentId
  };
};

export default useTeamOperations;
