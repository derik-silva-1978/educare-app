
import React from 'react';
import { PEI } from '@/hooks/usePEI';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, FileText, Users, CheckSquare } from 'lucide-react';

interface CompletenessCheckProps {
  pei: PEI;
}

export const CompletenessCheck: React.FC<CompletenessCheckProps> = ({ pei }) => {
  // Check PEI completeness
  const completenessChecks = [
    { key: 'title', name: 'Título', completed: !!pei.title, icon: <FileText className="h-4 w-4" /> },
    { key: 'dates', name: 'Datas de Início e Fim', completed: !!pei.startDate && !!pei.endDate, icon: <FileText className="h-4 w-4" /> },
    { key: 'teamMembers', name: 'Equipe de Apoio', completed: pei.teamMembers.length > 0, icon: <Users className="h-4 w-4" /> },
    { key: 'goals', name: 'Objetivos Definidos', completed: pei.goals.length > 0, icon: <CheckSquare className="h-4 w-4" /> },
    { key: 'goals-strategies', name: 'Estratégias para Objetivos', completed: pei.goals.every(g => g.strategies.length > 0), icon: <CheckSquare className="h-4 w-4" /> }
  ];
  
  const completedChecks = completenessChecks.filter(check => check.completed).length;
  const totalChecks = completenessChecks.length;
  const completenessScore = Math.round((completedChecks / totalChecks) * 100);
  
  // Completeness severity class
  const getCompletenessClass = () => {
    if (completenessScore < 60) return 'text-red-500';
    if (completenessScore < 80) return 'text-amber-500';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Verificação de Completude</h4>
        <Badge className={`${getCompletenessClass()} bg-opacity-10`}>
          {completenessScore}% completo
        </Badge>
      </div>
      
      <div className="flex justify-between text-sm mb-1">
        <span>Completude Geral</span>
        <span className={`font-medium ${getCompletenessClass()}`}>
          {completenessScore}%
        </span>
      </div>
      <Progress value={completenessScore} className="h-2" />
      
      <div className="space-y-0 mt-4 border rounded-md overflow-hidden">
        {completenessChecks.map((check, index) => (
          <div 
            key={check.key} 
            className={`flex items-center justify-between py-3 px-4 ${
              index !== completenessChecks.length - 1 ? 'border-b' : ''
            } ${check.completed ? 'bg-green-50/50' : ''}`}
          >
            <div className="flex items-center gap-2">
              {check.icon}
              <span className="text-sm">{check.name}</span>
            </div>
            {check.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletenessCheck;
