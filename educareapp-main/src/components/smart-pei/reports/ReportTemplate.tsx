import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportTemplateProps {
  title: string;
  description?: string;
  icon: ReactNode;
  onSelect: () => void;
  badges?: ReactNode;
  domainTracking?: boolean;
  skillsTracking?: boolean;
  studentName?: string;
  date?: string;
  content?: string;
  school?: string;
  author?: string;
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ 
  title, 
  description, 
  icon, 
  onSelect,
  badges,
  domainTracking = true,
  skillsTracking = true,
  studentName,
  date,
  content,
  school,
  author
}) => {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/50 group overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-md bg-primary/10">{icon}</div>
          {badges && <div className="flex gap-1">{badges}</div>}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription className="mt-1">{description}</CardDescription>}
        
        <div className="flex flex-wrap gap-1 mt-2">
          {domainTracking && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Domínios
            </Badge>
          )}
          {skillsTracking && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Habilidades
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardFooter className="bg-muted/10 border-t pt-3">
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary/10 transition-colors"
          onClick={onSelect}
        >
          Selecionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportTemplate;
