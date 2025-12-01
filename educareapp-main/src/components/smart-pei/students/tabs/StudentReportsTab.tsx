
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface StudentReportsTabProps {
  studentId: string;
  reports?: Report[];
  isLoading?: boolean;
}

export const StudentReportsTab: React.FC<StudentReportsTabProps> = ({
  studentId,
  reports = [],
  isLoading = false
}) => {
  const navigate = useNavigate();

  const handleCreateReport = () => {
    navigate(`/educare-app/child/${studentId}/reports/new`);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/educare-app/reports/${reportId}`);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full w-12 h-12 flex items-center justify-center bg-blue-50 mb-4">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-lg">Sem relatórios</CardTitle>
          <p className="text-muted-foreground mt-2">
            Nenhum relatório foi criado para esta criança
          </p>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button onClick={handleCreateReport} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Relatório
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Relatórios</h3>
        <Button onClick={handleCreateReport} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Relatório
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => handleViewReport(report.id)}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  report.status === 'published' ? 'bg-green-100 text-green-800' :
                  report.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {report.status === 'published' ? 'Publicado' : 
                   report.status === 'draft' ? 'Rascunho' : 'Em progresso'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentReportsTab;
