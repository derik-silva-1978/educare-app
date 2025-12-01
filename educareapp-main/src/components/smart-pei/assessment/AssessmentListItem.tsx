
import React from 'react';
import { AssessmentSummary, Assessment } from '@/types/assessment';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AssessmentCardProps {
  assessment: AssessmentSummary | Assessment;
  lastUpdated?: string;
  onClick: () => void;
}

// This component renders an assessment card that can accept either AssessmentSummary or Assessment types
export const AssessmentListItem: React.FC<AssessmentCardProps> = ({ 
  assessment, 
  lastUpdated, 
  onClick 
}) => {
  // Function to handle different property access patterns
  const getProperty = <T,>(obj: any, camelCaseProp: string, snakeCaseProp: string, defaultValue: T): T => {
    if (obj[camelCaseProp] !== undefined) return obj[camelCaseProp];
    if (obj[snakeCaseProp] !== undefined) return obj[snakeCaseProp];
    return defaultValue;
  };

  // Extract values safely
  const studentName = getProperty(assessment, 'studentName', 'student_name', 'Unnamed Student');
  const date = getProperty(assessment, 'date', 'date', new Date().toISOString());
  const status = getProperty(assessment, 'status', 'status', 'draft');
  
  // Use the provided lastUpdated or find it in the assessment
  const updatedTime = lastUpdated || 
    getProperty(assessment, 'updatedAt', 'updated_at', '') || 
    getProperty(assessment, 'createdAt', 'created_at', '');
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="h-10 w-10 mr-3 bg-primary/10 text-primary">
            <AvatarFallback>{getInitials(studentName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate">{assessment.title}</h3>
              <StatusBadge status={status} />
            </div>
            
            <p className="text-sm text-muted-foreground truncate">{studentName}</p>
            
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>
                Criado: {new Date(date).toLocaleDateString('pt-BR')}
              </span>
              {updatedTime && (
                <span>
                  Atualizado: {formatDistanceToNow(new Date(updatedTime), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentListItem;
