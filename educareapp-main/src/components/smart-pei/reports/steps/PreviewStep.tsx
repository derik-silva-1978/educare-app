
import React from 'react';
import { Button } from '@/components/ui/button';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { ReportType, Report } from '@/types/report';
import { ArrowLeft, Save, Send, Printer, Download, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PreviewStepProps {
  reportContent: string;
  reportTitle: string;
  studentName: string;
  aiOptions: AIReportGenerationOptions;
  onSaveDraft: () => void;
  onComplete: () => void;
  onBack: () => void;
  report: Report | null;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  reportContent,
  reportTitle,
  studentName,
  aiOptions,
  onSaveDraft,
  onComplete,
  onBack,
  report
}) => {
  const handlePrintReport = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Prévia do Relatório</h2>
        <p className="text-sm text-muted-foreground">
          Revise o relatório gerado e faça ajustes se necessário.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrintReport}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveDraft}
            className="flex items-center gap-1"
          >
            <Clock className="h-4 w-4" />
            <span>Salvar Rascunho</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onComplete}
            className="flex items-center gap-1"
          >
            <Send className="h-4 w-4" />
            <span>Finalizar</span>
          </Button>
        </div>
      </div>
      
      <div className="report-preview bg-white rounded-lg border p-6 shadow-sm print:shadow-none print:border-none">
        <div className="report-header mb-6 print:mb-8">
          <h1 className="text-2xl font-bold text-center mb-2 print:text-3xl">{reportTitle}</h1>
          <p className="text-center text-muted-foreground">
            {studentName} | {new Date().toLocaleDateString('pt-BR')}
          </p>
          <Separator className="my-4" />
        </div>
        
        <div 
          className="report-content prose max-w-none print:text-base"
          dangerouslySetInnerHTML={{ __html: reportContent }}
        />
        
        <div className="report-footer mt-8 print:mt-16 text-sm text-muted-foreground">
          <Separator className="mb-4" />
          <p className="text-center">Smart PEI | Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
