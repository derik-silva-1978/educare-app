
import React from 'react';
import { PEI } from '@/hooks/usePEI';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import useStudents from '@/hooks/useStudents';

interface PEIReviewFormProps {
  pei: PEI;
  onSubmit?: () => Promise<void>;
  isSubmitting?: boolean;
}

const PEIReviewForm: React.FC<PEIReviewFormProps> = ({ 
  pei,
  onSubmit,
  isSubmitting
}) => {
  const { getStudent } = useStudents();
  const student = getStudent(pei.studentId);
  
  // Format review frequency for display
  const formatReviewFrequency = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      weekly: 'Semanal',
      biweekly: 'Quinzenal',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      semiannually: 'Semestral',
      annually: 'Anual'
    };
    
    return frequencyMap[frequency] || frequency;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Revisão Final</h3>
        <p className="text-muted-foreground mb-6">
          Revise as informações do PEI antes de finalizar a criação.
        </p>
        
        <div className="space-y-6">
          <div className="bg-muted/10 p-4 rounded-md border">
            <h4 className="font-medium mb-2">Informações Gerais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Título:</span>
                <p className="font-medium">{pei.title}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Estudante:</span>
                <p className="font-medium">{student?.name || 'Não especificado'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Período:</span>
                <p>
                  {format(new Date(pei.startDate), 'PPP', { locale: ptBR })} até{' '}
                  {format(new Date(pei.endDate), 'PPP', { locale: ptBR })}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Frequência de revisão:</span>
                <p>{formatReviewFrequency(pei.reviewFrequency)}</p>
              </div>
              {pei.nextReviewDate && (
                <div>
                  <span className="text-sm text-muted-foreground">Próxima revisão:</span>
                  <p>{format(new Date(pei.nextReviewDate), 'PPP', { locale: ptBR })}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <p>Rascunho (será ativado após finalização)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/10 p-4 rounded-md border">
            <h4 className="font-medium mb-2">Equipe de Apoio</h4>
            {pei.teamMembers.length > 0 ? (
              <ul className="space-y-1">
                {pei.teamMembers.map((member, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    {member}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-sm">Nenhum membro da equipe adicionado</p>
              </div>
            )}
          </div>
          
          <div className="bg-muted/10 p-4 rounded-md border">
            <h4 className="font-medium mb-2">Objetivos</h4>
            {pei.goals && pei.goals.length > 0 ? (
              <ul className="space-y-1">
                {pei.goals.map((goal, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    {goal.title}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-sm">Nenhum objetivo definido</p>
              </div>
            )}
          </div>
          
          {pei.notes && (
            <div className="bg-muted/10 p-4 rounded-md border">
              <h4 className="font-medium mb-2">Notas</h4>
              <p className="text-sm whitespace-pre-wrap">{pei.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PEIReviewForm;
