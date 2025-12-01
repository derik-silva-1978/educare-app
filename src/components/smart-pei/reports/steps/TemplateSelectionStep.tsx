
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  BarChart2,
  ChartBar,
  GraduationCap,
  Layers,
  Users,
  FileText
} from "lucide-react";
import { ReportTemplateConfig, getReportTemplates } from '../templates/TemplateConfig';

interface TemplateSelectionStepProps {
  onSelectTemplate: (template: ReportTemplateConfig) => void;
}

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({ onSelectTemplate }) => {
  const baseTemplates = getReportTemplates();
  
  // Add the icons to the templates
  const templates = baseTemplates.map(template => {
    let icon;
    switch (template.id) {
      case 'pei-complete':
        icon = <BookOpen className="h-5 w-5" />;
        break;
      case 'monthly-progress':
        icon = <Calendar className="h-5 w-5" />;
        break;
      case 'quarterly-report':
        icon = <BarChart2 className="h-5 w-5" />;
        break;
      case 'biannual-report':
        icon = <ChartBar className="h-5 w-5" />;
        break;
      case 'yearly-report':
        icon = <GraduationCap className="h-5 w-5" />;
        break;
      case 'comprehensive-report':
        icon = <Layers className="h-5 w-5" />;
        break;
      case 'team-report':
        icon = <Users className="h-5 w-5" />;
        break;
      case 'custom-report':
        icon = <FileText className="h-5 w-5" />;
        break;
      default:
        icon = <FileText className="h-5 w-5" />;
    }
    return { ...template, icon };
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Selecione um Modelo de Relatório</h2>
        <p className="text-sm text-muted-foreground">
          Escolha um modelo para o seu relatório. Você poderá personalizar todas as opções na próxima etapa.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer border ${template.color} hover:shadow-md transition-shadow`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{template.title}</CardTitle>
              <div className={`rounded-full p-2 ${template.iconBgColor}`}>
                {template.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-2">
              <Button variant="outline" className="w-full">
                Selecionar este modelo
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
