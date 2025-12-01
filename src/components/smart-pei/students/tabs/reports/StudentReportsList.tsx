
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Printer, Download, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Report } from '@/types/report';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface StudentReportsListProps {
  studentName: string;
  filteredReports: Report[];
  onCreateReport: () => void;
  onViewReport: (reportId: string) => void;
  onPrintReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
  onShareReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
}

const StudentReportsList: React.FC<StudentReportsListProps> = ({
  studentName,
  filteredReports,
  onCreateReport,
  onViewReport,
  onPrintReport,
  onDownloadReport,
  onShareReport,
  onDeleteReport
}) => {
  // Helper function to format the report date
  const formatReportDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Helper function to format report type
  const formatReportType = (type: string) => {
    const typeMap: Record<string, string> = {
      'assessment': 'Avaliação',
      'progress': 'Progresso',
      'summary': 'Sumário',
      'trimestral': 'Trimestral',
      'team': 'Equipe',
      'pei-complete': 'PEI Completo',
      'complete': 'Completo',
      'monthly-progress': 'Progresso Mensal',
      'quarterly-report': 'Relatório Trimestral'
    };
    
    return typeMap[type] || type;
  };
  
  // Helper function to format report status
  const formatReportStatus = (status: string) => {
    const statusMap: Record<string, { text: string, color: string }> = {
      'draft': { text: 'Rascunho', color: 'text-amber-600 bg-amber-50' },
      'completed': { text: 'Finalizado', color: 'text-green-600 bg-green-50' },
      'shared': { text: 'Compartilhado', color: 'text-blue-600 bg-blue-50' },
      'complete': { text: 'Completo', color: 'text-green-600 bg-green-50' }
    };
    
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Relatórios de {studentName}</h2>
        <Button onClick={onCreateReport} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Relatório
        </Button>
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <p className="text-muted-foreground mb-4">Nenhum relatório encontrado para este aluno.</p>
          <Button onClick={onCreateReport} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Relatório
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReports.map(report => (
            <Card key={report.id} className="overflow-hidden">
              <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{formatReportType(report.type)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${formatReportStatus(report.status).color}`}>
                      {formatReportStatus(report.status).text}
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary"
                    onClick={() => onViewReport(report.id)}
                  >
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatReportDate(report.date)}
                  </p>
                  {report.description && (
                    <p className="text-sm line-clamp-2">{report.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-1 md:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 md:px-3"
                    onClick={() => onViewReport(report.id)}
                  >
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onPrintReport(report.id)}
                  >
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Imprimir</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onDownloadReport(report.id)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onShareReport(report.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteReport(report.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentReportsList;
