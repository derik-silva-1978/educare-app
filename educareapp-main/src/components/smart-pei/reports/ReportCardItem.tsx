
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileOutput, 
  Calendar, 
  User 
} from 'lucide-react';
import { Report, toReportType, toReportStatus } from '@/types/report';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReportCardItemProps {
  report: Report;
}

export const ReportCardItem: React.FC<ReportCardItemProps> = ({ report }) => {
  // Type guard function for important flag
  const hasImportant = (report: Report): report is Report & { important?: boolean } => 
    'important' in report;
  
  // Use safe type checking with the helper functions
  const reportType = toReportType(report.type);
  const reportStatus = toReportStatus(report.status);
    
  return (
    <TooltipProvider>
      <Card className="overflow-hidden border border-border hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base truncate">{report.title}</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={`
                  ${reportType === 'assessment' ? 'border-blue-200 bg-blue-50 text-blue-800' : 
                    reportType === 'progress' ? 'border-green-200 bg-green-50 text-green-800' : 
                    reportType === 'pei' ? 'border-amber-200 bg-amber-50 text-amber-800' :
                    reportType === 'summary' ? 'border-purple-200 bg-purple-50 text-purple-800' :
                    reportType === 'team' ? 'border-indigo-200 bg-indigo-50 text-indigo-800' :
                    reportType === 'complete' || reportType === 'pei-complete' ? 'border-gray-200 bg-gray-50 text-gray-800' :
                    'border-gray-200 bg-gray-50 text-gray-800'
                  }`}
                >
                  {reportType === 'assessment' ? 'Avaliação' : 
                   reportType === 'progress' ? 'Progresso PEI' : 
                   reportType === 'pei' ? 'PEI' :
                   reportType === 'summary' ? 'Sumário PEI' :
                   reportType === 'team' ? 'Equipe' :
                   reportType === 'complete' || reportType === 'pei-complete' ? 'Completo' : 
                   reportType}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">{
                  reportType === 'assessment' ? 'Documenta resultados e análises de avaliações formais do aluno.' : 
                  reportType === 'progress' ? 'Foca no progresso específico dos objetivos do PEI.' : 
                  reportType === 'pei' ? 'Plano Educacional Individualizado completo.' :
                  reportType === 'summary' ? 'Versão resumida do PEI atual para consulta rápida.' :
                  reportType === 'team' ? 'Relatório técnico para a equipe multidisciplinar.' :
                  reportType === 'complete' || reportType === 'pei-complete' ? 'Compila todos os documentos relevantes do aluno.' : 
                  'Tipo de relatório personalizado.'
                }</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className="text-xs flex items-center gap-1 mt-1">
            <User className="h-3 w-3" />
            {report.studentName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 mt-1">
            <Calendar className="h-3 w-3" />
            <span>{report.date}</span>
            {hasImportant(report) && report.important && (
              <Badge className="ml-auto bg-red-100 text-red-800 border-none text-[10px] py-0">Importante</Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant={reportStatus === 'draft' ? 'outline' : 'default'} className={
              reportStatus === 'draft' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 
              reportStatus === 'completed' || reportStatus === 'complete' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' : 
              'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200'
            }>
              {reportStatus === 'draft' ? 'Rascunho' : 
               reportStatus === 'completed' || reportStatus === 'complete' ? 'Completo' : 'Arquivado'}
            </Badge>
            
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                <FileOutput className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ReportCardItem;
