
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { ActivityFormData } from '@/types/activity';
import useStudents from '@/hooks/useStudents';

interface ActivityDetailsFormProps {
  formData: ActivityFormData;
  handleInputChange: (field: keyof ActivityFormData, value: any) => void;
}

const ActivityDetailsForm: React.FC<ActivityDetailsFormProps> = ({ formData, handleInputChange }) => {
  const { students } = useStudents();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assignedRoles">Funções Atribuídas</Label>
        <Select 
          value={formData.assignedToRoles?.[0] || "none"} 
          onValueChange={(value) => {
            handleInputChange('assignedToRoles', [value]);
          }}
        >
          <SelectTrigger id="assignedRoles">
            <SelectValue placeholder="Selecione as funções" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="coordinator">Coordenador</SelectItem>
            <SelectItem value="teacher">Professor</SelectItem>
            <SelectItem value="therapist">Terapeuta</SelectItem>
            <SelectItem value="parent">Responsável</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="studentId">Aluno Relacionado</Label>
        <Select 
          value={formData.studentId || "no_student"} 
          onValueChange={(value) => handleInputChange('studentId', value === "no_student" ? "" : value)}
        >
          <SelectTrigger id="studentId">
            <SelectValue placeholder="Selecione um aluno (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_student">Nenhum</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reminderDate">Lembrete</Label>
        <DatePicker 
          date={formData.reminderDate} 
          onSelect={(date) => handleInputChange('reminderDate', date)}
        />
      </div>
    </div>
  );
};

export default ActivityDetailsForm;
