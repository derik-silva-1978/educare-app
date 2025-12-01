
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import DeleteTeamDialog from './DeleteTeamDialog';
import TeamDetailsDialog from './TeamDetailsDialog';
import { LicenseTeam } from '@/types/license';

interface TeamsListProps {
  teams: LicenseTeam[];
  onTeamUpdate: (team: LicenseTeam) => void;
  onTeamDelete: (id: string) => void;
  licenseId?: string;
  isLoading?: boolean;
}

export const TeamsList: React.FC<TeamsListProps> = ({ 
  teams, 
  onTeamUpdate, 
  onTeamDelete,
  licenseId,
  isLoading = false
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<LicenseTeam | null>(null);

  const handleOpenDeleteDialog = (team: LicenseTeam) => {
    setSelectedTeam(team);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTeam(null);
  };

  const handleOpenDetailsDialog = (team: LicenseTeam) => {
    setSelectedTeam(team);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedTeam(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    onTeamDelete(teamId);
    handleCloseDeleteDialog();
  };

  const handleSaveTeam = (teamData: LicenseTeam) => {
    onTeamUpdate(teamData);
    handleCloseDetailsDialog();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        <span className="ml-2 text-muted-foreground">Carregando equipes...</span>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">Nenhuma equipe encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>Lista de equipes licenciadas para sua organização.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Membros</TableHead>
            <TableHead>Licenças</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.id}</TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.description}</TableCell>
              <TableCell>{team.members.length}</TableCell>
              <TableCell>{team.licenses.length}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleOpenDetailsDialog(team)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDeleteDialog(team)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Total de {teams.length} equipes
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {selectedTeam && (
        <DeleteTeamDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          team={selectedTeam}
          onDelete={handleDeleteTeam}
          onOpenChange={setOpenDeleteDialog}
        />
      )}

      {selectedTeam && (
        <TeamDetailsDialog
          open={openDetailsDialog}
          onClose={handleCloseDetailsDialog}
          team={selectedTeam}
          onSave={handleSaveTeam}
        />
      )}
    </>
  );
};

export default TeamsList;
