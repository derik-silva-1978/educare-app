
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, BookOpen, Calendar, BarChart2, ChartBar, GraduationCap, Layers, Users, FileText } from 'lucide-react';
import { getReportTemplates, ReportTemplateConfig } from './templates/TemplateConfig';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReportTemplateSelectorProps {
  onSelectTemplate: (template: ReportTemplateConfig) => void;
}

export const ReportTemplateSelector: React.FC<ReportTemplateSelectorProps> = ({
  onSelectTemplate
}) => {
  const baseTemplates = getReportTemplates();
  
  // Add the icons to the templates
  const templates = baseTemplates.map(template => {
    let icon;
    switch (template.id) {
      case 'pei-complete':
        icon = <BookOpen className="h-8 w-8" />;
        break;
      case 'monthly-progress':
        icon = <Calendar className="h-8 w-8" />;
        break;
      case 'quarterly-report':
        icon = <BarChart2 className="h-8 w-8" />;
        break;
      case 'biannual-report':
        icon = <ChartBar className="h-8 w-8" />;
        break;
      case 'yearly-report':
        icon = <GraduationCap className="h-8 w-8" />;
        break;
      case 'comprehensive-report':
        icon = <Layers className="h-8 w-8" />;
        break;
      case 'team-report':
        icon = <Users className="h-8 w-8" />;
        break;
      case 'custom-report':
        icon = <FileText className="h-8 w-8" />;
        break;
      default:
        icon = <FileText className="h-8 w-8" />;
    }
    return { ...template, icon };
  });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <TooltipProvider>
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="border hover:shadow-md transition-shadow h-full flex flex-col"
          >
            <CardContent className="pt-6 flex-grow">
              <div className="flex flex-col items-center mb-4 text-center">
                <div className="mb-3 text-primary/80">
                  {template.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-4 justify-center">
                {template.domainTracking && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Domínios</span>
                )}
                {template.skillsTracking && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Habilidades</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center pt-2 pb-4">
              <Button 
                variant="default" 
                size="sm"
                className="w-full"
                onClick={() => onSelectTemplate(template)}
              >
                Selecionar
              </Button>
              
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="max-w-xs">
                  <p>{template.helpText}</p>
                  {template.sections && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Seções incluídas:</p>
                      <ul className="text-xs list-disc ml-4">
                        {template.sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default ReportTemplateSelector;
