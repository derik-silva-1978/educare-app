
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PEI } from '@/hooks/usePEI';
import { Student } from '@/hooks/useStudents';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PEIHeaderProps {
  pei: PEI;
  student?: Student | null;
}

const PEIHeader: React.FC<PEIHeaderProps> = ({ pei, student }) => {
  // Status badge color and text mapping
  const statusColor = {
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    active: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300',
    archived: 'bg-gray-100 text-gray-800 border-gray-300'
  }[pei.status];
  
  const statusText = {
    draft: 'Rascunho',
    active: 'Ativo',
    completed: 'Concluído',
    archived: 'Arquivado'
  }[pei.status];
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        {student && (
          <Avatar className="h-12 w-12 border">
            {student.photoUrl ? (
              <AvatarImage src={student.photoUrl} alt={student.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {student.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        )}
        
        <div>
          <h2 className="text-xl font-bold">{pei.title}</h2>
          <p className="text-sm text-muted-foreground">
            {student ? (
              <span>Estudante: {student.name}</span>
            ) : (
              <span>ID do estudante: {pei.studentId}</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="outline" className={`${statusColor} px-3 py-1`}>
          {statusText}
        </Badge>
      </div>
    </div>
  );
};

export default PEIHeader;
