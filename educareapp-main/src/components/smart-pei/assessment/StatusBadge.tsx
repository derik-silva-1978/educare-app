
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AssessmentStatus } from '@/types/assessment';

interface StatusBadgeProps {
  status: AssessmentStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Function to normalize status values
  const normalizeStatus = (status: string): AssessmentStatus => {
    if (status === 'completed') return 'completed';
    if (status === 'in_progress' || status === 'in-progress') return 'in_progress';
    if (status === 'archived') return 'archived';
    if (status === 'pending') return 'pending';
    return 'draft';
  };

  const normalizedStatus = normalizeStatus(status);
  
  // Status badge variants
  const getVariant = (status: AssessmentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'archived':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'draft':
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };
  
  // Status display text
  const getStatusText = (status: AssessmentStatus) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress':
      case 'in-progress': return 'Em progresso';
      case 'archived': return 'Arquivado';
      case 'pending': return 'Pendente';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium py-1 ${getVariant(normalizedStatus)}`}>
      {getStatusText(normalizedStatus)}
    </Badge>
  );
};
