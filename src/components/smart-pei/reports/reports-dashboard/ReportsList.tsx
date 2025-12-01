
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Report, ReportType } from '@/types/report';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsListProps {
  reports: Report[];
  onViewReport: (id: string) => void;
  onEditReport: (id: string) => void;
  onPrintReport?: (id: string) => void;
  onDownloadReport?: (id: string) => void;
  onShareReport?: (id: string) => void;
  onDeleteReport?: (id: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  onViewReport,
  onEditReport,
  onPrintReport,
  onDownloadReport,
  onShareReport,
  onDeleteReport
}) => {
  const getReportTypeText = (type: ReportType): string => {
    const typeMap: Record<string, string> = {
      'assessment': 'Avaliação',
      'progress': 'Progresso',
      'pei': 'PEI',
      'meeting': 'Reunião',
      'complete': 'Completo',
      'monthly-progress': 'Progresso Mensal',
      'quarterly-report': 'Relatório Trimestral',
      'pei-complete': 'PEI Completo',
      'team': 'Equipe'
    };
    
    return typeMap[type] || 'Relatório';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Em Progresso</Badge>;
      case 'completed':
      case 'complete':
        return <Badge variant="default">Concluído</Badge>;
      case 'approved':
        return <Badge variant="default">Aprovado</Badge>;
      case 'archived':
        return <Badge variant="outline">Arquivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Aluno</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell>{getReportTypeText(report.type)}</TableCell>
              <TableCell>{report.studentName}</TableCell>
              <TableCell>{formatDate(report.date)}</TableCell>
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewReport(report.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditReport(report.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      
                      {onPrintReport && (
                        <DropdownMenuItem onClick={() => onPrintReport(report.id)}>
                          Imprimir
                        </DropdownMenuItem>
                      )}
                      
                      {onDownloadReport && (
                        <DropdownMenuItem onClick={() => onDownloadReport(report.id)}>
                          Baixar
                        </DropdownMenuItem>
                      )}
                      
                      {onShareReport && (
                        <DropdownMenuItem onClick={() => onShareReport(report.id)}>
                          Compartilhar
                        </DropdownMenuItem>
                      )}
                      
                      {onDeleteReport && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
                                onDeleteReport(report.id);
                              }
                            }}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum relatório encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsList;
