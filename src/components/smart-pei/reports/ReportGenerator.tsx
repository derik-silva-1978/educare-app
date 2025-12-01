
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSmartPEI from '@/hooks/useSmartPEI';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AIReportGenerationOptions } from '@/utils/ai-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Report } from '@/types/report';

interface ReportGeneratorProps {
  onReportCreated?: (reportId: string) => void;
  initialStudentId?: string;
  initialStudentName?: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onReportCreated,
  initialStudentId,
  initialStudentName,
}) => {
  const { generateReport } = useSmartPEI();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!initialStudentId || !initialStudentName) {
      toast({
        title: "Informações incompletas",
        description: "É necessário selecionar um estudante para gerar o relatório",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Mock options for now
      const options: AIReportGenerationOptions = {
        includeStrengths: true,
        includeWeaknesses: true,
        includeRecommendations: true,
        includeNextSteps: true,
        detailLevel: 'detailed',
        tone: 'supportive',
        targetAudience: 'all',
        includeVisualData: true,
      };

      const report: Report = await generateReport(options, initialStudentId, initialStudentName);
      
      toast({
        title: "Relatório Gerado",
        description: "Seu relatório foi gerado com sucesso!",
      });

      if (onReportCreated) {
        onReportCreated(report.id);
      } else {
        // If no callback is provided, navigate to the report view
        navigate(`/smart-pei/app/reports/${report.id}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        {initialStudentId && initialStudentName ? (
          <div className="space-y-4">
            <p>
              Gerando relatório para: <strong>{initialStudentName}</strong>
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Selecione um estudante para gerar o relatório
            </p>
            <Button 
              onClick={() => navigate('/smart-pei/app/students')}
              variant="outline"
            >
              Selecionar Estudante
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
