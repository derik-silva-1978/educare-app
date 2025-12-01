
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Share2 } from 'lucide-react';

interface ReportHeaderComponentProps {
  report: {
    title: string;
    description?: string;
    date: string;
    studentName: string;
  };
  onEdit?: () => void;
  onShare?: () => void;
}

export const ReportHeaderComponent: React.FC<ReportHeaderComponentProps> = ({
  report,
  onEdit,
  onShare
}) => {
  const formattedDate = new Date(report.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{report.title}</h2>
          {report.description && (
            <p className="text-sm text-muted-foreground">{report.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Editar</span>
            </Button>
          )}
          
          {onShare && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Compartilhar</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
        <div className="flex gap-1">
          <span className="font-medium">Data:</span>
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex gap-1">
          <span className="font-medium">Aluno:</span>
          <span>{report.studentName}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportHeaderComponent;
