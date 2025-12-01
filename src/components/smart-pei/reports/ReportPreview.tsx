
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Mail, Share2 } from 'lucide-react';

interface ReportPreviewProps {
  reportId: string;
  title: string;
  studentName: string;
  date: string;
  onShare?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportId,
  title,
  studentName,
  date,
  onShare
}) => {
  const handleDownload = () => {
    // In a real app, this would download the report
    console.log(`Downloading report ${reportId}`);
  };
  
  const handlePrint = () => {
    // In a real app, this would print the report
    console.log(`Printing report ${reportId}`);
    window.print();
  };
  
  const handleEmail = () => {
    // In a real app, this would email the report
    console.log(`Emailing report ${reportId}`);
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-6 border rounded-lg bg-muted/50">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground">Aluno: {studentName}</p>
              <p className="text-muted-foreground">Data: {date}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visão Geral</h3>
              <p>Este relatório fornece uma visão geral do progresso do aluno em seu Plano de Ensino Individualizado (PEI).</p>
              
              <h3 className="text-lg font-medium">Áreas de Progresso</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Desenvolvimento da comunicação</li>
                <li>Habilidades motoras</li>
                <li>Autonomia nas atividades diárias</li>
              </ul>
              
              <h3 className="text-lg font-medium">Próximos Passos</h3>
              <p>Recomenda-se continuar com as estratégias atuais e reavaliar em três meses.</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar por Email
          </Button>
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
