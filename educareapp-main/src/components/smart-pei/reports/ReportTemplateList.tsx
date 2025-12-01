
import React, { useState } from 'react';
import { BookOpen, Calendar, BarChart2, ChartBar, GraduationCap, Layers, Users, FileText } from 'lucide-react';
import { ReportTemplate } from './ReportTemplate';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { getReportTemplates } from './templates/TemplateConfig';
import { Badge } from '@/components/ui/badge';

interface ReportTemplateListProps {
  studentId: string;
  studentName?: string;
}

export const ReportTemplateList: React.FC<ReportTemplateListProps> = ({ studentId, studentName }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  
  const baseTemplates = getReportTemplates();
  
  // Add the icons to the templates
  const templates = baseTemplates.map(template => {
    let icon;
    switch (template.id) {
      case 'pei-complete':
        icon = <BookOpen className="h-6 w-6" />;
        break;
      case 'monthly-progress':
        icon = <Calendar className="h-6 w-6" />;
        break;
      case 'quarterly-report':
        icon = <BarChart2 className="h-6 w-6" />;
        break;
      case 'biannual-report':
        icon = <ChartBar className="h-6 w-6" />;
        break;
      case 'yearly-report':
        icon = <GraduationCap className="h-6 w-6" />;
        break;
      case 'comprehensive-report':
        icon = <Layers className="h-6 w-6" />;
        break;
      case 'team-report':
        icon = <Users className="h-6 w-6" />;
        break;
      case 'custom-report':
        icon = <FileText className="h-6 w-6" />;
        break;
      default:
        icon = <FileText className="h-6 w-6" />;
    }
    return { ...template, icon };
  });
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowDialog(true);
  };
  
  const handleGenerateReport = () => {
    setShowDialog(false);
    
    // In a real app, this would generate the report
    toast({
      title: "Relatório gerado com sucesso",
      description: `O relatório "${templates.find(t => t.id === selectedTemplate)?.title}" para ${studentName || 'o aluno'} foi gerado.`,
    });
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {templates.map((template) => (
          <ReportTemplate
            key={template.id}
            title={template.title}
            description={template.description}
            icon={template.icon}
            onSelect={() => handleSelectTemplate(template.id)}
            badges={
              <>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  Domínios
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  Habilidades
                </Badge>
              </>
            }
          />
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Relatório</DialogTitle>
            <DialogDescription>
              Deseja gerar o relatório "{templates.find(t => t.id === selectedTemplate)?.title}" para {studentName || 'o aluno'}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Este relatório será gerado com base nos dados mais recentes disponíveis no sistema e incluirá o acompanhamento de progresso por domínios e habilidades.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateReport}>
              Gerar Relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportTemplateList;
