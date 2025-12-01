
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamMemberCard from './TeamMemberCard';
import UserProfileCard from './UserProfileCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTeamOperations from '@/hooks/teams/useTeamOperations';
import { LicenseTeam, TeamMember } from '@/types/license';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StudentTeamViewProps {
  studentId: string;
  studentName: string;
}

const StudentTeamView: React.FC<StudentTeamViewProps> = ({ 
  studentId, 
  studentName 
}) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getTeamsByStudentId, isLoading } = useTeamOperations();
  const [teams, setTeams] = useState<LicenseTeam[]>([]);

  useEffect(() => {
    const studentTeams = getTeamsByStudentId(studentId);
    setTeams(studentTeams || []);
  }, [studentId, getTeamsByStudentId]);

  const handleViewProfile = (memberId: string) => {
    const member = teams.flatMap(team => team.members || []).find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
      setDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Nenhuma equipe encontrada para este estudante.
        </AlertDescription>
      </Alert>
    );
  }

  // Get all professionals across all teams
  const allMembers = teams.flatMap(team => team.members || []);
  
  // Get unique role types for the tabs
  const roleTypes = [...new Set(allMembers.map(member => member.role))];

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <CardTitle className="text-lg">{team.name || `Equipe de ${studentName}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {roleTypes.includes('coordinator') && (
                  <TabsTrigger value="coordinator">Coordenadores</TabsTrigger>
                )}
                {roleTypes.includes('parent') && (
                  <TabsTrigger value="parent">Responsáveis</TabsTrigger>
                )}
                {roleTypes.includes('professional') && (
                  <TabsTrigger value="professional">Especialistas</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="all" className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(team.members || []).map(member => (
                    <TeamMemberCard 
                      key={member.id}
                      member={{
                        id: member.id,
                        name: member.name,
                        position: getRoleLabel(member.role),
                        description: member.description,
                      }}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              </TabsContent>
              
              {roleTypes.includes('coordinator') && (
                <TabsContent value="coordinator" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(team.members || [])
                      .filter(m => m.role === 'coordinator')
                      .map(member => (
                        <TeamMemberCard 
                          key={member.id}
                          member={{
                            id: member.id,
                            name: member.name,
                            position: getRoleLabel(member.role),
                            description: member.description,
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                  </div>
                </TabsContent>
              )}
              
              {roleTypes.includes('parent') && (
                <TabsContent value="parent" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(team.members || [])
                      .filter(m => m.role === 'parent')
                      .map(member => (
                        <TeamMemberCard 
                          key={member.id}
                          member={{
                            id: member.id,
                            name: member.name,
                            position: getRoleLabel(member.role),
                            description: member.description,
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                  </div>
                </TabsContent>
              )}
              
              {roleTypes.includes('professional') && (
                <TabsContent value="professional" className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(team.members || [])
                      .filter(m => m.role === 'professional')
                      .map(member => (
                        <TeamMemberCard 
                          key={member.id}
                          member={{
                            id: member.id,
                            name: member.name,
                            position: getRoleLabel(member.role),
                            description: member.description,
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      ))}

      {/* Member Profile Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil do Profissional</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <UserProfileCard 
              profile={{
                id: selectedMember.id,
                name: selectedMember.name,
                position: getRoleLabel(selectedMember.role),
                description: selectedMember.description,
              }} 
              isEditable={false} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get a user-friendly label for role
function getRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    'coordinator': 'Coordenador',
    'parent': 'Responsável',
    'professional': 'Profissional',
    'teacher': 'Professor',
    'psychologist': 'Psicólogo',
    'therapist': 'Terapeuta',
    'specialist': 'Especialista',
    'admin': 'Administrador'
  };
  
  return roleMap[role] || role;
}

export default StudentTeamView;
