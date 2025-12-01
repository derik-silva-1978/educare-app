
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentSummary } from '@/types/assessment';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';

interface AssessmentCardProps {
  assessment: AssessmentSummary;
  lastUpdated?: string;
  onClick?: () => void;
}

// Fix the formatDate function to handle Date objects
const formatDate = (date: string): string => {
  if (!date) return '';
  
  // Already a string, use it directly
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Fix the formatRelativeTime function to handle Date objects
const formatRelativeTime = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Convert to Date object
  const date = new Date(dateStr);
  
  return formatRelative(date, new Date(), { locale: ptBR });
};

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  assessment, 
  lastUpdated,
  onClick 
}) => {
  const formattedDate = formatDate(assessment.date);
  const isInProgress = assessment.status === 'in_progress' || assessment.status === 'in-progress' || assessment.status === 'draft';
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{assessment.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Data</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Estudante</span>
            <span>{assessment.studentName}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isInProgress 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isInProgress ? 'Em andamento' : 'Concluída'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 justify-between border-t mt-2 px-4 py-2">
        <div className="text-xs text-muted-foreground">
          {lastUpdated && `Atualizado ${formatRelativeTime(lastUpdated)}`}
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClick}>
          {isInProgress ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
          {isInProgress ? 'Editar' : 'Visualizar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
