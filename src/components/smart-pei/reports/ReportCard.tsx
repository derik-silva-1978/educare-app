
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Eye, Share2, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'assessment' | 'progress' | 'pei' | 'custom';
  status: 'draft' | 'complete' | 'shared';
  studentName?: string;
  coverImage?: string;
  onView?: (id: string) => void;
  onPrint?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  id,
  title,
  description,
  date,
  type,
  status,
  studentName,
  coverImage,
  onView,
  onPrint,
  onDownload,
  onShare,
  onDelete
}) => {
  // Type to Label mapping
  const typeLabels = {
    assessment: 'Avaliação',
    progress: 'Progresso',
    pei: 'PEI',
    custom: 'Personalizado'
  };

  // Status to Badge color mapping
  const statusColors = {
    draft: 'bg-amber-100 text-amber-800',
    complete: 'bg-green-100 text-green-800',
    shared: 'bg-blue-100 text-blue-800'
  };

  // Status to Label mapping
  const statusLabels = {
    draft: 'Rascunho',
    complete: 'Completo',
    shared: 'Compartilhado'
  };

  return (
    <Card className="report-card overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        {coverImage ? (
          <div 
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        ) : (
          <div className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-2xl font-semibold text-primary/40">{typeLabels[type]}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="outline" className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            {studentName && (
              <p className="text-sm text-muted-foreground">Aluno: {studentName}</p>
            )}
          </div>
          <Badge variant="outline" className="capitalize">
            {typeLabels[type]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-400 mt-2">Criado em: {new Date(date).toLocaleDateString('pt-BR')}</p>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600"
          onClick={() => onView && onView(id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
        
        <div className="flex items-center gap-1">
          {onPrint && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onPrint(id)}
            >
              <Printer className="h-4 w-4" />
            </Button>
          )}
          {onDownload && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDownload(id)}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onShare(id)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
