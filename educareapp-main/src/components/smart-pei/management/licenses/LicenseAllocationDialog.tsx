
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { LicenseAllocationParams, TeamMember } from '@/types/license';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/hooks/use-toast';
import { uuid } from '@/utils/uuid';

export interface LicenseAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  licenseId: string;
  onAllocate?: (teamId: string) => void;
}

export default function LicenseAllocationDialog({ 
  open, 
  onOpenChange, 
  licenseId,
  onAllocate
}: LicenseAllocationDialogProps) {
  const { createTeam, isLoading } = useTeamManagement();
  
  const [studentName, setStudentName] = useState('');
  const [teamName, setTeamName] = useState('');
  
  // Coordinator
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  
  // Parent
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  
  // Professionals
  const [professionals, setProfessionals] = useState<TeamMember[]>([]);
  const [professionalName, setProfessionalName] = useState('');
  const [professionalEmail, setProfessionalEmail] = useState('');
  
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
      // Create coordinator object if name and email are provided
      const coordinator = coordinatorName && coordinatorEmail ? {
        id: uuid(),
        name: coordinatorName,
        email: coordinatorEmail,
        role: 'coordinator' as const
      } : undefined;
      
      // Create parent object if name and email are provided
      const parent = parentName && parentEmail ? {
        id: uuid(),
        name: parentName,
        email: parentEmail,
        role: 'parent' as const
      } : undefined;
      
      const allocationParams: LicenseAllocationParams = {
        licenseId,
        studentName,
        teamName: teamName || `Equipe ${studentName}`,
        coordinator,
        parent,
        professionals
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
    } catch (error) {
      console.error('Error allocating license to team:', error);
      toast({
        title: 'Erro ao alocar licença',
        description: 'Ocorreu um erro ao criar a equipe e alocar a licença.',
        variant: 'destructive'
      });
    }
  };
  
  const handleAddProfessional = () => {
    if (professionalName && professionalEmail) {
      setProfessionals([
        ...professionals,
        {
          id: uuid(),
          name: professionalName,
          email: professionalEmail,
          role: 'professional'
        }
      ]);
      
      // Reset fields
      setProfessionalName('');
      setProfessionalEmail('');
    }
  };
  
  const handleRemoveProfessional = (id: string) => {
    setProfessionals(professionals.filter(p => p.id !== id));
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coordinator-name">Nome do Coordenador</Label>
                <Input
                  id="coordinator-name"
                  placeholder="Nome do coordenador"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coordinator-email">Email do Coordenador</Label>
                <Input
                  id="coordinator-email"
                  type="email"
                  placeholder="Email do coordenador"
                  value={coordinatorEmail}
                  onChange={(e) => setCoordinatorEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent-name">Nome do Responsável</Label>
                <Input
                  id="parent-name"
                  placeholder="Nome do responsável"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parent-email">Email do Responsável</Label>
                <Input
                  id="parent-email"
                  type="email"
                  placeholder="Email do responsável"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Profissionais</Label>
              {professionals.length > 0 && (
                <div className="space-y-2 mb-4">
                  {professionals.map(prof => (
                    <div key={prof.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{prof.name} ({prof.email})</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProfessional(prof.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-[1fr,1fr,auto] gap-2">
                <Input
                  placeholder="Nome do profissional"
                  value={professionalName}
                  onChange={(e) => setProfessionalName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email do profissional"
                  value={professionalEmail}
                  onChange={(e) => setProfessionalEmail(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddProfessional}
                  disabled={!professionalName || !professionalEmail}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
