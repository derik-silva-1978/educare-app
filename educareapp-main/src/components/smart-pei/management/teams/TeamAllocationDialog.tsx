
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { LicenseAllocationParams, TeamMember } from '@/types/license';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';
import { TeamMemberSelector } from './TeamMemberSelector';

export interface TeamAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  licenseId: string;
  onClose?: () => void;
  onAllocate?: (teamId: string) => void;
}

export default function TeamAllocationDialog({ 
  open, 
  onOpenChange, 
  licenseId,
  onClose,
  onAllocate
}: TeamAllocationDialogProps) {
  const { createTeam, isLoading } = useTeamManagement();
  
  const [studentName, setStudentName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [coordinator, setCoordinator] = useState<TeamMember | null>(null);
  const [parent, setParent] = useState<TeamMember | null>(null);
  const [professionals, setProfessionals] = useState<TeamMember[]>([]);
  
  const handleCoordinatorSelect = (member: TeamMember) => {
    setCoordinator(member);
  };
  
  const handleParentSelect = (member: TeamMember) => {
    setParent(member);
  };
  
  const handleProfessionalsSelect = (members: TeamMember[]) => {
    setProfessionals(members);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, preencha o nome do aluno.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const allocationParams: LicenseAllocationParams = {
        licenseId,
        studentName,
        teamName: teamName || `Equipe ${studentName}`,
        coordinator: coordinator || undefined,
        parent: parent || undefined,
        professionals: professionals
      };
      
      const teamId = createTeam(allocationParams);
      
      toast({
        title: 'Equipe criada com sucesso',
        description: `A equipe "${teamName || `Equipe ${studentName}`}" foi criada e a licença foi alocada.`
      });
      
      if (onAllocate) {
        onAllocate(teamId);
      }
      
      onOpenChange(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error allocating license to team:', error);
      toast({
        title: 'Erro ao alocar licença',
        description: 'Ocorreu um erro ao criar a equipe e alocar a licença.',
        variant: 'destructive'
      });
    }
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Alocar Licença para Novo Aluno</DialogTitle>
          <DialogDescription>
            Crie uma nova equipe para o aluno e aloque a licença.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Nome do Aluno</Label>
              <Input
                id="student-name"
                placeholder="Nome do aluno"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome da Equipe (opcional)</Label>
              <Input
                id="team-name"
                placeholder="Nome da equipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Coordenador</Label>
              <TeamMemberSelector 
                role="coordinator"
                selectedMember={coordinator}
                onSelect={handleCoordinatorSelect}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Responsável</Label>
              <TeamMemberSelector 
                role="parent"
                selectedMember={parent}
                onSelect={handleParentSelect}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profissionais</Label>
              <TeamMemberSelector 
                role="professional"
                multiple
                selectedMembers={professionals}
                onSelectMultiple={handleProfessionalsSelect}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loading size="sm" text="Processando..." /> : 'Alocar Licença'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
