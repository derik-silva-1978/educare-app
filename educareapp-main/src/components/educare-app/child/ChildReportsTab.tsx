import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Share, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { StandardReport } from './StandardReport';
import { useDevelopmentReports } from '@/hooks/educare-app/useDevelopmentReports';

interface ChildReportsTabProps {
  childData: any;
  childId: string;
}

export const ChildReportsTab: React.FC<ChildReportsTabProps> = ({ childData, childId }) => {
  const { reports, isLoading, generateStandardReport } = useDevelopmentReports(childId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Gere e compartilhe relatórios de desenvolvimento com profissionais que acompanham {childData?.first_name}.
          </p>
          <Button onClick={generateStandardReport} className="gap-2">
            <FileText className="h-4 w-4" />
            Gerar Relatório Padrão
          </Button>
        </CardContent>
      </Card>

      {/* Available Reports */}
      {reports?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">Relatório de Desenvolvimento</h4>
                      <Badge variant={report.status === 'complete' ? 'default' : 'secondary'}>
                        {report.status === 'complete' ? 'Completo' : 'Em progresso'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.generated_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {Math.round(report.overall_score)}% de desenvolvimento
                      </div>
                      {report.concerns?.length > 0 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          {report.concerns.length} ponto(s) de atenção
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share className="h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standard Report Preview */}
      {reports?.length > 0 && (
        <StandardReport 
          childData={childData} 
          reportData={reports[0]} 
        />
      )}

      {/* Professional Sharing Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Share className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Compartilhamento com Profissionais
              </h4>
              <p className="text-blue-700 text-sm mb-3">
                Os relatórios podem ser compartilhados com pediatras, psicólogos, terapeutas, 
                neurologistas e outros profissionais que acompanham o desenvolvimento de {childData?.first_name}.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pediatras e médicos especialistas</li>
                <li>• Psicólogos infantis</li>
                <li>• Terapeutas ocupacionais e fonoaudiólogos</li>
                <li>• Neurologistas pediátricos</li>
                <li>• Educadores e coordenadores pedagógicos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};