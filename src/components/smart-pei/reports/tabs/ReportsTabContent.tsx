
import React from 'react';
import { Report } from '@/types/report';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit } from 'lucide-react';

interface ReportsTabContentProps {
  reports: Report[];
  onViewReport: (id: string) => void;
  onEditReport: (id: string) => void;
  filterPredicate?: (report: Report) => boolean;
  emptyMessage?: string;
}

const ReportsTabContent: React.FC<ReportsTabContentProps> = ({
  reports,
  onViewReport,
  onEditReport,
  filterPredicate,
  emptyMessage = "Nenhum relatório encontrado."
}) => {
  const filteredReports = filterPredicate 
    ? reports.filter(filterPredicate) 
    : reports;

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredReports.map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <div className="mb-2">
                <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                  {report.type}
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full ml-2">
                  {report.status}
                </span>
              </div>
              
              <h3 className="font-medium text-lg mb-1">{report.title}</h3>
              
              <p className="text-sm text-muted-foreground mb-2">
                {report.studentName && `Estudante: ${report.studentName}`}
              </p>
              
              {report.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {report.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mt-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onViewReport(report.id)}
                >
                  <FileText size={16} />
                  Visualizar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onEditReport(report.id)}
                >
                  <Edit size={16} />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsTabContent;
