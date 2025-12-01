
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, BarChart2, BookOpen, Calendar, Users } from 'lucide-react';

interface ReportTypeSelectorProps {
  selectedType: string;
  onChange: (type: string) => void;
}

export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  selectedType,
  onChange
}) => {
  const reportTypes = [
    {
      id: 'assessment',
      label: 'Relatório de Avaliação',
      description: 'Documenta resultados de avaliações',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'progress',
      label: 'Relatório de Progresso',
      description: 'Acompanhamento periódico do desenvolvimento',
      icon: <BarChart2 className="h-4 w-4" />
    },
    {
      id: 'pei',
      label: 'Plano de Ensino Individualizado',
      description: 'Documento base do PEI',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: 'meeting',
      label: 'Registro de Reunião',
      description: 'Documentação de reuniões e decisões',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'summary',
      label: 'Relatório Periódico',
      description: 'Síntese de períodos específicos (trimestral, semestral)',
      icon: <Calendar className="h-4 w-4" />
    }
  ];
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Label className="text-base">Tipo de Relatório</Label>
          <RadioGroup 
            value={selectedType} 
            onValueChange={onChange}
            className="flex flex-col space-y-2"
          >
            {reportTypes.map(type => (
              <div key={type.id} className="flex items-start space-x-2">
                <RadioGroupItem 
                  value={type.id} 
                  id={`report-type-${type.id}`} 
                  className="mt-1" 
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor={`report-type-${type.id}`}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </Label>
                  <p className="text-sm text-muted-foreground ml-6">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTypeSelector;
