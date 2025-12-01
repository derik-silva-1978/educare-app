
import React from 'react';
import { Report } from '@/types/report';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2, Edit, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface ReportVisualizerProps {
  report: Report;
}

const ReportVisualizer: React.FC<ReportVisualizerProps> = ({ report }) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/smart-pei/app/reports');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // Mock download functionality
    alert('Download functionality to be implemented');
  };
  
  const handleShare = () => {
    // Mock share functionality
    alert('Share functionality to be implemented');
  };
  
  const handleEdit = () => {
    navigate(`/smart-pei/app/reports/${report.id}/edit`);
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2 mb-4"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Relatórios
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">
              {report.studentName ? `Aluno: ${report.studentName}` : 'Relatório Geral'} | 
              {new Date(report.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
            
            {report.status === 'draft' && (
              <Button variant="default" size="sm" onClick={handleEdit} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Card className="p-6 bg-white rounded-lg shadow-sm print:shadow-none print:border-none">
        <div className="report-header mb-6 print:mb-8">
          <h1 className="text-2xl font-bold text-center mb-2 print:text-3xl">{report.title}</h1>
          <p className="text-center text-muted-foreground">
            {report.studentName} | {new Date(report.date).toLocaleDateString('pt-BR')}
          </p>
          
          {report.status === 'draft' && (
            <div className="flex items-center justify-center gap-2 my-3 text-amber-700">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Rascunho - Este relatório ainda não foi finalizado</span>
            </div>
          )}
          
          <Separator className="my-4" />
        </div>
        
        <div 
          className="report-content prose max-w-none print:text-base"
          dangerouslySetInnerHTML={{ __html: report.content || '<p>Este relatório não possui conteúdo.</p>' }}
        />
        
        <div className="report-footer mt-8 print:mt-16 text-sm text-muted-foreground">
          <Separator className="mb-4" />
          <p className="text-center">Smart PEI | Gerado em {new Date(report.createdAt).toLocaleDateString('pt-BR')}</p>
          {report.updatedAt !== report.createdAt && (
            <p className="text-center text-xs">
              Última atualização: {new Date(report.updatedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportVisualizer;
