import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Share2, 
  Download, 
  Clock,
  User,
  Brain,
  Heart,
  MessageSquare,
  Activity,
  Settings,
  Baby
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface DevelopmentReport {
  id: string;
  child_id: string;
  session_id: string;
  age_range_months: string;
  total_questions: number;
  answered_questions: number;
  completion_percentage: number;
  overall_score: number;
  dimension_scores: Record<string, number>;
  recommendations: string[];
  concerns: string[];
  report_data: any;
  status: string;
  generated_at: string;
  shared_with_professionals: boolean;
  child_name?: string;
}

interface DevelopmentReportViewerProps {
  report: DevelopmentReport;
  onShare?: (reportId: string) => void;
  onExport?: (reportId: string) => void;
  isSharing?: boolean;
}

const dimensionIcons: Record<string, any> = {
  'motor_grosso': Activity,
  'motor_fino': Settings,
  'linguagem': MessageSquare,
  'cognitivo': Brain,
  'social_emocional': Heart,
  'autocuidado': Baby
};

const dimensionColors: Record<string, string> = {
  'motor_grosso': 'bg-blue-500',
  'motor_fino': 'bg-purple-500',
  'linguagem': 'bg-green-500',
  'cognitivo': 'bg-orange-500',
  'social_emocional': 'bg-pink-500',
  'autocuidado': 'bg-cyan-500'
};

export default function DevelopmentReportViewer({
  report,
  onShare,
  onExport,
  isSharing = false
}: DevelopmentReportViewerProps) {
  const getDimensionName = (dimension: string): string => {
    const names: Record<string, string> = {
      'motor_grosso': 'Motor Grosso',
      'motor_fino': 'Motor Fino', 
      'linguagem': 'Linguagem',
      'cognitivo': 'Cognitivo',
      'social_emocional': 'Social-Emocional',
      'autocuidado': 'Autocuidado'
    };
    return names[dimension] || dimension;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header do Relatório */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Relatório de Desenvolvimento
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {report.child_name}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(report.generated_at), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
                <Badge variant={report.shared_with_professionals ? "default" : "secondary"}>
                  {report.shared_with_professionals ? "Compartilhado" : "Privado"}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(report.id)}
                  disabled={isSharing || report.shared_with_professionals}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {report.shared_with_professionals ? "Compartilhado" : "Compartilhar"}
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(report.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{report.overall_score}%</div>
              <div className="text-sm text-muted-foreground">Score Geral</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{report.answered_questions}</div>
              <div className="text-sm text-muted-foreground">Perguntas Respondidas</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{report.age_range_months}</div>
              <div className="text-sm text-muted-foreground">Faixa Etária</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores por Dimensão */}
      <Card>
        <CardHeader>
          <CardTitle>Desenvolvimento por Área</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(report.dimension_scores).map(([dimension, score]) => {
              const Icon = dimensionIcons[dimension] || Activity;
              const colorClass = dimensionColors[dimension] || 'bg-gray-500';
              
              return (
                <motion.div
                  key={dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{getDimensionName(dimension)}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
                      {score}%
                    </div>
                  </div>
                  <Progress value={score} className="h-2" />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      {report.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  {recommendation}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Áreas de Atenção */}
      {report.concerns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Áreas de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.concerns.map((concern, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  {concern}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}