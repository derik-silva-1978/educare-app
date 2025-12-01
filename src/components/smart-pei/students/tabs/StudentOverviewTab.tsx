
import React from 'react';
import { Student } from '@/hooks/useStudents';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate as defaultFormatDate } from '@/utils/date-utils';

interface StudentOverviewTabProps {
  student: Student;
  formatDate?: (dateString?: string) => string;
}

// Helper functions to format various student data
const formatGradeLevel = (level?: string) => {
  if (!level) return 'Não informado';
  
  const gradeLevels: Record<string, string> = {
    'infant': 'Educação Infantil',
    'elementary': 'Ensino Fundamental I',
    'middle': 'Ensino Fundamental II',
    'high': 'Ensino Médio',
    'special': 'Educação Especial'
  };
  
  return gradeLevels[level] || level;
};

const formatSupportLevel = (level?: string) => {
  if (!level) return 'Não informado';
  
  const supportLevels: Record<string, string> = {
    'low': 'Suporte Leve',
    'medium': 'Suporte Moderado',
    'high': 'Suporte Intensivo'
  };
  
  return supportLevels[level] || level;
};

const formatTherapy = (therapy: string) => {
  const therapies: Record<string, string> = {
    'speech': 'Fonoaudiologia',
    'occupational': 'Terapia Ocupacional',
    'physical': 'Fisioterapia',
    'psychotherapy': 'Psicoterapia',
    'aba': 'Terapia ABA',
    'equine': 'Equoterapia',
    'other': 'Outra Terapia'
  };
  
  return therapies[therapy] || therapy;
};

const formatAccommodation = (accommodation: string) => {
  const accommodations: Record<string, string> = {
    'extended_time': 'Tempo Estendido',
    'separate_room': 'Sala Separada',
    'reader': 'Leitor',
    'scribe': 'Escriba',
    'assistive_tech': 'Tecnologia Assistiva',
    'modified_materials': 'Materiais Adaptados',
    'other': 'Outra Acomodação'
  };
  
  return accommodations[accommodation] || accommodation;
};

const StudentOverviewTab: React.FC<StudentOverviewTabProps> = ({ 
  student, 
  formatDate = defaultFormatDate 
}) => {
  const birthDate = student.birthDate ? new Date(student.birthDate) : null;
  const age = student.age || (birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null);
  
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo</p>
              <p>{student.name}</p>
            </div>
            {birthDate && (
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p>{formatDate(student.birthDate)}</p>
              </div>
            )}
            {age && (
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p>{age} anos</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Gênero</p>
              <p>{student.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p>{student.guardianName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Academic Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informações Acadêmicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Série/Ano</p>
              <p>{formatGradeLevel(student.gradeLevel)}</p>
            </div>
            {student.schoolName && (
              <div>
                <p className="text-sm text-muted-foreground">Escola</p>
                <p>{student.schoolName}</p>
              </div>
            )}
            {student.teacherName && (
              <div>
                <p className="text-sm text-muted-foreground">Professor(a)</p>
                <p>{student.teacherName}</p>
              </div>
            )}
            {student.schoolYear && (
              <div>
                <p className="text-sm text-muted-foreground">Ano Letivo</p>
                <p>{student.schoolYear}</p>
              </div>
            )}
          </div>
          
          {student.academicNotes && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Observações Acadêmicas</p>
              <p className="whitespace-pre-line">{student.academicNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diagnostic Information */}
      {student.hasDiagnosis && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações Diagnósticas</h3>
            {student.diagnoses && student.diagnoses.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Diagnósticos</p>
                {student.diagnoses.map((diagnosis, index) => (
                  <div key={index} className="mb-2">
                    <Badge variant="secondary">{diagnosis.type}</Badge>
                    {diagnosis.cid && <p className="text-xs text-muted-foreground">CID: {diagnosis.cid}</p>}
                    {diagnosis.date && <p className="text-xs text-muted-foreground">Data: {formatDate(diagnosis.date)}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {student.supportLevel && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Nível de Suporte</p>
                <Badge variant="outline" className="mt-1">
                  {formatSupportLevel(student.supportLevel)}
                </Badge>
              </div>
            )}
            
            {student.diagnosisNotes && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Observações sobre o Diagnóstico</p>
                <p className="whitespace-pre-line">{student.diagnosisNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Support Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Apoios e Terapias</h3>
          
          {student.therapies && student.therapies.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Terapias e Intervenções</p>
              <div className="flex flex-wrap gap-2">
                {student.therapies.map(therapy => (
                  <Badge key={therapy} variant="secondary">
                    {formatTherapy(therapy)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {student.therapyNotes && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Observações sobre Terapias</p>
              <p className="whitespace-pre-line">{student.therapyNotes}</p>
            </div>
          )}
          
          {student.accommodations && student.accommodations.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Acomodações Educacionais</p>
              <div className="flex flex-wrap gap-2">
                {student.accommodations.map(accommodation => (
                  <Badge key={accommodation} variant="secondary">
                    {formatAccommodation(accommodation)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {student.medicationUse && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Medicação</p>
              <p className="whitespace-pre-line">{student.medicationNotes || 'Não especificado'}</p>
            </div>
          )}
          
          {student.schoolSupport && (
            <div>
              <Badge variant="outline">Recebe Apoio Escolar Especializado</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOverviewTab;
