
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportDetailsFormProps {
  reportData: {
    title: string;
    description: string;
    type: string;
    studentName: string;
  };
  onChange: (field: string, value: string) => void;
  studentIdProvided?: boolean;
}

export const ReportDetailsForm: React.FC<ReportDetailsFormProps> = ({
  reportData,
  onChange,
  studentIdProvided = false
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-title">Título do Relatório</Label>
            <Input 
              id="report-title" 
              value={reportData.title} 
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Digite um título para o relatório" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-description">Descrição</Label>
            <Textarea 
              id="report-description" 
              value={reportData.description} 
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Breve descrição do conteúdo deste relatório" 
              rows={3}
            />
          </div>
          
          {!studentIdProvided && (
            <div className="space-y-2">
              <Label htmlFor="student-select">Aluno</Label>
              <Select 
                value={reportData.studentName || "select-student"} 
                onValueChange={(value) => onChange('studentName', value)}
              >
                <SelectTrigger id="student-select">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-student" disabled>Selecione um aluno</SelectItem>
                  <SelectItem value="Thiago Henrique">Thiago Henrique</SelectItem>
                  <SelectItem value="Maria Eduarda">Maria Eduarda</SelectItem>
                  <SelectItem value="João Pedro">João Pedro</SelectItem>
                  <SelectItem value="Sofia Santos">Sofia Santos</SelectItem>
                  <SelectItem value="Todos os Alunos">Todos os Alunos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="pt-2 text-xs text-muted-foreground">
            <p>* Campos obrigatórios</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDetailsForm;
