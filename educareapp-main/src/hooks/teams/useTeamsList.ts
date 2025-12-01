
import { useState, useEffect } from 'react';
import { LicenseTeam } from '@/types/license';
import useLicenseManagement from '../useLicenseManagement';

export function useTeamsList() {
  const [teams, setTeams] = useState<LicenseTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { licenses } = useLicenseManagement();
  
  useEffect(() => {
    // In a real app, fetch teams from an API or extract from licenses
    const storedTeams = localStorage.getItem('smartPeiTeams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      // Initialize with empty teams array
      setTeams([]);
      localStorage.setItem('smartPeiTeams', JSON.stringify([]));
    }
    setIsLoading(false);
  }, []);

  const getAllTeams = (): LicenseTeam[] => {
    // In a real app, you would fetch this from an API
    let allTeams: LicenseTeam[] = [];
    
    licenses.forEach(license => {
      if (license.teams && license.teams.length > 0) {
        allTeams = [...allTeams, ...license.teams];
      }
    });
    
    return allTeams;
  };

  const getTeamsByStudentId = (studentId: string): LicenseTeam[] => {
    return getAllTeams().filter(team => team.studentId === studentId);
  };

  const getTeamsByUserId = (userId: string): LicenseTeam[] => {
    return getAllTeams().filter(team => {
      return team.coordinator.id === userId || 
             team.parent.id === userId ||
             team.professionals.some(prof => prof.id === userId);
    });
  };

  return {
    teams,
    isLoading,
    getAllTeams,
    getTeamsByStudentId,
    getTeamsByUserId
  };
}

export default useTeamsList;
