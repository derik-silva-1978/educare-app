
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Edit, User, Mail, Phone, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Student } from '@/hooks/useStudents';

interface StudentProfileSidebarProps {
  student: Student;
  formatDiagnosisType: (type?: string) => string;
}

export const StudentProfileSidebar: React.FC<StudentProfileSidebarProps> = ({ 
  student, 
  formatDiagnosisType 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {student.photoUrl ? (
                <img 
                  src={student.photoUrl} 
                  alt={student.name} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
          </div>
        </div>
        <CardTitle className="text-center">{student.name}</CardTitle>
        <CardDescription className="text-center">
          {student.gradeLevel} - {student.age} anos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email do Responsável</h3>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {student.guardianEmail || "Não informado"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Responsável</h3>
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {student.guardianName || "Não informado"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Telefone</h3>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {student.guardianPhone || "Não informado"}
            </p>
          </div>
          {student.hasDiagnosis && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Diagnóstico</h3>
              <p className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {formatDiagnosisType(student.diagnosisType)}
              </p>
            </div>
          )}
          <Separator />
          <Button variant="outline" className="w-full" onClick={() => navigate(`/smart-pei/students/edit/${student.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
