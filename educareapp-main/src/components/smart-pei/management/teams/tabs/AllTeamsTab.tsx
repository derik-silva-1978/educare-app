
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LicenseTeam } from '@/types/license';
import { Search } from 'lucide-react';
import TeamsList from '../TeamsList';
import TeamDetailsDialog from '../TeamDetailsDialog';
import DeleteTeamDialog from '../DeleteTeamDialog';

interface AllTeamsTabProps {
  teams: LicenseTeam[];
  isLoading: boolean;
  onDeleteTeam?: (teamId: string) => void;
  onUpdateTeam?: (team: LicenseTeam) => void;
}

const AllTeamsTab: React.FC<AllTeamsTabProps> = ({
  teams,
  isLoading,
  onDeleteTeam = () => {},
  onUpdateTeam = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<LicenseTeam | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<LicenseTeam | null>(null);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredTeams = teams.filter(team => {
    const query = searchQuery.toLowerCase();
    return (
      team.name.toLowerCase().includes(query) ||
      (team.studentName && team.studentName.toLowerCase().includes(query))
    );
  });
  
  const handleOpenDetails = (team: LicenseTeam) => {
    setSelectedTeam(team);
  };
  
  const handleCloseDetails = () => {
    setSelectedTeam(null);
  };
  
  const handleOpenDeleteDialog = (team: LicenseTeam) => {
    setTeamToDelete(team);
  };
  
  const handleCloseDeleteDialog = () => {
    setTeamToDelete(null);
  };
  
  const handleDelete = (teamId: string) => {
    onDeleteTeam(teamId);
    setTeamToDelete(null);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar equipes..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TeamsList
        teams={filteredTeams}
        isLoading={isLoading}
        onTeamUpdate={onUpdateTeam}
        onTeamDelete={handleDelete}
      />
      
      {selectedTeam && (
        <TeamDetailsDialog
          team={selectedTeam}
          open={!!selectedTeam}
          onClose={handleCloseDetails}
          onSave={onUpdateTeam}
        />
      )}
      
      {teamToDelete && (
        <DeleteTeamDialog
          team={teamToDelete}
          open={!!teamToDelete}
          onClose={handleCloseDeleteDialog}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AllTeamsTab;
