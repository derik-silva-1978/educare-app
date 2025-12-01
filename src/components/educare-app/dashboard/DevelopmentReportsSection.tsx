import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  TrendingUp, 
  Calendar,
  User,
  Eye,
  Download,
  Share2,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useJourneyBotReports } from '@/hooks/useJourneyBotReports';
import DevelopmentReportViewer from '../journey-bot/DevelopmentReportViewer';

interface DevelopmentReportsSectionProps {
  childId?: string;
}

export default function DevelopmentReportsSection({ childId }: DevelopmentReportsSectionProps) {
  const { reports, isLoading, shareWithProfessionals } = useJourneyBotReports();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const filteredReports = childId 
    ? reports.filter(report => report.child_id === childId)
    : reports;

  const handleViewReport = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const handleShareReport = async (reportId: string) => {
    setIsSharing(true);
    try {
      await shareWithProfessionals(reportId);
    } finally {
      setIsSharing(false);
    }
  };

  const handleExportReport = (reportId: string) => {
    // TODO: Implementar exportação PDF
    console.log('Exportar relatório:', reportId);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (selectedReport) {
    const report = reports.find(r => r.id === selectedReport);
    if (report) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedReport(null)}
            >
              ← Voltar aos Relatórios
            </Button>
          </div>
          <DevelopmentReportViewer
            report={report}
            onShare={handleShareReport}
            onExport={handleExportReport}
            isSharing={isSharing}
          />
        </div>
      );
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando relatórios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório ainda</h3>
            <p className="text-muted-foreground mb-4">
              Complete uma sessão do Titi Nauta para gerar seu primeiro relatório de desenvolvimento.
            </p>
            <Button variant="outline">
              Iniciar Avaliação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios de Desenvolvimento
            <Badge variant="secondary">{filteredReports.length}</Badge>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Header Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.child_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(report.generated_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                        <Badge variant={report.shared_with_professionals ? "default" : "secondary"}>
                          {report.shared_with_professionals ? "Compartilhado" : "Privado"}
                        </Badge>
                      </div>

                      {/* Scores Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold px-2 py-1 rounded-full ${getScoreColor(report.overall_score)}`}>
                            {report.overall_score}%
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Score Geral</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {report.answered_questions}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Perguntas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {report.age_range_months}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Idade</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Completude</span>
                          <span>{report.completion_percentage}%</span>
                        </div>
                        <Progress value={report.completion_percentage} className="h-2" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      
                      {!report.shared_with_professionals && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareReport(report.id)}
                          disabled={isSharing}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {filteredReports.length > 3 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Ver Todos os Relatórios ({filteredReports.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}