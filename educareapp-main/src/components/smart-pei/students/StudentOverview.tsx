
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PEISelector } from '@/components/smart-pei/pei/PEISelector';
import { Student } from '@/hooks/useStudents';
import { FileText, GraduationCap, LineChart, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface StudentOverviewProps {
  student: Student;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ student }) => {
  const navigate = useNavigate();
  
  // Calculate overall progress - use a default since progress doesn't exist in Student type
  const overallProgress = 65; // Default progress value
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dados do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.photoUrl} alt={student.name} />
                <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{student.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {student.id}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Data de Nascimento</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(student.birthDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Idade</p>
                <p className="text-sm text-muted-foreground">
                  {student.age || calculateAge(student.birthDate)} anos
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Turma</p>
                <p className="text-sm text-muted-foreground">{student.gradeLevel || 'Não informado'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">{student.guardianName || 'Não informado'}</p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Progresso Geral</span>
                  <span className="text-xs text-muted-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Planos de Ensino Individualizados</CardTitle>
              <Button size="sm" variant="outline" onClick={() => navigate(`/smart-pei/students/${student.id}/pei/new`)}>
                <Plus className="h-4 w-4 mr-1" />
                Novo PEI
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PEISelector studentId={student.id} onSelectPEI={(peiId) => navigate(`/smart-pei/students/${student.id}/pei/${peiId}`)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          <CardDescription>Histórico de atividades relacionadas a este aluno</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="assessments">Avaliações</TabsTrigger>
              <TabsTrigger value="pei">PEIs</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <DefaultActivities studentId={student.id} />
            </TabsContent>
            
            <TabsContent value="assessments" className="space-y-4">
              <ActivityItem 
                activity={{
                  type: 'assessment',
                  title: 'Avaliação Inicial',
                  date: new Date().toISOString(),
                  status: 'completed',
                  link: `/smart-pei/assessments?student=${student.id}`
                }} 
              />
            </TabsContent>
            
            <TabsContent value="pei" className="space-y-4">
              <ActivityItem 
                activity={{
                  type: 'pei',
                  title: 'PEI 2023/2024',
                  date: new Date().toISOString(),
                  status: 'active',
                  link: `/smart-pei/students/${student.id}/pei`
                }} 
              />
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <ActivityItem 
                activity={{
                  type: 'report',
                  title: 'Relatório Trimestral',
                  date: new Date().toISOString(),
                  status: 'pending',
                  link: `/smart-pei/reports?student=${student.id}`
                }} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Activity item component
interface Activity {
  type: 'assessment' | 'pei' | 'report' | 'progress' | 'other';
  title: string;
  date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  link?: string;
  description?: string;
}

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const icon = {
    assessment: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
    pei: <GraduationCap className="h-5 w-5 text-green-500" />,
    report: <FileText className="h-5 w-5 text-purple-500" />,
    progress: <LineChart className="h-5 w-5 text-amber-500" />,
    other: <FileText className="h-5 w-5 text-gray-500" />
  }[activity.type];
  
  const statusColor = {
    pending: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }[activity.status];
  
  return (
    <div className="flex items-start space-x-4 border-b border-gray-100 pb-4">
      <div className="bg-gray-50 p-2 rounded-md">{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            {activity.link ? (
              <Link to={activity.link} className="hover:underline">{activity.title}</Link>
            ) : (
              activity.title
            )}
          </h4>
          <Badge variant="outline" className={`${statusColor} text-xs`}>
            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
          </Badge>
        </div>
        {activity.description && (
          <p className="text-xs text-muted-foreground">{activity.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {new Date(activity.date).toLocaleDateString('pt-BR', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

// Default activities when none are available
const DefaultActivities: React.FC<{ studentId: string }> = ({ studentId }) => {
  return (
    <>
      <ActivityItem 
        activity={{
          type: 'assessment',
          title: 'Avaliação Inicial',
          date: new Date().toISOString(),
          status: 'completed',
          link: `/smart-pei/assessments?student=${studentId}`
        }} 
      />
      <ActivityItem 
        activity={{
          type: 'pei',
          title: 'PEI 2023/2024',
          date: new Date().toISOString(),
          status: 'active',
          link: `/smart-pei/students/${studentId}/pei`
        }} 
      />
      <ActivityItem 
        activity={{
          type: 'report',
          title: 'Relatório Trimestral',
          date: new Date().toISOString(),
          status: 'pending',
          link: `/smart-pei/reports?student=${studentId}`
        }} 
      />
      <ActivityItem 
        activity={{
          type: 'progress',
          title: 'Registro de Progresso',
          date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
          status: 'completed',
          description: 'Evolução positiva nas atividades de comunicação'
        }} 
      />
    </>
  );
};

// Import Clipboard Check icon
import { ClipboardCheck } from 'lucide-react';

export default StudentOverview;
