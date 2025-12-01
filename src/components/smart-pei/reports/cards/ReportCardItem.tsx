
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Calendar, Clock, Edit2, Eye, FileCheck, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Report } from '@/types/report';

interface ReportCardItemProps {
  report: Report;
  onView?: (reportId: string) => void;
  onEdit?: (reportId: string) => void;
}

const ReportCardItem: React.FC<ReportCardItemProps> = ({
  report,
  onView,
  onEdit
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return <FileCheck className="h-4 w-4" />;
      case 'progress':
        return <BadgeCheck className="h-4 w-4" />;
      case 'pei':
        return <Star className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'archived':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'shared':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      case 'archived':
        return 'Arquivado';
      case 'shared':
        return 'Compartilhado';
      default:
        return status;
    }
  };
  
  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'assessment':
        return 'Avaliação';
      case 'progress':
        return 'Progresso';
      case 'pei':
        return 'PEI';
      case 'meeting':
        return 'Reunião';
      case 'activity':
        return 'Atividade';
      case 'evaluation':
        return 'Avaliação';
      case 'custom':
        return 'Personalizado';
      case 'summary':
        return 'Sumário';
      case 'trimestral':
        return 'Trimestral';
      case 'team':
        return 'Equipe';
      case 'complete':
        return 'Completo';
      case 'pei-complete':
        return 'PEI Completo';
      case 'monthly-progress':
        return 'Progresso Mensal';
      case 'quarterly-report':
        return 'Relatório Trimestral';
      default:
        return type;
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start mb-2">
          <div 
            className={cn(
              "text-xs px-2 py-1 rounded-full border",
              getStatusColor(report.status)
            )}
          >
            {getStatusText(report.status)}
          </div>
          
          {report.important && (
            <div className="text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500" />
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-md line-clamp-2">{report.title}</h3>
        
        {report.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {report.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(report.date)}</span>
            </div>
            
            <span className="text-muted-foreground">•</span>
            
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
              title={getReportTypeText(report.type)}
            >
              {getReportTypeIcon(report.type)}
              <span>{getReportTypeText(report.type)}</span>
            </div>
          </div>
          
          {report.studentName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Aluno:</span>
              <span>{report.studentName}</span>
            </div>
          )}
          
          {report.status === 'in_progress' && report.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progresso</span>
                <span>{report.progress}%</span>
              </div>
              <Progress value={report.progress} className="h-1.5" />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 bg-muted/20">
        <div className="flex w-full gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-8"
            onClick={() => onView?.(report.id)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Visualizar
          </Button>
          
          {report.status !== 'completed' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-8"
              onClick={() => onEdit?.(report.id)}
            >
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportCardItem;
