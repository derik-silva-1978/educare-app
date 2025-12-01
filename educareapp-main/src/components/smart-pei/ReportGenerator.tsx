
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileSpreadsheet, FileBarChart, Puzzle } from 'lucide-react';

interface ReportGeneratorProps {
  onReportCreated?: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportCreated }) => {
  const navigate = useNavigate();

  const handleCreateReport = (templateId: string) => {
    navigate('/smart-pei/app/reports/new', { state: { templateId } });
    if (onReportCreated) {
      onReportCreated();
    }
  };

  const reportTemplates = [
    {
      id: 'progress',
      title: 'Relatório de Progresso',
      description: 'Acompanhamento periódico da evolução do estudante nos objetivos do PEI.',
      icon: <FileBarChart className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'assessment',
      title: 'Relatório de Avaliação',
      description: 'Análise detalhada com base nas avaliações realizadas.',
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'team',
      title: 'Relatório para Equipe',
      description: 'Informações consolidadas para compartilhamento com a equipe multidisciplinar.',
      icon: <FileSpreadsheet className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'custom',
      title: 'Relatório Personalizado',
      description: 'Crie um relatório totalmente personalizado com os elementos que desejar.',
      icon: <Puzzle className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Escolha um Modelo de Relatório</CardTitle>
          <CardDescription>
            Selecione o tipo de relatório que deseja criar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${template.color}`}
                onClick={() => handleCreateReport(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <Button 
                      variant="link" 
                      className="mt-2 p-0 h-auto text-sm"
                    >
                      Selecionar este modelo
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
