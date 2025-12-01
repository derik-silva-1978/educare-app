
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TeamMemberSelector } from '@/components/smart-pei/management/teams/TeamMemberSelector';
import { TeamMember } from '@/types/license';
import useTeamOperations from '@/hooks/teams/useTeamOperations';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/loading';
import { Users } from 'lucide-react';

interface StudentTeamFormProps {
  studentId: string;
  studentName: string;
  onSuccess?: () => void;
  licenseId?: string;
}

const StudentTeamForm: React.FC<StudentTeamFormProps> = ({
  studentId,
  studentName,
  onSuccess,
  licenseId = 'default-license' // In a real app, you'd use a proper license ID
}) => {
  const { toast } = useToast();
  const { createTeam } = useTeamOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamName, setTeamName] = useState(`Equipe ${studentName}`);
  const [coordinator, setCoordinator] = useState<TeamMember | null>(null);
  const [parent, setParent] = useState<TeamMember | null>(null);
  const [professionals, setProfessionals] = useState<TeamMember[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the team using the useTeamOperations hook
      createTeam({
        licenseId,
        studentId,
        studentName,
        teamName,
        coordinator: coordinator || {
          id: '',
          name: '',
          email: '',
          role: 'coordinator'
        },
        parent: parent || {
          id: '',
          name: '',
          email: '',
          role: 'parent'
        },
        professionals
      });

      toast({
        title: "Equipe criada com sucesso",
        description: `A equipe "${teamName}" foi criada para ${studentName}.`
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Erro ao criar equipe",
        description: "Não foi possível criar a equipe. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Criar Equipe para {studentName}
        </CardTitle>
        <CardDescription>
          Adicione os profissionais que farão parte da equipe de apoio do estudante.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Nome da Equipe</Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nome da equipe"
            />
          </div>

          <div className="space-y-2">
            <Label>Coordenador</Label>
            <TeamMemberSelector
              role="coordinator"
              selectedMember={coordinator}
              onSelect={setCoordinator}
            />
          </div>

          <div className="space-y-2">
            <Label>Responsável</Label>
            <TeamMemberSelector
              role="parent"
              selectedMember={parent}
              onSelect={setParent}
            />
          </div>

          <div className="space-y-2">
            <Label>Profissionais</Label>
            <TeamMemberSelector
              role="professional"
              multiple
              selectedMembers={professionals}
              onSelectMultiple={setProfessionals}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Criando equipe...
              </>
            ) : (
              'Criar Equipe'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentTeamForm;
