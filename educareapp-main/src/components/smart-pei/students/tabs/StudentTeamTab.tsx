
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import useTeamOperations from '@/hooks/teams/useTeamOperations';
import StudentTeamView from '../../user/StudentTeamView';
import StudentTeamForm from '../team/StudentTeamForm';
import { Users, Plus } from 'lucide-react';

interface StudentTeamTabProps {
  studentId: string;
  studentName: string;
}

const StudentTeamTab: React.FC<StudentTeamTabProps> = ({ 
  studentId, 
  studentName 
}) => {
  const [activeTab, setActiveTab] = useState<string>("view");
  const { getTeamsByStudentId, teams, loadTeams } = useTeamOperations();
  const [hasTeam, setHasTeam] = useState(false);
  
  // Check if student already has a team
  useEffect(() => {
    const studentTeams = getTeamsByStudentId(studentId);
    setHasTeam(studentTeams && studentTeams.length > 0);
  }, [studentId, getTeamsByStudentId, teams]);
  
  const handleTeamCreated = () => {
    loadTeams();
    setActiveTab("view");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Equipe de Apoio</h2>
        {hasTeam && (
          <Button 
            variant="outline" 
            onClick={() => setActiveTab(activeTab === "view" ? "add" : "view")}
            className="flex items-center gap-1"
          >
            {activeTab === "view" ? (
              <>
                <Plus className="h-4 w-4" />
                Nova Equipe
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Ver Equipes
              </>
            )}
          </Button>
        )}
      </div>
      
      {hasTeam ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="view">Visualizar Equipe</TabsTrigger>
            <TabsTrigger value="add">Adicionar Nova Equipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            <StudentTeamView studentId={studentId} studentName={studentName} />
          </TabsContent>
          
          <TabsContent value="add">
            <StudentTeamForm 
              studentId={studentId} 
              studentName={studentName} 
              onSuccess={handleTeamCreated}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Sem equipe associada
            </CardTitle>
            <CardDescription>
              Esse estudante ainda não possui uma equipe de apoio associada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentTeamForm 
              studentId={studentId} 
              studentName={studentName} 
              onSuccess={handleTeamCreated}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentTeamTab;
