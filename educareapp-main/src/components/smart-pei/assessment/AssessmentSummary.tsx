import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentSummary as AssessmentSummaryType } from '@/types/assessment';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';

interface AssessmentSummaryProps {
  assessment: AssessmentSummaryType;
  lastUpdated?: string;
  onClick?: () => void;
}

// Fix the formatDate function to handle Date objects
const formatDate = (date: string): string => {
  if (!date) return '';
  
  // Already a string, use it directly
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Fix the formatRelativeTime function to handle Date objects
const formatRelativeTime = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Convert to Date object
  const date = new Date(dateStr);
  
  const now = new Date();
  const diff = formatRelative(date, now, { locale: ptBR });
  return `Atualizado ${diff}`;
};

const AssessmentSummary: React.FC<AssessmentSummaryProps> = ({ assessment, lastUpdated, onClick }) => {
  return (
    <Card className="bg-white shadow-md rounded-md overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{assessment.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="text-sm text-gray-500">
          Data: {formatDate(assessment.date)}
        </div>
        
        {lastUpdated && (
          <div className="text-sm text-gray-500">
            {formatRelativeTime(lastUpdated)}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
        <div className="text-sm text-gray-600">
          Status: {assessment.status}
        </div>
        
        <div>
          <Link to={`/smart-pei/assessment/view/${assessment.id}`}>
            <Button variant="outline" size="sm" className="mr-2">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
          </Link>
          
          <Button size="sm" onClick={onClick}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssessmentSummary;
