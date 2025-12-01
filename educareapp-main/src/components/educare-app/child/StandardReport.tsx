import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Hand,
  MessageCircle,
  Heart,
  Users,
  Sparkles
} from 'lucide-react';
import { calculateAge } from '@/utils/dateUtils';

interface StandardReportProps {
  childData: any;
  reportData: any;
}

export const StandardReport: React.FC<StandardReportProps> = ({ childData, reportData }) => {
  const age = calculateAge ? calculateAge(childData.birthdate) : { years: 0, months: 0 };
  
  const dimensionIcons = {
    motor_grosso: Hand,
    motor_fino: Sparkles,
    linguagem: MessageCircle,
    cognitivo: Brain,
    social_emocional: Heart,
    autocuidado: Users
  };

  const dimensionNames = {
    motor_grosso: 'Motor Grosso',
    motor_fino: 'Motor Fino',
    linguagem: 'Linguagem',
    cognitivo: 'Cognitivo',
    social_emocional: 'Social/Emocional',
    autocuidado: 'Autocuidado'
  };

  const getStatusColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (score: number) => {
    if (score >= 75) return <Badge className="bg-green-100 text-green-800">Adequado</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
    return <Badge className="bg-red-100 text-red-800">Alerta</Badge>;
  };

  return (
    <div className="space-y-6 print:shadow-none">
      {/* Report Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            Relatório de Desenvolvimento
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Gerado em {new Date().toLocaleDateString('pt-BR')}
          </p>
        </CardHeader>
      </Card>

      {/* Child Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Criança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="font-semibold">{childData.first_name} {childData.last_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Idade</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{age.years} anos e {age.months} meses</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
              <p>{new Date(childData.birthdate).toLocaleDateString('pt-BR')}</p>
            </div>
            
            {childData.city && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>{childData.city}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo do Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2 text-primary">
              {Math.round(reportData?.overall_score || 0)}%
            </div>
            <p className="text-muted-foreground">Índice Geral de Desenvolvimento</p>
            {getStatusBadge(reportData?.overall_score || 0)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {reportData?.answered_questions || 0}
              </div>
              <p className="text-sm text-muted-foreground">Perguntas Respondidas</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {reportData?.age_range_months || `${age.years * 12 + age.months} meses`}
              </div>
              <p className="text-sm text-muted-foreground">Faixa Etária Avaliada</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(reportData?.completion_percentage || 0)}%
              </div>
              <p className="text-sm text-muted-foreground">Avaliação Completa</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      {reportData?.dimension_scores && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Desenvolvimento por Dimensão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.dimension_scores).map(([dimension, score]: [string, any]) => {
                const IconComponent = dimensionIcons[dimension as keyof typeof dimensionIcons] || Brain;
                return (
                  <div key={dimension} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {dimensionNames[dimension as keyof typeof dimensionNames]}
                          </span>
                          <span className={`font-bold ${getStatusColor(score)}`}>
                            {Math.round(score)}%
                          </span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    </div>
                    {getStatusBadge(score)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths and Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData?.dimension_scores && Object.entries(reportData.dimension_scores)
                .filter(([_, score]: [string, any]) => score >= 75)
                .map(([dimension, score]: [string, any]) => (
                  <div key={dimension} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {dimensionNames[dimension as keyof typeof dimensionNames]} - {Math.round(score)}%
                    </span>
                  </div>
                ))
              }
              {reportData?.recommendations?.filter((rec: string) => rec.includes('pontos fortes') || rec.includes('adequado'))
                .slice(0, 3).map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Oportunidades de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData?.concerns?.map((concern: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <span className="text-sm">{concern}</span>
                </div>
              ))}
              {reportData?.dimension_scores && Object.entries(reportData.dimension_scores)
                .filter(([_, score]: [string, any]) => score < 75)
                .map(([dimension, score]: [string, any]) => (
                  <div key={dimension} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      Estimular {dimensionNames[dimension as keyof typeof dimensionNames].toLowerCase()} - {Math.round(score)}%
                    </span>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {reportData?.recommendations?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.recommendations.slice(0, 5).map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Notes Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Observações do Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-muted-foreground">
            Espaço reservado para anotações do profissional que acompanha o desenvolvimento da criança.
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-0 bg-gray-50">
        <CardContent className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Este relatório foi gerado pela plataforma Educare e deve ser interpretado por profissional qualificado.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Para mais informações, visite: www.educare.app
          </p>
        </CardContent>
      </Card>
    </div>
  );
};